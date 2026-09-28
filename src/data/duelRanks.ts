export interface DuelRank {
  id: string;
  tier: 'Ferro' | 'Bronze' | 'Prata' | 'Ouro' | 'Platina' | 'Diamante' | 'Mestre' | 'Grão-Mestre' | 'Desafiante';
  division: number | null; // 1, 2, 3 ou null para Ferro
  name: string;
  trophiesRequired: number;
  primaryColor: string;
  gradientColors: [string, string];
  glowColor: string;
  tag: string;
}

export const DUEL_RANKS: DuelRank[] = [
  // 0: Ferro
  {
    id: 'ferro',
    tier: 'Ferro',
    division: null,
    name: 'Ferro',
    trophiesRequired: 0,
    primaryColor: '#71717A',
    gradientColors: ['#52525B', '#27272A'],
    glowColor: 'rgba(113, 113, 122, 0.4)',
    tag: 'Iniciante do Caos',
  },

  // Bronze 1, 2, 3
  {
    id: 'bronze_1',
    tier: 'Bronze',
    division: 1,
    name: 'Bronze 1',
    trophiesRequired: 2,
    primaryColor: '#B45309',
    gradientColors: ['#D97706', '#78350F'],
    glowColor: 'rgba(217, 119, 6, 0.4)',
    tag: 'Primeiros Combates',
  },
  {
    id: 'bronze_2',
    tier: 'Bronze',
    division: 2,
    name: 'Bronze 2',
    trophiesRequired: 4,
    primaryColor: '#B45309',
    gradientColors: ['#D97706', '#78350F'],
    glowColor: 'rgba(217, 119, 6, 0.4)',
    tag: 'Guerreiro de Bronze',
  },
  {
    id: 'bronze_3',
    tier: 'Bronze',
    division: 3,
    name: 'Bronze 3',
    trophiesRequired: 6,
    primaryColor: '#B45309',
    gradientColors: ['#F59E0B', '#92400E'],
    glowColor: 'rgba(245, 158, 11, 0.4)',
    tag: 'Veterano do Bronze',
  },

  // Prata 1, 2, 3
  {
    id: 'prata_1',
    tier: 'Prata',
    division: 1,
    name: 'Prata 1',
    trophiesRequired: 9,
    primaryColor: '#94A3B8',
    gradientColors: ['#CBD5E1', '#475569'],
    glowColor: 'rgba(148, 163, 184, 0.4)',
    tag: 'Duelista Prateado',
  },
  {
    id: 'prata_2',
    tier: 'Prata',
    division: 2,
    name: 'Prata 2',
    trophiesRequired: 12,
    primaryColor: '#94A3B8',
    gradientColors: ['#CBD5E1', '#334155'],
    glowColor: 'rgba(148, 163, 184, 0.4)',
    tag: 'Mente Brilhante',
  },
  {
    id: 'prata_3',
    tier: 'Prata',
    division: 3,
    name: 'Prata 3',
    trophiesRequired: 15,
    primaryColor: '#38BDF8',
    gradientColors: ['#7DD3FC', '#0369A1'],
    glowColor: 'rgba(56, 189, 248, 0.4)',
    tag: 'Elite da Prata',
  },

  // Ouro 1, 2, 3
  {
    id: 'ouro_1',
    tier: 'Ouro',
    division: 1,
    name: 'Ouro 1',
    trophiesRequired: 19,
    primaryColor: '#F59E0B',
    gradientColors: ['#FCD34D', '#B45309'],
    glowColor: 'rgba(245, 158, 11, 0.4)',
    tag: 'Aura Dourada',
  },
  {
    id: 'ouro_2',
    tier: 'Ouro',
    division: 2,
    name: 'Ouro 2',
    trophiesRequired: 23,
    primaryColor: '#F59E0B',
    gradientColors: ['#FBBF24', '#92400E'],
    glowColor: 'rgba(245, 158, 11, 0.4)',
    tag: 'Campeão Dourado',
  },
  {
    id: 'ouro_3',
    tier: 'Ouro',
    division: 3,
    name: 'Ouro 3',
    trophiesRequired: 27,
    primaryColor: '#EAB308',
    gradientColors: ['#FDE047', '#A16207'],
    glowColor: 'rgba(234, 179, 8, 0.4)',
    tag: 'Soberano de Ouro',
  },

  // Platina 1, 2, 3
  {
    id: 'platina_1',
    tier: 'Platina',
    division: 1,
    name: 'Platina 1',
    trophiesRequired: 32,
    primaryColor: '#14B8A6',
    gradientColors: ['#2DD4BF', '#0F766E'],
    glowColor: 'rgba(20, 184, 166, 0.4)',
    tag: 'Guardião Esmeralda',
  },
  {
    id: 'platina_2',
    tier: 'Platina',
    division: 2,
    name: 'Platina 2',
    trophiesRequired: 37,
    primaryColor: '#14B8A6',
    gradientColors: ['#5EEAD4', '#115E59'],
    glowColor: 'rgba(20, 184, 166, 0.4)',
    tag: 'Mestre da Platina',
  },
  {
    id: 'platina_3',
    tier: 'Platina',
    division: 3,
    name: 'Platina 3',
    trophiesRequired: 42,
    primaryColor: '#06B6D4',
    gradientColors: ['#67E8F9', '#0E7490'],
    glowColor: 'rgba(6, 182, 212, 0.4)',
    tag: 'Supremo da Platina',
  },

  // Diamante 1, 2, 3
  {
    id: 'diamante_1',
    tier: 'Diamante',
    division: 1,
    name: 'Diamante 1',
    trophiesRequired: 48,
    primaryColor: '#3B82F6',
    gradientColors: ['#60A5FA', '#1D4ED8'],
    glowColor: 'rgba(59, 130, 246, 0.45)',
    tag: 'Safira Celestial',
  },
  {
    id: 'diamante_2',
    tier: 'Diamante',
    division: 2,
    name: 'Diamante 2',
    trophiesRequired: 54,
    primaryColor: '#2563EB',
    gradientColors: ['#93C5FD', '#1E40AF'],
    glowColor: 'rgba(37, 99, 235, 0.45)',
    tag: 'Duelista Implacável',
  },
  {
    id: 'diamante_3',
    tier: 'Diamante',
    division: 3,
    name: 'Diamante 3',
    trophiesRequired: 60,
    primaryColor: '#1D4ED8',
    gradientColors: ['#60A5FA', '#172554'],
    glowColor: 'rgba(29, 78, 216, 0.5)',
    tag: 'Lenda de Diamante',
  },

  // Mestre 1, 2, 3
  {
    id: 'mestre_1',
    tier: 'Mestre',
    division: 1,
    name: 'Mestre 1',
    trophiesRequired: 67,
    primaryColor: '#A855F7',
    gradientColors: ['#C084FC', '#6B21A8'],
    glowColor: 'rgba(168, 85, 247, 0.5)',
    tag: 'Sabedoria Arcana',
  },
  {
    id: 'mestre_2',
    tier: 'Mestre',
    division: 2,
    name: 'Mestre 2',
    trophiesRequired: 74,
    primaryColor: '#9333EA',
    gradientColors: ['#E9D5FF', '#581C87'],
    glowColor: 'rgba(147, 51, 234, 0.5)',
    tag: 'Oráculo dos Duelos',
  },
  {
    id: 'mestre_3',
    tier: 'Mestre',
    division: 3,
    name: 'Mestre 3',
    trophiesRequired: 81,
    primaryColor: '#7E22CE',
    gradientColors: ['#C084FC', '#3B0764'],
    glowColor: 'rgba(126, 34, 206, 0.55)',
    tag: 'Mestre Supremo',
  },

  // Grão-Mestre 1, 2, 3
  {
    id: 'grao_mestre_1',
    tier: 'Grão-Mestre',
    division: 1,
    name: 'Grão-Mestre 1',
    trophiesRequired: 89,
    primaryColor: '#EF4444',
    gradientColors: ['#F87171', '#991B1B'],
    glowColor: 'rgba(239, 68, 68, 0.55)',
    tag: 'Fúria Ardente',
  },
  {
    id: 'grao_mestre_2',
    tier: 'Grão-Mestre',
    division: 2,
    name: 'Grão-Mestre 2',
    trophiesRequired: 97,
    primaryColor: '#DC2626',
    gradientColors: ['#FCA5A5', '#7F1D1D'],
    glowColor: 'rgba(220, 38, 38, 0.55)',
    tag: 'Vanguarda Vermelha',
  },
  {
    id: 'grao_mestre_3',
    tier: 'Grão-Mestre',
    division: 3,
    name: 'Grão-Mestre 3',
    trophiesRequired: 105,
    primaryColor: '#B91C1C',
    gradientColors: ['#EF4444', '#450A0A'],
    glowColor: 'rgba(185, 28, 28, 0.6)',
    tag: 'Tirano dos Duelos',
  },

  // Desafiante 1, 2, 3
  {
    id: 'desafiante_1',
    tier: 'Desafiante',
    division: 1,
    name: 'Desafiante 1',
    trophiesRequired: 115,
    primaryColor: '#38BDF8',
    gradientColors: ['#FDE047', '#0284C7'],
    glowColor: 'rgba(56, 189, 248, 0.6)',
    tag: 'Asas Celestiais',
  },
  {
    id: 'desafiante_2',
    tier: 'Desafiante',
    division: 2,
    name: 'Desafiante 2',
    trophiesRequired: 130,
    primaryColor: '#F59E0B',
    gradientColors: ['#38BDF8', '#D97706'],
    glowColor: 'rgba(245, 158, 11, 0.65)',
    tag: 'Divindade do BrainPOP',
  },
  {
    id: 'desafiante_3',
    tier: 'Desafiante',
    division: 3,
    name: 'Desafiante 3',
    trophiesRequired: 150,
    primaryColor: '#FBBF24',
    gradientColors: ['#67E8F9', '#B45309'],
    glowColor: 'rgba(251, 191, 36, 0.75)',
    tag: 'O Deus dos Duelos 👑',
  },
];

