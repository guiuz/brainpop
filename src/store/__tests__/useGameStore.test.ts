import { useGameStore, DUEL_BOTS, DuelBot } from '../useGameStore';

describe('useGameStore', () => {
  beforeEach(() => {
    // Reset store state before each test
    useGameStore.setState({
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
      disabledOptionIndices: [],
      score: 0,
      correctAnswersCount: 0,
      timeRemaining: 15,
      totalTimePerQuestion: 15,
      questionStartTime: 0,
      comboStreak: 0,
      maxComboStreak: 0,
      xpEarned: 0,
      coinsEarned: 0,
      usedPowerUps: {
        fiftyFifty: false,
        extraTime: false,
        skip: false,
        hint: false,
      },
      hintMessage: null,
      hasUsedAdRevive: false,
    });
    jest.restoreAllMocks();
  });

  describe('Inicialização e Estado Padrão', () => {
    it('deve inicializar com estado inativo por padrão', () => {
      const state = useGameStore.getState();
      expect(state.isActive).toBe(false);
      expect(state.score).toBe(0);
      expect(state.selectedOptionIndex).toBeNull();
      expect(state.isAnswerSubmitted).toBe(false);
      expect(state.hasUsedAdRevive).toBe(false);
    });

    it('DUEL_BOTS deve ter 4 bots com configurações válidas', () => {
      expect(DUEL_BOTS.length).toBe(4);
      expect(DUEL_BOTS.map((b) => b.id)).toEqual(['facil', 'medio', 'dificil', 'mestre']);
    });
  });

  describe('startMatch', () => {
    it('deve iniciar partida solo com parâmetros padrão', () => {
      useGameStore.getState().startMatch({});
      const state = useGameStore.getState();

      expect(state.isActive).toBe(true);
      expect(state.gameMode).toBe('solo');
      expect(state.category).toBe('all');
      expect(state.questions.length).toBe(10);
      expect(state.currentQuestionIndex).toBe(0);
      expect(state.timeRemaining).toBe(15);
      expect(state.score).toBe(0);
      expect(state.comboStreak).toBe(0);
      expect(state.hasUsedAdRevive).toBe(false);
      expect(state.usedPowerUps.fiftyFifty).toBe(false);
    });

    it('deve filtrar perguntas por categoria específica (história, geografia, ciência, cultura_pop, literatura)', () => {
      // Testando diferentes categorias para cobrir a normalização e filtros
      const categories = ['historia', 'geografia', 'ciencia', 'cultura_pop', 'literatura'];
      for (const cat of categories) {
        useGameStore.getState().startMatch({ category: cat, questionCount: 3 });
        const state = useGameStore.getState();
        expect(state.category).toBe(cat);
        expect(state.questions.length).toBeGreaterThan(0);
      }
    });

    it('deve lidar com categoria desafio_misto sem crashar', () => {
      useGameStore.getState().startMatch({ category: 'desafio_misto', questionCount: 5 });
      const state = useGameStore.getState();
      expect(state.questions.length).toBe(5);
    });

    it('deve embaralhar as opções e atribuir ids A, B, C, D mantendo a resposta correta', () => {
      useGameStore.getState().startMatch({ questionCount: 1 });
      const q = useGameStore.getState().questions[0];

      expect(q).toBeDefined();
      expect(q.options.map((o) => o.id)).toEqual(['A', 'B', 'C', 'D']);
      expect(['A', 'B', 'C', 'D']).toContain(q.correctId);
    });
  });

  describe('startDuelMatch', () => {
    const testBot: DuelBot = DUEL_BOTS[0];

    it('deve configurar partida de duelo quando o jogador é o Líder (3 vidas jogador vs 1 vida oponente)', () => {
      useGameStore.getState().startDuelMatch({
        bot: testBot,
        bet: 100,
        playerRoll: 6,
        opponentRoll: 3,
        isPlayerLeader: true,
        questionCount: 5,
        category: 'historia',
      });

      const state = useGameStore.getState();
      expect(state.isActive).toBe(true);
      expect(state.gameMode).toBe('duel');
      expect(state.duelBot).toEqual(testBot);
      expect(state.duelBet).toBe(100);
      expect(state.isPlayerLeader).toBe(true);
      expect(state.playerDuelLives).toBe(3);
      expect(state.opponentDuelLives).toBe(1);
      expect(state.duelEliminationStatus).toBe('playing');
      expect(state.questions.length).toBe(5);
    });

    it('deve configurar partida de duelo quando o oponente é o Líder (1 vida jogador vs 3 vidas oponente)', () => {
      useGameStore.getState().startDuelMatch({
        bot: testBot,
        bet: 50,
        playerRoll: 2,
        opponentRoll: 5,
        isPlayerLeader: false,
      });

      const state = useGameStore.getState();
      expect(state.isPlayerLeader).toBe(false);
      expect(state.playerDuelLives).toBe(1);
      expect(state.opponentDuelLives).toBe(3);
    });
  });

  describe('selectOption', () => {
    it('deve selecionar uma opção válida', () => {
      useGameStore.getState().selectOption(2);
      expect(useGameStore.getState().selectedOptionIndex).toBe(2);
    });

    it('não deve permitir selecionar opção se já desativada por 50/50', () => {
      useGameStore.setState({ disabledOptionIndices: [1] });
      useGameStore.getState().selectOption(1);
      expect(useGameStore.getState().selectedOptionIndex).toBeNull();
    });

    it('não deve alterar a opção após a resposta já ter sido enviada', () => {
      useGameStore.setState({ isAnswerSubmitted: true, selectedOptionIndex: 0 });
      useGameStore.getState().selectOption(3);
      expect(useGameStore.getState().selectedOptionIndex).toBe(0);
    });
  });

  describe('submitAnswer - Lógica de Pontuação e Anti-Cheat', () => {
    const mockQuestion = {
      id: 'q_test',
      question: 'Pergunta de Teste',
      category: 'Ciência',
      options: [
        { id: 'A', text: 'Opção A' },
        { id: 'B', text: 'Opção B' },
        { id: 'C', text: 'Opção C' },
        { id: 'D', text: 'Opção D' },
      ],
      correctId: 'B',
      explanation: 'Explicação teste',
      difficulty: 'fácil' as const,
    };

    it('deve retornar falso e 0 pontos se não houver pergunta ou nenhuma opção selecionada', () => {
      useGameStore.setState({ questions: [], currentQuestionIndex: 0, selectedOptionIndex: null });
      const result = useGameStore.getState().submitAnswer();
      expect(result).toEqual({ isCorrect: false, isLastQuestion: true, points: 0 });

      useGameStore.setState({ questions: [mockQuestion], currentQuestionIndex: 0, selectedOptionIndex: null });
      const result2 = useGameStore.getState().submitAnswer();
      expect(result2).toEqual({ isCorrect: false, isLastQuestion: true, points: 0 });
    });

    it('deve calcular pontuação correta com bônus de tempo e combo', () => {
      useGameStore.setState({
        questions: [mockQuestion, mockQuestion],
        currentQuestionIndex: 0,
        selectedOptionIndex: 1, // 'B' (Correta)
        timeRemaining: 10,
        questionStartTime: Date.now() - 2000,
        comboStreak: 2,
        maxComboStreak: 2,
        score: 100,
      });

      const result = useGameStore.getState().submitAnswer();
      const state = useGameStore.getState();

      expect(result.isCorrect).toBe(true);
      expect(result.isLastQuestion).toBe(false);
      // Base 100 + timeBonus (10 * 10 = 100) + comboBonus ((3 - 1) * 25 = 50) = 250
      expect(result.points).toBe(250);
      expect(state.score).toBe(350);
      expect(state.comboStreak).toBe(3);
      expect(state.maxComboStreak).toBe(3);
      expect(state.correctAnswersCount).toBe(1);
      expect(state.xpEarned).toBeGreaterThan(0);
      expect(state.coinsEarned).toBeGreaterThan(0);
    });

    it('deve respeitar tetos máximos: 500 pontos, 150 tempo, 250 combo', () => {
      useGameStore.setState({
        questions: [mockQuestion],
        currentQuestionIndex: 0,
        selectedOptionIndex: 1, // 'B' (Correta)
        timeRemaining: 30, // timeBonus teoricamente 300, limitado a 150
        questionStartTime: Date.now() - 2000,
        comboStreak: 20, // comboBonus teoricamente 500, limitado a 250
        score: 0,
      });

      const result = useGameStore.getState().submitAnswer();
      // 100 + 150 + 250 = 500 (teto máximo)
      expect(result.points).toBe(500);
      expect(useGameStore.getState().score).toBe(500);
    });

    it('deve resetar combo e dar recompensas de erro em caso de resposta incorreta', () => {
      useGameStore.setState({
        questions: [mockQuestion],
        currentQuestionIndex: 0,
        selectedOptionIndex: 0, // 'A' (Incorreta)
        timeRemaining: 8,
        questionStartTime: Date.now() - 2000,
        comboStreak: 5,
        score: 500,
      });

      const result = useGameStore.getState().submitAnswer();
      const state = useGameStore.getState();

      expect(result.isCorrect).toBe(false);
      expect(result.points).toBe(0);
      expect(state.score).toBe(500);
      expect(state.comboStreak).toBe(0);
      expect(state.xpEarned).toBe(10); // roundXp incorreto fixo
      expect(state.coinsEarned).toBe(2); // roundCoins incorreto fixo
    });

    it('deve detectar speedhack (< 150ms) e zerar pontuação, XP e moedas', () => {
      const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});

      useGameStore.setState({
        questions: [mockQuestion],
        currentQuestionIndex: 0,
        selectedOptionIndex: 1, // 'B' (Correta)
        timeRemaining: 15,
        questionStartTime: Date.now() - 50, // 50ms (sub-humano)
      });

      const result = useGameStore.getState().submitAnswer();
      const state = useGameStore.getState();

      expect(result.isCorrect).toBe(true);
      expect(result.points).toBe(0);
      expect(state.score).toBe(0);
      expect(state.xpEarned).toBe(0);
      expect(state.coinsEarned).toBe(0);
      expect(warnSpy).toHaveBeenCalled();
    });

    it('deve usar 1000ms como fallback se questionStartTime for 0', () => {
      useGameStore.setState({
        questions: [mockQuestion],
        currentQuestionIndex: 0,
        selectedOptionIndex: 1, // 'B' (Correta)
        timeRemaining: 10,
        questionStartTime: 0,
      });

      const result = useGameStore.getState().submitAnswer();
      expect(result.points).toBeGreaterThan(0);
    });
  });

  describe('submitAnswer - Mecânica de Duelo e Eliminação', () => {
    const duelQuestion = {
      id: 'q_duel',
      question: 'Pergunta Duelo',
      category: 'História',
      options: [
        { id: 'A', text: '1' },
        { id: 'B', text: '2' },
      ],
      correctId: 'A',
      explanation: '',
      difficulty: 'fácil' as const,
    };

    it('deve simular acerto do bot e pontuação do oponente quando Math.random < accuracyRate', () => {
      jest.spyOn(Math, 'random').mockReturnValue(0.1); // Garante acerto do bot

      useGameStore.setState({
        gameMode: 'duel',
        duelBot: DUEL_BOTS[1], // accuracyRate 0.70
        questions: [duelQuestion],
        currentQuestionIndex: 0,
        selectedOptionIndex: 0, // Jogador acertou
        questionStartTime: Date.now() - 1000,
        playerDuelLives: 3,
        opponentDuelLives: 1,
      });

      useGameStore.getState().submitAnswer();
      const state = useGameStore.getState();

      expect(state.isOpponentLastAnswerCorrect).toBe(true);
      expect(state.opponentScore).toBeGreaterThan(0);
      expect(state.opponentCorrectAnswersCount).toBe(1);
      expect(state.opponentDuelLives).toBe(1);
    });

    it('deve debitar vida do oponente e eliminá-lo quando bot erra e fica com 0 vidas', () => {
      jest.spyOn(Math, 'random').mockReturnValue(0.99); // Garante erro do bot

      useGameStore.setState({
        gameMode: 'duel',
        duelBot: DUEL_BOTS[0], // accuracyRate 0.45
        questions: [duelQuestion],
        currentQuestionIndex: 0,
        selectedOptionIndex: 0, // Jogador acertou
        questionStartTime: Date.now() - 1000,
        playerDuelLives: 3,
        opponentDuelLives: 1,
        duelEliminationStatus: 'playing',
      });

      const result = useGameStore.getState().submitAnswer();
      const state = useGameStore.getState();

      expect(state.isOpponentLastAnswerCorrect).toBe(false);
      expect(state.opponentDuelLives).toBe(0);
      expect(state.duelEliminationStatus).toBe('opponent_eliminated');
      expect(result.isLastQuestion).toBe(true);
    });

    it('deve debitar vida do jogador e eliminá-lo quando jogador erra e fica com 0 vidas', () => {
      jest.spyOn(Math, 'random').mockReturnValue(0.1); // Bot acerta

      useGameStore.setState({
        gameMode: 'duel',
        duelBot: DUEL_BOTS[1],
        questions: [duelQuestion],
        currentQuestionIndex: 0,
        selectedOptionIndex: 1, // Jogador errou (selecionou B, correta é A)
        questionStartTime: Date.now() - 1000,
        playerDuelLives: 1,
        opponentDuelLives: 3,
        duelEliminationStatus: 'playing',
      });

      const result = useGameStore.getState().submitAnswer();
      const state = useGameStore.getState();

      expect(state.playerDuelLives).toBe(0);
      expect(state.duelEliminationStatus).toBe('player_eliminated');
      expect(result.isLastQuestion).toBe(true);
    });
  });

  describe('nextQuestion', () => {
    const q1 = {
      id: 'q_1',
      question: 'Q1',
      category: 'Geral',
      options: [{ id: 'A', text: '1' }],
      correctId: 'A',
      explanation: '',
      difficulty: 'fácil' as const,
    };
    const q2 = {
      id: 'q_2',
      question: 'Q2',
      category: 'Geral',
      options: [{ id: 'A', text: '2' }],
      correctId: 'A',
      explanation: '',
      difficulty: 'fácil' as const,
    };

    it('deve avançar para a próxima pergunta e redefinir o estado da rodada', () => {
      useGameStore.setState({
        questions: [q1, q2],
        currentQuestionIndex: 0,
        selectedOptionIndex: 0,
        isAnswerSubmitted: true,
        isCorrect: true,
        disabledOptionIndices: [1],
        timeRemaining: 4,
        hintMessage: 'Dica antiga',
      });

      const hasNext = useGameStore.getState().nextQuestion();
      const state = useGameStore.getState();

      expect(hasNext).toBe(true);
      expect(state.currentQuestionIndex).toBe(1);
      expect(state.selectedOptionIndex).toBeNull();
      expect(state.isAnswerSubmitted).toBe(false);
      expect(state.isCorrect).toBeNull();
      expect(state.disabledOptionIndices).toEqual([]);
      expect(state.timeRemaining).toBe(15);
      expect(state.hintMessage).toBeNull();
    });

    it('deve encerrar a partida (isActive: false) ao chegar na última pergunta', () => {
      useGameStore.setState({
        questions: [q1],
        currentQuestionIndex: 0,
        isActive: true,
      });

      const hasNext = useGameStore.getState().nextQuestion();
      const state = useGameStore.getState();

      expect(hasNext).toBe(false);
      expect(state.isActive).toBe(false);
      expect(state.hintMessage).toBeNull();
    });
  });

  describe('submitTimeout e Resolução de Tempo Esgotado', () => {
    const qTest = {
      id: 'q_timeout',
      question: 'Pergunta Timeout',
      category: 'Geral',
      options: [
        { id: 'A', text: 'Opção 1' },
        { id: 'B', text: 'Opção 2' },
      ],
      correctId: 'A',
      explanation: 'Explicação timeout',
      difficulty: 'fácil' as const,
    };

    it('ao terminar o tempo sem seleção, finaliza como erro com selectedOptionIndex null', () => {
      useGameStore.setState({
        questions: [qTest],
        currentQuestionIndex: 0,
        selectedOptionIndex: null,
        isAnswerSubmitted: false,
        score: 100,
        comboStreak: 3,
      });

      const res = useGameStore.getState().submitTimeout();
      const state = useGameStore.getState();

      expect(res.isCorrect).toBe(false);
      expect(res.points).toBe(0);
      expect(state.selectedOptionIndex).toBeNull();
      expect(state.isAnswerSubmitted).toBe(true);
      expect(state.isCorrect).toBe(false);
      expect(state.isTimeout).toBe(true);
      expect(state.score).toBe(100);
      expect(state.comboStreak).toBe(0);
      expect(state.timeRemaining).toBe(0);
    });

    it('processa o timeout exatamente uma vez de forma idempotente', () => {
      useGameStore.setState({
        questions: [qTest],
        currentQuestionIndex: 0,
        selectedOptionIndex: null,
        isAnswerSubmitted: false,
      });

      const res1 = useGameStore.getState().submitTimeout();
      const res2 = useGameStore.getState().submitTimeout();

      expect(res1.isCorrect).toBe(false);
      expect(res2.isCorrect).toBe(false);
      expect(useGameStore.getState().isAnswerSubmitted).toBe(true);
    });

    it('no modo duelo, remove exatamente uma vida do jogador sem descontos adicionais', () => {
      jest.spyOn(Math, 'random').mockReturnValue(0.1); // Bot acerta

      useGameStore.setState({
        gameMode: 'duel',
        duelBot: DUEL_BOTS[0],
        questions: [qTest],
        currentQuestionIndex: 0,
        selectedOptionIndex: null,
        playerDuelLives: 3,
        opponentDuelLives: 1,
        duelEliminationStatus: 'playing',
        isAnswerSubmitted: false,
      });

      useGameStore.getState().submitTimeout();
      const state = useGameStore.getState();

      expect(state.playerDuelLives).toBe(2);
      expect(state.isOpponentLastAnswerCorrect).toBe(true);

      // Chamada redundante de timeout não pode debitar vida novamente
      useGameStore.getState().submitTimeout();
      expect(useGameStore.getState().playerDuelLives).toBe(2);
    });

    it('identifica corretamente a última pergunta e finaliza', () => {
      useGameStore.setState({
        questions: [qTest],
        currentQuestionIndex: 0,
        selectedOptionIndex: null,
        isAnswerSubmitted: false,
      });

      const res = useGameStore.getState().submitTimeout();
      expect(res.isLastQuestion).toBe(true);
    });

    it('tickTimer aciona submitTimeout quando o deadline expira', () => {
      useGameStore.setState({
        questions: [qTest],
        currentQuestionIndex: 0,
        selectedOptionIndex: null,
        isAnswerSubmitted: false,
        questionDeadlineAt: Date.now() - 100, // Prazo já expirou
        timeRemaining: 1,
      });

      useGameStore.getState().tickTimer();
      const state = useGameStore.getState();

      expect(state.isAnswerSubmitted).toBe(true);
      expect(state.isTimeout).toBe(true);
      expect(state.selectedOptionIndex).toBeNull();
    });

    it('continua permitindo resposta normal antes do prazo', () => {
      useGameStore.setState({
        questions: [qTest],
        currentQuestionIndex: 0,
        selectedOptionIndex: 0, // 'A' (Correta)
        isAnswerSubmitted: false,
        questionDeadlineAt: Date.now() + 10000,
        timeRemaining: 10,
        questionStartTime: Date.now() - 1000,
      });

      const res = useGameStore.getState().submitAnswer();
      expect(res.isCorrect).toBe(true);
      expect(res.points).toBeGreaterThan(0);
      expect(useGameStore.getState().isTimeout).toBe(false);
    });
  });

  describe('reviveMatch (Segunda Chance)', () => {
    const q = {
      id: 'q_revive',
      question: 'Revive',
      category: 'Geral',
      options: [
        { id: 'A', text: 'Incorreta' },
        { id: 'B', text: 'Correta' },
      ],
      correctId: 'B',
      explanation: '',
      difficulty: 'fácil' as const,
    };

    it('deve retornar falso se a segunda chance já tiver sido usada', () => {
      useGameStore.setState({ hasUsedAdRevive: true, questions: [q] });
      const success = useGameStore.getState().reviveMatch();
      expect(success).toBe(false);
    });

    it('deve retornar falso se não houver perguntas na partida', () => {
      useGameStore.setState({ hasUsedAdRevive: false, questions: [] });
      const success = useGameStore.getState().reviveMatch();
      expect(success).toBe(false);
    });

    it('deve reativar a partida, eliminar a opção incorreta selecionada e marcar hasUsedAdRevive', () => {
      useGameStore.setState({
        hasUsedAdRevive: false,
        questions: [q],
        currentQuestionIndex: 0,
        selectedOptionIndex: 0, // Selecionou a errada (id: 'A')
        disabledOptionIndices: [],
        isAnswerSubmitted: true,
      });

      const success = useGameStore.getState().reviveMatch();
      const state = useGameStore.getState();

      expect(success).toBe(true);
      expect(state.isActive).toBe(true);
      expect(state.hasUsedAdRevive).toBe(true);
      expect(state.timeRemaining).toBe(15);
      expect(state.selectedOptionIndex).toBeNull();
      expect(state.isAnswerSubmitted).toBe(false);
      expect(state.disabledOptionIndices).toContain(0); // Opção errada eliminada!
      expect(state.hintMessage).toContain('Segunda Chance Ativada');
    });
  });

  describe('usePowerUp', () => {
    const qWithFour = {
      id: 'q_pu',
      question: 'PowerUp',
      category: 'Geografia',
      options: [
        { id: 'A', text: 'Errada 1' },
        { id: 'B', text: 'Correta' },
        { id: 'C', text: 'Errada 2' },
        { id: 'D', text: 'Errada 3' },
      ],
      correctId: 'B',
      explanation: '',
      difficulty: 'médio' as const,
    };

    it('não deve permitir usar power-up se já utilizado ou resposta já enviada', () => {
      useGameStore.setState({
        usedPowerUps: { fiftyFifty: true, extraTime: false, skip: false, hint: false },
        questions: [qWithFour],
      });
      expect(useGameStore.getState().usePowerUp('fiftyFifty')).toBe(false);

      useGameStore.setState({
        usedPowerUps: { fiftyFifty: false, extraTime: false, skip: false, hint: false },
        isAnswerSubmitted: true,
        questions: [qWithFour],
      });
      expect(useGameStore.getState().usePowerUp('fiftyFifty')).toBe(false);
    });

    it('deve retornar falso se não houver pergunta ativa', () => {
      useGameStore.setState({ questions: [], currentQuestionIndex: 0 });
      expect(useGameStore.getState().usePowerUp('extraTime')).toBe(false);
    });

    it('fiftyFifty deve desativar até 2 opções incorretas sem remover a correta', () => {
      useGameStore.setState({
        questions: [qWithFour],
        currentQuestionIndex: 0,
        disabledOptionIndices: [],
        usedPowerUps: { fiftyFifty: false, extraTime: false, skip: false, hint: false },
      });

      const success = useGameStore.getState().usePowerUp('fiftyFifty');
      const state = useGameStore.getState();

      expect(success).toBe(true);
      expect(state.usedPowerUps.fiftyFifty).toBe(true);
      expect(state.disabledOptionIndices.length).toBe(2);
      expect(state.disabledOptionIndices).not.toContain(1); // Índice 1 é a correta ('B')
    });

    it('extraTime deve adicionar 15 segundos ao cronômetro respeitando o teto de 30', () => {
      useGameStore.setState({
        questions: [qWithFour],
        currentQuestionIndex: 0,
        timeRemaining: 10,
        usedPowerUps: { fiftyFifty: false, extraTime: false, skip: false, hint: false },
      });

      const success = useGameStore.getState().usePowerUp('extraTime');
      expect(success).toBe(true);
      expect(useGameStore.getState().timeRemaining).toBe(25);

      // Se tentar adicionar com 20, teto é 30
      useGameStore.setState({
        timeRemaining: 20,
        usedPowerUps: { fiftyFifty: false, extraTime: false, skip: false, hint: false },
      });
      useGameStore.getState().usePowerUp('extraTime');
      expect(useGameStore.getState().timeRemaining).toBe(30);
    });

    it('skip deve pular para a próxima pergunta', () => {
      const qNext = { ...qWithFour, id: 'q_pu_2' };
      useGameStore.setState({
        questions: [qWithFour, qNext],
        currentQuestionIndex: 0,
        usedPowerUps: { fiftyFifty: false, extraTime: false, skip: false, hint: false },
      });

      const success = useGameStore.getState().usePowerUp('skip');
      const state = useGameStore.getState();

      expect(success).toBe(true);
      expect(state.usedPowerUps.skip).toBe(true);
      expect(state.currentQuestionIndex).toBe(1);
    });

    it('hint deve desativar 1 opção incorreta e gerar mensagem de dica contextual', () => {
      useGameStore.setState({
        questions: [qWithFour],
        currentQuestionIndex: 0,
        disabledOptionIndices: [],
        usedPowerUps: { fiftyFifty: false, extraTime: false, skip: false, hint: false },
      });

      const success = useGameStore.getState().usePowerUp('hint');
      const state = useGameStore.getState();

      expect(success).toBe(true);
      expect(state.usedPowerUps.hint).toBe(true);
      expect(state.disabledOptionIndices.length).toBe(1);
      expect(state.disabledOptionIndices).not.toContain(1); // Não elimina a correta
      expect(state.hintMessage).toContain('Dica:');
    });

    it('deve retornar falso para tipo desconhecido de power-up', () => {
      useGameStore.setState({ questions: [qWithFour] });
      // @ts-expect-error testando tipo inválido
      expect(useGameStore.getState().usePowerUp('invalido')).toBe(false);
    });
  });

  describe('endMatch', () => {
    it('deve desativar a partida', () => {
      useGameStore.setState({ isActive: true });
      useGameStore.getState().endMatch();
      expect(useGameStore.getState().isActive).toBe(false);
    });
  });
});
