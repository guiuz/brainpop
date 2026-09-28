import { 
  validateAndCreditPurchase, 
  PLAY_STORE_SKU_COINS_MAP 
} from '../purchaseValidationService';
import { playBillingService } from '../playBillingService';
import { auth } from '../firebase';
import { useUserStore } from '../../store/useUserStore';
import * as RNIap from 'react-native-iap';
import { Platform } from 'react-native';

const mockHttpsCallable = jest.fn((..._args: any[]) => jest.fn());
const mockGetFunctions = jest.fn((..._args: any[]) => ({}));
const mockFinishTransaction = jest.fn();
const mockGetAvailablePurchases = jest.fn();

jest.mock('firebase/functions', () => ({
  getFunctions: (appInstance?: any, region?: string) => mockGetFunctions(appInstance, region),
  httpsCallable: (funcInstance?: any, name?: string) => mockHttpsCallable(funcInstance, name),
}));

jest.mock('../firebase', () => ({
  __esModule: true,
  default: {},
  auth: {
    currentUser: { uid: 'user_test_123', email: 'test@brainpop.app' },
  },
}));

jest.mock('react-native-iap', () => ({
  initConnection: jest.fn().mockResolvedValue(true),
  endConnection: jest.fn().mockResolvedValue(true),
  flushFailedPurchasesCachedAsPendingAndroid: jest.fn().mockResolvedValue(true),
  getProducts: jest.fn().mockResolvedValue([]),
  finishTransaction: (...args: any[]) => mockFinishTransaction(...args),
  getAvailablePurchases: (...args: any[]) => mockGetAvailablePurchases(...args),
}));

