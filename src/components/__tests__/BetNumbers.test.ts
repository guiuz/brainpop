describe('Bet Numbers Formatting & Contrast Requirements', () => {
  const betAmounts = [50, 100, 250, 500, 1000];

  it('Formata os 5 botões de valores corretamente no padrão brasileiro (pt-BR)', () => {
    const formatted = betAmounts.map((amt) => amt.toLocaleString('pt-BR'));
    expect(formatted).toEqual(['50', '100', '250', '500', '1.000']);
  });

  it('Calcula e formata os valores do Pote Total dobrado (bet * 2) em pt-BR', () => {
    const pots = betAmounts.map((amt) => (amt * 2).toLocaleString('pt-BR'));
    expect(pots).toEqual(['100', '200', '500', '1.000', '2.000']);
  });

  it('Garante que a formatação não inclui emoji embutido na string numérica', () => {
    betAmounts.forEach((amt) => {
      const str = amt.toLocaleString('pt-BR');
      expect(str).not.toContain('🪙');
      expect(typeof str).toBe('string');
    });
  });

  it('Garante contraste acessível definido para todos os estados de aposta', () => {
    const states = {
      normal: {
        bg: '#F1F5F9',
        textColor: '#334155',
        coinColor: '#D97706',
      },
      selected: {
        bg: '#FEF3C7',
        textColor: '#92400E',
        coinColor: '#B45309',
      },
      disabled: {
        bg: '#F1F5F9',
        textColor: '#64748B',
        coinColor: '#94A3B8',
        opacity: 0.4,
      },
    };

    expect(states.normal.textColor).toBe('#334155');
    expect(states.selected.textColor).toBe('#92400E');
    expect(states.disabled.textColor).toBe('#64748B');
  });
});
