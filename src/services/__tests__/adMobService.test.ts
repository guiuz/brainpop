import { Platform } from 'react-native';
import { 
  adMobService, 
  getRewardedAdUnitId 
} from '../adMobService';
import { 
  RewardedAd, 
  RewardedAdEventType, 
  AdEventType, 
  TestIds 
} from 'react-native-google-mobile-ads';

const mockAddAdEventListener = jest.fn();
const mockLoad = jest.fn();
const mockShow = jest.fn();
const mockUnsubscribe = jest.fn();

let mockEventHandlers: Record<string, ((...args: any[]) => void)[]> = {};

const mockMobileAdsInstance = {
  initialize: jest.fn().mockResolvedValue([]),
  setRequestConfiguration: jest.fn().mockResolvedValue(undefined),
};

jest.mock('react-native-google-mobile-ads', () => ({
  __esModule: true,
  RewardedAdEventType: {
    LOADED: 'rewarded_loaded',
    EARNED_REWARD: 'rewarded_earned_reward',
  },
  AdEventType: {
    LOADED: 'ad_loaded',
    OPENED: 'ad_opened',
    CLICKED: 'ad_clicked',
    CLOSED: 'ad_closed',
    ERROR: 'ad_error',
  },
  TestIds: {
    REWARDED: 'ca-app-pub-3940256099942544/5224354917',
  },
  MaxAdContentRating: {
    G: 'G',
    PG: 'PG',
    T: 'T',
    MA: 'MA',
  },
  AdsConsentStatus: {
    UNKNOWN: 'UNKNOWN',
    NOT_REQUIRED: 'NOT_REQUIRED',
    REQUIRED: 'REQUIRED',
    OBTAINED: 'OBTAINED',
  },
  RewardedAd: {
    createForAdRequest: jest.fn(() => ({
      addAdEventListener: (eventType: string, handler: (...args: any[]) => void) => {
        mockAddAdEventListener(eventType, handler);
        if (!mockEventHandlers[eventType]) {
          mockEventHandlers[eventType] = [];
        }
        mockEventHandlers[eventType].push(handler);
        return mockUnsubscribe;
      },
      load: mockLoad,
      show: mockShow,
      setServerSideVerificationOptions: jest.fn(),
    })),
  },
  AdsConsent: {
    requestInfoUpdate: jest.fn().mockResolvedValue({
      isConsentFormAvailable: false,
      status: 'OBTAINED',
    }),
    showForm: jest.fn(),
    getConsentInfo: jest.fn().mockResolvedValue({
      canRequestAds: true,
    }),
    showPrivacyOptionsForm: jest.fn(),
  },
  default: jest.fn(() => mockMobileAdsInstance),
}));