/**
 * Retorna o Rank atual do jogador com base na contagem de troféus
 */
export function getDuelRankByTrophies(trophies: number): {
  currentRank: DuelRank;
  nextRank: DuelRank | null;
  progressPercent: number;
  trophiesInCurrentTier: number;
  trophiesNeededForNext: number;
} {
  const count = Math.max(0, trophies || 0);
  let currentRank = DUEL_RANKS[0];
  let nextRank: DuelRank | null = DUEL_RANKS[1] || null;

  for (let i = DUEL_RANKS.length - 1; i >= 0; i--) {
    if (count >= DUEL_RANKS[i].trophiesRequired) {
      currentRank = DUEL_RANKS[i];
      nextRank = i < DUEL_RANKS.length - 1 ? DUEL_RANKS[i + 1] : null;
      break;
    }
  }

  if (!nextRank) {
    return {
      currentRank,
      nextRank: null,
      progressPercent: 100,
      trophiesInCurrentTier: count - currentRank.trophiesRequired,
      trophiesNeededForNext: 0,
    };
  }

  const range = nextRank.trophiesRequired - currentRank.trophiesRequired;
  const currentProgress = count - currentRank.trophiesRequired;
  const progressPercent = Math.min(100, Math.max(0, Math.round((currentProgress / range) * 100)));

  return {
    currentRank,
    nextRank,
    progressPercent,
    trophiesInCurrentTier: currentProgress,
    trophiesNeededForNext: nextRank.trophiesRequired - count,
  };
}
