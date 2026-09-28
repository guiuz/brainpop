import { firebaseAuthService } from '../firebaseAuthService';
import { sendPasswordResetEmail as fbSendPasswordResetEmail } from 'firebase/auth';

describe('firebaseAuthService — Redefinição de Senha (sendPasswordResetEmail)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve validar e rejeitar e-mail inválido antes de chamar o Firebase', async () => {
    const invalidEmails = ['', '   ', 'usuario', 'usuario@', 'usuario@dominio', '@dominio.com'];

    for (const email of invalidEmails) {
      const result = await firebaseAuthService.sendPasswordResetEmail(email);
      expect(result.success).toBe(false);
      expect(result.message).toBe('Formato de e-mail inválido.');
      expect(fbSendPasswordResetEmail).not.toHaveBeenCalled();
    }
  });

  it('deve enviar e-mail com sucesso para formato válido', async () => {
    (fbSendPasswordResetEmail as jest.Mock).mockResolvedValueOnce(undefined);

    const result = await firebaseAuthService.sendPasswordResetEmail('jogador@brainpop.com');

    expect(fbSendPasswordResetEmail).toHaveBeenCalledTimes(1);
    expect(fbSendPasswordResetEmail).toHaveBeenCalledWith(
      expect.anything(),
      'jogador@brainpop.com'
    );
    expect(result.success).toBe(true);
    expect(result.message).toBe(
      'Se existir uma conta com este e-mail, enviaremos as instruções de redefinição.'
    );
  });

  it('deve retornar resposta neutra de sucesso para conta inexistente (proteção contra enumeração)', async () => {
    (fbSendPasswordResetEmail as jest.Mock).mockRejectedValueOnce({
      code: 'auth/user-not-found',
    });

    const result = await firebaseAuthService.sendPasswordResetEmail('naoexiste@brainpop.com');

    expect(result.success).toBe(true);
    expect(result.message).toBe(
      'Se existir uma conta com este e-mail, enviaremos as instruções de redefinição.'
    );
  });

  it('deve tratar erro de excesso de tentativas (too-many-requests)', async () => {
    (fbSendPasswordResetEmail as jest.Mock).mockRejectedValueOnce({
      code: 'auth/too-many-requests',
    });

    const result = await firebaseAuthService.sendPasswordResetEmail('jogador@brainpop.com');

    expect(result.success).toBe(false);
    expect(result.message).toBe(
      'Muitas tentativas. Aguarde alguns instantes antes de tentar novamente.'
    );
  });

  it('deve tratar falha de conexão de rede (network-request-failed)', async () => {
    (fbSendPasswordResetEmail as jest.Mock).mockRejectedValueOnce({
      code: 'auth/network-request-failed',
    });

    const result = await firebaseAuthService.sendPasswordResetEmail('jogador@brainpop.com');

    expect(result.success).toBe(false);
    expect(result.message).toBe('Falha de conexão com a rede. Verifique sua internet.');
  });

  it('deve tratar erros genéricos inesperados com mensagem amigável', async () => {
    (fbSendPasswordResetEmail as jest.Mock).mockRejectedValueOnce(new Error('Internal error'));

    const result = await firebaseAuthService.sendPasswordResetEmail('jogador@brainpop.com');

    expect(result.success).toBe(false);
    expect(result.message).toBe(
      'Não foi possível enviar o e-mail de recuperação. Tente novamente mais tarde.'
    );
  });
});