describe('AdMob Service (Ciclo de Vida & Recompensas)', () => {
  beforeEach(() => {
    Platform.OS = 'android';
    jest.clearAllMocks();
    mockEventHandlers = {};
    adMobService.destroy();
  });

  afterEach(() => {
    adMobService.destroy();
  });

  it('Usa estritamente TestIds.REWARDED quando em ambiente de desenvolvimento (__DEV__)', () => {
    const dailyId = getRewardedAdUnitId('daily_coins_rewarded');
    const secondChanceId = getRewardedAdUnitId('second_chance_rewarded');

    expect(dailyId).toBe(TestIds.REWARDED);
    expect(secondChanceId).toBe(TestIds.REWARDED);
  });

  it('Em produção, cada placement exige seu próprio ID sem fallback compartilhado', () => {
    const originalDev = (global as any).__DEV__;
    const originalEnv = process.env.EXPO_PUBLIC_APP_ENV;
    const originalTestAds = process.env.EXPO_PUBLIC_USE_TEST_ADS;
    try {
      (global as any).__DEV__ = false;
      delete process.env.EXPO_PUBLIC_APP_ENV;
      delete process.env.EXPO_PUBLIC_USE_TEST_ADS;
      process.env.EXPO_PUBLIC_ADMOB_REWARDED_DAILY_ID = 'test-daily-ad-unit';
      process.env.EXPO_PUBLIC_ADMOB_REWARDED_SECOND_CHANCE_ID = 'test-second-chance-ad-unit';

      const dailyId/ = getRewardedAdUnitId('daily_coins_rewarded');
      const secondChanceId = getRewardedAdUnitId('second_chance_rewarded');

      expect(dailyId).toBe('test-daily-ad-unit');
      expect(secondChanceId).toBe('test-second-chance-ad-unit');
      expect(dailyId).not.toBe(secondChanceId);

      expect(() => getRewardedAdUnitId('placement_invalido' as any)).toThrow(/Placement desconhecido/);
    } finally {
      (global as any).__DEV__ = originalDev;
      process.env.EXPO_PUBLIC_APP_ENV = originalEnv;
      process.env.EXPO_PUBLIC_USE_TEST_ADS = originalTestAds;
      delete process.env.EXPO_PUBLIC_ADMOB_REWARDED_DAILY_ID;
      delete process.env.EXPO_PUBLIC_ADMOB_REWARDED_SECOND_CHANCE_ID;
    }
  });

  it('Em build preview (EXPO_PUBLIC_APP_ENV=preview), força TestIds.REWARDED mesmo com __DEV__=false', () => {
    const originalDev = (global as any).__DEV__;
    const originalEnv = process.env.EXPO_PUBLIC_APP_ENV;
    try {
      (global as any).__DEV__ = false;
      process.env.EXPO_PUBLIC_APP_ENV = 'preview';

      expect(getRewardedAdUnitId('daily_coins_rewarded')).toBe(TestIds.REWARDED);
      expect(getRewardedAdUnitId('second_chance_rewarded')).toBe(TestIds.REWARDED);
    } finally {
      (global as any).__DEV__ = originalDev;
      process.env.EXPO_PUBLIC_APP_ENV = originalEnv;
    }
  });

  it('Possui os dois placements independentes configurados', () => {
    adMobService.preloadAd('daily_coins_rewarded');
    expect(RewardedAd.createForAdRequest).toHaveBeenCalledWith(
      TestIds.REWARDED,
      expect.anything()
    );

    adMobService.preloadAd('second_chance_rewarded');
    expect(RewardedAd.createForAdRequest).toHaveBeenCalledTimes(2);
  });

  it('Dispara onEarnedReward estritamente quando EARNED_REWARD ocorre', () => {
    adMobService.preloadAd('daily_coins_rewarded');

    // Simula anúncio carregado
    const loadedHandlers = mockEventHandlers[RewardedAdEventType.LOADED] || [];
    loadedHandlers.forEach((h) => h());

    expect(adMobService.isAdReady('daily_coins_rewarded')).toBe(true);

    const onEarnedReward = jest.fn();
    const onAdClosed = jest.fn();

    adMobService.showRewardedAd('daily_coins_rewarded', {
      onEarnedReward,
      onAdClosed,
    });

    // Simula evento EARNED_REWARD
    const earnedHandlers = mockEventHandlers[RewardedAdEventType.EARNED_REWARD] || [];
    earnedHandlers.forEach((h) => h({ amount: 25, type: 'coins' }));

    expect(onEarnedReward).toHaveBeenCalledTimes(1);

    // Simula evento CLOSED após recompensa
    const closedHandlers = mockEventHandlers[AdEventType.CLOSED] || [];
    closedHandlers.forEach((h) => h());

    expect(onAdClosed).toHaveBeenCalledWith(true);
    expect(mockUnsubscribe).toHaveBeenCalled();
  });

  it('Fechar anúncio sem EARNED_REWARD passa earned=false para onAdClosed e NÃO libera benefício', () => {
    adMobService.preloadAd('second_chance_rewarded');

    const loadedHandlers = mockEventHandlers[RewardedAdEventType.LOADED] || [];
    loadedHandlers.forEach((h) => h());

    const onEarnedReward = jest.fn();
    const onAdClosed = jest.fn();

    adMobService.showRewardedAd('second_chance_rewarded', {
      onEarnedReward,
      onAdClosed,
    });

    // Usuário fecha antes da recompensa: dispara apenas CLOSED
    const closedHandlers = mockEventHandlers[AdEventType.CLOSED] || [];
    closedHandlers.forEach((h) => h());

    expect(onEarnedReward).not.toHaveBeenCalled();
    expect(onAdClosed).toHaveBeenCalledWith(false);
  });

  it('Trata erro durante exibição chamando onAdFailedToShow e limpando listeners', () => {
    adMobService.preloadAd('daily_coins_rewarded');

    const loadedHandlers = mockEventHandlers[RewardedAdEventType.LOADED] || [];
    loadedHandlers.forEach((h) => h());

    const onFailed = jest.fn();
    adMobService.showRewardedAd('daily_coins_rewarded', {
      onEarnedReward: jest.fn(),
      onAdFailedToShow: onFailed,
    });

    const errorHandlers = mockEventHandlers[AdEventType.ERROR] || [];
    errorHandlers.forEach((h) => h(new Error('Network ad display timeout')));

    expect(onFailed).toHaveBeenCalledWith(expect.any(Error));
    expect(mockUnsubscribe).toHaveBeenCalled();
  });

  it('Configura testDeviceIdentifiers no build preview durante a inicialização', async () => {
    await adMobService.initialize();

    expect(mockMobileAdsInstance.setRequestConfiguration).toHaveBeenCalledWith(
      expect.objectContaining({
        testDeviceIdentifiers: ['EMULATOR'],
      })
    );
  });

  it('Não pré-carrega anúncios se o consentimento UMP for falso ou falhar', async () => {
    const { AdsConsent, RewardedAd } = require('react-native-google-mobile-ads');
    AdsConsent.getConsentInfo.mockResolvedValueOnce({ canRequestAds: false });
    RewardedAd.createForAdRequest.mockClear();

    // Cria nova instância para testar inicialização sem consentimento
    await adMobService.initialize();

    expect(RewardedAd.createForAdRequest).not.toHaveBeenCalled();
  });
});
