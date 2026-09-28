import { 
  collection, 
  query, 
  orderBy, 
  limit, 
  getDocs, 
  onSnapshot, 
  doc, 
  updateDoc, 
  increment, 
  addDoc, 
  serverTimestamp 
} from 'firebase/firestore';
import { db } from './firebase';

export interface LeaderboardPlayer {
  id: string;
  name: string;
  avatarUrl: string;
  level: number;
  totalXp: number;
  wins: number;
  title: string;
  badge?: string;
}

export const firebaseLeaderboardService = {
  /**
   * Buscar os melhores jogadores para o Ranking Geral / Semanal
   */
  async fetchTopPlayers(limitCount = 20): Promise<LeaderboardPlayer[]> {
    try {
      const q = query(
        collection(db, 'users'),
        orderBy('totalXp', 'desc'),
        limit(limitCount)
      );

      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        return [];
      }

      return snapshot.docs.map((docSnap: any, index: number) => {
        const data = docSnap.data();
        let badge = '';
        if (index === 0) badge = '🥇';
        else if (index === 1) badge = '🥈';
        else if (index === 2) badge = '🥉';

        return {
          id: docSnap.id,
          name: data.name || 'Jogador',
          avatarUrl: data.avatarUrl || `https://api.dicebear.com/7.x/avataaars/png?seed=${docSnap.id}`,
          level: data.level || 1,
          totalXp: data.totalXp || (data.level * 300 + (data.currentXp || 0)),
          wins: data.stats?.totalWins || 0,
          title: data.title || 'Curioso',
          badge,
        };
      });
    } catch (error) {
      console.warn('Erro ao buscar ranking do Firestore:', error);
      return [];
    }
  },

  /**
   * Ouvir ranking em tempo real
   */
  subscribeToTopPlayers(limitCount = 20, onUpdate: (players: LeaderboardPlayer[]) => void) {
    try {
      const q = query(
        collection(db, 'users'),
        orderBy('totalXp', 'desc'),
        limit(limitCount)
      );

      return onSnapshot(q, (snapshot: any) => {
        const players: LeaderboardPlayer[] = snapshot.docs.map((docSnap: any, index: number) => {
          const data = docSnap.data();
          let badge = '';
          if (index === 0) badge = '🥇';
          else if (index === 1) badge = '🥈';
          else if (index === 2) badge = '🥉';

          return {
            id: docSnap.id,
            name: data.name || 'Jogador',
            avatarUrl: data.avatarUrl || `https://api.dicebear.com/7.x/avataaars/png?seed=${docSnap.id}`,
            level: data.level || 1,
            totalXp: data.totalXp || 0,
            wins: data.stats?.totalWins || 0,
            title: data.title || 'Curioso',
            badge,
          };
        });
        onUpdate(players);
      });
    } catch (error) {
      console.warn('Erro ao assinar ranking:', error);
      return () => {};
    }
  },

  /**
   * Salvar resultado de partida e pontuação no Firestore
   */
  async recordMatchScore(params: {
    userId: string;
    score: number;
    xpGained: number;
    coinsGained: number;
    won: boolean;
    correctAnswers: number;
    totalQuestions: number;
    category: string;
  }): Promise<void> {
    try {
      if (!params.userId) return;

      // 1. Salvar histórico na coleção matches
      await addDoc(collection(db, 'matches'), {
        userId: params.userId,
        score: params.score,
        xpGained: params.xpGained,
        coinsGained: params.coinsGained,
        won: params.won,
        correctAnswers: params.correctAnswers,
        totalQuestions: params.totalQuestions,
        category: params.category,
        createdAt: serverTimestamp(),
      });

      // 2. Atualizar agregados no documento do usuário
      const userRef = doc(db, 'users', params.userId);
      await updateDoc(userRef, {
        totalXp: increment(params.xpGained),
        coins: increment(params.coinsGained),
        'stats.totalMatches': increment(1),
        'stats.totalWins': increment(params.won ? 1 : 0),
        'stats.totalCorrectAnswers': increment(params.correctAnswers),
        'stats.totalQuestionsAnswered': increment(params.totalQuestions),
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.warn('Erro ao salvar resultado da partida no Firestore:', error);
    }
  }
};
