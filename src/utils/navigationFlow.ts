export interface InitialRouteParams {
  hasCompletedOnboarding: boolean;
  hasConfiguredInitialPermissions: boolean;
  hasValidSession: boolean;
}

export type AppInitialRoute = '/home' | '/onboarding' | '/permissions' | '/login';

/**
 * Determina deterministicamente a rota inicial do aplicativo com base no estado de primeiro acesso e sessão.
 *
 * Regras:
 * - Instalação nova e sem sessão: Splash -> Onboarding
 * - Fim do onboarding: Onboarding -> Permissions
 * - Fim ou recusa das permissões: Permissions -> Login (nunca vai direto para a Home)
 * - Autenticação bem-sucedida: Login -> Home
 * - Instalação já configurada e sem sessão ativa: Splash -> Login
 * - Sessão autenticada válida: Splash -> Home
 * - Logout: Login sem repetir onboarding
 * - Reset explícito dos dados: repete onboarding
 */
export function resolveInitialRoute(params: InitialRouteParams): AppInitialRoute {
  const { hasCompletedOnboarding, hasConfiguredInitialPermissions, hasValidSession } = params;

  // 1. Sessão ativa e válida tem precedência máxima -> Home
  if (hasValidSession) {
    return '/home';
  }

  // 2. Primeiro acesso: nunca concluiu o onboarding -> Onboarding
  if (!hasCompletedOnboarding) {
    return '/onboarding';
  }

  // 3. Concluiu onboarding mas ainda não configurou ou recusou permissões -> Permissions
  if (!hasConfiguredInitialPermissions) {
    return '/permissions';
  }

  // 4. Instalação configurada mas sem sessão ativa -> Login
  return '/login';
}
