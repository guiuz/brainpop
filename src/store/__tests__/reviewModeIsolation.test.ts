import { useGameStore } from '../useGameStore';
import { useUserStore } from '../useUserStore';
import { dailyMissionService } from '../../services/dailyMissionService';

jest.mock('../../services/dailyMissionService', () => ({
  dailyMissionService: {
    recordMissionProgress: jest.fn().mockResolvedValue({}),
  },
}));

describe('Isolamento Estrito do Modo de Revisão Pedagógica (gameMode: review)', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Estado inicial limpo do usuário
    useUserStore.setState({
      id: 'test_user_review_1',
      name: 'Aluno Focado',
      coins: 500,
      currentXp: 100,
      totalXp: 100,
      level: 1,
      stats: {
        totalMatches: 5,
        totalWins: 3,
        totalCorrectAnswers: 20,
        totalQuestionsAnswered: 30,
        bestStreak: 4,
        tournamentsWon: 0,
        tournamentsJoined: 0,
        categoryStats: {},
      },
    });

    // Inicia uma partida Solo normal com 3 perguntas
    useGameStore.getState().startMatch({ questionCount: 3 });
  });

  it('Garante fluxo completo: partida normal -> gravação única -> revisão isolada sem novos créditos de moedas, XP, stats ou missões', async () => {
    // 1. Partida Normal:
    // Pergunta 1: ACERTO
    const q1 = useGameStore.getState().questions[0];
    const correctIdx1 = q1.options.findIndex((o) => o.id === q1.correctId);
    useGameStore.getState().selectOption(correctIdx1);
    useGameStore.setState({ questionStartTime: Date.now() - 3000 });
    useGameStore.getState().submitAnswer();
    useGameStore.getState().nextQuestion();

    // Pergunta 2: ERRO
    const q2 = useGameStore.getState().questions[1];
    const wrongIdx2 = q2.options.findIndex((o) => o.id !== q2.correctId);
    useGameStore.getState().selectOption(wrongIdx2);
    useGameStore.getState().submitAnswer();
    useGameStore.getState().nextQuestion();

    // Pergunta 3: ERRO (Timeout)
    useGameStore.getState().submitTimeout();
    useGameStore.getState().nextQuestion();

    // Partida terminada
    useGameStore.getState().endMatch();
    const postMatchState = useGameStore.getState();

    expect(postMatchState.isActive).toBe(false);
    expect(postMatchState.answeredQuestionLog.filter((q) => !q.isCorrect)).toHaveLength(2);

    const initialCoinsEarned = postMatchState.coinsEarned;
    const initialXpEarned = postMatchState.xpEarned;
    const initialScore = postMatchState.score;

    expect(initialScore).toBeGreaterThan(0);
    expect(initialCoinsEarned).toBeGreaterThan(0);
    expect(initialXpEarned).toBeGreaterThan(0);

    // 2. Gravação do Resultado da Partida Original (simulando app/result.tsx montando pela 1ª vez)
    expect(postMatchState.hasRecordedMatchResult).toBe(false);
    useGameStore.getState().markMatchResultAsRecorded();
    useUserStore.getState().recordMatchResult({
      won: false,
      correctAnswers: postMatchState.correctAnswersCount,
      totalQuestions: 3,
      category: 'all',
      xpGained: initialXpEarned,
      coinsGained: initialCoinsEarned,
    });

    const userStateAfterFirstRecord = useUserStore.getState();
    const coinsAfterNormalMatch = userStateAfterFirstRecord.coins;
    const xpAfterNormalMatch = userStateAfterFirstRecord.currentXp;
    const matchesCountAfterNormalMatch = userStateAfterFirstRecord.stats.totalMatches;
    const winsCountAfterNormalMatch = userStateAfterFirstRecord.stats.totalWins;

    expect(coinsAfterNormalMatch).toBe(500 + initialCoinsEarned);
    expect(xpAfterNormalMatch).toBe(100 + initialXpEarned);
    expect(matchesCountAfterNormalMatch).toBe(6);

    // 3. Teste de Idempotência: Se o result.tsx abrir novamente, não duplica gravação
    expect(useGameStore.getState().hasRecordedMatchResult).toBe(true);
    // Simula tentativa de reexecução acidental
    if (!useGameStore.getState().hasRecordedMatchResult) {
      useUserStore.getState().recordMatchResult({
        won: false,
        correctAnswers: 1,
        totalQuestions: 3,
        category: 'all',
        xpGained: initialXpEarned,
        coinsGained: initialCoinsEarned,
      });
    }
    expect(useUserStore.getState().coins).toBe(coinsAfterNormalMatch); // Imutável!

    // Limpa mocks antes da revisão para garantir que a revisão não dispara novas chamadas
    (dailyMissionService.recordMissionProgress as jest.Mock).mockClear();

    // 4. Inicia Rodada Especial de Revisão Pedagógica ('REVISAR MEUS ERROS')
    const reviewStarted = useGameStore.getState().startReviewRound();
    expect(reviewStarted).toBe(true);

    const reviewState = useGameStore.getState();
    expect(reviewState.gameMode).toBe('review');
    expect(reviewState.isActive).toBe(true);
    expect(reviewState.hasUsedAdRevive).toBe(true);
    // Contém exclusivamente as 2 perguntas erradas da partida original
    expect(reviewState.questions).toHaveLength(2);
    expect(reviewState.reviewSession).toBeDefined();
    expect(reviewState.reviewSession?.originalScore).toBe(initialScore);
    expect(reviewState.reviewSession?.totalWrongQuestions).toBe(2);
    expect(reviewState.reviewSession?.correctedErrorsCount).toBe(0);

    // 5. Tentativa de reabrir revisão na mesma partida é PROIBIDA (máximo 1x)
    const secondReviewAttempt = useGameStore.getState().startReviewRound();
    expect(secondReviewAttempt).toBe(false);

    // 6. Responde Pergunta 1 da Revisão: ACERTO
    const revQ1 = useGameStore.getState().questions[0];
    const revCorrectIdx1 = revQ1.options.findIndex((o) => o.id === revQ1.correctId);
    useGameStore.getState().selectOption(revCorrectIdx1);
    useGameStore.setState({ questionStartTime: Date.now() - 3000 });
    const answerRes1 = useGameStore.getState().submitAnswer();

    // Verificação estrita: Modo revisão não gera pontos, XP ou moedas
    expect(answerRes1.points).toBe(0);
    expect(useGameStore.getState().score).toBe(initialScore);
    expect(useGameStore.getState().coinsEarned).toBe(initialCoinsEarned);
    expect(useGameStore.getState().xpEarned).toBe(initialXpEarned);
    expect(useGameStore.getState().reviewSession?.correctedErrorsCount).toBe(1);

    useGameStore.getState().nextQuestion();

    // 7. Responde Pergunta 2 da Revisão com uso de Power-up e ACERTO
    useGameStore.getState().usePowerUp('extraTime');
    const revQ2 = useGameStore.getState().questions[1];
    const revCorrectIdx2 = revQ2.options.findIndex((o) => o.id === revQ2.correctId);
    useGameStore.getState().selectOption(revCorrectIdx2);
    useGameStore.setState({ questionStartTime: Date.now() - 3000 });
    const answerRes2 = useGameStore.getState().submitAnswer();

    expect(answerRes2.points).toBe(0);
    expect(useGameStore.getState().score).toBe(initialScore);
    expect(useGameStore.getState().coinsEarned).toBe(initialCoinsEarned);
    expect(useGameStore.getState().xpEarned).toBe(initialXpEarned);
    expect(useGameStore.getState().reviewSession?.correctedErrorsCount).toBe(2);

    // 8. Conclui Revisão
    useGameStore.getState().endMatch();
    const finalReviewState = useGameStore.getState();
    expect(finalReviewState.isActive).toBe(false);
    expect(finalReviewState.reviewSession?.isCompleted).toBe(true);
    expect(finalReviewState.reviewSession?.correctedErrorsCount).toBe(2);

    // 9. Simulação da tela de resultado após a revisão (gameMode === 'review')
    // A tela de resultado detecta gameMode === 'review' e NÃO chama recordMatchResult nem missões
    if (finalReviewState.gameMode !== 'review') {
      useUserStore.getState().recordMatchResult({
        won: true,
        correctAnswers: 2,
        totalQuestions: 2,
        category: 'all',
        xpGained: 100,
        coinsGained: 50,
      });
    }

    // 10. Asserção Final de Integridade Absoluta:
    const finalUserState = useUserStore.getState();
    expect(finalUserState.coins).toBe(coinsAfterNormalMatch); // ZERO moedas extras
    expect(finalUserState.currentXp).toBe(xpAfterNormalMatch); // ZERO XP extra
    expect(finalUserState.stats.totalMatches).toBe(matchesCountAfterNormalMatch); // ZERO partidas duplicadas
    expect(finalUserState.stats.totalWins).toBe(winsCountAfterNormalMatch); // ZERO vitórias duplicadas
    expect(dailyMissionService.recordMissionProgress).not.toHaveBeenCalled();
  });

  it('Timeout no modo de revisão não concede 10 XP', () => {
    // Registra 1 erro prévio para permitir rodada de revisão
    const q = useGameStore.getState().questions[0];
    useGameStore.setState({
      answeredQuestionLog: [{
        question: q,
        selectedOptionId: 'wrong_id',
        isCorrect: false,
      }],
      hasUsedAdRevive: false,
      xpEarned: 50,
    });

    const started = useGameStore.getState().startReviewRound();
    expect(started).toBe(true);
    expect(useGameStore.getState().gameMode).toBe('review');

    const xpBefore = useGameStore.getState().xpEarned;
    useGameStore.getState().submitTimeout();

    expect(useGameStore.getState().xpEarned).toBe(xpBefore); // Não aumentou 10 XP
    expect(useGameStore.getState().isTimeout).toBe(true);
  });
});
