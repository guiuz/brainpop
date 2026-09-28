import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut as fbSignOut, 
  sendPasswordResetEmail as fbSendPasswordResetEmail,
  updateProfile,
  signInAnonymously,
  GoogleAuthProvider,
  signInWithCredential,
  signInWithPopup,
  User as FirebaseUser
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { Platform } from 'react-native';
import Constants from 'expo-constants';
import { 
  GoogleSignin, 
  statusCodes 
} from '@react-native-google-signin/google-signin';
import { auth, db } from './firebase';
import { generateGuestName } from '../utils/guestName';

export interface FirebaseUserProfile {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  title: string;
  level: number;
  currentXp: number;
  totalXp: number;
  xpToNextLevel: number;
  coins: number;
  gems: number;
  lives: number;
  maxLives: number;
  dailyStreak: number;
  lastActiveDate?: string;
  lastDailyAdDate?: string;
  hasCompletedDailyChallengeToday?: boolean;
  nameChangesCount?: number;
  hasCompletedProfileTutorial?: boolean;
  duelTrophies?: number;
  duelWins?: number;
  duelLosses?: number;
  inventory?: {
    fiftyFifty: number;
    extraTime: number;
    skip: number;
    hint: number;
  };
  stats: {
    totalMatches: number;
    totalWins: number;
    totalCorrectAnswers: number;
    totalQuestionsAnswered: number;
    bestStreak: number;
    tournamentsWon?: number;
    tournamentsJoined?: number;
    categoryStats?: Record<string, { correct: number; total: number }>;
  };
  friends: string[];
  settings?: {
    soundEnabled: boolean;
    vibrationEnabled: boolean;
    notificationsEnabled: boolean;
  };
  createdAt?: any;
  updatedAt?: any;
}

export interface AuthResult {
  success: boolean;
  message: string;
  user?: FirebaseUserProfile;
  cancelled?: boolean;
}

/**
 * Obtém o Web Client ID configurado (OAuth 2.0 Aplicativo Web).
 * Prioriza variável de ambiente EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID e depois extra.googleWebClientId do app.config.ts.
 */
export const getGoogleWebClientId = (): string => {
  return (
    process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID ||
    Constants.expoConfig?.extra?.googleWebClientId ||
    ''
  ).trim();
};

/**
 * Registra diagnóstico estruturado de autenticação em ambiente de desenvolvimento (__DEV__).
 * Nunca registra tokens, senhas ou credenciais sensíveis.
 */
export const logAuthDiagnostic = (params: {
  provider: 'google' | 'password' | 'guest' | 'password_reset';
  step: 'play_services' | 'token_exchange' | 'credential_auth' | 'firestore_sync' | 'validation' | 'send_email';
  errorCode?: string;
  hasIdToken?: boolean;
  extra?: Record<string, unknown>;
}) => {
  if (__DEV__) {
    console.warn('[Auth Diagnostic]', {
      provider: params.provider,
      step: params.step,
      errorCode: params.errorCode || 'NONE',
      hasIdToken: Boolean(params.hasIdToken),
      ...params.extra,
    });
  }
};

/**
 * Traduz e normaliza códigos de erro do Firebase Auth e do Google Sign-In para mensagens claras em português.
 * Garante que mensagens cruas como "Firebase: Error (...)" nunca sejam exibidas ao usuário.
 */
