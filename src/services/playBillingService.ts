import * as RNIap from 'react-native-iap';
import { Platform } from 'react-native';
import { PLAY_STORE_SKU_COINS_MAP, validateAndCreditPurchase, ProcessPurchaseResult } from './purchaseValidationService';
import { useUserStore } from '../store/useUserStore';

/**
 * SKUs Consumíveis Oficiais do BrainPOP na Google Play Store
 */
export const PLAY_STORE_SKUS = Object.keys(PLAY_STORE_SKU_COINS_MAP);

export interface PlayProductItem {
  productId: string;
  title: string;
  description: string;
  price: string;
  localizedPrice: string;
  currency: string;
  coins: number;
  bonusCoins?: number;
  badge?: string;
  badgeColor?: string;
  isCombo?: boolean;
  gradientColors: string[];
}

// Configuração visual dos pacotes consumíveis
export const PRODUCT_METADATA_CONFIG: Record<string, {
  titleFallback: string;
  coins: number;
  bonusCoins?: number;
  badge?: string;
  badgeColor?: string;
  isCombo?: boolean;
  gradientColors: string[];
}> = {
  brainpop_coins_300: {
    titleFallback: 'Saco Pequeno de Moedas',
    coins: 300,
    gradientColors: ['#2DD4BF', '#0D9488'],
  },
  brainpop_coins_600: {
    titleFallback: 'Bolsa de Moedas',
    coins: 600,
    gradientColors: ['#67E8F9', '#06B6D4'],
  },
  brainpop_coins_1200: {
    titleFallback: 'Baú Clássico de Moedas',
    coins: 1200,
    gradientColors: ['#38BDF8', '#0284C7'],
  },
  brainpop_combo_2500: {
    titleFallback: 'Combo Aprendiz',
    coins: 2000,
    bonusCoins: 500,
    badge: '+500 BÔNUS 🎁',
    badgeColor: '#EC4899',
    isCombo: true,
    gradientColors: ['#EC4899', '#F472B6'],
  },
  brainpop_combo_6500: {
    titleFallback: 'Mega Combo Mestre',
    coins: 5000,
    bonusCoins: 1500,
    badge: 'POPULAR ⭐',
    badgeColor: '#8B5CF6',
    isCombo: true,
    gradientColors: ['#8B5CF6', '#A855F7'],
  },
  brainpop_combo_14000: {
    titleFallback: 'Ultra Cofre Lendário',
    coins: 10000,
    bonusCoins: 4000,
    badge: 'SUPER COMBO 🔥',
    badgeColor: '#F97316',
    isCombo: true,
    gradientColors: ['#F97316', '#F59E0B'],
  },
};

class PlayBillingService {
  private isConnected = false;
  private purchaseUpdateSub: any = null;
  private purchaseErrorSub: any = null;

  /**
   * Inicializa a conexão com o Google Play Billing
   */
  async init(): Promise<boolean> {
    if (Platform.OS !== 'android') {
      return false;
    }

    try {
      await RNIap.initConnection();
      this.isConnected = true;
      if (Platform.OS === 'android') {
        await RNIap.flushFailedPurchasesCachedAsPendingAndroid();
      }
      return true;
    } catch (error) {
      console.warn('[PlayBillingService] Erro ao conectar ao Google Play Billing:', error);
      this.isConnected = false;
      return false;
    }
  }

  /**
   * Finaliza conexão e remove listeners
   */
  async cleanup(): Promise<void> {
    if (this.purchaseUpdateSub) {
      this.purchaseUpdateSub.remove();
      this.purchaseUpdateSub = null;
    }
    if (this.purchaseErrorSub) {
      this.purchaseErrorSub.remove();
      this.purchaseErrorSub = null;
    }
    if (this.isConnected) {
      try {
        await RNIap.endConnection();
      } catch {
        // Ignora erro no teardown
      }
      this.isConnected = false;
    }
  }

  /**
   * Busca os produtos oficiais cadastrados na Google Play Store
   * Nunca confia em preços hardcoded no app: lê localizedPrice e currency retornados pela loja.
   */
  async fetchProducts(): Promise<PlayProductItem[]> {
    if (Platform.OS !== 'android') {
      return this.getFallbackCatalog();
    }

    try {
      if (!this.isConnected) {
        await this.init();
      }

      const products = await RNIap.getProducts({ skus: PLAY_STORE_SKUS });

      if (!products || products.length === 0) {
        console.warn('[PlayBillingService] Nenhum produto retornado da Play Store. Usando catálogo estruturado.');
        return this.getFallbackCatalog();
      }

      const items: PlayProductItem[] = [];

      for (const sku of PLAY_STORE_SKUS) {
        const found = products.find((p) => p.productId === sku);
        const meta = PRODUCT_METADATA_CONFIG[sku];
        if (!meta) continue;

        if (found) {
          items.push({
            productId: found.productId,
            title: found.title ? found.title.replace(/\s*\(.*?\)\s*$/, '') : meta.titleFallback,
            description: found.description || '',
            price: found.price || '',
            localizedPrice: found.localizedPrice || (found.currency ? `${found.currency} ${found.price}` : 'R$ --'),
            currency: found.currency || 'BRL',
            coins: meta.coins,
            bonusCoins: meta.bonusCoins,
            badge: meta.badge,
            badgeColor: meta.badgeColor,
            isCombo: meta.isCombo,
            gradientColors: meta.gradientColors,
          });
        } else {
          // Se o produto não estiver ativo no console neste momento, exibe placeholder indisponível
          items.push({
            productId: sku,
            title: meta.titleFallback,
            description: '',
            price: '--',
            localizedPrice: 'Indisponível',
            currency: 'BRL',
            coins: meta.coins,
            bonusCoins: meta.bonusCoins,
            badge: meta.badge,
            badgeColor: meta.badgeColor,
            isCombo: meta.isCombo,
            gradientColors: meta.gradientColors,
          });
        }
      }

      return items;
    } catch (error) {
      console.warn('[PlayBillingService] Falha ao consultar Play Store:', error);
      return this.getFallbackCatalog();
    }
  }

