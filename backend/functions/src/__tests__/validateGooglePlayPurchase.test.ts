import fft from 'firebase-functions-test';

// Mocks do Google APIs e Firestore
const mockProductsGet = jest.fn();
jest.mock('googleapis', () => ({
  google: {
    auth: {
      GoogleAuth: jest.fn(),
    },
    androidpublisher: jest.fn(() => ({
      purchases: {
        products: {
          get: mockProductsGet,
        },
      },
    })),
  },
}));

// Mock do Firestore
const mockGet = jest.fn();
const mockSet = jest.fn();
const mockUpdate = jest.fn();
const mockRunTransaction = jest.fn((cb) => cb({
  get: mockGet,
  set: mockSet,
  update: mockUpdate,
}));

jest.mock('firebase-admin', () => {
  const actualAdmin = jest.requireActual('firebase-admin');
  return {
    ...actualAdmin,
    apps: [{}],
    initializeApp: jest.fn(),
    firestore: Object.assign(
      () => ({
        collection: jest.fn((colName: string) => ({
          doc: jest.fn((docId: string) => ({
            id: docId,
            path: `${colName}/${docId}`,
          })),
        })),
        runTransaction: mockRunTransaction,
      }),
      {
        FieldValue: {
          serverTimestamp: jest.fn(() => 'MOCK_TIMESTAMP'),
          increment: jest.fn((n) => n),
        },
      }
    ),
  };
});

import { 
  validateGooglePlayPurchase, 
  OFFICIAL_SKU_COINS_MAP,
  EXPECTED_PACKAGE_NAME 
} from '../validateGooglePlayPurchase';

const testEnv = fft();
const wrapped = testEnv.wrap(validateGooglePlayPurchase);