export const mapAuthErrorToPortuguese = (
  error: unknown, 
  context: 'signUp' | 'signIn' | 'google' | 'guest' = 'signIn'
): string => {
  if (!error) return 'Ocorreu um erro inesperado. Tente novamente.';

  const err = error as { code?: string | number; message?: string };
  const errorCode = String(err.code || '');
  const rawMsg = err.message || '';

  // 1. Erros do Google Sign-In Nativo
  if (
    errorCode === statusCodes.SIGN_IN_CANCELLED || 
    errorCode === '12501' || 
    rawMsg.includes('SIGN_IN_CANCELLED') ||
    rawMsg.includes('canceled') ||
    rawMsg.includes('cancelado')
  ) {
    return 'Login com Google cancelado.';
  }

  if (
    errorCode === statusCodes.PLAY_SERVICES_NOT_AVAILABLE || 
    errorCode === 'PLAY_SERVICES_NOT_AVAILABLE' ||
    rawMsg.includes('PLAY_SERVICES_NOT_AVAILABLE')
  ) {
    return 'O Google Play Services não está disponível no dispositivo ou precisa ser atualizado.';
  }

  if (
    errorCode === statusCodes.IN_PROGRESS || 
    errorCode === 'ASYNC_OP_IN_PROGRESS' ||
    rawMsg.includes('IN_PROGRESS')
  ) {
    return 'O login já está em andamento. Aguarde um instante.';
  }

  if (
    errorCode === 'DEVELOPER_ERROR' || 
    errorCode === '10' || 
    rawMsg.includes('DEVELOPER_ERROR')
  ) {
    return 'Erro de configuração OAuth (DEVELOPER_ERROR). Verifique se o Web Client ID e o SHA-1 do keystore estão registrados no Firebase Console.';
  }

  // 2. Erros do Firebase Auth
  if (errorCode === 'auth/operation-not-allowed') {
    if (context === 'signUp') {
      return 'Não foi possível criar a conta neste momento. O método de cadastro ainda não está disponível. Tente novamente mais tarde.';
    }
    return 'Este método de autenticação não está habilitado no momento. Tente novamente mais tarde.';
  }

  if (errorCode === 'auth/email-already-in-use') {
    return 'Este e-mail já está cadastrado.';
  }

  if (errorCode === 'auth/invalid-email') {
    return 'Formato de e-mail inválido.';
  }

  if (errorCode === 'auth/weak-password') {
    return 'A senha deve ter pelo menos 6 caracteres.';
  }

  if (errorCode === 'auth/network-request-failed') {
    return 'Falha de conexão com a rede. Verifique sua internet.';
  }

  if (errorCode === 'auth/popup-closed-by-user') {
    return 'O login com Google foi cancelado antes de ser concluído.';
  }

  if (
    errorCode === 'auth/user-not-found' ||
    errorCode === 'auth/wrong-password' ||
    errorCode === 'auth/invalid-credential' ||
    errorCode === 'auth/invalid-login-credentials'
  ) {
    return 'E-mail ou senha incorretos.';
  }

  if (errorCode === 'auth/user-disabled') {
    return 'Esta conta foi desativada.';
  }

  if (errorCode === 'auth/too-many-requests') {
    return 'Muitas tentativas sem sucesso. Tente novamente mais tarde.';
  }

  if (errorCode === 'auth/popup-blocked') {
    return 'A janela de autenticação foi bloqueada pelo navegador.';
  }

  // Fallback seguro sem expor strings técnicas cruas do Firebase
  if (rawMsg && !rawMsg.includes('Firebase: Error') && !rawMsg.includes('auth/')) {
    return rawMsg;
  }

  return 'Falha ao autenticar. Verifique sua conexão e tente novamente.';
};

/**
 * Cria a estrutura inicial padronizada de perfil e inventário para novos usuários.
 */
export const createDefaultUserProfile = (
  userId: string, 
  name: string, 
  email = '', 
  photoUrl = ''
): FirebaseUserProfile => {
  const cleanName = name.trim() || 'Jogador BrainPOP';
  return {
    id: userId,
    name: cleanName,
    email: email.trim().toLowerCase(),
    avatarUrl: photoUrl || `https://api.dicebear.com/7.x/avataaars/png?seed=${encodeURIComponent(cleanName)}`,
    title: 'Novato',
    level: 1,
    currentXp: 0,
    totalXp: 0,
    xpToNextLevel: 300,
    coins: 500, // Bônus de boas-vindas
    gems: 15,
    lives: 5,
    maxLives: 5,
    dailyStreak: 1,
    nameChangesCount: 0,
    hasCompletedProfileTutorial: false,
    duelTrophies: 0,
    duelWins: 0,
    duelLosses: 0,
    inventory: {
      fiftyFifty: 3,
      extraTime: 2,
      skip: 2,
      hint: 1,
    },
    stats: {
      totalMatches: 0,
      totalWins: 0,
      totalCorrectAnswers: 0,
      totalQuestionsAnswered: 0,
      bestStreak: 0,
      tournamentsWon: 0,
      tournamentsJoined: 0,
      categoryStats: {},
    },
    friends: [],
    settings: {
      soundEnabled: true,
      vibrationEnabled: true,
      notificationsEnabled: true,
    },
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };
};

