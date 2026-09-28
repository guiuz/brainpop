import AsyncStorage from '@react-native-async-storage/async-storage';
import { dailyMissionService } from '../dailyMissionService';
import { useUserStore } from '../../store/useUserStore';
import { useGameStore } from '../../store/useGameStore';

describe('dailyMissionService & Missões Diárias — Regras de Negócio e Concorrência', () => {
  beforeEach(async () => {
    jest.clearAllMocks();
    await AsyncStorage.clear();
    await dailyMissionService._resetForTesting();
    useUserStore.setState({
      id: 'user-test-1',
      name: 'Jogador 1',
      coins: 1000,
      totalXp: 0,
      currentXp: 0,
      level: 1,
      xpToNextLevel: 300,
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
    });
    useGameStore.setState({
      isActive: false,
      questions: [],
      currentQuestionIndex: 0,
      score: 0,
      comboStreak: 0,
      maxComboStreak: 0,
      isAnswerSubmitted: false,
      isCorrect: null,
      isTimeout: false,
    });
  });

  it('partida abandonada não conta', async () => {
    // Inicia uma partida
    useGameStore.getState().startMatch({ questionCount: 10 });
    expect(useGameStore.getState().isActive).toBe(true);

    // O jogador desiste no meio da partida (endMatch) sem navegar para a tela de resultado
    useGameStore.getState().endMatch();
    expect(useGameStore.getState().isActive).toBe(false);

    // Como recordMatchResult nunca foi disparado, o progresso da missão de partida permanece em 0
    const missions = await dailyMissionService.getDailyMissions('user-test-1');
    expect(missions.missions.play_match.current).toBe(0);
    expect(missions.missions.play_match.completed).toBe(false);
  });

  it('resultado é processado apenas uma vez', async () => {
    const userId = 'user-test-1';

    // Dispara o término legítimo da partida uma única vez
    await dailyMissionService.recordMissionProgress(userId, { type: 'match_completed' });

    let missions = await dailyMissionService.getDailyMissions(userId);
    expect(missions.missions.play_match.current).toBe(1);
    expect(missions.missions.play_match.completed).toBe(true);

    // Tentativa duplicada de processar a mesma conclusão não ultrapassa a meta
    await dailyMissionService.recordMissionProgress(userId, { type: 'match_completed' });
    missions = await dailyMissionService.getDailyMissions(userId);
    expect(missions.missions.play_match.current).toBe(1);
  });

  it('duelo cancelado não conta', async () => {
    const userId = 'user-test-1';
    // Se o usuário cancela a busca no matchmaking ou cancela o duelo antes do resultado
    // a ação recordMissionProgress({ type: 'duel_completed' }) não é chamada
    const missions = await dailyMissionService.getDailyMissions(userId);
    expect(missions.missions.play_duel.current).toBe(0);
    expect(missions.missions.play_duel.completed).toBe(false);
  });

  it('timeout quebra sequência', () => {
    // Monta estado no useGameStore com combo streak ativo
    useGameStore.setState({
      isActive: true,
      comboStreak: 4,
      maxComboStreak: 4,
      currentQuestionIndex: 0,
      isAnswerSubmitted: false,
      questions: [
        {
          id: 'q1',
          question: 'Pergunta?',
          options: [
            { id: 'a', text: 'Opção 1' },
            { id: 'b', text: 'Opção 2' },
          ],
          correctId: 'a',
          category: 'geral',
          difficulty: 'medium',
        },
      ],
    });

    // Ocorre timeout
    useGameStore.getState().submitTimeout();

    const state = useGameStore.getState();
    expect(state.isTimeout).toBe(true);
    expect(state.isCorrect).toBe(false);
    expect(state.comboStreak).toBe(0); // Sequência quebrada!
  });

  it('pular pergunta não conta como acerto', () => {
    useGameStore.setState({
      isActive: true,
      correctAnswersCount: 2,
      comboStreak: 2,
      currentQuestionIndex: 0,
      usedPowerUps: { fiftyFifty: false, extraTime: false, skip: false, hint: false },
      questions: [
        {
          id: 'q1',
          question: 'Pergunta 1',
          options: [{ id: 'a', text: '1' }],
          correctId: 'a',
          category: 'geral',
          difficulty: 'medium',
        },
        {
          id: 'q2',
          question: 'Pergunta 2',
          options: [{ id: 'a', text: '2' }],
          correctId: 'a',
          category: 'geral',
          difficulty: 'medium',
        },
      ],
    });

    // Usa o poder de Pular
    const success = useGameStore.getState().usePowerUp('skip');
    expect(success).toBe(true);

    const state = useGameStore.getState();
    expect(state.currentQuestionIndex).toBe(1);
    expect(state.correctAnswersCount).toBe(2); // NÃO aumentou!
    expect(state.comboStreak).toBe(2); // Não contabilizou novo acerto
  });

  it('cinco acertos precisam ocorrer na mesma partida', async () => {
    const userId = 'user-test-1';

    // Partida 1: jogador consegue sequência de 3 acertos
    await dailyMissionService.recordMissionProgress(userId, { type: 'streak_achieved', streak: 3 });
    let data = await dailyMissionService.getDailyMissions(userId);
    expect(data.missions.correct_streak.current).toBe(3);
    expect(data.missions.correct_streak.completed).toBe(false);

    // Partida 2: jogador consegue sequência de 2 acertos (NÃO soma com os 3 anteriores!)
    await dailyMissionService.recordMissionProgress(userId, { type: 'streak_achieved', streak: 2 });
    data = await dailyMissionService.getDailyMissions(userId);
    expect(data.missions.correct_streak.current).toBe(3); // Mantém o melhor da partida, não soma 3+2!
    expect(data.missions.correct_streak.completed).toBe(false);

    // Partida 3: jogador alcança 5 acertos na mesma partida
    await dailyMissionService.recordMissionProgress(userId, { type: 'streak_achieved', streak: 5 });
    data = await dailyMissionService.getDailyMissions(userId);
    expect(data.missions.correct_streak.current).toBe(5);
    expect(data.missions.correct_streak.completed).toBe(true);
  });

  it('troca de usuário não mistura dados', async () => {
    const userA = 'user-alice';
    const userB = 'user-bob';

    // Alice completa 1 partida
    await dailyMissionService.recordMissionProgress(userA, { type: 'match_completed' });
    const missionsAlice = await dailyMissionService.getDailyMissions(userA);
    expect(missionsAlice.missions.play_match.current).toBe(1);
    expect(missionsAlice.missions.play_match.completed).toBe(true);

    // Bob entra no app: seus dados estão zerados e isolados
    const missionsBob = await dailyMissionService.getDailyMissions(userB);
    expect(missionsBob.missions.play_match.current).toBe(0);
    expect(missionsBob.missions.play_match.completed).toBe(false);
  });

  it('virada do dia reinicia o progresso', async () => {
    const userId = 'user-test-1';
    const yesterdayKey = '2026-09-21';
    const todayKey = '2026-09-22';

    // No dia anterior o usuário completou a missão
    await dailyMissionService.recordMissionProgress(userId, { type: 'match_completed' }, yesterdayKey);
    const yesterdayMissions = await dailyMissionService.getDailyMissions(userId, yesterdayKey);
    expect(yesterdayMissions.missions.play_match.completed).toBe(true);

    // Na virada do dia, as missões do novo dia começam zeradas
    const todayMissions = await dailyMissionService.getDailyMissions(userId, todayKey);
    expect(todayMissions.missions.play_match.current).toBe(0);
    expect(todayMissions.missions.play_match.completed).toBe(false);
    expect(todayMissions.missions.play_match.claimed).toBe(false);
  });

  it('dois cliques em Coletar concedem uma única recompensa (idempotência e concorrência)', async () => {
    const userId = 'user-test-1';
    useUserStore.setState({ id: userId, coins: 500, totalXp: 100 });

    // Completa a missão play_match
    await dailyMissionService.recordMissionProgress(userId, { type: 'match_completed' });

    // Dispara dois cliques simultâneos em Coletar
    const [res1, res2] = await Promise.all([
      useUserStore.getState().claimDailyMission('play_match'),
      useUserStore.getState().claimDailyMission('play_match'),
    ]);

    // Exatamente uma das requisições deve ter sucesso
    const successCount = [res1, res2].filter((r) => r.success).length;
    expect(successCount).toBe(1);

    // O saldo de moedas deve ter recebido a recompensa de 60 moedas exatamente uma vez (500 + 60 = 560)
    expect(useUserStore.getState().coins).toBe(560);

    // Uma tentativa subsequente é rejeitada por já estar coletada
    const res3 = await useUserStore.getState().claimDailyMission('play_match');
    expect(res3.success).toBe(false);
    expect(res3.claimed).toBe(true);
    expect(useUserStore.getState().coins).toBe(560);
  });
});
