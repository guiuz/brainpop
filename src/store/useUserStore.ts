import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { firebaseLeaderboardService } from '../services/firebaseLeaderboardService';
import { firebaseAuthService, FirebaseUserProfile } from '../services/firebaseAuthService';
import { getDuelRankByTrophies, DuelRank } from '../data/duelRanks';
import { dailyMissionService, MissionKey, ClaimMissionResult } from '../services/dailyMissionService';

export interface UserStats {
  totalMatches: number;
  totalWins: number;
  totalCorrectAnswers: number;
  totalQuestionsAnswered: number;
  bestStreak: number;
  tournamentsWon: number;
  tournamentsJoined: number;
  categoryStats: Record<string, { correct: number; total: number }>;
}

export interface UserSettings {
  soundEnabled: boolean;
  vibrationEnabled: boolean;
  notificationsEnabled: boolean;
}

export interface UserState {
  // Perfil
  id: string;
  name: string;
  email?: string;
  avatarUrl: string;
  title: string;
  
  // Nível & Progressão
  level: number;
  currentXp: number;
  totalXp: number;
  xpToNextLevel: number;
  
  // Economia & Recursos
  coins: number;
  gems: number;
  lives: number;
  maxLives: number;
  lastLifeRegenTimestamp: number;
  
  // Gamificação & Sequência
  dailyStreak: number;
  lastActiveDate: string; // YYYY-MM-DD
  lastDailyAdDate: string; // YYYY-MM-DD
  hasCompletedDailyChallengeToday: boolean;
  isLoggedIn: boolean;
  
  // Primeiro Acesso & Onboarding
  hasCompletedOnboarding: boolean;
  hasConfiguredInitialPermissions: boolean;
  
  // Duelos & Rankings Competitivos
  duelTrophies: number;
  duelWins: number;
  duelLosses: number;
  
  // Customização de Perfil & Tutorial
  nameChangesCount: number;
  hasCompletedProfileTutorial: boolean;
  
  // Inventário de Power-ups
  inventory: {
    fiftyFifty: number;
    extraTime: number;
    skip: number;
    hint: number;
  };
  
  // Estatísticas do Jogador
  stats: UserStats;

  // Amigos
  friends: string[];

  // Configurações
  settings: UserSettings;

  // Ações
  addXp: (amount: number) => { leveledUp: boolean; newLevel: number };
  addCoins: (amount: number) => void;
  setCoinsConfirmed: (confirmedBalance: number) => void;
  spendCoins: (amount: number) => boolean;
  addGems: (amount: number) => void;
  spendGems: (amount: number) => boolean;
  useLife: () => boolean;
  refillLives: () => void;
  addLife: (amount?: number) => void;
  checkDailyStreak: () => void;
  consumePowerUpItem: (type: 'fiftyFifty' | 'extraTime' | 'skip' | 'hint') => boolean;
  addPowerUpItem: (type: 'fiftyFifty' | 'extraTime' | 'skip' | 'hint', count?: number) => void;
  recordMatchResult: (params: {
    won: boolean;
    correctAnswers: number;
    totalQuestions: number;
    category: string;
    xpGained: number;
    coinsGained: number;
  }) => void;
  completeDailyChallenge: () => void;
  canClaimDailyAd: () => boolean;
  claimDailyAdReward: () => { success: boolean; message: string; coinsEarned: number };
  claimDailyMission: (missionKey: MissionKey) => Promise<ClaimMissionResult>;
  updateProfile: (data: Partial<Pick<UserState, 'name' | 'avatarUrl' | 'title' | 'nameChangesCount'>>) => void;
  changeUsername: (newName: string) => { success: boolean; message: string; cost: number };
  changeAvatar: (newAvatarUrl: string) => void;
  completeProfileTutorial: () => void;
  joinTournament: () => void;
  winTournament: () => void;
  updateSettings: (newSettings: Partial<UserSettings>) => void;
  setHasCompletedOnboarding: (completed: boolean) => void;
  setHasConfiguredInitialPermissions: (configured: boolean) => void;
  addFriendId: (friendId: string) => void;
  removeFriendId: (friendId: string) => void;
  recordDuelOutcome: (params: {
    won: boolean;
    betAmount: number;
  }) => {
    won: boolean;
    earnedTrophies: number;
    newTotalTrophies: number;
    rankedUp: boolean;
    currentRank: DuelRank;
    coinsEarnedOrLost: number;
  };
  login: (userData: Partial<FirebaseUserProfile>) => void;
  syncFromCloud: (userData: Partial<FirebaseUserProfile>) => void;
  logout: () => void;
  resetGameProgress: () => void;
  resetApplicationData: () => void;
}

