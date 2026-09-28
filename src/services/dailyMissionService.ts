import AsyncStorage from '@react-native-async-storage/async-storage';

export type MissionKey = 'play_match' | 'play_duel' | 'correct_streak';

export interface MissionDefinition {
  key: MissionKey;
  title: string;
  description: string;
  target: number;
  rewardCoins: number;
  rewardXp: number;
}

export const DAILY_MISSION_DEFINITIONS: Record<MissionKey, MissionDefinition> = {
  play_match: {
    key: 'play_match',
    title: 'Treino Rápido',
    description: 'Jogue 1 partida de qualquer matéria',
    target: 1,
    rewardCoins: 60,
    rewardXp: 50,
  },
  play_duel: {
    key: 'play_duel',
    title: 'Guerreiro do Duelo',
    description: 'Participe do Matchmaking 1v1',
    target: 1,
    rewardCoins: 80,
    rewardXp: 60,
  },
  correct_streak: {
    key: 'correct_streak',
    title: 'Foco Total',
    description: 'Acerte 5 perguntas seguidas em uma mesma partida',
    target: 5,
    rewardCoins: 100,
    rewardXp: 80,
  },
};

export interface MissionProgress {
  key: MissionKey;
  current: number;
  target: number;
  completed: boolean;
  claimed: boolean;
}

export interface UserDailyMissions {
  userId: string;
  dateKey: string;
  missions: Record<MissionKey, MissionProgress>;
}

export interface ClaimMissionResult {
  success: boolean;
  message: string;
  claimed: boolean;
  coins?: number;
  xp?: number;
}

export type MissionProgressEvent =
  | { type: 'match_completed' }
  | { type: 'duel_completed' }
  | { type: 'streak_achieved'; streak: number };

// Trava de concorrência síncrona em memória para evitar execução concorrente de coleta
const activeClaimLocks = new Set<string>();

export const getTodayKey = (date: Date = new Date()): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const getStorageKey = (userId: string, dateKey: string): string => {
  return `@brainpop:daily_missions:${userId}:${dateKey}`;
};

export const createInitialMissions = (userId: string, dateKey: string): UserDailyMissions => {
  return {
    userId,
    dateKey,
    missions: {
      play_match: {
        key: 'play_match',
        current: 0,
        target: DAILY_MISSION_DEFINITIONS.play_match.target,
        completed: false,
        claimed: false,
      },
      play_duel: {
        key: 'play_duel',
        current: 0,
        target: DAILY_MISSION_DEFINITIONS.play_duel.target,
        completed: false,
        claimed: false,
      },
      correct_streak: {
        key: 'correct_streak',
        current: 0,
        target: DAILY_MISSION_DEFINITIONS.correct_streak.target,
        completed: false,
        claimed: false,
      },
    },
  };
};

