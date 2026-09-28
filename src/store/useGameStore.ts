import { create } from 'zustand';
import { questions, Question } from '../data/questions';
import { selectQuestions, randomizeQuestionOptions, fisherYatesShuffle } from '../utils/questionSelector';
import { questionHistoryService } from '../services/questionHistoryService';

export type PowerUpType = 'fiftyFifty' | 'extraTime' | 'skip' | 'hint';

export interface DuelBot {
  id: 'facil' | 'medio' | 'dificil' | 'mestre';
  name: string;
  difficultyLabel: 'Fácil' | 'Médio' | 'Difícil' | 'Mestre';
  level: number;
  avatarUrl: string;
  wins: number;
  losses: number;
  streak: number;
  accuracyRate: number;
  color: string;
  tagline: string;
  responseSpeed: string;
}

export const DUEL_BOTS: DuelBot[] = [
  {
    id: 'facil',
    name: 'Léo Novato',
    difficultyLabel: 'Fácil',
    level: 3,
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/png?seed=LeoNovato&backgroundColor=b6e3f4',
    wins: 8,
    losses: 25,
    streak: 1,
    accuracyRate: 0.45,
    color: '#22C55E',
    tagline: 'Está começando agora no BrainPOP. Erra bastante e pensa com calma.',
    responseSpeed: 'Lento (8-12s)',
  },
  {
    id: 'medio',
    name: 'Bia Gamer',
    difficultyLabel: 'Médio',
    level: 10,
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/png?seed=BiaGamer&backgroundColor=ffdfbf',
    wins: 34,
    losses: 20,
    streak: 3,
    accuracyRate: 0.70,
    color: '#06B6D4',
    tagline: 'Jogadora experiente com ótimo conhecimento geral. Um duelo equilibrado!',
    responseSpeed: 'Moderado (5-8s)',
  },
  {
    id: 'dificil',
    name: 'Prof. Helena',
    difficultyLabel: 'Difícil',
    level: 18,
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/png?seed=ProfHelena&backgroundColor=d1d4f9',
    wins: 89,
    losses: 15,
    streak: 7,
    accuracyRate: 0.85,
    color: '#EC4899',
    tagline: 'Especialista em ciências e história. Raramente erra e é muito ágil.',
    responseSpeed: 'Rápido (3-5s)',
  },
  {
    id: 'mestre',
    name: 'MegaBrain AI',
    difficultyLabel: 'Mestre',
    level: 30,
    avatarUrl: 'https://api.dicebear.com/7.x/bottts/png?seed=MegaBrainAI&backgroundColor=ffd5dc',
    wins: 210,
    losses: 8,
    streak: 19,
    accuracyRate: 0.96,
    color: '#8B5CF6',
    tagline: 'A inteligência suprema do BrainPOP. Precisão cirúrgica e reflexos instantâneos!',
    responseSpeed: 'Relâmpago (1-3s)',
  },
];

export interface ReviewSession {
  originalScore: number;
  originalCorrectAnswersCount: number;
  originalTotalQuestions: number;
  totalWrongQuestions: number;
  correctedErrorsCount: number;
  isCompleted: boolean;
}

export interface GameState {
  // Partida ativa
  isActive: boolean;
  gameMode: 'solo' | 'duel' | 'daily' | 'survival' | 'timeAttack' | 'review';
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  questions: Question[];
  currentQuestionIndex: number;
  
  // Duelo contra Bot & Apostas / Líder
  duelBot: DuelBot | null;
  opponentScore: number;
  opponentCorrectAnswersCount: number;
  isOpponentLastAnswerCorrect: boolean | null;
  duelBet: number;
  playerDiceRoll: number;
  opponentDiceRoll: number;
  isPlayerLeader: boolean;
  playerDuelLives: number;
  opponentDuelLives: number;
  duelEliminationStatus: 'playing' | 'opponent_eliminated' | 'player_eliminated' | 'completed';

  // Resposta & Seleção
  selectedOptionIndex: number | null;
  isAnswerSubmitted: boolean;
  isCorrect: boolean | null;
  isTimeout: boolean;
  disabledOptionIndices: number[]; // para 50/50
  
