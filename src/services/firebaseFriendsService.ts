import { 
  collection, 
  query, 
  where, 
  getDocs, 
  doc, 
  getDoc, 
  updateDoc, 
  arrayUnion, 
  arrayRemove 
} from 'firebase/firestore';
import { db } from './firebase';

export interface FriendUser {
  id: string;
  name: string;
  avatar: string;
  level: number;
  title: string;
  status: string;
  statusColor?: string;
  online: boolean;
  playing: boolean;
  totalXp: number;
}

export const firebaseFriendsService = {
  /**
   * Buscar lista de amigos de um usuário no Firestore
   */
  async getFriendsList(userId: string): Promise<FriendUser[]> {
    try {
      if (!userId) return [];

      const userDoc = await getDoc(doc(db, 'users', userId));
      if (!userDoc.exists()) return [];

      const friendIds: string[] = userDoc.data()?.friends || [];
      if (friendIds.length === 0) return [];

      const friends: FriendUser[] = [];

      for (const fId of friendIds) {
        const fDoc = await getDoc(doc(db, 'users', fId));
        if (fDoc.exists()) {
          const data = fDoc.data();
          const isOnline = Math.random() > 0.4;
          const isPlaying = isOnline && Math.random() > 0.5;

          friends.push({
            id: fDoc.id,
            name: data.name || 'Amigo',
            avatar: data.avatarUrl || `https://api.dicebear.com/7.x/avataaars/png?seed=${fDoc.id}`,
            level: data.level || 1,
            title: data.title || 'Curioso',
            status: isPlaying ? 'Jogando agora 🎮' : isOnline ? 'Online' : 'Recente',
            online: isOnline,
            playing: isPlaying,
            totalXp: data.totalXp || 0,
          });
        }
      }

      return friends;
    } catch (error) {
      console.warn('Erro ao carregar amigos:', error);
      return [];
    }
  },

  /**
   * Adicionar amigo por ID ou Nome/E-mail
   */
  async addFriend(userId: string, targetQuery: string): Promise<{ success: boolean; message: string; friend?: FriendUser }> {
    try {
      if (!userId) return { success: false, message: 'Usuário não autenticado.' };
      const cleanTarget = targetQuery.trim();

      if (!cleanTarget) return { success: false, message: 'Insira um ID, nome ou e-mail válido.' };

      // 1. Tentar por ID exato
      let targetDoc = await getDoc(doc(db, 'users', cleanTarget));
      let targetId = targetDoc.exists() ? cleanTarget : null;

      // 2. Se não encontrou por ID, buscar por e-mail ou nome
      if (!targetDoc.exists()) {
        const qEmail = query(collection(db, 'users'), where('email', '==', cleanTarget.toLowerCase()));
        const snapEmail = await getDocs(qEmail);

        if (!snapEmail.empty) {
          targetDoc = snapEmail.docs[0];
          targetId = targetDoc.id;
        } else {
          const qName = query(collection(db, 'users'), where('name', '==', cleanTarget));
          const snapName = await getDocs(qName);
          if (!snapName.empty) {
            targetDoc = snapName.docs[0];
            targetId = targetDoc.id;
          }
        }
      }

      if (!targetDoc.exists() || !targetId) {
        return { success: false, message: 'Jogador não encontrado no BrainPOP.' };
      }

      if (targetId === userId) {
        return { success: false, message: 'Você não pode adicionar a si mesmo como amigo.' };
      }

      // Adicionar aos amigos de ambos
      await updateDoc(doc(db, 'users', userId), {
        friends: arrayUnion(targetId),
      });

      await updateDoc(doc(db, 'users', targetId), {
        friends: arrayUnion(userId),
      });

      const data = targetDoc.data();
      const friendData: FriendUser = {
        id: targetId,
        name: data?.name || 'Novo Amigo',
        avatar: data?.avatarUrl || `https://api.dicebear.com/7.x/avataaars/png?seed=${targetId}`,
        level: data?.level || 1,
        title: data?.title || 'Curioso',
        status: 'Online',
        online: true,
        playing: false,
        totalXp: data?.totalXp || 0,
      };

      return {
        success: true,
        message: `${friendData.name} foi adicionado à sua lista de amigos!`,
        friend: friendData,
      };
    } catch (error: any) {
      return { success: false, message: error.message || 'Falha ao adicionar amigo.' };
    }
  },

  /**
   * Remover amigo
   */
  async removeFriend(userId: string, friendId: string): Promise<boolean> {
    try {
      await updateDoc(doc(db, 'users', userId), {
        friends: arrayRemove(friendId),
      });
      await updateDoc(doc(db, 'users', friendId), {
        friends: arrayRemove(userId),
      });
      return true;
    } catch (e) {
      console.warn('Erro ao remover amigo:', e);
      return false;
    }
  }
};
