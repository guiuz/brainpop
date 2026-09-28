import { useUserStore } from '../useUserStore';

describe('useUserStore — Autenticação e Gestão de Estado', () => {
  beforeEach(() => {
    // Garante que cada teste inicie em estado limpo
    useUserStore.getState().logout();
  });

  it('deve inicializar com valores padrão de convidado não autenticado', () => {
    const state = useUserStore.getState();
    expect(state.isLoggedIn).toBe(false);
    expect(state.id).toBe('');
    expect(state.name).toBe('Convidado');
    expect(state.coins).toBe(500);
    expect(state.lives).toBe(5);
  });

  it('deve atualizar o estado corretamente ao realizar login', () => {
    useUserStore.getState().login({
      id: 'usr_test_123',
      name: 'Jogador Teste',
      email: 'teste@brainpop.com',
      coins: 1250,
      gems: 40,
      level: 5,
      currentXp: 150,
    });

    const state = useUserStore.getState();
    expect(state.isLoggedIn).toBe(true);
    expect(state.id).toBe('usr_test_123');
    expect(state.name).toBe('Jogador Teste');
    expect(state.email).toBe('teste@brainpop.com');
    expect(state.coins).toBe(1250);
    expect(state.gems).toBe(40);
    expect(state.level).toBe(5);
  });

  it('deve isolar e resetar completamente todo o patrimônio ao efetuar logout', () => {
    // 1. Simula usuário com saldo e progresso altos
    useUserStore.getState().login({
      id: 'usr_whale_999',
      name: 'Jogador Rico',
      email: 'rico@brainpop.com',
      coins: 99999,
      gems: 500,
      level: 30,
      currentXp: 5000,
      totalXp: 50000,
      duelTrophies: 150,
      inventory: {
        fiftyFifty: 20,
        extraTime: 15,
        skip: 10,
        hint: 5,
      },
    });

    // 2. Executa logout
    useUserStore.getState().logout();

    // 3. Valida que nenhum patrimônio vazou para a nova sessão
    const stateAfterLogout = useUserStore.getState();
    expect(stateAfterLogout.isLoggedIn).toBe(false);
    expect(stateAfterLogout.id).toBe('');
    expect(stateAfterLogout.name).toBe('Convidado');
    expect(stateAfterLogout.coins).toBe(500); // Padrão inicial
    expect(stateAfterLogout.gems).toBe(15);   // Padrão inicial
    expect(stateAfterLogout.level).toBe(1);
    expect(stateAfterLogout.currentXp).toBe(0);
    expect(stateAfterLogout.totalXp).toBe(0);
    expect(stateAfterLogout.duelTrophies).toBe(0);
    expect(stateAfterLogout.inventory.fiftyFifty).toBe(3);
  });

  it('deve debitar moedas apenas quando houver saldo suficiente', () => {
    useUserStore.setState({ coins: 100 });
    
    // Tenta gastar mais do que possui
    const successOverspend = useUserStore.getState().spendCoins(150);
    expect(successOverspend).toBe(false);
    expect(useUserStore.getState().coins).toBe(100);

    // Gasta quantia válida
    const successValidSpend = useUserStore.getState().spendCoins(40);
    expect(successValidSpend).toBe(true);
    expect(useUserStore.getState().coins).toBe(60);
  });

  it('deve decrementar vidas e bloquear quando vidas chegarem a 0', () => {
    useUserStore.setState({ lives: 1 });

    const used1 = useUserStore.getState().useLife();
    expect(used1).toBe(true);
    expect(useUserStore.getState().lives).toBe(0);

    const used2 = useUserStore.getState().useLife();
    expect(used2).toBe(false);
    expect(useUserStore.getState().lives).toBe(0);
  });

  it('deve rejeitar valores negativos ou inválidos em addCoins e spendCoins', () => {
    const initialCoins = useUserStore.getState().coins;

    // Tentativas maliciosas de injeção negativa ou NaN
    useUserStore.getState().addCoins(-1000);
    expect(useUserStore.getState().coins).toBe(initialCoins);

    useUserStore.getState().addCoins(NaN);
    expect(useUserStore.getState().coins).toBe(initialCoins);

    const spendNegative = useUserStore.getState().spendCoins(-500);
    expect(spendNegative).toBe(false);
    expect(useUserStore.getState().coins).toBe(initialCoins);

    const spendNaN = useUserStore.getState().spendCoins(NaN);
    expect(spendNaN).toBe(false);
    expect(useUserStore.getState().coins).toBe(initialCoins);
  });

  it('deve gerenciar e proteger saldo de gemas com validação estrita', () => {
    const initialGems = useUserStore.getState().gems;

    useUserStore.getState().addGems(50);
    expect(useUserStore.getState().gems).toBe(initialGems + 50);

    // Rejeita negativo
    useUserStore.getState().addGems(-30);
    expect(useUserStore.getState().gems).toBe(initialGems + 50);

    // Gasto válido
    const spentGems = useUserStore.getState().spendGems(20);
    expect(spentGems).toBe(true);
    expect(useUserStore.getState().gems).toBe(initialGems + 30);

    // Gasto além do saldo
    const overspendGems = useUserStore.getState().spendGems(9999);
    expect(overspendGems).toBe(false);
    expect(useUserStore.getState().gems).toBe(initialGems + 30);
  });

  it('deve aplicar teto anti-cheat em recordMatchResult contra valores inflacionados', () => {
    const initialCoins = useUserStore.getState().coins;
    const initialTotalXp = useUserStore.getState().totalXp;

    // Tentativa de injetar 1 milhão de moedas e XP em uma partida de 10 perguntas
    useUserStore.getState().recordMatchResult({
      won: true,
      correctAnswers: 10,
      totalQuestions: 10,
      category: 'Ciência',
      xpGained: 1_000_000,
      coinsGained: 1_000_000,
    });

    const maxAllowableCoins = 10 * 35 + 50; // 400
    const maxAllowableXp = 10 * 75 + 100;   // 850

    expect(useUserStore.getState().coins).toBe(initialCoins + maxAllowableCoins);
    expect(useUserStore.getState().totalXp).toBe(initialTotalXp + maxAllowableXp);
    expect(useUserStore.getState().level).toBeGreaterThan(1);
  });

  it('deve validar e proteger aposta em recordDuelOutcome contra valores arbitrários', () => {
    useUserStore.setState({ coins: 1000 });

    // Aposta arbitrária de 99.999 deve ser convertida para aposta segura padrão de 50
    const outcome = useUserStore.getState().recordDuelOutcome({
      won: true,
      betAmount: 99999,
    });

    expect(outcome.won).toBe(true);
    // Prêmio deve ser 50 * 2 = 100, e não 99999 * 2
    expect(outcome.coinsEarnedOrLost).toBe(100);
    expect(useUserStore.getState().coins).toBe(1100);
  });
});