  // Pontuação & Estatísticas da rodada
  score: number;
  correctAnswersCount: number;
  timeRemaining: number;
  totalTimePerQuestion: number;
  questionStartTime: number;
  questionDeadlineAt: number;
  comboStreak: number;
  maxComboStreak: number;
  xpEarned: number;
  coinsEarned: number;
  
  // Power-ups usados nesta partida
  usedPowerUps: Record<PowerUpType, boolean>;
  hintMessage: string | null;

  // Perguntas respondidas na partida para análise e revisão
  answeredQuestionLog: {
    question: Question;
    selectedOptionId: string | null;
    isCorrect: boolean;
  }[];

  // Segunda Chance / Reviver via Anúncio AdMob (1x por partida)
  hasUsedAdRevive: boolean;

  // Sessão de Revisão Pedagógica Isolada
  reviewSession: ReviewSession | null;
  hasRecordedMatchResult: boolean;
  
  // Ações
  startMatch: (params?: {
    category?: string;
    difficulty?: 'easy' | 'medium' | 'hard';
    mode?: 'solo' | 'duel' | 'daily' | 'survival' | 'timeAttack';
    questionCount?: number;
    bot?: DuelBot;
  }) => void;
  startDuelMatch: (params: {
    bot: DuelBot;
    bet: number;
    playerRoll: number;
    opponentRoll: number;
    isPlayerLeader: boolean;
    questionCount?: number;
    category?: string;
  }) => void;
  startReviewRound: () => boolean; // Nova rodada apenas com erros, sem duplicar recompensas
  markMatchResultAsRecorded: () => void;
  selectOption: (index: number) => void;
  submitAnswer: () => { isCorrect: boolean; isLastQuestion: boolean; points: number };
  submitTimeout: () => { isCorrect: boolean; isLastQuestion: boolean; points: number };
  nextQuestion: () => boolean; // retorna false se terminou
  reviveMatch: () => boolean; // Mantido para compatibilidade
  tickTimer: () => void;
  usePowerUp: (type: PowerUpType) => boolean;
  endMatch: () => void;
}