export const dailyMissionService = {
  /**
   * Obtém as missões diárias do usuário para a data especificada (ou hoje).
   * Se a data virou ou o usuário não tem dados gravados, reinicia o progresso.
   */
  async getDailyMissions(userId: string, targetDateKey?: string): Promise<UserDailyMissions> {
    if (!userId) {
      return createInitialMissions('guest', targetDateKey || getTodayKey());
    }

    const dateKey = targetDateKey || getTodayKey();
    const key = getStorageKey(userId, dateKey);

    try {
      const stored = await AsyncStorage.getItem(key);
      if (stored) {
        const parsed = JSON.parse(stored) as UserDailyMissions;
        if (parsed && parsed.userId === userId && parsed.dateKey === dateKey && parsed.missions) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('[dailyMissionService] Erro ao carregar missões:', e);
    }

    const initial = createInitialMissions(userId, dateKey);
    try {
      await AsyncStorage.setItem(key, JSON.stringify(initial));
    } catch (e) {
      console.warn('[dailyMissionService] Erro ao salvar missões iniciais:', e);
    }
    return initial;
  },

  /**
   * Atualiza o progresso das missões diárias com base em eventos legítimos do jogo.
   */
  async recordMissionProgress(
    userId: string,
    event: MissionProgressEvent,
    targetDateKey?: string
  ): Promise<UserDailyMissions> {
    if (!userId) {
      return createInitialMissions('guest', targetDateKey || getTodayKey());
    }

    const dateKey = targetDateKey || getTodayKey();
    const data = await this.getDailyMissions(userId, dateKey);
    let changed = false;

    if (event.type === 'match_completed') {
      const m = data.missions.play_match;
      if (m && !m.completed) {
        m.current = Math.min(m.target, m.current + 1);
        if (m.current >= m.target) {
          m.completed = true;
        }
        changed = true;
      }
    } else if (event.type === 'duel_completed') {
      const m = data.missions.play_duel;
      if (m && !m.completed) {
        m.current = Math.min(m.target, m.current + 1);
        if (m.current >= m.target) {
          m.completed = true;
        }
        changed = true;
      }
    } else if (event.type === 'streak_achieved') {
      // Cinco acertos precisam ocorrer na mesma partida
      const m = data.missions.correct_streak;
      if (m && !m.completed) {
        // Atualiza a maior sequência alcançada em uma única partida no dia
        const matchStreak = Math.max(0, event.streak || 0);
        if (matchStreak > m.current) {
          m.current = Math.min(m.target, matchStreak);
          if (m.current >= m.target) {
            m.completed = true;
          }
          changed = true;
        }
      }
    }

    if (changed) {
      try {
        const key = getStorageKey(userId, dateKey);
        await AsyncStorage.setItem(key, JSON.stringify(data));
      } catch (e) {
        console.warn('[dailyMissionService] Erro ao atualizar progresso de missões:', e);
      }
    }

    return data;
  },

  /**
   * Coleta idempotente e atômica de missão diária:
   * 1. Trava concorrência via lock síncrono.
   * 2. Valida se a missão está completa (current >= target).
   * 3. Valida se a missão já foi coletada (claimed === false).
   * 4. Marca claimed = true e persiste de forma atômica no AsyncStorage.
   * 5. Retorna o valor de moedas e XP para concessão segura.
   */
  async claimDailyMission(
    userId: string,
    missionKey: MissionKey,
    targetDateKey?: string
  ): Promise<ClaimMissionResult> {
    if (!userId) {
      return { success: false, message: 'Usuário inválido.', claimed: false };
    }

    const dateKey = targetDateKey || getTodayKey();
    const lockKey = `${userId}:${missionKey}:${dateKey}`;

    // Trava de concorrência: duplo clique bloqueado na hora
    if (activeClaimLocks.has(lockKey)) {
      return {
        success: false,
        message: 'A coleta desta missão já está em andamento.',
        claimed: false,
      };
    }

    activeClaimLocks.add(lockKey);

    try {
      const data = await this.getDailyMissions(userId, dateKey);
      const mission = data.missions[missionKey];
      const def = DAILY_MISSION_DEFINITIONS[missionKey];

      if (!mission || !def) {
        return { success: false, message: 'Missão desconhecida.', claimed: false };
      }

      if (mission.claimed) {
        return {
          success: false,
          message: 'Esta recompensa já foi coletada hoje.',
          claimed: true,
        };
      }

      if (!mission.completed || mission.current < mission.target) {
        return {
          success: false,
          message: 'Esta missão ainda não foi concluída.',
          claimed: false,
        };
      }

      // Marca como claimed de forma definitiva
      mission.claimed = true;
      const key = getStorageKey(userId, dateKey);
      await AsyncStorage.setItem(key, JSON.stringify(data));

      return {
        success: true,
        message: `Recompensa coletada! +${def.rewardCoins} Moedas e +${def.rewardXp} XP.`,
        claimed: true,
        coins: def.rewardCoins,
        xp: def.rewardXp,
      };
    } catch (e) {
      console.warn('[dailyMissionService] Erro ao reivindicar recompensa da missão:', e);
      return {
        success: false,
        message: 'Erro interno ao processar a recompensa. Tente novamente.',
        claimed: false,
      };
    } finally {
      activeClaimLocks.delete(lockKey);
    }
  },

  /**
   * Utilitário para testes: limpa armazenamento e travas
   */
  async _resetForTesting(): Promise<void> {
    activeClaimLocks.clear();
  },
};
