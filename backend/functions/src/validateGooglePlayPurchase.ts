import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { google } from 'googleapis';

// Inicializa o Admin SDK do Firebase caso ainda não tenha sido iniciado
if (!admin.apps.length) {
  admin.initializeApp();
}

const db = admin.firestore();

/**
 * Tabela Oficial de Moedas por SKU (Autoritativa no Servidor)
 * O cliente NUNCA informa a quantidade de moedas concedida.
 */
export const OFFICIAL_SKU_COINS_MAP: Record<string, number> = {
  brainpop_coins_300: 300,
  brainpop_coins_600: 600,
  brainpop_coins_1200: 1200,
  brainpop_combo_2500: 2500,
  brainpop_combo_6500: 6500,
  brainpop_combo_14000: 14000,
};

export const EXPECTED_PACKAGE_NAME = 'com.brainpop.app';

export interface ValidatePurchaseRequest {
  productId: string;
  purchaseToken: string;
}

export interface ValidatePurchaseResponse {
  success: boolean;
  message: string;
  coinsCredited?: number;
  newBalance?: number;
  alreadyProcessed?: boolean;
  isSameUser?: boolean;
}

/**
 * Cloud Function Autoritativa: validateGooglePlayPurchase
 * 
 * Regras Estritas:
 * 1. Autentica o chamador via context.auth.uid (Firebase Auth Token).
 * 2. Consulta a Google Play Developer API (androidpublisher v3).
 * 3. Valida se o packageName é exatamente "com.brainpop.app".
 * 4. Valida se purchaseState === 0 (0 = COMPLETED; rejeita 1 = PENDING e 2 = CANCELLED).
 * 5. Garante idempotência transacional: purchaseToken serve como chave primária em processedPurchases.
 * 6. Credita as moedas atomicamente na conta do usuário em users/{uid}.
 * 7. Nunca confia em dados financeiros ou de saldo vindos do cliente.
 * 8. Região configurada: southamerica-east1 (alinhada com o cliente).
 */
export const validateGooglePlayPurchase = functions
  .region('southamerica-east1')
  .https.onCall(
    async (
      data: ValidatePurchaseRequest,
      context: functions.https.CallableContext
    ): Promise<ValidatePurchaseResponse> => {
      // 1. Validação de Autenticação do Usuário
      if (!context.auth || !context.auth.uid) {
        throw new functions.https.HttpsError(
          'unauthenticated',
          'Usuário não autenticado. Faça login no aplicativo para validar compras.'
        );
      }

      const userId = context.auth.uid;
      const { productId, purchaseToken } = data || {};

      if (!productId || !purchaseToken) {
        throw new functions.https.HttpsError(
          'invalid-argument',
          'Parâmetros obrigatórios ausentes: productId e purchaseToken são necessários.'
        );
      }

      const coinsToCredit = OFFICIAL_SKU_COINS_MAP[productId];
      if (!coinsToCredit) {
        throw new functions.https.HttpsError(
          'invalid-argument',
          `Produto desconhecido ou inválido no catálogo: ${productId}`
        );
      }

      // 2. Consulta à Google Play Developer API
      let playPurchaseData: any = null;
      try {
        const authClient = new google.auth.GoogleAuth({
          scopes: ['https://www.googleapis.com/auth/androidpublisher'],
        });

        const androidPublisher = google.androidpublisher({
          version: 'v3',
          auth: authClient,
        });

        const response = await androidPublisher.purchases.products.get({
          packageName: EXPECTED_PACKAGE_NAME,
          productId,
          token: purchaseToken,
        });

        playPurchaseData = response.data;
      } catch (apiError: any) {
        console.error('[validateGooglePlayPurchase] Erro na Play Developer API:', apiError);
        throw new functions.https.HttpsError(
          'permission-denied',
          'Não foi possível verificar o comprovante de compra com a Google Play Store.'
        );
      }

      if (!playPurchaseData) {
        throw new functions.https.HttpsError(
          'not-found',
          'Compra não localizada na Google Play Developer API.'
        );
      }

      // 3. Validação de Estado da Compra
      // purchaseState: 0 = COMPLETED / PURCHASED, 1 = CANCELED, 2 = PENDING
      if (playPurchaseData.purchaseState !== 0) {
        const stateMap: Record<number, string> = {
          1: 'cancelada',
          2: 'pendente de pagamento',
        };
        const desc = stateMap[playPurchaseData.purchaseState] || 'inválida';
        return {
          success: false,
          message: `Compra não aprovada pela Google Play (estado: ${desc}). Moedas não creditadas.`,
        };
      }

      // 4. Transação Atômica e Idempotente no Firestore (Anti-Replay)
      const safeDocId = purchaseToken.replace(/\//g, '_');
      const purchaseDocRef = db.collection('processedPurchases').doc(safeDocId);
      const userDocRef = db.collection('users').doc(userId);

      try {
        const txResult = await db.runTransaction(async (transaction: admin.firestore.Transaction) => {
          const purchaseSnap = await transaction.get(purchaseDocRef);
          if (purchaseSnap.exists) {
            const purchaseData = typeof purchaseSnap.data === 'function' ? (purchaseSnap.data() || {}) : {};
            const isSameUser = purchaseData.userId ? purchaseData.userId === userId : true;
            return {
              alreadyProcessed: true,
              isSameUser,
              newBalance: undefined,
            };
          }

          const userSnap = await transaction.get(userDocRef);
          if (!userSnap.exists) {
            throw new functions.https.HttpsError(
              'not-found',
              `Perfil de usuário não encontrado para o UID: ${userId}`
            );
          }

          const currentCoins = Number(userSnap.data()?.coins) || 0;
          const newBalance = currentCoins + coinsToCredit;

          // Registra o token como consumido
          transaction.set(purchaseDocRef, {
            purchaseToken,
            productId,
            userId,
            orderId: playPurchaseData.orderId || null,
            purchaseTimeMillis: playPurchaseData.purchaseTimeMillis || Date.now(),
            consumptionState: playPurchaseData.consumptionState ?? null,
            coinsCredited: coinsToCredit,
            verifiedAt: admin.firestore.FieldValue.serverTimestamp(),
            packageName: EXPECTED_PACKAGE_NAME,
          });

          // Credita moedas atomicamente
          transaction.update(userDocRef, {
            coins: newBalance,
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
          });

          return {
            alreadyProcessed: false,
            isSameUser: true,
            newBalance,
          };
        });

        if (txResult.alreadyProcessed) {
          const isSameUser = Boolean(txResult.isSameUser);
          return {
            success: false,
            alreadyProcessed: true,
            isSameUser,
            message: isSameUser
              ? 'Este comprovante de compra já foi processado e creditado anteriormente para a sua conta.'
              : 'Este comprovante de compra pertence a outra conta de usuário e não pode ser reutilizado.',
          };
        }

        return {
          success: true,
          alreadyProcessed: false,
          coinsCredited: coinsToCredit,
          newBalance: txResult.newBalance,
          message: `Compra aprovada! +${coinsToCredit.toLocaleString('pt-BR')} moedas creditadas com sucesso.`,
        };
      } catch (txError: any) {
        if (txError instanceof functions.https.HttpsError) {
          throw txError;
        }
        console.error('[validateGooglePlayPurchase] Erro na transação Firestore:', txError);
        throw new functions.https.HttpsError(
          'internal',
          'Erro ao registrar a transação de compra no banco de dados.'
        );
      }
    }
  );