export const firebaseAuthService = {
  /**
   * Garante a existência do perfil no Firestore de forma única, padronizada e idempotente.
   * Utilizada em E-mail/Senha, Google e Convidado para garantir exatamente a mesma estrutura inicial.
   * Caso o Firestore falhe pontualmente, retorna o perfil estruturado sem derrubar a sessão do usuário.
   */
  async ensureUserProfile(
    fbUser: { uid: string; displayName?: string | null; email?: string | null; photoURL?: string | null },
    customName?: string
  ): Promise<FirebaseUserProfile> {
    const uid = fbUser.uid;
    const resolvedName = customName?.trim() || fbUser.displayName || (fbUser.email ? fbUser.email.split('@')[0] : '') || 'Jogador BrainPOP';
    const resolvedEmail = fbUser.email || '';
    const resolvedPhoto = fbUser.photoURL || '';

    const userDocRef = doc(db, 'users', uid);

    try {
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const existingProfile = userDoc.data() as FirebaseUserProfile;
        
        // Garante inventário íntegro em memória sem disparar updateDoc rejeitado por security rules
        if (!existingProfile.inventory) {
          existingProfile.inventory = { fiftyFifty: 3, extraTime: 2, skip: 2, hint: 1 };
        }

        // Auto-reparo de campos estritamente permitidos pela whitelist de regras do Firestore
        const updates: Partial<FirebaseUserProfile> = {};
        if (resolvedPhoto && (!existingProfile.avatarUrl || existingProfile.avatarUrl.includes('unsplash'))) {
          existingProfile.avatarUrl = resolvedPhoto;
          updates.avatarUrl = resolvedPhoto;
        }

        if (Object.keys(updates).length > 0) {
          updateDoc(userDocRef, updates).catch((err) => {
            console.warn('Idempotent profile update warning:', err);
          });
        }

        return existingProfile;
      }

      // Criação inicial padronizada (apenas para usuário novo)
      const newProfile = createDefaultUserProfile(uid, resolvedName, resolvedEmail, resolvedPhoto);
      await setDoc(userDocRef, newProfile);
      return newProfile;
    } catch (error) {
      console.warn('ensureUserProfile Firestore error (recovering locally):', error);
      
      // Bloqueio de recriação econômica: se o usuário já possui saldo e perfil local no Zustand,
      // preserva rigorosamente seu patrimônio (moedas, gemas, inventário, XP) em vez de resetar para 500
      try {
        const { useUserStore } = require('../store/useUserStore');
        const localUser = useUserStore.getState();
        if (localUser && localUser.id === uid && localUser.coins !== undefined) {
          console.warn('[ensureUserProfile] Falha ao consultar Firestore; economia local protegida contra recriação.');
          return {
            ...createDefaultUserProfile(uid, resolvedName, resolvedEmail, resolvedPhoto),
            coins: localUser.coins,
            gems: localUser.gems,
            lives: localUser.lives,
            inventory: localUser.inventory || { fiftyFifty: 3, extraTime: 2, skip: 2, hint: 1 },
            stats: localUser.stats,
            level: localUser.level,
            totalXp: localUser.totalXp,
            currentXp: localUser.currentXp,
            duelTrophies: localUser.duelTrophies,
            duelWins: localUser.duelWins,
            duelLosses: localUser.duelLosses,
          };
        }
      } catch (storeErr) {
        console.warn('Falha ao inspecionar estado local:', storeErr);
      }

      return createDefaultUserProfile(uid, resolvedName, resolvedEmail, resolvedPhoto);
    }
  },

  /**
   * Cadastro com E-mail e Senha no Firebase Auth + Firestore
   */
  async signUpWithEmail(name: string, email: string, password: string): Promise<AuthResult> {
    const cleanEmail = email.trim().toLowerCase();
    const cleanName = name.trim();

    if (!cleanName || cleanName.length < 3) {
      return { success: false, message: 'O nome de jogador deve ter pelo menos 3 caracteres.' };
    }
    if (!cleanEmail || !cleanEmail.includes('@')) {
      return { success: false, message: 'Formato de e-mail inválido.' };
    }
    if (!password || password.length < 6) {
      return { success: false, message: 'A senha deve ter pelo menos 6 caracteres.' };
    }

    let createdUser: FirebaseUser | null = null;

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, cleanEmail, password);
      createdUser = userCredential.user;

      await updateProfile(createdUser, { displayName: cleanName }).catch((err) => {
        console.warn('updateProfile warning during sign up:', err);
      });

      const profile = await this.ensureUserProfile(createdUser, cleanName);

      return {
        success: true,
        message: 'Conta criada com sucesso no Firebase!',
        user: profile,
      };
    } catch (error: unknown) {
      // Se a conta já tiver sido criada com sucesso no Auth mas o Firestore/perfil falhar,
      // não induz o usuário a recriar a conta; mantém o login válido e repara o perfil.
      if (createdUser) {
        console.warn('Sign up Auth succeeded but follow-up failed. Repairing session idempotently:', error);
        const fallbackProfile = createDefaultUserProfile(createdUser.uid, cleanName, cleanEmail);
        return {
          success: true,
          message: 'Conta criada com sucesso no Firebase!',
          user: fallbackProfile,
        };
      }

      const msg = mapAuthErrorToPortuguese(error, 'signUp');
      return { success: false, message: msg };
    }
  },

  /**
   * Login com E-mail e Senha
   */
  async signInWithEmail(email: string, password: string): Promise<AuthResult> {
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail || !cleanEmail.includes('@')) {
      return { success: false, message: 'Formato de e-mail inválido.' };
    }
    if (!password) {
      return { success: false, message: 'Digite sua senha.' };
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, cleanEmail, password);
      const fbUser = userCredential.user;

      const profile = await this.ensureUserProfile(fbUser);

      return {
        success: true,
        message: `Bem-vindo de volta, ${profile.name}!`,
        user: profile,
      };
    } catch (error: unknown) {
      const msg = mapAuthErrorToPortuguese(error, 'signIn');
      return { success: false, message: msg };
    }
  },

  /**
   * Envio de e-mail de recuperação de senha.
   * - Valida o formato do e-mail antes da chamada.
   * - Utiliza o alias fbSendPasswordResetEmail para evitar conflito de nomes.
   * - Mantém resposta neutra para conta inexistente (evita enumeração de contas).
   * - Trata rede e excesso de tentativas.
   */
  async sendPasswordResetEmail(email: string): Promise<{ success: boolean; message: string }> {
    const cleanEmail = email?.trim().toLowerCase() || '';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!cleanEmail || !emailRegex.test(cleanEmail)) {
      return { success: false, message: 'Formato de e-mail inválido.' };
    }

    try {
      await fbSendPasswordResetEmail(auth, cleanEmail);
      return {
        success: true,
        message: 'Se existir uma conta com este e-mail, enviaremos as instruções de redefinição.',
      };
    } catch (error: any) {
      const errorCode = error?.code || '';

      // Proteção contra enumeração de contas: user-not-found responde com sucesso neutro
      if (errorCode === 'auth/user-not-found') {
        return {
          success: true,
          message: 'Se existir uma conta com este e-mail, enviaremos as instruções de redefinição.',
        };
      }

      if (errorCode === 'auth/invalid-email') {
        return { success: false, message: 'Formato de e-mail inválido.' };
      }

      if (errorCode === 'auth/too-many-requests') {
        return {
          success: false,
          message: 'Muitas tentativas. Aguarde alguns instantes antes de tentar novamente.',
        };
      }

      if (errorCode === 'auth/network-request-failed') {
        return {
          success: false,
          message: 'Falha de conexão com a rede. Verifique sua internet.',
        };
      }

      return {
        success: false,
        message: 'Não foi possível enviar o e-mail de recuperação. Tente novamente mais tarde.',
      };
    }
  },

  /**
   * Login Real com Google:
   * - Web: utiliza signInWithPopup(auth, provider).
   * - Android / iOS: utiliza @react-native-google-signin/google-signin para obter o idToken nativo,
   *   gerar a credencial GoogleAuthProvider.credential(idToken) e autenticar com signInWithCredential(auth, credential).
   * - Nunca autentica anonimamente um usuário Google e não gera identidades falsas.
   */
  async signInWithGoogle(): Promise<AuthResult> {
    try {
      let fbUser: FirebaseUser;

      if (Platform.OS === 'web') {
        const provider = new GoogleAuthProvider();
        provider.setCustomParameters({ prompt: 'select_account' });
        const result = await signInWithPopup(auth, provider);
        fbUser = result.user;
      } else {
        // Dispositivos Móveis (Android / iOS)
        const webClientId = getGoogleWebClientId();

        if (!webClientId) {
          return {
            success: false,
            message: 'Configuração do Google Sign-In ausente. A variável EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID (OAuth Client ID do tipo Aplicativo Web) não está configurada.',
          };
        }

        try {
          GoogleSignin.configure({
            webClientId,
            offlineAccess: false,
          });

          await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
          const signInResponse = await GoogleSignin.signIn();

          // Trata estrutura de resposta do Google Sign-in v12/v13 (data.idToken ou idToken)
          const idToken = (signInResponse as any)?.data?.idToken || (signInResponse as any)?.idToken;

          if (!idToken) {
            return {
              success: false,
              message: 'Não foi possível validar as credenciais do Google. Token não recebido.',
            };
          }

          const credential = GoogleAuthProvider.credential(idToken);
          const userCredential = await signInWithCredential(auth, credential);
          fbUser = userCredential.user;
        } catch (nativeErr: any) {
          // Trata cancelamento voluntário do usuário sem exibir erro alarmante
          if (
            nativeErr?.code === statusCodes.SIGN_IN_CANCELLED ||
            nativeErr?.code === '12501' ||
            String(nativeErr?.message || '').includes('SIGN_IN_CANCELLED') ||
            String(nativeErr?.message || '').includes('canceled')
          ) {
            return {
              success: false,
              cancelled: true,
              message: 'Login com Google cancelado.',
            };
          }

          throw nativeErr;
        }
      }

      const profile = await this.ensureUserProfile(fbUser);

      return {
        success: true,
        message: `Bem-vindo ao BrainPOP, ${profile.name}!`,
        user: profile,
      };
    } catch (error: any) {
      if (
        error?.code === statusCodes?.SIGN_IN_CANCELLED ||
        error?.code === '12501' ||
        String(error?.message || '').includes('SIGN_IN_CANCELLED') ||
        String(error?.message || '').includes('canceled') ||
        error?.code === 'auth/popup-closed-by-user'
      ) {
        return {
          success: false,
          cancelled: true,
          message: 'Login com Google cancelado.',
        };
      }

      const msg = mapAuthErrorToPortuguese(error, 'google');
      return { success: false, message: msg };
    }
  },

  /**
   * Login como Convidado / Anônimo Real no Firebase Auth
   * Se a autenticação anônima falhar ou estiver desativada no console, retorna erro estrito e não cria UID local falso.
   */
  async signInAsGuest(customName?: string): Promise<AuthResult> {
    try {
      const userCredential = await signInAnonymously(auth);
      const fbUser = userCredential.user;
      const name = customName || fbUser.displayName || generateGuestName();

      await updateProfile(fbUser, { displayName: name }).catch((err) => {
        console.warn('updateProfile guest warning:', err);
      });

      const profile = await this.ensureUserProfile(fbUser, name);

      return {
        success: true,
        message: `Entrando como ${profile.name}`,
        user: profile,
      };
    } catch (error: unknown) {
      const msg = mapAuthErrorToPortuguese(error, 'guest');
      return { success: false, message: msg };
    }
  },

  /**
   * Logout unificado do Firebase Auth e desconexão do Google Sign-In
   */
  async signOut(): Promise<void> {
    try {
      if (Platform.OS !== 'web') {
        try {
          await GoogleSignin.signOut();
        } catch {
          // Ignora se não houver sessão do Google aberta
        }
      }
      await fbSignOut(auth);
    } catch (e) {
      console.warn('Erro ao sair:', e);
    }
  },

  /**
   * Atualizar dados de perfil no Firestore
   */
  async updateProfileData(userId: string, data: Partial<FirebaseUserProfile>): Promise<void> {
    try {
      if (!userId) return;
      await updateDoc(doc(db, 'users', userId), {
        ...data,
        updatedAt: serverTimestamp(),
      });
    } catch (e) {
      console.warn('Erro ao atualizar perfil no Firestore:', e);
    }
  },

  /**
   * Buscar perfil completo do usuário pelo ID
   */
  async getUserProfileById(userId: string): Promise<FirebaseUserProfile | null> {
    try {
      if (!userId) return null;
      const userDoc = await getDoc(doc(db, 'users', userId));
      if (userDoc.exists()) {
        return userDoc.data() as FirebaseUserProfile;
      }
      return null;
    } catch (e) {
      console.warn('Erro ao buscar perfil do Firestore:', e);
      return null;
    }
  }
};
