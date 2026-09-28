import { 
  selectQuestions, 
  fisherYatesShuffle, 
  normalizeDifficulty, 
  normalizeCategory,
  randomizeQuestionOptions
} from '../questionSelector';
import { Question } from '../../data/questions';

const createMockQuestion = (id: string, category = 'História', difficulty = 'Fácil'): Question => ({
  id,
  category,
  difficulty,
  question: `Pergunta de teste ${id}?`,
  options: [
    { id: 'A', text: `Alternativa A de ${id}` },
    { id: 'B', text: `Alternativa B de ${id}` },
    { id: 'C', text: `Alternativa C de ${id} (Correta)` },
    { id: 'D', text: `Alternativa D de ${id}` },
  ],
  correctId: 'C',
});

describe('questionSelector — Algoritmo de Seleção e Anti-Repetição', () => {
  describe('fisherYatesShuffle', () => {
    it('deve manter todos os elementos originais sem duplicatas', () => {
      const original = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
      const shuffled = fisherYatesShuffle(original);
      expect(shuffled).toHaveLength(original.length);
      expect(new Set(shuffled).size).toBe(original.length);
      expect(shuffled.sort((a, b) => a - b)).toEqual(original);
    });

    it('deve ser puramente determinístico quando fornecido um RNG fixo', () => {
      const items = ['A', 'B', 'C', 'D'];
      let rngCalls = 0;
      const fakeRng = () => {
        rngCalls += 1;
        return 0.2; // Sempre seleciona índice previsível
      };

      const res1 = fisherYatesShuffle(items, fakeRng);
      expect(res1).toHaveLength(4);
      expect(rngCalls).toBe(3);
    });
  });

  describe('normalizeDifficulty & normalizeCategory', () => {
    it('deve mapear corretamente as dificuldades entre inglês e português com ou sem acentos', () => {
      expect(normalizeDifficulty('easy')).toBe('easy');
      expect(normalizeDifficulty('facil')).toBe('easy');
      expect(normalizeDifficulty('Fácil')).toBe('easy');

      expect(normalizeDifficulty('medium')).toBe('medium');
      expect(normalizeDifficulty('medio')).toBe('medium');
      expect(normalizeDifficulty('Médio')).toBe('medium');

      expect(normalizeDifficulty('hard')).toBe('hard');
      expect(normalizeDifficulty('dificil')).toBe('hard');
      expect(normalizeDifficulty('Difícil')).toBe('hard');

      expect(normalizeDifficulty('todos')).toBe('all');
      expect(normalizeDifficulty('all')).toBe('all');
      expect(normalizeDifficulty(undefined)).toBe('all');
    });

    it('deve normalizar categorias ignorando acentuação e caixa', () => {
      expect(normalizeCategory('História')).toBe('historia');
      expect(normalizeCategory('Ciência')).toBe('ciencia');
      expect(normalizeCategory('Todos')).toBe('all');
      expect(normalizeCategory('desafio_misto')).toBe('all');
    });
  });

  describe('selectQuestions — Anti-Repetição e Fallback Progressivo', () => {
    const mockPool: Question[] = [
      createMockQuestion('Q1', 'História', 'Fácil'),
      createMockQuestion('Q2', 'História', 'Fácil'),
      createMockQuestion('Q3', 'História', 'Fácil'),
      createMockQuestion('Q4', 'História', 'Fácil'),
      createMockQuestion('Q5', 'História', 'Fácil'),
      createMockQuestion('Q6', 'História', 'Fácil'),
      createMockQuestion('Q7', 'História', 'Fácil'),
      createMockQuestion('Q8', 'História', 'Fácil'),
      createMockQuestion('Q9', 'História', 'Fácil'),
      createMockQuestion('Q10', 'História', 'Fácil'),
    ];

    it('nunca deve permitir perguntas duplicadas dentro da mesma partida', () => {
      const selected = selectQuestions({
        pool: mockPool,
        count: 5,
        category: 'História',
        difficulty: 'easy',
      });

      expect(selected).toHaveLength(5);
      const uniqueIds = new Set(selected.map((q) => q.id));
      expect(uniqueIds.size).toBe(5);
    });

    it('não deve utilizar perguntas do histórico quando houver perguntas novas suficientes', () => {
      const recentIds = ['Q1', 'Q2', 'Q3'];
      const selected = selectQuestions({
        pool: mockPool,
        count: 5,
        recentIds,
        category: 'História',
        difficulty: 'easy',
      });

      expect(selected).toHaveLength(5);
      // Nenhuma das selecionadas deve estar nos recentIds
      for (const q of selected) {
        expect(recentIds).not.toContain(q.id);
      }
    });

    it('deve liberar progressivamente as perguntas mais antigas do histórico quando o banco novo for insuficiente', () => {
      // 8 perguntas no histórico, apenas 2 novas ('Q9', 'Q10'). Solicitamos 4.
      // Histórico ordenado: Q1 é a mais antiga, Q8 é a mais recente.
      const recentIds = ['Q1', 'Q2', 'Q3', 'Q4', 'Q5', 'Q6', 'Q7', 'Q8'];
      
      const selected = selectQuestions({
        pool: mockPool,
        count: 4,
        recentIds,
        category: 'História',
        difficulty: 'easy',
      });

      expect(selected).toHaveLength(4);
      const selectedIds = selected.map((q) => q.id);

      // Deve incluir as 2 frescas: Q9 e Q10
      expect(selectedIds).toContain('Q9');
      expect(selectedIds).toContain('Q10');

      // As 2 que precisavam vir do histórico devem ser as mais antigas ('Q1', 'Q2')
      expect(selectedIds).toContain('Q1');
      expect(selectedIds).toContain('Q2');

      // Não deve pegar as mais recentes ('Q7', 'Q8')
      expect(selectedIds).not.toContain('Q7');
      expect(selectedIds).not.toContain('Q8');
    });

    it('deve respeitar filtro de categoria e dificuldade', () => {
      const mixedPool: Question[] = [
        createMockQuestion('H_E_1', 'História', 'Fácil'),
        createMockQuestion('H_E_2', 'História', 'Fácil'),
        createMockQuestion('H_M_1', 'História', 'Médio'),
        createMockQuestion('C_E_1', 'Ciência', 'Fácil'),
        createMockQuestion('C_H_1', 'Ciência', 'Difícil'),
      ];

      const selected = selectQuestions({
        pool: mixedPool,
        count: 2,
        category: 'História',
        difficulty: 'easy',
      });

      expect(selected).toHaveLength(2);
      expect(selected.map((q) => q.id)).toEqual(expect.arrayContaining(['H_E_1', 'H_E_2']));
    });

    it('funciona de forma determinística com RNG injetado', () => {
      let call = 0;
      const deterministicRng = () => {
        call++;
        return (call % 10) / 10;
      };

      const res1 = selectQuestions({
        pool: mockPool,
        count: 3,
        rng: deterministicRng,
      });

      call = 0;
      const res2 = selectQuestions({
        pool: mockPool,
        count: 3,
        rng: deterministicRng,
      });

      expect(res1.map((q) => q.id)).toEqual(res2.map((q) => q.id));
    });
  });

  describe('randomizeQuestionOptions', () => {
    it('deve embaralhar as alternativas mantendo a resposta correta sincronizada com o novo correctId', () => {
      const q = createMockQuestion('Q_TEST');
      const randomized = randomizeQuestionOptions(q);

      expect(randomized.options).toHaveLength(4);
      const correctOption = randomized.options.find((o) => o.id === randomized.correctId);
      expect(correctOption).toBeDefined();
      expect(correctOption?.text).toBe('Alternativa C de Q_TEST (Correta)');
    });
  });
});
