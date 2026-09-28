import { Platform } from 'react-native';
import mobileAds, { 
  RewardedAd, 
  RewardedAdEventType, 
  AdEventType,
  TestIds,
  AdsConsent,
  AdsConsentStatus,
  MaxAdContentRating
} from 'react-native-google-mobile-ads';

function environmentValue(name: string): string | undefined {
  return typeof process !== 'undefined' ? process.env?.[name] : undefined;
}

export type AdPlacement = 'daily_coins_rewarded' | 'second_chance_rewarded';

/**
 * Verifica se o ambiente atual deve utilizar anúncios de teste:
 * - Em desenvolvimento (__DEV__);
 * - Em builds Preview do EAS (EXPO_PUBLIC_APP_ENV === 'preview' ou EAS_BUILD_PROFILE === 'preview');
 * - Ou quando explicitamente ativado via EXPO_PUBLIC_USE_TEST_ADS === 'true'.
 */
export function isTestOrPreviewEnvironment(): boolean {
  if (typeof __DEV__ !== 'undefined' && __DEV__) {
    return true;
  }
  const envObj = typeof process !== 'undefined' && process.env ? process.env : ({} as Record<string, string | undefined>);
  if (envObj['EXPO_PUBLIC_USE_TEST_ADS'] === 'true') {
    return true;
  }
  if (
    envObj['EXPO_PUBLIC_APP_ENV'] === 'preview' ||
    envObj['EAS_BUILD_PROFILE'] === 'preview' ||
    envObj['APP_VARIANT'] === 'preview'
  ) {
    return true;
  }
  return false;
}

/**
 * Obtém o Ad Unit ID apropriado respeitando rigorosamente o ambiente:
 * - Em desenvolvimento e Preview: usa OBRIGATORIAMENTE TestIds.REWARDED para não penalizar a conta AdMob;
 * - Em produção (release store): lê da variável de ambiente EAS específica ou usa o ID real cadastrado para o placement.
 * - Sem fallback para ID compartilhado: cada placement exige seu próprio identificador.
 */
export function getRewardedAdUnitId(placement: AdPlacement): string {
  if (isTestOrPreviewEnvironment()) {
    return TestIds.REWARDED;
  }

  if (placement === 'daily_coins_rewarded') {
    const dailyId = environmentValue('EXPO_PUBLIC_ADMOB_REWARDED_DAILY_ID');
    if (!dailyId) {
      throw new Error('[adMobService] ID para daily_coins_rewarded não configurado.');
    }
    return dailyId;
  }

  if (placement === 'second_chance_rewarded') {
    const secondChanceId = environmentValue('EXPO_PUBLIC_ADMOB_REWARDED_SECOND_CHANCE_ID');
    if (!secondChanceId) {
      throw new Error('[adMobService] ID para second_chance_rewarded não configurado.');
    }
    return secondChanceId;
  }

  throw new Error(`[adMobService] Placement desconhecido: ${placement}`);
}

export interface ShowAdOptions {
  onEarnedReward: () => void;
  onAdClosed?: (earned: boolean) => void;
  onAdFailedToLoad?: (error: Error) => void;
  onAdFailedToShow?: (error: Error) => void;
  serverSideVerificationOptions?: {
    userId?: string;
    customData?: string;
  };
}

export interface AdMobInitOptions {
  tagForChildDirectedTreatment?: boolean;
  tagForUnderAgeOfConsent?: boolean;
  maxAdContentRating?: MaxAdContentRating;
}

class AdMobManager {
  private ads: Map<AdPlacement, RewardedAd> = new Map();
  private isLoadedMap: Map<AdPlacement, boolean> = new Map();
  private isLoadingMap: Map<AdPlacement, boolean> = new Map();
  private unsubscribersMap: Map<AdPlacement, (() => void)[]> = new Map();
  private reloadTimersMap: Map<AdPlacement, ReturnType<typeof setTimeout>> = new Map();
  private isInitialized = false;
  private canRequestAds = false;

  /**
   * Remove e limpa todos os event listeners registrados para um placement específico,
   * impedindo acúmulo de handlers entre recargas ou exibições.
   */
  private cleanupListeners(placement: AdPlacement): void {
    const timer = this.reloadTimersMap.get(placement);
    if (timer) {
      clearTimeout(timer);
      this.reloadTimersMap.delete(placement);
    }

    const list = this.unsubscribersMap.get(placement);
    if (list && list.length > 0) {
      list.forEach((unsub) => {
        try {
          unsub();
        } catch (e) {
          console.warn(`[AdMobManager] Erro ao remover listener de ${placement}:`, e);
        }
      });
    }
    this.unsubscribersMap.set(placement, []);
  }

