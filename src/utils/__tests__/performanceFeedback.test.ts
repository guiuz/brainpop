import { getPerformanceFeedback } from '../performanceFeedback';

describe('getPerformanceFeedback (pure function)', () => {
  describe('Partidas de 10 perguntas (valores inteiros)', () => {
    it('0 acertos (0%) -> ESTUDE MAIS!', () => {
      const fb = getPerformanceFeedback(0, 10);
      expect(fb.tier).toBe('study_more');
      expect(fb.title).toBe('ESTUDE MAIS!');
      expect(fb.subtitle).toBe('Revise seus erros e tente novamente. Você consegue melhorar!');
      expect(fb.percentage).toBe(0);
    });

    it('2 acertos (20%) -> ESTUDE MAIS!', () => {
      const fb = getPerformanceFeedback(2, 10);
      expect(fb.tier).toBe('study_more');
      expect(fb.title).toBe('ESTUDE MAIS!');
      expect(fb.percentage).toBe(20);
    });

    it('3 acertos (30% limite da faixa) -> ESTUDE MAIS!', () => {
      const fb = getPerformanceFeedback(3, 10);
      expect(fb.tier).toBe('study_more');
      expect(fb.title).toBe('ESTUDE MAIS!');
      expect(fb.percentage).toBe(30);
    });

    it('4 acertos (40% limite inferior da faixa) -> BOM ESFORÇO!', () => {
      const fb = getPerformanceFeedback(4, 10);
      expect(fb.tier).toBe('good_effort');
      expect(fb.title).toBe('BOM ESFORÇO!');
      expect(fb.subtitle).toBe('Você está no caminho certo. Continue praticando!');
      expect(fb.percentage).toBe(40);
    });

    it('6 acertos (60% limite superior da faixa) -> BOM ESFORÇO!', () => {
      const fb = getPerformanceFeedback(6, 10);
      expect(fb.tier).toBe('good_effort');
      expect(fb.title).toBe('BOM ESFORÇO!');
      expect(fb.percentage).toBe(60);
    });

    it('7 acertos (70% faixa intermediária) -> MUITO BEM!', () => {
      const fb = getPerformanceFeedback(7, 10);
      expect(fb.tier).toBe('very_well');
      expect(fb.title).toBe('MUITO BEM!');
      expect(fb.subtitle).toBe('Ótimo resultado! Falta pouco para dominar este tema.');
      expect(fb.percentage).toBe(70);
    });

    it('8 acertos (80% limite superior da faixa) -> MUITO BEM!', () => {
      const fb = getPerformanceFeedback(8, 10);
      expect(fb.tier).toBe('very_well');
      expect(fb.title).toBe('MUITO BEM!');
      expect(fb.percentage).toBe(80);
    });

    it('9 acertos (90% acima de 80%) -> EXCELENTE!', () => {
      const fb = getPerformanceFeedback(9, 10);
      expect(fb.tier).toBe('excellent');
      expect(fb.title).toBe('EXCELENTE!');
      expect(fb.subtitle).toBe('Você dominou este desafio!');
      expect(fb.percentage).toBe(90);
    });

    it('10 acertos (100% pontuação máxima) -> EXCELENTE!', () => {
      const fb = getPerformanceFeedback(10, 10);
      expect(fb.tier).toBe('excellent');
      expect(fb.title).toBe('EXCELENTE!');
      expect(fb.percentage).toBe(100);
    });
  });

  describe('Cálculo proporcional para outras quantidades de perguntas', () => {
    it('Partida de 20 perguntas: 6 acertos (30%) -> ESTUDE MAIS!', () => {
      const fb = getPerformanceFeedback(6, 20);
      expect(fb.tier).toBe('study_more');
      expect(fb.percentage).toBe(30);
    });

    it('Partida de 20 perguntas: 7 acertos (35%) -> BOM ESFORÇO!', () => {
      const fb = getPerformanceFeedback(7, 20);
      expect(fb.tier).toBe('good_effort');
      expect(fb.percentage).toBe(35);
    });

    it('Partida de 15 perguntas (Duelo): 12 acertos (80%) -> MUITO BEM!', () => {
      const fb = getPerformanceFeedback(12, 15);
      expect(fb.tier).toBe('very_well');
      expect(fb.percentage).toBe(80);
    });

    it('Partida de 15 perguntas (Duelo): 13 acertos (86.7%) -> EXCELENTE!', () => {
      const fb = getPerformanceFeedback(13, 15);
      expect(fb.tier).toBe('excellent');
      expect(fb.percentage).toBe(87);
    });
  });

  describe('Resiliência a limites e edge cases', () => {
    it('Total 0 ou negativo é tratado de forma segura com denominador mínimo 1', () => {
      const fb = getPerformanceFeedback(0, 0);
      expect(fb.tier).toBe('study_more');
      expect(fb.percentage).toBe(0);
    });

    it('Acertos maiores que o total são limitados ao total (100%)', () => {
      const fb = getPerformanceFeedback(15, 10);
      expect(fb.tier).toBe('excellent');
      expect(fb.percentage).toBe(100);
    });

    it('Valores negativos de acertos são limitados a 0', () => {
      const fb = getPerformanceFeedback(-5, 10);
      expect(fb.tier).toBe('study_more');
      expect(fb.percentage).toBe(0);
    });
  });
});