describe('Google Play Billing & purchaseValidationService (Segurança e Ciclo de Compra)', () => {
  const mockUserId = 'user_test_123';
  const mockToken = 'mock_purchase_token_abcdef123';
  const mockSku = 'brainpop_coins_600';
  const mockPurchase: RNIap.ProductPurchase = {
    productId: mockSku,
    purchaseToken: mockToken,
    transactionId: 'GPA.1234-5678-9012',
    transactionDate: Date.now(),
    transactionReceipt: 'mock_receipt_json_str',
  };

  beforeEach(() => {
    Platform.OS = 'android';
    jest.clearAllMocks();
    (auth as any).currentUser = { uid: mockUserId, email: 'test@brainpop.app' };
    useUserStore.setState({ coins: 500 });
  });

  describe('Tabela Informativa de SKUs', () => {
    it('Possui os 6 SKUs oficiais configurados na tabela de catálogo informativa', () => {
      expect(PLAY_STORE_SKU_COINS_MAP).toEqual({
        brainpop_coins_300: 300,
        brainpop_coins_600: 600,
        brainpop_coins_1200: 1200,
        brainpop_combo_2500: 2500,
        brainpop_combo_6500: 6500,
        brainpop_combo_14000: 14000,
      });
    });
  });

  describe('Validação no Cliente (purchaseValidationService)', () => {
    it('Rejeita compra se parâmetros obrigatórios estiverem ausentes sem chamar o backend', async () => {
      const res = await validateAndCreditPurchase({
        purchaseToken: '',
        productId: mockSku,
      });
      expect(res.success).toBe(false);
      expect(res.message).toContain('incompletos');
      expect(mockHttpsCallable).not.toHaveBeenCalled();
    });

    it('Rejeita compra se usuário não estiver autenticado no Firebase Auth', async () => {
      (auth as any).currentUser = null;

      const res = await validateAndCreditPurchase({
        purchaseToken: mockToken,
        productId: mockSku,
      });
      expect(res.success).toBe(false);
      expect(res.message).toContain('não autenticado');
      expect(mockHttpsCallable).not.toHaveBeenCalled();
    });

    it('Invoca a Cloud Function validateGooglePlayPurchase com os parâmetros corretos', async () => {
      const mockCallableFn = jest.fn().mockResolvedValue({
        data: {
          success: true,
          message: 'Compra aprovada! +600 moedas creditadas.',
          coinsCredited: 600,
          newBalance: 1100,
          alreadyProcessed: false,
        },
      });
      mockHttpsCallable.mockReturnValue(mockCallableFn);

      const res = await validateAndCreditPurchase({
        purchaseToken: mockToken,
        productId: mockSku,
      });

      expect(mockGetFunctions).toHaveBeenCalledWith(expect.anything(), 'southamerica-east1');
      expect(mockHttpsCallable).toHaveBeenCalledWith(expect.anything(), 'validateGooglePlayPurchase');
      expect(mockCallableFn).toHaveBeenCalledWith({
        productId: mockSku,
        purchaseToken: mockToken,
      });
      expect(res.success).toBe(true);
      expect(res.coinsCredited).toBe(600);
      expect(res.newBalance).toBe(1100);
    });
  });

  describe('Ordem e Segurança de Finalização (playBillingService.processAndFinishPurchase)', () => {
    it('1. Compra aprovada: valida no backend -> credita moedas -> chama finishTransaction -> atualiza saldo com newBalance', async () => {
      const mockCallableFn = jest.fn().mockResolvedValue({
        data: {
          success: true,
          message: 'Compra aprovada! +600 moedas creditadas.',
          coinsCredited: 600,
          newBalance: 1100,
          alreadyProcessed: false,
          isSameUser: true,
        },
      });
      mockHttpsCallable.mockReturnValue(mockCallableFn);

      const result = await playBillingService.processAndFinishPurchase(mockPurchase, mockUserId);

      expect(result.success).toBe(true);
      // finishTransaction chamado estritamente após confirmação de crédito
      expect(mockFinishTransaction).toHaveBeenCalledWith({
        purchase: mockPurchase,
        isConsumable: true,
      });
      // Saldo atualizado com valor do servidor
      expect(useUserStore.getState().coins).toBe(1100);
    });

    it('2. Compra pendente: rejeitada sem crédito -> finishTransaction NÃO é chamado -> compra permanece recuperável', async () => {
      const mockCallableFn = jest.fn().mockResolvedValue({
        data: {
          success: false,
          message: 'Compra não aprovada pela Google Play (estado: pendente de pagamento). Moedas não creditadas.',
        },
      });
      mockHttpsCallable.mockReturnValue(mockCallableFn);

      const result = await playBillingService.processAndFinishPurchase(mockPurchase, mockUserId);

      expect(result.success).toBe(false);
      expect(mockFinishTransaction).not.toHaveBeenCalled();
      expect(useUserStore.getState().coins).toBe(500); // Intacto
    });

    it('3. Cancelamento de compra: rejeitada sem crédito -> finishTransaction NÃO é chamado', async () => {
      const mockCallableFn = jest.fn().mockResolvedValue({
        data: {
          success: false,
          message: 'Compra não aprovada pela Google Play (estado: cancelada). Moedas não creditadas.',
        },
      });
      mockHttpsCallable.mockReturnValue(mockCallableFn);

      const result = await playBillingService.processAndFinishPurchase(mockPurchase, mockUserId);

      expect(result.success).toBe(false);
      expect(mockFinishTransaction).not.toHaveBeenCalled();
      expect(useUserStore.getState().coins).toBe(500);
    });

    it('4. Erro de rede antes da validação: captura exceção -> finishTransaction NÃO é chamado -> token permanece recuperável', async () => {
      const mockCallableFn = jest.fn().mockRejectedValue(new Error('Network request failed'));
      mockHttpsCallable.mockReturnValue(mockCallableFn);

      const result = await playBillingService.processAndFinishPurchase(mockPurchase, mockUserId);

      expect(result.success).toBe(false);
      expect(result.message).toContain('Network request failed');
      expect(mockFinishTransaction).not.toHaveBeenCalled();
      expect(useUserStore.getState().coins).toBe(500);
    });

    it('5. Erro após crédito e antes de finishTransaction: saldo confirmado atualiza estado e erro no consumo não impede o crédito', async () => {
      const mockCallableFn = jest.fn().mockResolvedValue({
        data: {
          success: true,
          message: 'Compra aprovada! +600 moedas creditadas.',
          coinsCredited: 600,
          newBalance: 1100,
        },
      });
      mockHttpsCallable.mockReturnValue(mockCallableFn);
      mockFinishTransaction.mockRejectedValue(new Error('Google Play Store timeout ao consumir'));

      const result = await playBillingService.processAndFinishPurchase(mockPurchase, mockUserId);

      expect(result.success).toBe(true);
      expect(mockFinishTransaction).toHaveBeenCalled();
      // O crédito é registrado no cliente a partir do servidor mesmo se a loja oscilar no consumo
      expect(useUserStore.getState().coins).toBe(1100);
    });

    it('6. Token repetido do mesmo usuário: identifica isSameUser=true -> chama finishTransaction com segurança sem duplicar crédito', async () => {
      const mockCallableFn = jest.fn().mockResolvedValue({
        data: {
          success: false,
          alreadyProcessed: true,
          isSameUser: true,
          message: 'Este comprovante de compra já foi processado e creditado anteriormente para a sua conta.',
        },
      });
      mockHttpsCallable.mockReturnValue(mockCallableFn);

      const result = await playBillingService.processAndFinishPurchase(mockPurchase, mockUserId);

      expect(result.success).toBe(false);
      expect(result.alreadyProcessed).toBe(true);
      expect(result.isSameUser).toBe(true);
      // Finaliza na loja para desobstruir fila com segurança já que pertence a este mesmo usuário
      expect(mockFinishTransaction).toHaveBeenCalledWith({
        purchase: mockPurchase,
        isConsumable: true,
      });
      // Saldo não duplicado
      expect(useUserStore.getState().coins).toBe(500);
    });

    it('7. Token de outro usuário: isSameUser=false -> violação detectada -> finishTransaction NÃO é chamado e UID não é exposto', async () => {
      const mockCallableFn = jest.fn().mockResolvedValue({
        data: {
          success: false,
          alreadyProcessed: true,
          isSameUser: false,
          message: 'Este comprovante de compra pertence a outra conta de usuário e não pode ser reutilizado.',
        },
      });
      mockHttpsCallable.mockReturnValue(mockCallableFn);

      const result = await playBillingService.processAndFinishPurchase(mockPurchase, mockUserId);

      expect(result.success).toBe(false);
      expect(result.alreadyProcessed).toBe(true);
      expect(result.isSameUser).toBe(false);
      expect((result as any).processedForUserId).toBeUndefined(); // Proteção de privacidade
      expect(mockFinishTransaction).not.toHaveBeenCalled(); // Bloqueado!
      expect(useUserStore.getState().coins).toBe(500);
    });

    it('8. Produto ou token inválido: rejeição do backend -> finishTransaction NÃO é chamado', async () => {
      const mockCallableFn = jest.fn().mockResolvedValue({
        data: {
          success: false,
          message: 'Produto desconhecido ou token inválido no catálogo do servidor.',
        },
      });
      mockHttpsCallable.mockReturnValue(mockCallableFn);

      const result = await playBillingService.processAndFinishPurchase(
        { ...mockPurchase, productId: 'sku_inexistente' },
        mockUserId
      );

      expect(result.success).toBe(false);
      expect(mockFinishTransaction).not.toHaveBeenCalled();
      expect(useUserStore.getState().coins).toBe(500);
    });

    it('9. Recuperação ao reabrir o app: getAvailablePurchases encontra compra não consumida, valida no backend e finaliza', async () => {
      mockGetAvailablePurchases.mockResolvedValue([mockPurchase]);
      const mockCallableFn = jest.fn().mockResolvedValue({
        data: {
          success: true,
          message: 'Compra aprovada! +600 moedas creditadas.',
          coinsCredited: 600,
          newBalance: 1100,
          alreadyProcessed: false,
          isSameUser: true,
        },
      });
      mockHttpsCallable.mockReturnValue(mockCallableFn);

      const results = await playBillingService.restoreAndProcessAvailablePurchases(mockUserId);

      expect(results).toHaveLength(1);
      expect(results[0].success).toBe(true);
      expect(mockFinishTransaction).toHaveBeenCalledWith({
        purchase: mockPurchase,
        isConsumable: true,
      });
      expect(useUserStore.getState().coins).toBe(1100);
    });
  });
});
