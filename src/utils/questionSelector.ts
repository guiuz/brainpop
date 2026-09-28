import { Question, Option } from '../data/questions';

export interface SelectQuestionsParams {
  pool: Question[];
  count: number;
  recentIds?: string[];
  category?: string;
  difficulty?: string;
  rng?: () => number;
}

/**
 * Embaralha um array usando o algoritmo Fisher-Yates (Durstenfeld).
 * Aceita uma função de RNG opcional para garantir determinismo nos testes.
 */
export function fisherYatesShuffle<T>(array: T[], rng: () => number = Math.random): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    const temp = result[i];
    result[i] = result[j];
    result[j] = temp;
  }
  return result;
}

/**
 * Normaliza os termos de dificuldade entre as convenções do app (easy/medium/hard)
 * e os valores existentes no banco de perguntas (Fácil/Médio/Difícil).
 */
export function normalizeDifficulty(diff?: string): 'easy' | 'medium' | 'hard' | 'all' {
  if (!diff) return 'all';
  const clean = diff.trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  if (clean === 'easy' || clean === 'facil' || clean === '1') return 'easy';
  if (clean === 'medium' || clean === 'medio' || clean === '2') return 'medium';
  if (clean === 'hard' || clean === 'dificil' || clean === '3') return 'hard';
  return 'all';
}

/**
 * Normaliza a categoria para comparação insensível a acentos e maiúsculas/minúsculas.
 */
export function normalizeCategory(cat?: string): string {
  if (!cat) return 'all';
  const clean = cat.trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  if (clean === 'todos' || clean === 'all' || clean === 'desafio_misto' || clean === 'geral') {
    return 'all';
  }
  return clean;
}

/**
 * Verifica se a dificuldade de uma pergunta corresponde à dificuldade solicitada.
 */
export function matchesDifficulty(questionDiff: string, targetDiff: string): boolean {
  const normTarget = normalizeDifficulty(targetDiff);
  if (normTarget === 'all') return true;
  const normQuestion = normalizeDifficulty(questionDiff);
  return normQuestion === normTarget;
}

/**
 * Verifica se a categoria de uma pergunta corresponde à categoria solicitada.
 */
export function matchesCategory(questionCat: string, targetCat: string): boolean {
  const normTarget = normalizeCategory(targetCat);
  if (normTarget === 'all') return true;
  const normQuestion = normalizeCategory(questionCat);
  return (
    normQuestion.includes(normTarget) ||
    normTarget.includes(normQuestion) ||
    (normTarget === 'historia' && normQuestion.includes('historia')) ||
    (normTarget === 'geografia' && normQuestion.includes('geografia')) ||
    (normTarget === 'ciencia' && (normQuestion.includes('ciencia') || normQuestion.includes('natureza'))) ||
    (normTarget === 'cultura_pop' && (normQuestion.includes('entretenimento') || normQuestion.includes('pop') || normQuestion.includes('musica') || normQuestion.includes('cinema'))) ||
    (normTarget === 'literatura' && (normQuestion.includes('literatura') || normQuestion.includes('lingua')))
  );
}

/**
 * Função pura e testável para seleção de perguntas com anti-repetição,
 * fallback progressivo do histórico mais antigo e embaralhamento Fisher-Yates.
 */
export function selectQuestions({
  pool,
  count,
  recentIds = [],
  category = 'all',
  difficulty = 'all',
  rng = Math.random,
}: SelectQuestionsParams): Question[] {
  if (!pool || pool.length === 0 || count <= 0) {
    return [];
  }

  // 1. Desduplicar o pool de entrada por id
  const uniquePoolMap = new Map<string, Question>();
  for (const q of pool) {
    if (q && q.id && !uniquePoolMap.has(q.id)) {
      uniquePoolMap.set(q.id, q);
    }
  }
  const uniquePool = Array.from(uniquePoolMap.values());

  // 2. Filtrar por categoria
  let categoryFiltered = uniquePool;
  const normCat = normalizeCategory(category);
  if (normCat !== 'all') {
    const matched = uniquePool.filter((q) => matchesCategory(q.category, category));
    if (matched.length > 0) {
      categoryFiltered = matched;
    }
  }

  // 3. Filtrar por dificuldade
  let candidates = categoryFiltered;
  const normDiff = normalizeDifficulty(difficulty);
  if (normDiff !== 'all') {
    const matched = categoryFiltered.filter((q) => matchesDifficulty(q.difficulty, difficulty));
    if (matched.length > 0) {
      candidates = matched;
    }
  }

  // 4. Se a quantidade total de candidatos for menor ou igual à solicitada,
  // retorna todos os candidatos embaralhados (sem duplicatas)
  if (candidates.length <= count) {
    return fisherYatesShuffle(candidates, rng);
  }

  // 5. Separar candidatos em "Frescos" (não vistos recentemente) e "Recentes"
  const recentSet = new Set(recentIds);
  const freshQuestions = candidates.filter((q) => !recentSet.has(q.id));
  const recentQuestions = candidates.filter((q) => recentSet.has(q.id));

  // 6. Caso haja perguntas frescas suficientes
  if (freshQuestions.length >= count) {
    const shuffledFresh = fisherYatesShuffle(freshQuestions, rng);
    return shuffledFresh.slice(0, count);
  }

  // 7. Caso as perguntas frescas não bastem: liberar progressivamente as perguntas
  // mais antigas do histórico. A ordem em recentIds é [mais antiga, ..., mais recente].
  const needed = count - freshQuestions.length;

  // Ordena as perguntas recentes pela antiguidade no histórico (índice menor = mais antiga)
  recentQuestions.sort((a, b) => {
    const idxA = recentIds.indexOf(a.id);
    const idxB = recentIds.indexOf(b.id);
    return idxA - idxB;
  });

  const releasedFromHistory = recentQuestions.slice(0, needed);
  const combined = [...freshQuestions, ...releasedFromHistory];

  // Embaralha o conjunto combinado final com Fisher-Yates
  return fisherYatesShuffle(combined, rng);
}

/**
 * Embaralha as alternativas de uma pergunta usando Fisher-Yates e atualiza o correctId
 * para garantir distribuição uniforme entre as letras A, B, C, D.
 */
export function randomizeQuestionOptions(
  question: Question,
  rng: () => number = Math.random
): Question {
  const letters = ['A', 'B', 'C', 'D'];
  const correctOpt =
    question.options.find((o) => o.id === question.correctId) ||
    question.options[0];
  const correctText = correctOpt ? correctOpt.text : '';

  const shuffledOptions = fisherYatesShuffle(question.options, rng);
  const newOptions: Option[] = shuffledOptions.map((opt, idx) => ({
    id: letters[idx] || String.fromCharCode(65 + idx),
    text: opt.text,
  }));

  const newCorrectId =
    newOptions.find((o) => o.text === correctText)?.id || 'A';

  return {
    ...question,
    options: newOptions,
    correctId: newCorrectId,
  };
}