  /**
   * Adiciona um unsubscribe à lista do placement
   */
  private addUnsubscriber(placement: AdPlacement, unsub: () => void): void {
    const current = this.unsubscribersMap.get(placement) || [];
    current.push(unsub);
    this.unsubscribersMap.set(placement, current);
  }

  /**
   * Inicializa o SDK do Google Mobile Ads respeitando a política UMP de consentimento.
   * Se o consentimento falhar ou for indefinido, suspende carregamento de anúncios.
   */
  async initialize(options?: AdMobInitOptions): Promise<void> {
    if (this.isInitialized || Platform.OS !== 'android') return;

    try {
      // 1. Configuração do SDK de Anúncios
      const requestConfig: any = {
        maxAdContentRating: options?.maxAdContentRating ?? MaxAdContentRating.PG,
        tagForChildDirectedTreatment: options?.tagForChildDirectedTreatment,
        tagForUnderAgeOfConsent: options?.tagForUnderAgeOfConsent,
      };

      if (isTestOrPreviewEnvironment()) {
        requestConfig.testDeviceIdentifiers = ['EMULATOR'];
      }

      await mobileAds().setRequestConfiguration(requestConfig);

      // 2. Fluxo UMP de Consentimento obrigatório antes de carregar anúncios
      this.canRequestAds = false;
      try {
        const consentInfo = await AdsConsent.requestInfoUpdate();
        if (
          consentInfo.isConsentFormAvailable &&
          consentInfo.status === AdsConsentStatus.REQUIRED
        ) {
          await AdsConsent.showForm();
        }
        const updatedConsent = await AdsConsent.getConsentInfo();
        this.canRequestAds = Boolean(updatedConsent && updatedConsent.canRequestAds);
      } catch (umpError) {
        console.warn('[AdMobManager] UMP consentimento falhou ou indefinido:', umpError);
        this.canRequestAds = false;
      }

      // 3. Inicialização do Google Mobile Ads
      await mobileAds().initialize();
      this.isInitialized = true;

      // 4. Somente pré-carrega anúncios se canRequestAds permitir explicitamente
      if (this.canRequestAds) {
        this.preloadAd('daily_coins_rewarded');
        this.preloadAd('second_chance_rewarded');
      } else {
        console.warn('[AdMobManager] Pré-carregamento suspenso: consentimento UMP não concedido ou indefinido.');
      }
    } catch (error) {
      console.warn('[AdMobManager] Erro ao inicializar SDK AdMob:', error);
    }
  }

  /**
   * Exibe formulário de opções de privacidade (para Configurações)
   */
  async showPrivacyOptionsForm(): Promise<void> {
    try {
      await AdsConsent.showPrivacyOptionsForm();
    } catch (error) {
      console.warn('[AdMobManager] Falha ao exibir opções de privacidade:', error);
    }
  }

  /**
   * Pré-carrega o anúncio premiado para o placement especificado
   */
  preloadAd(placement: AdPlacement): void {
    if (Platform.OS !== 'android') return;
    if (this.isLoadingMap.get(placement)) return;

    this.cleanupListeners(placement);

    const adUnitId = getRewardedAdUnitId(placement);
    this.isLoadingMap.set(placement, true);
    this.isLoadedMap.set(placement, false);

    const rewardedAd = RewardedAd.createForAdRequest(adUnitId, {
      requestNonPersonalizedAdsOnly: false,
    });

    const unsubLoaded = rewardedAd.addAdEventListener(
      RewardedAdEventType.LOADED,
      () => {
        this.isLoadedMap.set(placement, true);
        this.isLoadingMap.set(placement, false);
      }
    );
    this.addUnsubscriber(placement, unsubLoaded);

    const unsubError = rewardedAd.addAdEventListener(
      AdEventType.ERROR,
      (error) => {
        console.warn(`[AdMobManager] Falha ao carregar anúncio (${placement}):`, error);
        this.isLoadedMap.set(placement, false);
        this.isLoadingMap.set(placement, false);
      }
    );
    this.addUnsubscriber(placement, unsubError);

    rewardedAd.load();
    this.ads.set(placement, rewardedAd);
  }

  /**
   * Verifica se o anúncio premiado está pronto para exibição
   */
  isAdReady(placement: AdPlacement): boolean {
    return !!this.isLoadedMap.get(placement);
  }

