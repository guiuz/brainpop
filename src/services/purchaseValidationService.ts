import { auth } from './firebase';
import { getFunctions, httpsCallable } from 'firebase/functions';
import app from './firebase';

export interface ProcessPurchaseParams {
  purchaseToken: string;
  productId: string;
  userId?: string;
  orderId?: string | null;
  purchaseTime?: number;
}

export interface ProcessPurchaseResult {
  success: boolean;
  message: string;
  newBalance?: number;
  coinsCredited?: number;
  alreadyProcessed?: boolean;
  isSameUser?: boolean;
}

/**
 * Tabela informativa de SKUs para interface e catálogo (não usada para concessão de moedas).
 * O crédito de moedas é determinado com exclusividade pelo servidor/Cloud Function.
 */
export const PLAY_STORE_SKU_COINS_MAP: Record<string, number> = {
  brainpop_coins_300: 300,
  brainpop_coins_600: 600,
  brainpop_coins_1200: 1200,
  brainpop_combo_2500: 2500,
  brainpop_combo_6500: 6500,
  brainpop_combo_14000: 14000,
};

/**
 * Validação de Compras Google Play delegada exclusivamente ao Backend (Cloud Function).
 * 
 * Regras de Segurança:
 * 1. O cliente nunca calcula nem envia moedas ao servidor.
 * 2. O token do Firebase Auth garante a identidade legítima do usuário.
 * 3. A Cloud Function autentica na Google Play Developer API, valida o estado COMPLETED,
 *    verifica o package name com.brainpop.app e processa o purchaseToken de forma idempotente.
 */
export async function validateAndCreditPurchase(
  params: ProcessPurchaseParams
): Promise<ProcessPurchaseResult> {
  const { purchaseToken, productId } = params;

  if (!purchaseToken || !productId) {
    return {
      success: false,
      message: 'Dados de compra incompletos (purchaseToken ou productId ausente).',
    };
  }

  const currentUser = auth.currentUser;
  if (!currentUser) {
    return {
      success: false,
      message: 'Usuário não autenticado. Faça login para validar suas compras.',
    };
  }

  try {
    const functionsInstance = getFunctions(app, 'southamerica-east1');
    const validateFn = httpsCallable<
      { productId: string; purchaseToken: string },
      ProcessPurchaseResult
    >(functionsInstance, 'validateGooglePlayPurchase');

    const response = await validateFn({
      productId,
      purchaseToken,
    });

    return response.data;
  } catch (error: any) {
    console.error('[purchaseValidationService] Erro ao chamar Cloud Function de validação:', error);
    
    // Tratamento de códigos de erro do Cloud Functions
    const errorMsg = error?.message || 'Falha ao validar a compra com o servidor.';
    return {
      success: false,
      message: errorMsg,
    };
  }
}
