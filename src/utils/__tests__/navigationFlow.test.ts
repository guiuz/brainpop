import { resolveInitialRoute } from '../navigationFlow';
import { useUserStore } from '../../store/useUserStore';

describe('Navigation Flow & Route Resolution Logic', () => {
  describe('Função Pura resolveInitialRoute', () => {
    it('deve direcionar para /onboarding em instalação nova sem sessão', () => {
      const route = resolveInitialRoute({
        hasCompletedOnboarding: false,
        hasConfiguredInitialPermissions: false,
        hasValidSession: false,
      });
      expect(route).toBe('/onboarding');
    });

    it('deve direcionar para /permissions quando onboarding estiver concluído mas permissões pendentes', () => {
      const route = resolveInitialRoute({
        hasCompletedOnboarding: true,
        hasConfiguredInitialPermissions: false,
        hasValidSession: false,
      });
      expect(route).toBe('/permissions');
    });

    it('deve direcionar para /login quando onboarding e permissões estiverem configurados e não houver sessão ativa', () => {
      const route = resolveInitialRoute({
        hasCompletedOnboarding: true,
        hasConfiguredInitialPermissions: true,
        hasValidSession: false,
      });
      expect(route).toBe('/login');
    });

    it('deve direcionar para /home quando houver sessão autenticada válida', () => {
      const route = resolveInitialRoute({
        hasCompletedOnboarding: true,
        hasConfiguredInitialPermissions: true,
        hasValidSession: true,
      });
      expect(route).toBe('/home');
    });

    it('deve priorizar sessão ativa para /home mesmo se flags locais estiverem inconsistentes', () => {
      const route = resolveInitialRoute({
        hasCompletedOnboarding: false,
        hasConfiguredInitialPermissions: false,
        hasValidSession: true,
      });
      expect(route).toBe('/home');
    });
  });

  describe('Integração com useUserStore (Persistência e Lifecycle)', () => {
    beforeEach(() => {
      useUserStore.getState().resetGameProgress();
    });

    it('deve inicializar flags de primeiro acesso como falsas no reset inicial', () => {
      const state = useUserStore.getState();
      expect(state.hasCompletedOnboarding).toBe(false);
      expect(state.hasConfiguredInitialPermissions).toBe(false);
    });

    it('deve registrar conclusão do onboarding no store', () => {
      useUserStore.getState().setHasCompletedOnboarding(true);
      expect(useUserStore.getState().hasCompletedOnboarding).toBe(true);
      expect(useUserStore.getState().hasConfiguredInitialPermissions).toBe(false);
    });

    it('deve registrar configuração de permissões no store', () => {
      useUserStore.getState().setHasCompletedOnboarding(true);
      useUserStore.getState().setHasConfiguredInitialPermissions(true);
      expect(useUserStore.getState().hasCompletedOnboarding).toBe(true);
      expect(useUserStore.getState().hasConfiguredInitialPermissions).toBe(true);
    });

    it('deve preservar as flags de onboarding e permissões após logout', () => {
      // Simula usuário que completou primeiro acesso e fez login
      const store = useUserStore.getState();
      store.setHasCompletedOnboarding(true);
      store.setHasConfiguredInitialPermissions(true);
      store.login({
        id: 'user_123',
        name: 'Jogador Teste',
        email: 'teste@brainpop.app',
      });

      expect(useUserStore.getState().isLoggedIn).toBe(true);

      // Executa logout
      useUserStore.getState().logout();

      const stateAfterLogout = useUserStore.getState();
      expect(stateAfterLogout.isLoggedIn).toBe(false);
      expect(stateAfterLogout.hasCompletedOnboarding).toBe(true);
      expect(stateAfterLogout.hasConfiguredInitialPermissions).toBe(true);

      // Verifica que a resolução pós-logout vai para login e não repete onboarding
      const nextRoute = resolveInitialRoute({
        hasCompletedOnboarding: stateAfterLogout.hasCompletedOnboarding,
        hasConfiguredInitialPermissions: stateAfterLogout.hasConfiguredInitialPermissions,
        hasValidSession: stateAfterLogout.isLoggedIn,
      });
      expect(nextRoute).toBe('/login');
    });

    it('deve PRESERVAR as flags de onboarding e permissões no resetGameProgress', () => {
      const store = useUserStore.getState();
      store.setHasCompletedOnboarding(true);
      store.setHasConfiguredInitialPermissions(true);

      expect(useUserStore.getState().hasCompletedOnboarding).toBe(true);

      // Reset de progresso do jogo
      store.resetGameProgress();

      const stateAfterReset = useUserStore.getState();
      expect(stateAfterReset.hasCompletedOnboarding).toBe(true);
      expect(stateAfterReset.hasConfiguredInitialPermissions).toBe(true);
    });

    it('deve redefinir flags de onboarding e permissões no resetApplicationData (limpeza total da instalação)', () => {
      const store = useUserStore.getState();
      store.setHasCompletedOnboarding(true);
      store.setHasConfiguredInitialPermissions(true);

      // Limpeza completa da aplicação
      store.resetApplicationData();

      const stateAfterFullReset = useUserStore.getState();
      expect(stateAfterFullReset.hasCompletedOnboarding).toBe(false);
      expect(stateAfterFullReset.hasConfiguredInitialPermissions).toBe(false);

      const nextRoute = resolveInitialRoute({
        hasCompletedOnboarding: stateAfterFullReset.hasCompletedOnboarding,
        hasConfiguredInitialPermissions: stateAfterFullReset.hasConfiguredInitialPermissions,
        hasValidSession: false,
      });
      expect(nextRoute).toBe('/onboarding');
    });

    it('deve persistir opções de som e notificações na tela de permissões', () => {
      const { updateSettings } = useUserStore.getState();
      updateSettings({
        notificationsEnabled: false,
        soundEnabled: true,
      });

      const updated = useUserStore.getState();
      expect(updated.settings.notificationsEnabled).toBe(false);
      expect(updated.settings.soundEnabled).toBe(true);
      expect(updated.settings.vibrationEnabled).toBe(true);
    });
  });
});
