import { firebaseAuthService, mapAuthErrorToPortuguese, createDefaultUserProfile } from '../firebaseAuthService';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signInAnonymously,
  signInWithCredential,
  signInWithPopup,
  GoogleAuthProvider,
  signOut
} from 'firebase/auth';
import { getDoc, setDoc } from 'firebase/firestore';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import { Platform } from 'react-native';

describe('firebaseAuthService — Arquitetura de Autenticação e Tratamento de Erros', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('ensureUserProfile — Idempotência e Padronização de Perfis', () => {
    it('deve retornar o perfil existente quando o documento já existir no Firestore', async () => {
      const mockProfile = createDefaultUserProfile('user-123', 'Jogador Experiente', 'exp@brainpop.com');
      (getDoc as jest.Mock).mockResolvedValueOnce({
        exists: () => true,
        data: () => mockProfile,
      });

      const profile = await firebaseAuthService.ensureUserProfile({
        uid: 'user-123',
        displayName: 'Jogador Experiente',
        email: 'exp@brainpop.com',
      });

      expect(profile.id).toBe('user-123');
      expect(profile.name).toBe('Jogador Experiente');
      expect(profile.coins).toBe(500);
      expect(profile.inventory?.fiftyFifty).toBe(3);
    });

    it('deve criar e salvar perfil padrão unificado quando o usuário for novo', async () => {
      (getDoc as jest.Mock).mockResolvedValueOnce({
        exists: () => false,
      });

      const profile = await firebaseAuthService.ensureUserProfile({
        uid: 'user-novo',
        displayName: 'Novo Atleta',
        email: 'novo@brainpop.com',
      });

      expect(setDoc).toHaveBeenCalledTimes(1);
      expect(profile.id).toBe('user-novo');
      expect(profile.name).toBe('Novo Atleta');
      expect(profile.title).toBe('Novato');
      expect(profile.level).toBe(1);
      expect(profile.inventory).toEqual({
        fiftyFifty: 3,
        extraTime: 2,
        skip: 2,
        hint: 1,
      });
    });

    it('deve se recuperar resilientemente caso o Firestore falhe ao persistir o perfil', async () => {
      (getDoc as jest.Mock).mockRejectedValueOnce(new Error('Firestore offline'));

      const profile = await firebaseAuthService.ensureUserProfile({
        uid: 'user-offline',
        displayName: 'Jogador Resiliente',
        email: 'resiliente@brainpop.com',
      });

      expect(profile.id).toBe('user-offline');
      expect(profile.name).toBe('Jogador Resiliente');
      expect(profile.coins).toBe(500);
    });
  });

  describe('Parte 1 — Cadastro e Login com E-mail/Senha', () => {
    it('deve cadastrar usuário com sucesso e salvar perfil no Firestore', async () => {
      const mockUser = {
        uid: 'uid-email-1',
        displayName: 'Estudante',
        email: 'estudante@brainpop.com',
      };
      (createUserWithEmailAndPassword as jest.Mock).mockResolvedValueOnce({
        user: mockUser,
      });
      (getDoc as jest.Mock).mockResolvedValueOnce({
        exists: () => false,
      });

      const res = await firebaseAuthService.signUpWithEmail('Estudante', 'estudante@brainpop.com', 'senhaForte123');
      expect(res.success).toBe(true);
      expect(res.user?.id).toBe('uid-email-1');
      expect(res.user?.email).toBe('estudante@brainpop.com');
      expect(res.message).toBe('Conta criada com sucesso no Firebase!');
    });

    it('deve retornar mensagem amigável exata quando operation-not-allowed ocorrer no cadastro', async () => {
      (createUserWithEmailAndPassword as jest.Mock).mockRejectedValueOnce({
        code: 'auth/operation-not-allowed',
        message: 'Firebase: Error (auth/operation-not-allowed).',
      });

      const res = await firebaseAuthService.signUpWithEmail('Teste', 'desabilitado@brainpop.com', '123456');
      expect(res.success).toBe(false);
      expect(res.message).toBe(
        'Não foi possível criar a conta neste momento. O método de cadastro ainda não está disponível. Tente novamente mais tarde.'
      );
      expect(res.message).not.toContain('Firebase: Error');
    });

    it('deve retornar erro em português quando o e-mail já estiver cadastrado', async () => {
      (createUserWithEmailAndPassword as jest.Mock).mockRejectedValueOnce({
        code: 'auth/email-already-in-use',
      });

      const res = await firebaseAuthService.signUpWithEmail('Teste', 'duplicado@brainpop.com', '123456');
      expect(res.success).toBe(false);
      expect(res.message).toBe('Este e-mail já está cadastrado.');
    });

    it('deve validar e rejeitar entradas inválidas no cliente', async () => {
      const resNome = await firebaseAuthService.signUpWithEmail('ab', 'valido@brainpop.com', '123456');
      expect(resNome.success).toBe(false);
      expect(resNome.message).toContain('pelo menos 3 caracteres');

      const resEmail = await firebaseAuthService.signUpWithEmail('Valido', 'emailinvalido', '123456');
      expect(resEmail.success).toBe(false);
      expect(resEmail.message).toBe('Formato de e-mail inválido.');

      const resSenha = await firebaseAuthService.signUpWithEmail('Valido', 'valido@brainpop.com', '123');
      expect(resSenha.success).toBe(false);
      expect(resSenha.message).toBe('A senha deve ter pelo menos 6 caracteres.');
    });

    it('deve manter o login válido de forma idempotente se o Auth criar a conta mas o Firestore falhar', async () => {
      const mockUser = {
        uid: 'uid-reparo',
        displayName: 'Jogador Recuperado',
        email: 'reparo@brainpop.com',
      };
      (createUserWithEmailAndPassword as jest.Mock).mockResolvedValueOnce({
        user: mockUser,
      });
      // Simulando falha do Firestore durante o cadastro
      (getDoc as jest.Mock).mockRejectedValueOnce(new Error('Network error on Firestore'));

      const res = await firebaseAuthService.signUpWithEmail('Jogador Recuperado', 'reparo@brainpop.com', '123456');
      expect(res.success).toBe(true);
      expect(res.user?.id).toBe('uid-reparo');
      expect(res.user?.name).toBe('Jogador Recuperado');
    });

    it('deve realizar login por e-mail com sucesso e buscar perfil', async () => {
      const mockUser = {
        uid: 'uid-login-1',
        displayName: 'Veterano',
        email: 'veterano@brainpop.com',
      };
      (signInWithEmailAndPassword as jest.Mock).mockResolvedValueOnce({
        user: mockUser,
      });
      (getDoc as jest.Mock).mockResolvedValueOnce({
        exists: () => true,
        data: () => createDefaultUserProfile('uid-login-1', 'Veterano', 'veterano@brainpop.com'),
      });

      const res = await firebaseAuthService.signInWithEmail('veterano@brainpop.com', 'senha123');
      expect(res.success).toBe(true);
      expect(res.user?.id).toBe('uid-login-1');
      expect(res.message).toBe('Bem-vindo de volta, Veterano!');
    });
  });

  describe('Parte 2 — Autenticação Google Nativa (Android/Mobile) e Web', () => {
    it('deve autenticar com Google nativo no Android via idToken e signInWithCredential', async () => {
      Platform.OS = 'android';
      (GoogleSignin.signIn as jest.Mock).mockResolvedValueOnce({
        data: {
          idToken: 'mock-google-id-token-xyz',
        },
      });

      const mockFbUser = {
        uid: 'uid-google-android',
        displayName: 'Google Player',
        email: 'google@gmail.com',
        photoURL: 'https://lh3.googleusercontent.com/photo.jpg',
      };

      (signInWithCredential as jest.Mock).mockResolvedValueOnce({
        user: mockFbUser,
      });
      (getDoc as jest.Mock).mockResolvedValueOnce({
        exists: () => false,
      });

      const res = await firebaseAuthService.signInWithGoogle();

      expect(GoogleSignin.configure).toHaveBeenCalled();
      expect(GoogleSignin.hasPlayServices).toHaveBeenCalled();
      expect(GoogleAuthProvider.credential).toHaveBeenCalledWith('mock-google-id-token-xyz');
      expect(signInWithCredential).toHaveBeenCalled();
      expect(res.success).toBe(true);
      expect(res.user?.id).toBe('uid-google-android');
      expect(res.user?.name).toBe('Google Player');
      expect(res.user?.email).toBe('google@gmail.com');
    });

    it('deve tratar cancelamento do Google no Android sem exibir erro alarmante e com flag cancelled: true', async () => {
      Platform.OS = 'android';
      (GoogleSignin.signIn as jest.Mock).mockRejectedValueOnce({
        code: statusCodes.SIGN_IN_CANCELLED,
        message: 'Sign in cancelled by user',
      });

      const res = await firebaseAuthService.signInWithGoogle();
      expect(res.success).toBe(false);
      expect(res.cancelled).toBe(true);
      expect(res.message).toBe('Login com Google cancelado.');
    });

    it('deve tratar falta do Google Play Services com mensagem específica', async () => {
      Platform.OS = 'android';
      (GoogleSignin.hasPlayServices as jest.Mock).mockRejectedValueOnce({
        code: statusCodes.PLAY_SERVICES_NOT_AVAILABLE,
        message: 'Play services not available',
      });

      const res = await firebaseAuthService.signInWithGoogle();
      expect(res.success).toBe(false);
      expect(res.message).toBe('O Google Play Services não está disponível no dispositivo ou precisa ser atualizado.');
    });

    it('deve tratar erro de DEVELOPER_ERROR / OAuth mal configurado no Google Sign-In', async () => {
      Platform.OS = 'android';
      (GoogleSignin.signIn as jest.Mock).mockRejectedValueOnce({
        code: 'DEVELOPER_ERROR',
        message: 'Developer error',
      });

      const res = await firebaseAuthService.signInWithGoogle();
      expect(res.success).toBe(false);
      expect(res.message).toContain('Erro de configuração OAuth (DEVELOPER_ERROR)');
    });

    it('deve autenticar com Google na Web via signInWithPopup', async () => {
      Platform.OS = 'web';
      const mockFbUser = {
        uid: 'uid-google-web',
        displayName: 'Web Player',
        email: 'web@gmail.com',
      };
      (signInWithPopup as jest.Mock).mockResolvedValueOnce({
        user: mockFbUser,
      });
      (getDoc as jest.Mock).mockResolvedValueOnce({
        exists: () => false,
      });

      const res = await firebaseAuthService.signInWithGoogle();
      expect(signInWithPopup).toHaveBeenCalled();
      expect(res.success).toBe(true);
      expect(res.user?.id).toBe('uid-google-web');
    });
  });

  describe('Parte 3 — Convidado (Anonymous Auth Real)', () => {
    it('deve autenticar como convidado real no Firebase Auth com signInAnonymously', async () => {
      const mockFbUser = {
        uid: 'uid-anonimo-real',
        displayName: 'Mestre 450',
      };
      (signInAnonymously as jest.Mock).mockResolvedValueOnce({
        user: mockFbUser,
      });
      (getDoc as jest.Mock).mockResolvedValueOnce({
        exists: () => false,
      });

      const res = await firebaseAuthService.signInAsGuest('Mestre 450');
      expect(signInAnonymously).toHaveBeenCalled();
      expect(res.success).toBe(true);
      expect(res.user?.id).toBe('uid-anonimo-real');
      expect(res.user?.name).toBe('Mestre 450');
    });

    it('deve bloquear e retornar erro se Anonymous Auth falhar, SEM criar UID local falso', async () => {
      (signInAnonymously as jest.Mock).mockRejectedValueOnce({
        code: 'auth/operation-not-allowed',
        message: 'Operation not allowed',
      });

      const res = await firebaseAuthService.signInAsGuest();
      expect(res.success).toBe(false);
      expect(res.user).toBeUndefined();
      expect(res.message).toBe('Este método de autenticação não está habilitado no momento. Tente novamente mais tarde.');
    });
  });

  describe('Parte 4 — Logout e Mensagens de Erro Sanitizadas', () => {
    it('deve deslogar do Firebase Auth e desconectar sessão do Google', async () => {
      Platform.OS = 'android';
      await firebaseAuthService.signOut();
      expect(GoogleSignin.signOut).toHaveBeenCalled();
      expect(signOut).toHaveBeenCalled();
    });

    it('mapAuthErrorToPortuguese não deve vazar strings cruas do Firebase', () => {
      const msg = mapAuthErrorToPortuguese({
        code: 'auth/network-request-failed',
        message: 'Firebase: Error (auth/network-request-failed).',
      });
      expect(msg).toBe('Falha de conexão com a rede. Verifique sua internet.');
      expect(msg).not.toContain('Firebase:');
    });
  });
});