export const useGameStore = create<GameState>((set, get) => ({
  isActive: false,
  gameMode: 'solo',
  category: 'all',
  difficulty: 'medium',
  questions: [],
  currentQuestionIndex: 0,
  
  duelBot: null,
  opponentScore: 0,
  opponentCorrectAnswersCount: 0,
  isOpponentLastAnswerCorrect: null,
  duelBet: 0,
  playerDiceRoll: 1,
  opponentDiceRoll: 1,
  isPlayerLeader: false,
  playerDuelLives: 1,
  opponentDuelLives: 1,
  duelEliminationStatus: 'playing',

  selectedOptionIndex: null,
  isAnswerSubmitted: false,
  isCorrect: null,
  isTimeout: false,
  disabledOptionIndices: [],
  
  score: 0,
  correctAnswersCount: 0,
  timeRemaining: 15,
  totalTimePerQuestion: 15,
  questionStartTime: 0,
  questionDeadlineAt: 0,
  comboStreak: 0,
  maxComboStreak: 0,
  xpEarned: 0,
  coinsEarned: 0,
  answeredQuestionLog: [],
  
  usedPowerUps: {
    fiftyFifty: false,
    extraTime: false,
    skip: false,
    hint: false,
  },
  hintMessage: null,
  hasUsedAdRevive: false,
  reviewSession: null,
  hasRecordedMatchResult: false,
  markMatchResultAsRecorded: () => set({ hasRecordedMatchResult: true }),

  startMatch: ({ category = 'all', difficulty = 'medium', mode = 'solo', questionCount = 10, bot } = {}) => {
    // 1. Obtém IDs recentes para o anti-repetição
    const recentIds = questionHistoryService.getRecentIds(category);

    // 2. Seleciona perguntas com Fisher-Yates e fallback progressivo
    const selectedQuestions = selectQuestions({
      pool: questions,
      count: questionCount,
      recentIds,
      category,
      difficulty,
    });

    // 3. Embaralha alternativas com Fisher-Yates
    const randomizedQuestions = selectedQuestions.map((q) => randomizeQuestionOptions(q));

    // 4. Salva IDs no histórico persistente
    const selectedIds = selectedQuestions.map((q) => q.id);
    questionHistoryService.recordRecentIds(category, selectedIds).catch((err) => {
      console.warn('Erro ao salvar histórico de perguntas:', err);
    });

    const now = Date.now();
    const durationSec = 15;

    set({
      isActive: true,
      gameMode: mode,
      reviewSession: null,
      hasRecordedMatchResult: false,
      category,
      difficulty,
      questions: randomizedQuestions,
      currentQuestionIndex: 0,
      duelBot: bot || null,
      opponentScore: 0,
      opponentCorrectAnswersCount: 0,
      isOpponentLastAnswerCorrect: null,
      selectedOptionIndex: null,
      isAnswerSubmitted: false,
      isCorrect: null,
      isTimeout: false,
      disabledOptionIndices: [],
      score: 0,
      correctAnswersCount: 0,
      timeRemaining: durationSec,
      totalTimePerQuestion: durationSec,
      questionStartTime: now,
      questionDeadlineAt: now + durationSec * 1000,
      comboStreak: 0,
      maxComboStreak: 0,
      xpEarned: 0,
      coinsEarned: 0,
      answeredQuestionLog: [],
      usedPowerUps: {
        fiftyFifty: false,
        extraTime: false,
        skip: false,
        hint: false,
      },
      hintMessage: null,
      hasUsedAdRevive: false,
    });
  },

  startDuelMatch: ({ bot, bet, playerRoll, opponentRoll, isPlayerLeader, questionCount = 15, category = 'all' }) => {
    const recentIds = questionHistoryService.getRecentIds(category);

    const selectedQuestions = selectQuestions({
      pool: questions,
      count: questionCount,
      recentIds,
      category,
      difficulty: 'medium',
    });

    const randomizedQuestions = selectedQuestions.map((q) => randomizeQuestionOptions(q));

    const selectedIds = selectedQuestions.map((q) => q.id);
    questionHistoryService.recordRecentIds(category, selectedIds).catch((err) => {
      console.warn('Erro ao salvar histórico de duelo:', err);
    });

    const playerLives = isPlayerLeader ? 3 : 1;
    const opponentLives = isPlayerLeader ? 1 : 3;
    const now = Date.now();
    const durationSec = 15;

    set({
      isActive: true,
      gameMode: 'duel',
      category,
      difficulty: 'medium',
      questions: randomizedQuestions,
      currentQuestionIndex: 0,
      duelBot: bot,
      duelBet: bet,
      playerDiceRoll: playerRoll,
      opponentDiceRoll: opponentRoll,
      isPlayerLeader,
      playerDuelLives: playerLives,
      opponentDuelLives: opponentLives,
      duelEliminationStatus: 'playing',
      opponentScore: 0,
      opponentCorrectAnswersCount: 0,
      isOpponentLastAnswerCorrect: null,
      selectedOptionIndex: null,
      isAnswerSubmitted: false,
      isCorrect: null,
      isTimeout: false,
      disabledOptionIndices: [],
      score: 0,
      correctAnswersCount: 0,
      timeRemaining: durationSec,
      totalTimePerQuestion: durationSec,
      questionStartTime: now,
      questionDeadlineAt: now + durationSec * 1000,
      comboStreak: 0,
      maxComboStreak: 0,
      xpEarned: 0,
      coinsEarned: 0,
      answeredQuestionLog: [],
      usedPowerUps: {
        fiftyFifty: false,
        extraTime: false,
        skip: false,
        hint: false,
      },
      hintMessage: null,
      hasUsedAdRevive: false,
    });
  },

  reviveMatch: () => {
    const { hasUsedAdRevive, questions: qList, currentQuestionIndex, selectedOptionIndex, disabledOptionIndices } = get();
    if (hasUsedAdRevive || qList.length === 0) return false;

    const currentQ = qList[currentQuestionIndex];
    const newDisabled = [...disabledOptionIndices];
    if (currentQ && selectedOptionIndex !== null && !newDisabled.includes(selectedOptionIndex)) {
      // Elimina a opção errada anterior como bônus de segunda chance
      const selectedOpt = currentQ.options[selectedOptionIndex];
      if (selectedOpt && selectedOpt.id !== currentQ.correctId) {
        newDisabled.push(selectedOptionIndex);
      }
    }

    const now = Date.now();
    const durationSec = 15;

    set({
      isActive: true,
      hasUsedAdRevive: true,
      timeRemaining: durationSec,
      questionDeadlineAt: now + durationSec * 1000,
      selectedOptionIndex: null,
      isAnswerSubmitted: false,
      isCorrect: null,
      isTimeout: false,
      disabledOptionIndices: newDisabled,
      hintMessage: 'Segunda Chance Ativada! Você continua de onde parou.',
    });

    return true;
  },

  /**
   * Inicia uma rodada especial de revisão pedagógica ("REVISAR MEUS ERROS"):
   * - Carrega exclusivamente as questões respondidas incorretamente na partida recém-concluída;
   * - Define gameMode = 'review';
   * - Preserva os resultados originais em reviewSession;
   * - NÃO duplica moedas, XP, missões diárias ou pontuação do ranking já computadas;
   * - Marca hasUsedAdRevive = true para garantir uso estrito de no máximo 1x por partida.
   */
  startReviewRound: () => {
    const { answeredQuestionLog, hasUsedAdRevive, score, correctAnswersCount, questions } = get();
    if (hasUsedAdRevive) return false;

    const wrongQuestions = answeredQuestionLog
      .filter((item) => !item.isCorrect)
      .map((item) => item.question);

    if (wrongQuestions.length === 0) return false;

    const now = Date.now();
    const durationSec = 20;

    set({
      isActive: true,
      gameMode: 'review',
      hasUsedAdRevive: true,
      reviewSession: {
        originalScore: score,
        originalCorrectAnswersCount: correctAnswersCount,
        originalTotalQuestions: questions.length || 10,
        totalWrongQuestions: wrongQuestions.length,
        correctedErrorsCount: 0,
        isCompleted: false,
      },
      questions: wrongQuestions,
      currentQuestionIndex: 0,
      selectedOptionIndex: null,
      isAnswerSubmitted: false,
      isCorrect: null,
      isTimeout: false,
      disabledOptionIndices: [],
      timeRemaining: durationSec,
      totalTimePerQuestion: durationSec,
      questionStartTime: now,
      questionDeadlineAt: now + durationSec * 1000,
      comboStreak: 0,
      hintMessage: 'Rodada Pedagógica: revise as questões que errou para consolidar o aprendizado!',
    });

    return true;
  },

  selectOption: (index: number) => {
    const { isAnswerSubmitted, disabledOptionIndices } = get();
    if (isAnswerSubmitted || disabledOptionIndices.includes(index)) return;
    set({ selectedOptionIndex: index });
  },

  submitAnswer: () => {
    const { 
      questions: qList, 
      currentQuestionIndex, 
      selectedOptionIndex, 
      timeRemaining, 
      comboStreak, 
      maxComboStreak,
      score,
      correctAnswersCount,
      xpEarned,
      coinsEarned,
      gameMode,
      duelBot,
      opponentScore,
      opponentCorrectAnswersCount,
      isAnswerSubmitted
    } = get();

    // Idempotência: não processa se já foi submetida
    if (isAnswerSubmitted) {
      return { isCorrect: false, isLastQuestion: false, points: 0 };
    }

    const currentQ = qList[currentQuestionIndex];
    if (!currentQ || selectedOptionIndex === null) {
      return { isCorrect: false, isLastQuestion: true, points: 0 };
    }

    const selectedOpt = currentQ.options[selectedOptionIndex];
    const isCorrect = selectedOpt ? selectedOpt.id === currentQ.correctId : false;

    // Detecção Anti-Speedhack: Resposta sub-humana (< 150ms)
    const questionStartTime = get().questionStartTime || 0;
    const elapsedMs = questionStartTime > 0 ? Date.now() - questionStartTime : 1000;
    const isSuspiciousSpeed = isCorrect && elapsedMs < 150;
    if (isSuspiciousSpeed) {
      console.warn(`[Anti-Cheat] Resposta suspeita detectada (${elapsedMs}ms). Pontos da rodada anulados.`);
    }

    const newStreak = isCorrect ? comboStreak + 1 : 0;
    const newMaxStreak = Math.max(maxComboStreak, newStreak);
    
    // Cálculo seguro de pontuação: Base (100) + Bônus de Tempo (máx 150) + Bônus de Combo (máx 250)
    const timeBonus = isCorrect ? Math.min(150, Math.round(timeRemaining * 10)) : 0;
    const comboBonus = isCorrect ? Math.min(250, (newStreak - 1) * 25) : 0;
    let earnedPoints = isCorrect ? Math.min(500, 100 + timeBonus + comboBonus) : 0;

    let roundXp = isCorrect ? Math.min(75, 35 + Math.round(timeRemaining * 2)) : 10;
    let roundCoins = isCorrect ? Math.min(35, 15 + Math.min(newStreak * 5, 20)) : 2;

    if (isSuspiciousSpeed || gameMode === 'review') {
      earnedPoints = 0;
      roundXp = 0;
      roundCoins = 0;
    }

    // Simulação de resposta e Vidas no modo Duelo
    let newOpponentScore = opponentScore;
    let newOpponentCorrect = opponentCorrectAnswersCount;
    let botAnsweredCorrect: boolean | null = null;
    let newPlayerDuelLives = get().playerDuelLives;
    let newOpponentDuelLives = get().opponentDuelLives;
    let newEliminationStatus = get().duelEliminationStatus;

    if (gameMode === 'duel' && duelBot) {
      botAnsweredCorrect = Math.random() < duelBot.accuracyRate;
      if (botAnsweredCorrect) {
        const botSpeedBonus = Math.floor(Math.random() * 80) + 40;
        newOpponentScore += 100 + botSpeedBonus;
        newOpponentCorrect += 1;
      } else {
        // Bot errou a pergunta -> Perde 1 Vida de Duelo!
        newOpponentDuelLives = Math.max(0, newOpponentDuelLives - 1);
      }

      if (!isCorrect) {
        // Jogador errou -> Perde 1 Vida de Duelo!
        newPlayerDuelLives = Math.max(0, newPlayerDuelLives - 1);
      }

      // Verificação de Eliminação
      if (newOpponentDuelLives === 0) {
        newEliminationStatus = 'opponent_eliminated';
      } else if (newPlayerDuelLives === 0) {
        newEliminationStatus = 'player_eliminated';
      }
    }

    const selectedOptionId = currentQ && selectedOptionIndex !== null ? currentQ.options[selectedOptionIndex]?.id || null : null;
    const updatedLog = currentQ ? [
      ...get().answeredQuestionLog,
      {
        question: currentQ,
        selectedOptionId,
        isCorrect,
      }
    ] : get().answeredQuestionLog;

    const currentReviewSession = get().reviewSession;
    const updatedReviewSession = currentReviewSession ? {
      ...currentReviewSession,
      correctedErrorsCount: isCorrect ? currentReviewSession.correctedErrorsCount + 1 : currentReviewSession.correctedErrorsCount,
    } : null;

    set({
      isAnswerSubmitted: true,
      isCorrect,
      isTimeout: false,
      score: gameMode === 'review' ? score : score + earnedPoints,
      correctAnswersCount: gameMode === 'review' ? correctAnswersCount : (isCorrect ? correctAnswersCount + 1 : correctAnswersCount),
      opponentScore: newOpponentScore,
      opponentCorrectAnswersCount: newOpponentCorrect,
      isOpponentLastAnswerCorrect: botAnsweredCorrect,
      playerDuelLives: newPlayerDuelLives,
      opponentDuelLives: newOpponentDuelLives,
      duelEliminationStatus: newEliminationStatus,
      comboStreak: gameMode === 'review' ? 0 : newStreak,
      maxComboStreak: gameMode === 'review' ? maxComboStreak : newMaxStreak,
      xpEarned: gameMode === 'review' ? xpEarned : xpEarned + roundXp,
      coinsEarned: gameMode === 'review' ? coinsEarned : coinsEarned + roundCoins,
      answeredQuestionLog: gameMode === 'review' ? get().answeredQuestionLog : updatedLog,
      reviewSession: updatedReviewSession,
    });

    const isLastQuestion = currentQuestionIndex >= qList.length - 1 || newEliminationStatus !== 'playing';
    return { isCorrect, isLastQuestion, points: earnedPoints };
  },

  /**
   * Resolução explícita de Timeout quando o tempo expira:
   * - Aceita que selectedOptionIndex permaneça null;
   * - Considera a resposta incorreta (isCorrect = false);
   * - Define isAnswerSubmitted = true e isTimeout = true;
   * - Pontuação 0;
   * - No modo review: não adiciona XP e não altera contadores originais;
   * - No duelo: remove exatamente 1 vida do jogador e simula resposta do bot;
   * - Idempotente (executa no máximo uma vez por pergunta).
   */
  submitTimeout: () => {
    const { 
      questions: qList, 
      currentQuestionIndex, 
      isAnswerSubmitted,
      score,
      correctAnswersCount,
      xpEarned,
      coinsEarned,
      gameMode,
      duelBot,
      opponentScore,
      opponentCorrectAnswersCount
    } = get();

    // Idempotência: se a resposta já foi submetida, não faz nada
    if (isAnswerSubmitted) {
      const isLast = currentQuestionIndex >= qList.length - 1;
      return { isCorrect: false, isLastQuestion: isLast, points: 0 };
    }

    if (gameMode === 'review') {
      set({
        selectedOptionIndex: null,
        isAnswerSubmitted: true,
        isCorrect: false,
        isTimeout: true,
        timeRemaining: 0,
      });
      const isLast = currentQuestionIndex >= qList.length - 1;
      return { isCorrect: false, isLastQuestion: isLast, points: 0 };
    }

    const currentQ = qList[currentQuestionIndex];
    if (!currentQ) {
      return { isCorrect: false, isLastQuestion: true, points: 0 };
    }

    let newOpponentScore = opponentScore;
    let newOpponentCorrect = opponentCorrectAnswersCount;
    let botAnsweredCorrect: boolean | null = null;
    let newPlayerDuelLives = get().playerDuelLives;
    let newOpponentDuelLives = get().opponentDuelLives;
    let newEliminationStatus = get().duelEliminationStatus;

    if (gameMode === 'duel' && duelBot) {
      botAnsweredCorrect = Math.random() < duelBot.accuracyRate;
      if (botAnsweredCorrect) {
        const botSpeedBonus = Math.floor(Math.random() * 80) + 40;
        newOpponentScore += 100 + botSpeedBonus;
        newOpponentCorrect += 1;
      } else {
        newOpponentDuelLives = Math.max(0, newOpponentDuelLives - 1);
      }

      // No timeout, o jogador não respondeu a tempo -> Perde exatamente 1 vida!
      newPlayerDuelLives = Math.max(0, newPlayerDuelLives - 1);

      if (newOpponentDuelLives === 0) {
        newEliminationStatus = 'opponent_eliminated';
      } else if (newPlayerDuelLives === 0) {
        newEliminationStatus = 'player_eliminated';
      }
    }

    const updatedTimeoutLog = currentQ ? [
      ...get().answeredQuestionLog,
      {
        question: currentQ,
        selectedOptionId: null,
        isCorrect: false,
      }
    ] : get().answeredQuestionLog;

    set({
      selectedOptionIndex: null,
      isAnswerSubmitted: true,
      isCorrect: false,
      isTimeout: true,
      timeRemaining: 0,
      score,
      correctAnswersCount,
      opponentScore: newOpponentScore,
      opponentCorrectAnswersCount: newOpponentCorrect,
      isOpponentLastAnswerCorrect: botAnsweredCorrect,
      playerDuelLives: newPlayerDuelLives,
      opponentDuelLives: newOpponentDuelLives,
      duelEliminationStatus: newEliminationStatus,
      comboStreak: 0,
      xpEarned: xpEarned + 10,
      coinsEarned,
      answeredQuestionLog: updatedTimeoutLog,
    });

    const isLastQuestion = currentQuestionIndex >= qList.length - 1 || newEliminationStatus !== 'playing';
    return { isCorrect: false, isLastQuestion, points: 0 };
  },

  nextQuestion: () => {
    const { questions: qList, currentQuestionIndex, totalTimePerQuestion } = get();
    if (currentQuestionIndex + 1 < qList.length) {
      const now = Date.now();
      const durationSec = totalTimePerQuestion || 15;
      set({
        currentQuestionIndex: currentQuestionIndex + 1,
        selectedOptionIndex: null,
        isAnswerSubmitted: false,
        isCorrect: null,
        isTimeout: false,
        disabledOptionIndices: [],
        timeRemaining: durationSec,
        questionStartTime: now,
        questionDeadlineAt: now + durationSec * 1000,
        hintMessage: null,
      });
      return true;
    } else {
      set({ isActive: false, hintMessage: null });
      return false;
    }
  },

  tickTimer: () => {
    const { isAnswerSubmitted, questionDeadlineAt } = get();
    if (isAnswerSubmitted) return;

    const now = Date.now();
    if (questionDeadlineAt && now >= questionDeadlineAt) {
      get().submitTimeout();
      return;
    }

    if (questionDeadlineAt) {
      const remaining = Math.max(0, Math.ceil((questionDeadlineAt - now) / 1000));
      if (remaining <= 0) {
        get().submitTimeout();
      } else {
        set({ timeRemaining: remaining });
      }
    } else {
      const { timeRemaining } = get();
      if (timeRemaining <= 1) {
        get().submitTimeout();
      } else {
        set({ timeRemaining: timeRemaining - 1 });
      }
    }
  },

  usePowerUp: (type: PowerUpType) => {
    const { usedPowerUps, questions: qList, currentQuestionIndex, disabledOptionIndices, timeRemaining, isAnswerSubmitted, questionDeadlineAt } = get();
    if (usedPowerUps[type] || isAnswerSubmitted) return false;

    const currentQ = qList[currentQuestionIndex];
    if (!currentQ) return false;

    if (type === 'fiftyFifty') {
      // Elimina 2 opções incorretas com Fisher-Yates
      const wrongIndices = currentQ.options
        .map((opt, idx) => ({ opt, idx }))
        .filter(({ opt, idx }) => opt.id !== currentQ.correctId && !disabledOptionIndices.includes(idx))
        .map(({ idx }) => idx);
      
      const shuffledWrong = fisherYatesShuffle(wrongIndices).slice(0, 2);
      
      set({
        disabledOptionIndices: [...disabledOptionIndices, ...shuffledWrong],
        usedPowerUps: { ...usedPowerUps, fiftyFifty: true },
      });
      return true;
    }

    if (type === 'extraTime') {
      const newTime = Math.min(timeRemaining + 15, 30);
      const newDeadline = (questionDeadlineAt || Date.now()) + 15 * 1000;
      set({
        timeRemaining: newTime,
        questionDeadlineAt: newDeadline,
        usedPowerUps: { ...usedPowerUps, extraTime: true },
      });
      return true;
    }

    if (type === 'skip') {
      set({
        usedPowerUps: { ...usedPowerUps, skip: true },
      });
      get().nextQuestion();
      return true;
    }

    if (type === 'hint') {
      // Elimina 1 opção incorreta e gera uma dica contextual
      const wrongIndices = currentQ.options
        .map((opt, idx) => ({ opt, idx }))
        .filter(({ opt, idx }) => opt.id !== currentQ.correctId && !disabledOptionIndices.includes(idx))
        .map(({ idx }) => idx);

      const eliminatedIdx = wrongIndices[Math.floor(Math.random() * wrongIndices.length)];
      const updatedDisabled = eliminatedIdx !== undefined 
        ? [...disabledOptionIndices, eliminatedIdx] 
        : disabledOptionIndices;

      const eliminatedOptionText = eliminatedIdx !== undefined ? currentQ.options[eliminatedIdx]?.text : '';
      const hintMsg = eliminatedOptionText 
        ? `Dica: "${eliminatedOptionText}" está incorreta! Foco em ${currentQ.category}.`
        : `Dica: Pense nos conceitos centrais de ${currentQ.category}!`;

      set({
        disabledOptionIndices: updatedDisabled,
        hintMessage: hintMsg,
        usedPowerUps: { ...usedPowerUps, hint: true },
      });
      return true;
    }

    return false;
  },

  endMatch: () => {
    const { gameMode, reviewSession } = get();
    if (gameMode === 'review' && reviewSession) {
      set({
        isActive: false,
        reviewSession: { ...reviewSession, isCompleted: true },
      });
    } else {
      set({ isActive: false });
    }
  },
}));