const calculateXpForLevel = (level: number) => level * 300;

const getTodayString = () => new Date().toISOString().split('T')[0];

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      id: '',
      name: 'Jogador',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
      title: 'Novato',
      
      level: 1,
      currentXp: 0,
      totalXp: 0,
      xpToNextLevel: 300,
      
      coins: 500,
      gems: 15,
      lives: 5,
      maxLives: 5,
      lastLifeRegenTimestamp: Date.now(),
      
      dailyStreak: 1,
      lastActiveDate: getTodayString(),
      lastDailyAdDate: '',
      hasCompletedDailyChallengeToday: false,
      isLoggedIn: false,
      hasCompletedOnboarding: false,
      hasConfiguredInitialPermissions: false,
      
      duelTrophies: 0,
      duelWins: 0,
      duelLosses: 0,
      
      nameChangesCount: 0,
      hasCompletedProfileTutorial: false,
      
      inventory: {
        fiftyFifty: 3,
        extraTime: 2,
        skip: 2,
        hint: 1,
      },
      
      stats: {
        totalMatches: 0,
        totalWins: 0,
        totalCorrectAnswers: 0,
        totalQuestionsAnswered: 0,
        bestStreak: 0,
        tournamentsWon: 0,
        tournamentsJoined: 0,
        categoryStats: {},
      },

      friends: [],

      settings: {
        soundEnabled: true,
        vibrationEnabled: true,
        notificationsEnabled: true,
      },

      addXp: (amount: number) => {
        let { level, currentXp, xpToNextLevel, totalXp, id: userId } = get();
        let leveledUp = false;
        currentXp += amount;
        totalXp = (totalXp || 0) + amount;

        while (currentXp >= xpToNextLevel) {
          currentXp -= xpToNextLevel;
          level += 1;
          xpToNextLevel = calculateXpForLevel(level);
          leveledUp = true;
        }

        set({ level, currentXp, xpToNextLevel, totalXp });

        if (userId) {
          firebaseAuthService.updateProfileData(userId, {
            level,
            currentXp,
            totalXp,
            xpToNextLevel,
          }).catch((e) => console.warn('Sync XP error:', e));
        }

        return { leveledUp, newLevel: level };
      },

      addCoins: (amount: number) => {
        if (typeof amount !== 'number' || !Number.isFinite(amount) || Number.isNaN(amount) || amount <= 0) {
          console.warn('[Anti-Cheat] addCoins rejeitou valor inválido:', amount);
          return;
        }
        const safeAmount = Math.min(Math.floor(amount), 5000);
        const { coins, id: userId } = get();
        const newCoins = coins + safeAmount;
        set({ coins: newCoins });
        if (userId) {
          firebaseAuthService.updateProfileData(userId, { coins: newCoins }).catch((e) => console.warn('Sync coins error:', e));
        }
      },

      setCoinsConfirmed: (confirmedBalance: number) => {
        if (typeof confirmedBalance === 'number' && Number.isFinite(confirmedBalance) && confirmedBalance >= 0) {
          set({ coins: Math.floor(confirmedBalance) });
        }
      },

      spendCoins: (amount: number) => {
        if (typeof amount !== 'number' || !Number.isFinite(amount) || Number.isNaN(amount) || amount <= 0) {
          console.warn('[Anti-Cheat] spendCoins rejeitou valor inválido:', amount);
          return false;
        }
        const cleanAmount = Math.floor(amount);
        const { coins, id: userId } = get();
        if (coins < cleanAmount) return false;
        const newCoins = Math.max(0, coins - cleanAmount);
        set({ coins: newCoins });
        if (userId) {
          firebaseAuthService.updateProfileData(userId, { coins: newCoins }).catch((e) => console.warn('Sync spend error:', e));
        }
        return true;
      },

      addGems: (amount: number) => {
        if (typeof amount !== 'number' || !Number.isFinite(amount) || Number.isNaN(amount) || amount <= 0) {
          console.warn('[Anti-Cheat] addGems rejeitou valor inválido:', amount);
          return;
        }
        const safeAmount = Math.min(Math.floor(amount), 1000);
        const { gems, id: userId } = get();
        const newGems = gems + safeAmount;
        set({ gems: newGems });
        if (userId) {
          firebaseAuthService.updateProfileData(userId, { gems: newGems }).catch((e) => console.warn('Sync gems error:', e));
        }
      },

      spendGems: (amount: number) => {
        if (typeof amount !== 'number' || !Number.isFinite(amount) || Number.isNaN(amount) || amount <= 0) {
          console.warn('[Anti-Cheat] spendGems rejeitou valor inválido:', amount);
          return false;
        }
        const cleanAmount = Math.floor(amount);
        const { gems, id: userId } = get();
        if (gems < cleanAmount) return false;
        const newGems = Math.max(0, gems - cleanAmount);
        set({ gems: newGems });
        if (userId) {
          firebaseAuthService.updateProfileData(userId, { gems: newGems }).catch((e) => console.warn('Sync spend gems error:', e));
        }
        return true;
      },

      useLife: () => {
        const { lives, id: userId } = get();
        if (lives <= 0) return false;
        const newLives = Math.max(0, lives - 1);
        const regenTime = Date.now();
        set({ 
          lives: newLives,
          lastLifeRegenTimestamp: regenTime 
        });
        if (userId) {
          firebaseAuthService.updateProfileData(userId, { lives: newLives }).catch((e) => console.warn('Sync lives error:', e));
        }
        return true;
      },

      refillLives: () => {
        const { maxLives, id: userId } = get();
        set({ lives: maxLives, lastLifeRegenTimestamp: Date.now() });
        if (userId) {
          firebaseAuthService.updateProfileData(userId, { lives: maxLives }).catch((e) => console.warn('Sync refill error:', e));
        }
      },

      addLife: (amount = 1) => {
        if (typeof amount !== 'number' || !Number.isFinite(amount) || Number.isNaN(amount) || amount <= 0) {
          return;
        }
        const { maxLives, lives, id: userId } = get();
        const newLives = Math.min(maxLives, lives + Math.floor(amount));
        set({ lives: newLives });
        if (userId) {
          firebaseAuthService.updateProfileData(userId, { lives: newLives }).catch((e) => console.warn('Sync add life error:', e));
        }
      },

      checkDailyStreak: () => {
        const today = getTodayString();
        const { lastActiveDate, dailyStreak, id: userId } = get();
        
        if (lastActiveDate === today) return;

        const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
        let newStreak = dailyStreak;
        if (lastActiveDate === yesterday) {
          newStreak = dailyStreak + 1;
        } else {
          newStreak = 1;
        }

        set({ dailyStreak: newStreak, lastActiveDate: today });
        if (userId) {
          firebaseAuthService.updateProfileData(userId, { dailyStreak: newStreak, lastActiveDate: today }).catch((e) => console.warn('Sync streak error:', e));
        }
      },

      consumePowerUpItem: (type) => {
        const { inventory, id: userId } = get();
        if (inventory[type] <= 0) return false;
        const newInv = {
          ...inventory,
          [type]: inventory[type] - 1,
        };
        set({ inventory: newInv });
        if (userId) {
          firebaseAuthService.updateProfileData(userId, { inventory: newInv }).catch((e) => console.warn('Sync inventory error:', e));
        }
        return true;
      },

      addPowerUpItem: (type, count = 1) => {
        const { inventory, id: userId } = get();
        const newInv = {
          ...inventory,
          [type]: (inventory[type] || 0) + count,
        };
        set({ inventory: newInv });
        if (userId) {
          firebaseAuthService.updateProfileData(userId, { inventory: newInv }).catch((e) => console.warn('Sync add powerup error:', e));
        }
      },

      recordMatchResult: ({ won, correctAnswers, totalQuestions, category, xpGained, coinsGained }) => {
        // Anti-Cheat: Validação de consistência e tetos máximos matemáticos
        const safeQuestions = Math.max(1, Math.min(50, totalQuestions || 10));
        const safeCorrect = Math.max(0, Math.min(safeQuestions, correctAnswers || 0));

        // Teto máximo legítimo por partida:
        // Moedas: ~35 moedas por acerto com combo máximo + 50 moedas bônus de vitória
        const maxAllowableCoins = safeQuestions * 35 + (won ? 50 : 10);
        // XP: ~75 XP por acerto com tempo máximo + 100 XP bônus de vitória
        const maxAllowableXp = safeQuestions * 75 + (won ? 100 : 20);

        const safeCoins = Math.max(0, Math.min(coinsGained || 0, maxAllowableCoins));
        const safeXp = Math.max(0, Math.min(xpGained || 0, maxAllowableXp));

        if (coinsGained > maxAllowableCoins || xpGained > maxAllowableXp) {
          console.warn('[Anti-Cheat] Recompensa de partida truncada por exceder o teto seguro:', {
            fornecido: { coinsGained, xpGained },
            seguro: { safeCoins, safeXp },
          });
        }

        const { id: userId, stats } = get();
        const catLower = (category || 'geral').toLowerCase();
        const prevCat = stats.categoryStats?.[catLower] || { correct: 0, total: 0 };

        const newStats: UserStats = {
          totalMatches: (stats.totalMatches || 0) + 1,
          totalWins: won ? (stats.totalWins || 0) + 1 : (stats.totalWins || 0),
          totalCorrectAnswers: (stats.totalCorrectAnswers || 0) + safeCorrect,
          totalQuestionsAnswered: (stats.totalQuestionsAnswered || 0) + safeQuestions,
          bestStreak: Math.max(stats.bestStreak || 0, safeCorrect),
          tournamentsWon: stats.tournamentsWon || 0,
          tournamentsJoined: stats.tournamentsJoined || 0,
          categoryStats: {
            ...(stats.categoryStats || {}),
            [catLower]: {
              correct: prevCat.correct + safeCorrect,
              total: prevCat.total + safeQuestions,
            },
          },
        };

        set({ stats: newStats });
        get().addXp(safeXp);
        get().addCoins(safeCoins);

        if (userId) {
          firebaseAuthService.updateProfileData(userId, {
            stats: newStats,
          }).catch((e) => console.warn('Sync match stats error:', e));

          firebaseLeaderboardService.recordMatchScore({
            userId,
            score: safeCorrect * 100,
            xpGained: safeXp,
            coinsGained: safeCoins,
            won,
            correctAnswers: safeCorrect,
            totalQuestions: safeQuestions,
            category,
          }).catch((e) => console.warn('Sync score error:', e));

          // Notifica o progresso da missão diária de partida concluída
          dailyMissionService.recordMissionProgress(userId, { type: 'match_completed' }).catch((e) =>
            console.warn('Sync mission match error:', e)
          );
        }
      },

      completeDailyChallenge: () => {
        const { id: userId } = get();
        set({ hasCompletedDailyChallengeToday: true });
        get().addCoins(100);
        get().addXp(200);
        if (userId) {
          firebaseAuthService.updateProfileData(userId, { hasCompletedDailyChallengeToday: true }).catch((e) => console.warn('Sync daily challenge error:', e));
        }
      },

      canClaimDailyAd: () => {
        const today = getTodayString();
        const { lastDailyAdDate } = get();
        return lastDailyAdDate !== today;
      },

      claimDailyAdReward: () => {
        return { 
          success: false, 
          message: 'A concessão de moedas por anúncios em vídeo está temporariamente suspensa para homologação do fluxo autoritativo (SSV) no servidor.', 
          coinsEarned: 0 
        };
      },

      claimDailyMission: async (missionKey: MissionKey) => {
        const { id: userId } = get();
        if (!userId) {
          return { success: false, message: 'Usuário não autenticado.', claimed: false };
        }

        const result = await dailyMissionService.claimDailyMission(userId, missionKey);

        if (result.success && result.coins) {
          get().addCoins(result.coins);
          if (result.xp) {
            get().addXp(result.xp);
          }
        }

        return result;
      },

      updateProfile: (data) => {
        const { id: userId } = get();
        set((state) => ({ ...state, ...data }));
        if (userId) {
          firebaseAuthService.updateProfileData(userId, data).catch((e) => console.warn('Sync profile error:', e));
        }
      },

      changeUsername: (newName: string) => {
        const cleanName = newName.trim();
        if (!cleanName || cleanName.length < 3) {
          return { success: false, message: 'O nome deve ter no mínimo 3 caracteres.', cost: 0 };
        }
        if (cleanName.length > 20) {
          return { success: false, message: 'O nome pode ter no máximo 20 caracteres.', cost: 0 };
        }

        const { nameChangesCount, coins, id: userId } = get();
        const isFirstTime = nameChangesCount === 0;
        const cost = isFirstTime ? 0 : 10000;

        if (!isFirstTime && coins < cost) {
          return { 
            success: false, 
            message: `Saldo insuficiente! Alterar o nome novamente custa 10.000 moedas (você tem ${coins}).`, 
            cost 
          };
        }

        const newCoins = isFirstTime ? coins : coins - cost;
        const newCount = nameChangesCount + 1;

        set({
          name: cleanName,
          coins: newCoins,
          nameChangesCount: newCount,
          hasCompletedProfileTutorial: true,
        });

        if (userId) {
          firebaseAuthService.updateProfileData(userId, {
            name: cleanName,
            coins: newCoins,
            nameChangesCount: newCount,
            hasCompletedProfileTutorial: true,
          }).catch((e) => console.warn('Sync name error:', e));
        }

        return {
          success: true,
          message: isFirstTime 
            ? 'Nome de jogador salvo e registrado com sucesso!' 
            : `Nome alterado com sucesso! (10.000 moedas debitadas)`,
          cost,
        };
      },

      changeAvatar: (newAvatarUrl: string) => {
        const { id: userId } = get();
        set({ 
          avatarUrl: newAvatarUrl,
          hasCompletedProfileTutorial: true,
        });
        if (userId) {
          firebaseAuthService.updateProfileData(userId, {
            avatarUrl: newAvatarUrl,
            hasCompletedProfileTutorial: true,
          }).catch((e) => console.warn('Sync avatar error:', e));
        }
      },

      completeProfileTutorial: () => {
        const { id: userId } = get();
        set({ hasCompletedProfileTutorial: true });
        if (userId) {
          firebaseAuthService.updateProfileData(userId, { hasCompletedProfileTutorial: true }).catch((e) => console.warn('Sync tutorial error:', e));
        }
      },

      joinTournament: () => {
        const { stats, id: userId } = get();
        const newStats: UserStats = {
          ...stats,
          tournamentsJoined: (stats.tournamentsJoined || 0) + 1,
        };
        set({ stats: newStats });
        if (userId) {
          firebaseAuthService.updateProfileData(userId, { stats: newStats }).catch((e) => console.warn('Sync tournament joined error:', e));
        }
      },

      winTournament: () => {
        const { stats, id: userId } = get();
        const newStats: UserStats = {
          ...stats,
          tournamentsWon: (stats.tournamentsWon || 0) + 1,
          totalWins: (stats.totalWins || 0) + 1,
        };
        set({ stats: newStats });
        if (userId) {
          firebaseAuthService.updateProfileData(userId, { stats: newStats }).catch((e) => console.warn('Sync tournament won error:', e));
        }
      },

      updateSettings: (newSettings) => {
        const { settings, id: userId } = get();
        const updated = { ...settings, ...newSettings };
        set({ settings: updated });
        if (userId) {
          firebaseAuthService.updateProfileData(userId, { settings: updated }).catch((e) => console.warn('Sync settings error:', e));
        }
      },

      setHasCompletedOnboarding: (completed: boolean) => {
        set({ hasCompletedOnboarding: completed });
      },

      setHasConfiguredInitialPermissions: (configured: boolean) => {
        set({ hasConfiguredInitialPermissions: configured });
      },

      addFriendId: (friendId: string) => {
        const { friends, id: userId } = get();
        if (friends.includes(friendId)) return;
        const newFriends = [...friends, friendId];
        set({ friends: newFriends });
        if (userId) {
          firebaseAuthService.updateProfileData(userId, { friends: newFriends }).catch((e) => console.warn('Sync add friend error:', e));
        }
      },

      removeFriendId: (friendId: string) => {
        const { friends, id: userId } = get();
        const newFriends = friends.filter((f) => f !== friendId);
        set({ friends: newFriends });
        if (userId) {
          firebaseAuthService.updateProfileData(userId, { friends: newFriends }).catch((e) => console.warn('Sync remove friend error:', e));
        }
      },

      recordDuelOutcome: ({ won, betAmount }) => {
        const ALLOWED_BETS = [50, 100, 250, 500, 1000];
        const safeBet = typeof betAmount === 'number' && ALLOWED_BETS.includes(betAmount) ? betAmount : 50;

        const { duelTrophies, duelWins, duelLosses, coins, id: userId } = get();
        const prevRank = getDuelRankByTrophies(duelTrophies).currentRank;

        let newTrophies = duelTrophies;
        let earnedTrophies = 0;
        let newCoins = coins;
        let coinsEarnedOrLost = 0;

        if (won) {
          earnedTrophies = 1;
          newTrophies = duelTrophies + 1;
          const prize = safeBet * 2;
          newCoins = coins + prize;
          coinsEarnedOrLost = prize;
          set({
            duelTrophies: newTrophies,
            duelWins: duelWins + 1,
            coins: newCoins,
          });
        } else {
          coinsEarnedOrLost = -safeBet;
          set({
            duelLosses: duelLosses + 1,
          });
        }

        const newRank = getDuelRankByTrophies(newTrophies).currentRank;
        const rankedUp = won && (newRank.id !== prevRank.id);

        if (userId) {
          firebaseAuthService.updateProfileData(userId, {
            coins: newCoins,
            duelTrophies: newTrophies,
            duelWins: won ? duelWins + 1 : duelWins,
            duelLosses: won ? duelLosses : duelLosses + 1,
          }).catch((e) => console.warn('Sync duel outcome error:', e));

          // Notifica o progresso da missão diária de duelo concluído
          dailyMissionService.recordMissionProgress(userId, { type: 'duel_completed' }).catch((e) =>
            console.warn('Sync mission duel error:', e)
          );
          dailyMissionService.recordMissionProgress(userId, { type: 'match_completed' }).catch((e) =>
            console.warn('Sync mission duel match error:', e)
          );
        }

        return {
          won,
          earnedTrophies,
          newTotalTrophies: newTrophies,
          rankedUp,
          currentRank: newRank,
          coinsEarnedOrLost,
        };
      },

      login: (userData) => {
        set((state) => {
          const isSameUser = Boolean(state.id && userData.id && state.id === userData.id);
          // Bloqueio de recriação econômica: se o usuário local já acumulou saldo maior que o valor default de cadastro (500/15)
          // e os dados recebidos forem o fallback padrão (500/15), preserva o saldo real acumulado
          const safeCoins = (isSameUser && userData.coins === 500 && state.coins > 500)
            ? state.coins
            : (userData.coins !== undefined ? userData.coins : state.coins);
          const safeGems = (isSameUser && userData.gems === 15 && state.gems > 15)
            ? state.gems
            : (userData.gems !== undefined ? userData.gems : state.gems);
          const safeXp = (isSameUser && userData.currentXp === 0 && state.currentXp > 0)
            ? state.currentXp
            : (userData.currentXp !== undefined ? userData.currentXp : state.currentXp);
          const safeTotalXp = (isSameUser && userData.totalXp === 0 && state.totalXp > 0)
            ? state.totalXp
            : (userData.totalXp !== undefined ? userData.totalXp : state.totalXp);
          const safeLevel = (isSameUser && userData.level === 1 && state.level > 1)
            ? state.level
            : (userData.level !== undefined ? userData.level : state.level);

          return {
            ...state,
            id: userData.id || state.id,
            name: userData.name || state.name,
            email: userData.email || state.email,
            avatarUrl: userData.avatarUrl || state.avatarUrl,
            title: userData.title || state.title || 'Novato',
            level: safeLevel,
            currentXp: safeXp,
            totalXp: safeTotalXp,
            xpToNextLevel: userData.xpToNextLevel !== undefined ? userData.xpToNextLevel : state.xpToNextLevel,
            coins: safeCoins,
            gems: safeGems,
            lives: userData.lives !== undefined ? userData.lives : state.lives,
            maxLives: userData.maxLives !== undefined ? userData.maxLives : state.maxLives,
            dailyStreak: userData.dailyStreak !== undefined ? userData.dailyStreak : state.dailyStreak,
            lastActiveDate: userData.lastActiveDate || state.lastActiveDate,
            lastDailyAdDate: userData.lastDailyAdDate || state.lastDailyAdDate,
            hasCompletedDailyChallengeToday: userData.hasCompletedDailyChallengeToday !== undefined ? userData.hasCompletedDailyChallengeToday : state.hasCompletedDailyChallengeToday,
            nameChangesCount: userData.nameChangesCount !== undefined ? userData.nameChangesCount : (state.name !== 'Jogador' ? 1 : 0),
            hasCompletedProfileTutorial: userData.hasCompletedProfileTutorial !== undefined ? userData.hasCompletedProfileTutorial : state.hasCompletedProfileTutorial,
            inventory: userData.inventory || state.inventory,
            stats: userData.stats ? {
              totalMatches: userData.stats.totalMatches ?? state.stats.totalMatches,
              totalWins: userData.stats.totalWins ?? state.stats.totalWins,
              totalCorrectAnswers: userData.stats.totalCorrectAnswers ?? state.stats.totalCorrectAnswers,
              totalQuestionsAnswered: userData.stats.totalQuestionsAnswered ?? state.stats.totalQuestionsAnswered,
              bestStreak: userData.stats.bestStreak ?? state.stats.bestStreak,
              tournamentsWon: userData.stats.tournamentsWon ?? state.stats.tournamentsWon,
              tournamentsJoined: userData.stats.tournamentsJoined ?? state.stats.tournamentsJoined,
              categoryStats: userData.stats.categoryStats ?? state.stats.categoryStats,
            } : state.stats,
            friends: userData.friends || state.friends,
            settings: userData.settings || state.settings,
            duelTrophies: userData.duelTrophies ?? state.duelTrophies ?? 0,
            duelWins: userData.duelWins ?? state.duelWins ?? 0,
            duelLosses: userData.duelLosses ?? state.duelLosses ?? 0,
            isLoggedIn: true,
          };
        });
      },

      syncFromCloud: (userData) => {
        get().login(userData);
      },

      logout: () => {
        firebaseAuthService.signOut().catch((e) => console.warn('Logout error:', e));
        const { hasCompletedOnboarding, hasConfiguredInitialPermissions } = get();
        set({
          isLoggedIn: false,
          hasCompletedOnboarding: hasCompletedOnboarding ?? true,
          hasConfiguredInitialPermissions: hasConfiguredInitialPermissions ?? true,
          id: '',
          name: 'Convidado',
          email: '',
          avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
          title: 'Novato',
          level: 1,
          currentXp: 0,
          totalXp: 0,
          xpToNextLevel: 300,
          coins: 500,
          gems: 15,
          lives: 5,
          maxLives: 5,
          lastLifeRegenTimestamp: Date.now(),
          dailyStreak: 1,
          lastActiveDate: getTodayString(),
          lastDailyAdDate: '',
          hasCompletedDailyChallengeToday: false,
          duelTrophies: 0,
          duelWins: 0,
          duelLosses: 0,
          nameChangesCount: 0,
          hasCompletedProfileTutorial: false,
          inventory: {
            fiftyFifty: 3,
            extraTime: 2,
            skip: 2,
            hint: 1,
          },
          stats: {
            totalMatches: 0,
            totalWins: 0,
            totalCorrectAnswers: 0,
            totalQuestionsAnswered: 0,
            bestStreak: 0,
            tournamentsWon: 0,
            tournamentsJoined: 0,
            categoryStats: {},
          },
          friends: [],
          settings: {
            soundEnabled: true,
            vibrationEnabled: true,
            notificationsEnabled: true,
          },
        });
      },

      resetGameProgress: () => {
        const { id: userId } = get();
        const initialStats: UserStats = {
          totalMatches: 0,
          totalWins: 0,
          totalCorrectAnswers: 0,
          totalQuestionsAnswered: 0,
          bestStreak: 0,
          tournamentsWon: 0,
          tournamentsJoined: 0,
          categoryStats: {},
        };
        const initialInv = {
          fiftyFifty: 3,
          extraTime: 2,
          skip: 2,
          hint: 1,
        };
        set({
          level: 1,
          currentXp: 0,
          totalXp: 0,
          xpToNextLevel: 300,
          coins: 500,
          gems: 15,
          lives: 5,
          dailyStreak: 1,
          hasCompletedDailyChallengeToday: false,
          inventory: initialInv,
          stats: initialStats,
        });
        if (userId) {
          firebaseAuthService.updateProfileData(userId, {
            level: 1,
            currentXp: 0,
            totalXp: 0,
            xpToNextLevel: 300,
            coins: 500,
            gems: 15,
            lives: 5,
            dailyStreak: 1,
            hasCompletedDailyChallengeToday: false,
            inventory: initialInv,
            stats: initialStats,
          }).catch((e) => console.warn('Sync reset error:', e));
        }
      },

      resetApplicationData: () => {
        get().resetGameProgress();
        set({
          hasCompletedOnboarding: false,
          hasConfiguredInitialPermissions: false,
        });
      },
    }),
    {
      name: 'brainpop-user-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
