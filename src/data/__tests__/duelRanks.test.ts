import { getDuelRankByTrophies, DUEL_RANKS } from '../duelRanks';

describe('getDuelRankByTrophies', () => {
  it('deve retornar rank Ferro para 0 troféus', () => {
    const result = getDuelRankByTrophies(0);
    expect(result.currentRank.id).toBe('ferro');
    expect(result.currentRank.tier).toBe('Ferro');
    expect(result.nextRank?.id).toBe('bronze_1');
  });

  it('deve retornar rank Bronze 1 para 2 troféus com progresso correto', () => {
    const result = getDuelRankByTrophies(2);
    expect(result.currentRank.id).toBe('bronze_1');
    expect(result.nextRank?.id).toBe('bronze_2');
    expect(result.progressPercent).toBe(0);
  });

  it('deve limitar troféus negativos a 0 sem quebrar', () => {
    const result = getDuelRankByTrophies(-5);
    expect(result.currentRank.id).toBe('ferro');
  });

  it('deve retornar o rank máximo para pontuações muito altas sem nextRank', () => {
    const maxRank = DUEL_RANKS[DUEL_RANKS.length - 1];
    const result = getDuelRankByTrophies(maxRank.trophiesRequired + 500);
    expect(result.currentRank.id).toBe(maxRank.id);
    expect(result.nextRank).toBeNull();
    expect(result.progressPercent).toBe(100);
  });
});