  /**
   * Dispara a solicitação nativa de compra do Google Play para um SKU consumível
   */
  async requestPurchase(productId: string): Promise<void> {
    if (Platform.OS !== 'android') {
      throw new Error('Google Play Billing está disponível exclusivamente no Android.');
    }
    if (!this.isConnected) {
      await this.init();
    }

    await RNIap.requestPurchase({
      skus: [productId],
      andDangerouslyFinishTransactionAutomaticallyIOS: false,
    });
  }

  /**
   * Processa e consome uma compra concluída.
   * Regras Estritas de Segurança:
   * 1. Envia purchaseToken e productId à Cloud Function (Backend).
   * 2. O backend valida a compra na Google Play API e credita moedas atomicamente.
   * 3. Finaliza/consome no Google Play (`finishTransaction`) SOMENTE se:
   *    a) O crédito foi confirmado com sucesso (validationResult.success === true); OU
   *    b) O token já foi processado anteriormente e comprovadamente pertence a este mesmo usuário (alreadyProcessed === true && isSameUser === true).
   * 4. Se a validação falhar por erro de rede, timeout, compra pendente, cancelada ou token de outro usuário,
   *    NÃO consome a compra, mantendo-a recuperável no Google Play para tentativas futuras.
   * 5. Atualiza o saldo exibido no useUserStore exclusivamente com o newBalance confirmado pelo backend.
   */
  async processAndFinishPurchase(
    purchase: RNIap.ProductPurchase,
    userId: string
  ): Promise<ProcessPurchaseResult> {
    const { purchaseToken, productId, transactionId, transactionDate } = purchase;

    if (!purchaseToken || !productId) {
      return {
        success: false,
        message: 'Dados incompletos retornados pelo Google Play (token ou produto ausente).',
      };
    }

    // 1. Validação autoritativa e crédito atômico no Firestore via Cloud Function
    const validationResult = await validateAndCreditPurchase({
      purchaseToken,
      productId,
      userId,
      orderId: transactionId || null,
      purchaseTime: transactionDate || Date.now(),
    });

    // 2. Determina se a compra pode ser consumida e finalizada com segurança
    const shouldFinish = validationResult.success === true ||
      (validationResult.alreadyProcessed === true && validationResult.isSameUser === true);

    if (shouldFinish) {
      try {
        await RNIap.finishTransaction({
          purchase,
          isConsumable: true,
        });
      } catch (finishErr) {
        console.warn('[PlayBillingService] Aviso ao finalizar transação no Google Play:', finishErr);
        // O crédito já foi garantido pelo backend. A compra permanece não finalizada na loja
        // até ser consumida na próxima verificação de compras pendentes.
      }

      // 3. Atualiza o saldo exibido diretamente a partir do valor confirmado pelo servidor (sem addCoins no cliente)
      if (typeof validationResult.newBalance === 'number') {
        useUserStore.getState().setCoinsConfirmed(validationResult.newBalance);
      }
    } else {
      console.warn(
        `[PlayBillingService] Transação NÃO finalizada no Google Play (recuperável ou inválida): ${validationResult.message}`
      );
    }

    return validationResult;
  }

  /**
   * Recupera compras pendentes ou não consumidas (ex: usuário fechou ou reabriu o app após o pagamento).
   * Consulta getAvailablePurchases, envia ao backend e consome as transações aprovadas.
   */
  async restoreAndProcessAvailablePurchases(userId: string): Promise<ProcessPurchaseResult[]> {
    if (Platform.OS !== 'android') return [];
    if (!this.isConnected) {
      await this.init();
    }

    try {
      const purchases = await RNIap.getAvailablePurchases();
      const results: ProcessPurchaseResult[] = [];

      for (const purchase of purchases) {
        if (purchase.purchaseToken && purchase.productId) {
          const res = await this.processAndFinishPurchase(purchase, userId);
          results.push(res);
        }
      }

      return results;
    } catch (error) {
      console.warn('[PlayBillingService] Erro ao recuperar compras disponíveis:', error);
      return [];
    }
  }

  /**
   * Catálogo estruturado de fallback para quando a loja estiver offline ou em desenvolvimento
   */
  private getFallbackCatalog(): PlayProductItem[] {
    return PLAY_STORE_SKUS.map((sku) => {
      const meta = PRODUCT_METADATA_CONFIG[sku];
      return {
        productId: sku,
        title: meta.titleFallback,
        description: '',
        price: '0.00',
        localizedPrice: 'R$ --',
        currency: 'BRL',
        coins: meta.coins,
        bonusCoins: meta.bonusCoins,
        badge: meta.badge,
        badgeColor: meta.badgeColor,
        isCombo: meta.isCombo,
        gradientColors: meta.gradientColors,
      };
    });
  }
}

export const playBillingService = new PlayBillingService();
