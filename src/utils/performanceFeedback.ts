export interface PerformanceFeedback {
  title: string;
  subtitle: string;
  tier: 'study_more' | 'good_effort' | 'very_well' | 'excellent';
  percentage: number;
}

/**
 * Retorna feedback determinístico e contextual com base no aproveitamento da partida.
 * 
 * Faixas proporcionais:
 * - Até 30% (<= 30%): "ESTUDE MAIS!"
 * - 31% a 60% (> 30% e <= 60%): "BOM ESFORÇO!"
 * - 61% a 80% (> 60% e <= 80%): "MUITO BEM!"
 * - Acima de 80% (> 80%): "EXCELENTE!"
 * 
 * @param correct Quantidade de acertos (número inteiro >= 0)
 * @param total Quantidade total de perguntas da partida (número inteiro > 0)
 */
export function getPerformanceFeedback(correct: number, total: number): PerformanceFeedback {
  const safeTotal = Math.max(1, total || 1);
  const safeCorrect = Math.max(0, Math.min(correct || 0, safeTotal));
  const ratio = safeCorrect / safeTotal;
  const percentage = Math.round(ratio * 100);

  // Faixa 1: Até 30%
  if (ratio <= 0.30001) {
    return {
      title: 'ESTUDE MAIS!',
      subtitle: 'Revise seus erros e tente novamente. Você consegue melhorar!',
      tier: 'study_more',
      percentage,
    };
  }

  // Faixa 2: 31% a 60%
  if (ratio <= 0.60001) {
    return {
      title: 'BOM ESFORÇO!',
      subtitle: 'Você está no caminho certo. Continue praticando!',
      tier: 'good_effort',
      percentage,
    };
  }

  // Faixa 3: 61% a 80%
  if (ratio <= 0.80001) {
    return {
      title: 'MUITO BEM!',
      subtitle: 'Ótimo resultado! Falta pouco para dominar este tema.',
      tier: 'very_well',
      percentage,
    };
  }

  // Faixa 4: Acima de 80%
  return {
    title: 'EXCELENTE!',
    subtitle: 'Você dominou este desafio!',
    tier: 'excellent',
    percentage,
  };
}