  /**
   * Verifica se o anúncio está carregando
   */
  isAdLoading(placement: AdPlacement): boolean {
    return !!this.isLoadingMap.get(placement);
  }

  /**
   * Exibe o anúncio premiado real.
   * Regras Obrigatórias:
   * 1. Recompensa liberada estritamente no evento EARNED_REWARD (exatamente uma vez);
   * 2. onAdClosed chamado exclusivamente no evento AdEventType.CLOSED, informando o estado 'earned';
   * 3. Erros reportados via AdEventType.ERROR;
   * 4. Listeners unsubscribed e limpos após fechamento ou erro para evitar vazamento de memória.
   */
  showRewardedAd(
    placement: AdPlacement,
    options: ShowAdOptions
  ): void {
    const { onEarnedReward, onAdClosed, onAdFailedToShow, serverSideVerificationOptions } = options;

    if (Platform.OS !== 'android') {
      onAdFailedToShow?.(new Error('Anúncios AdMob disponíveis exclusivamente no Android.'));
      return;
    }

    const ad = this.ads.get(placement);
    const isLoaded = this.isLoadedMap.get(placement);

    if (!ad || !isLoaded) {
      onAdFailedToShow?.(new Error('Anúncio ainda não carregado. Aguarde alguns instantes.'));
      this.preloadAd(placement);
      return;
    }

    // Configura SSV se fornecido
    if (serverSideVerificationOptions && (ad as any).setServerSideVerificationOptions) {
      try {
        (ad as any).setServerSideVerificationOptions({
          userId: serverSideVerificationOptions.userId,
          customData: serverSideVerificationOptions.customData,
        });
      } catch (ssvError) {
        console.warn('[AdMobManager] Erro ao definir SSV options:', ssvError);
      }
    }

    // Limpa listeners da fase de pré-carregamento antes de registrar os de exibição
    this.cleanupListeners(placement);

    let hasEarnedReward = false;

    // 1. Escuta EARNED_REWARD: libera o benefício uma única vez
    const unsubEarned = ad.addAdEventListener(
      RewardedAdEventType.EARNED_REWARD,
      () => {
        if (!hasEarnedReward) {
          hasEarnedReward = true;
          onEarnedReward();
        }
      }
    );
    this.addUnsubscriber(placement, unsubEarned);

    // 2. Escuta CLOSED: executa callback com o estado real de 'earned' e limpa listeners
    const unsubClosed = ad.addAdEventListener(
      AdEventType.CLOSED,
      () => {
        this.cleanupListeners(placement);
        this.isLoadedMap.set(placement, false);
        this.isLoadingMap.set(placement, false);

        onAdClosed?.(hasEarnedReward);

        // Pré-carrega o próximo anúncio
        const reloadTimer = setTimeout(() => {
          this.preloadAd(placement);
        }, 1000);
        this.reloadTimersMap.set(placement, reloadTimer);
      }
    );
    this.addUnsubscriber(placement, unsubClosed);

    // 3. Escuta ERROR durante a exibição
    const unsubError = ad.addAdEventListener(
      AdEventType.ERROR,
      (error) => {
        console.warn(`[AdMobManager] Erro durante exibição do anúncio (${placement}):`, error);
        this.cleanupListeners(placement);
        this.isLoadedMap.set(placement, false);
        this.isLoadingMap.set(placement, false);

        onAdFailedToShow?.(new Error(error?.message || 'Erro ao reproduzir anúncio premiado.'));

        // Tenta recarregar
        const reloadTimer = setTimeout(() => {
          this.preloadAd(placement);
        }, 2000);
        this.reloadTimersMap.set(placement, reloadTimer);
      }
    );
    this.addUnsubscriber(placement, unsubError);

    // Marca como consumido localmente e dispara exibição
    this.isLoadedMap.set(placement, false);

    try {
      ad.show();
    } catch (showError: any) {
      this.cleanupListeners(placement);
      this.preloadAd(placement);
      onAdFailedToShow?.(showError || new Error('Falha ao exibir anúncio premiado.'));
    }
  }

  /**
   * Encerra o serviço AdMob e remove todos os listeners ativos
   */
  destroy(): void {
    this.reloadTimersMap.forEach((timer) => clearTimeout(timer));
    this.reloadTimersMap.clear();
    this.cleanupListeners('daily_coins_rewarded');
    this.cleanupListeners('second_chance_rewarded');
    this.ads.clear();
    this.isLoadedMap.clear();
    this.isLoadingMap.clear();
    this.isInitialized = false;
  }
}

export const adMobService = new AdMobManager();