describe('Backend Cloud Function: validateGooglePlayPurchase', () => {
  const mockUid = 'user_authoritative_123';
  const mockToken = 'real_or_mock_purchase_token_xyz987';
  const mockSku = 'brainpop_coins_600';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    testEnv.cleanup();
  });

  it('Contém os 6 SKUs autoritativos no catálogo do servidor', () => {
    expect(OFFICIAL_SKU_COINS_MAP).toEqual({
      brainpop_coins_300: 300,
      brainpop_coins_600: 600,
      brainpop_coins_1200: 1200,
      brainpop_combo_2500: 2500,
      brainpop_combo_6500: 6500,
      brainpop_combo_14000: 14000,
    });
    expect(EXPECTED_PACKAGE_NAME).toBe('com.brainpop.app');
  });

  it('Rejeita requisição de usuário não autenticado', async () => {
    await expect(
      wrapped({ productId: mockSku, purchaseToken: mockToken }, { auth: undefined } as any)
    ).rejects.toThrow(/não autenticado/);
  });

  it('Rejeita parâmetros obrigatórios ausentes', async () => {
    await expect(
      wrapped({ productId: '', purchaseToken: '' }, { auth: { uid: mockUid } } as any)
    ).rejects.toThrow(/Parâmetros obrigatórios/);
  });

  it('Rejeita SKU inválido que não consta no catálogo do servidor', async () => {
    await expect(
      wrapped(
        { productId: 'hacked_infinite_coins_99999', purchaseToken: mockToken },
        { auth: { uid: mockUid } } as any
      )
    ).rejects.toThrow(/Produto desconhecido ou inválido/);
  });

  it('Rejeita token falso/inexistente na Google Play API com permission-denied', async () => {
    mockProductsGet.mockRejectedValue(new Error('Invalid purchase token'));

    await expect(
      wrapped(
        { productId: mockSku, purchaseToken: 'fake_forged_token' },
        { auth: { uid: mockUid } } as any
      )
    ).rejects.toThrow(/Não foi possível verificar o comprovante/);
  });

  it('Rejeita compra com estado pendente (purchaseState: 2) sem creditar moedas', async () => {
    mockProductsGet.mockResolvedValue({
      data: {
        purchaseState: 2, // 2 = PENDING
        orderId: 'GPA.PENDING-1234',
      },
    });

    const result = await wrapped(
      { productId: mockSku, purchaseToken: mockToken },
      { auth: { uid: mockUid } } as any
    );

    expect(result.success).toBe(false);
    expect(result.message).toContain('pendente de pagamento');
    expect(mockRunTransaction).not.toHaveBeenCalled();
  });

  it('Rejeita compra cancelada (purchaseState: 1) sem creditar moedas', async () => {
    mockProductsGet.mockResolvedValue({
      data: {
        purchaseState: 1, // 1 = CANCELED
        orderId: 'GPA.CANCELED-1234',
      },
    });

    const result = await wrapped(
      { productId: mockSku, purchaseToken: mockToken },
      { auth: { uid: mockUid } } as any
    );

    expect(result.success).toBe(false);
    expect(result.message).toContain('cancelada');
    expect(mockRunTransaction).not.toHaveBeenCalled();
  });

  it('Impede duplo crédito de compra já processada (Anti-Replay / Idempotência)', async () => {
    mockProductsGet.mockResolvedValue({
      data: {
        purchaseState: 0, // COMPLETED
        orderId: 'GPA.VALID-1234',
        purchaseTimeMillis: Date.now(),
      },
    });

    // Simula que o documento já existe em processedPurchases pertencendo ao mesmo usuário
    mockGet.mockImplementation((docRef: { path: string }) => {
      if (docRef.path.startsWith('processedPurchases/')) {
        return Promise.resolve({
          exists: true,
          data: () => ({ userId: mockUid }),
        });
      }
      return Promise.resolve({ exists: false });
    });

    const result = await wrapped(
      { productId: mockSku, purchaseToken: mockToken },
      { auth: { uid: mockUid } } as any
    );

    expect(result.success).toBe(false);
    expect(result.alreadyProcessed).toBe(true);
    expect(result.isSameUser).toBe(true);
    expect(result.message).toContain('já foi processado');
    expect(mockSet).not.toHaveBeenCalled();
    expect(mockUpdate).not.toHaveBeenCalled();
  });

  it('Identifica token repetido de outro usuário sem expor seu UID (isSameUser: false)', async () => {
    mockProductsGet.mockResolvedValue({
      data: {
        purchaseState: 0,
        orderId: 'GPA.OTHER-1234',
      },
    });

    // Pertence a outro usuário 'hacker_uid'
    mockGet.mockImplementation((docRef: { path: string }) => {
      if (docRef.path.startsWith('processedPurchases/')) {
        return Promise.resolve({
          exists: true,
          data: () => ({ userId: 'different_buyer_uid' }),
        });
      }
      return Promise.resolve({ exists: false });
    });

    const result = await wrapped(
      { productId: mockSku, purchaseToken: mockToken },
      { auth: { uid: mockUid } } as any
    );

    expect(result.success).toBe(false);
    expect(result.alreadyProcessed).toBe(true);
    expect(result.isSameUser).toBe(false);
    expect((result as any).processedForUserId).toBeUndefined(); // UID NÃO exposto!
    expect(result.message).toContain('pertence a outra conta');
    expect(mockSet).not.toHaveBeenCalled();
    expect(mockUpdate).not.toHaveBeenCalled();
  });

  it('Rejeita transação se o perfil de usuário não for encontrado no Firestore', async () => {
    mockProductsGet.mockResolvedValue({
      data: {
        purchaseState: 0,
        orderId: 'GPA.VALID-1234',
      },
    });

    mockGet.mockImplementation((docRef: { path: string }) => {
      if (docRef.path.startsWith('processedPurchases/')) {
        return Promise.resolve({ exists: false });
      }
      if (docRef.path.startsWith('users/')) {
        return Promise.resolve({ exists: false });
      }
      return Promise.resolve({ exists: false });
    });

    await expect(
      wrapped(
        { productId: mockSku, purchaseToken: mockToken },
        { auth: { uid: mockUid } } as any
      )
    ).rejects.toThrow(/Perfil de usuário não encontrado/);
  });

  it('Valida com sucesso compra legítima, registra token e credita moedas autoritativas', async () => {
    mockProductsGet.mockResolvedValue({
      data: {
        purchaseState: 0,
        orderId: 'GPA.1234-5678-9012-34567',
        purchaseTimeMillis: 1726000000000,
        consumptionState: 0,
      },
    });

    mockGet.mockImplementation((docRef: { path: string }) => {
      if (docRef.path.startsWith('processedPurchases/')) {
        return Promise.resolve({ exists: false });
      }
      if (docRef.path.startsWith('users/')) {
        return Promise.resolve({
          exists: true,
          data: () => ({ coins: 150 }),
        });
      }
      return Promise.resolve({ exists: false });
    });

    const result = await wrapped(
      { productId: mockSku, purchaseToken: mockToken },
      { auth: { uid: mockUid } } as any
    );

    expect(result.success).toBe(true);
    expect(result.alreadyProcessed).toBe(false);
    expect(result.coinsCredited).toBe(600);
    expect(result.newBalance).toBe(750); // 150 + 600

    expect(mockProductsGet).toHaveBeenCalledWith({
      packageName: 'com.brainpop.app',
      productId: mockSku,
      token: mockToken,
    });

    // Registra token em processedPurchases
    expect(mockSet).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        purchaseToken: mockToken,
        productId: mockSku,
        userId: mockUid,
        orderId: 'GPA.1234-5678-9012-34567',
        coinsCredited: 600,
        packageName: 'com.brainpop.app',
      })
    );

    // Atualiza saldo atômico do usuário
    expect(mockUpdate).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        coins: 750,
      })
    );
  });
});
