import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  TextInput,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Modal
} from 'react-native';
import { theme } from '../src/theme';
import { useRouter } from 'expo-router';
import { 
  Mail, 
  Lock, 
  User, 
  Eye, 
  EyeOff, 
  ArrowRight,
  UserCheck
} from 'lucide-react-native';
import { firebaseAuthService } from '../src/services/firebaseAuthService';
import { useUserStore } from '../src/store/useUserStore';

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useUserStore();

  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Estados para recuperação de senha
  const [isResetModalVisible, setIsResetModalVisible] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [isResetLoading, setIsResetLoading] = useState(false);
  const [resetMessage, setResetMessage] = useState<{ text: string; type: 'success' | 'error' | null }>({
    text: '',
    type: null,
  });

  // Travas de concorrência com ref para garantir bloqueio síncrono absoluto contra duplo clique
  const isRequestInProgress = useRef(false);
  const isResetInProgress = useRef(false);

  const handlePasswordReset = async () => {
    if (isResetInProgress.current || isResetLoading) return;

    setResetMessage({ text: '', type: null });

    const cleanEmail = resetEmail.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!cleanEmail || !emailRegex.test(cleanEmail)) {
      setResetMessage({ text: 'Por favor, digite um e-mail válido.', type: 'error' });
      return;
    }

    isResetInProgress.current = true;
    setIsResetLoading(true);

    try {
      const res = await firebaseAuthService.sendPasswordResetEmail(cleanEmail);
      if (res.success) {
        setResetMessage({ text: res.message, type: 'success' });
      } else {
        setResetMessage({ text: res.message, type: 'error' });
      }
    } catch {
      setResetMessage({
        text: 'Erro ao solicitar redefinição de senha. Verifique sua conexão e tente novamente.',
        type: 'error',
      });
    } finally {
      isResetInProgress.current = false;
      setIsResetLoading(false);
    }
  };

  const handleAuthSubmit = async () => {
    if (isRequestInProgress.current || isLoading) return;

    setErrorMessage('');

    const cleanEmail = email.trim().toLowerCase();
    const cleanName = name.trim();

    // Validações no cliente
    if (isRegisterMode && (!cleanName || cleanName.length < 3)) {
      setErrorMessage('O nome de jogador deve ter pelo menos 3 caracteres.');
      return;
    }

    if (!cleanEmail || !cleanEmail.includes('@')) {
      setErrorMessage('Por favor, digite um e-mail válido.');
      return;
    }

    if (!password || password.length < 6) {
      setErrorMessage('A senha deve conter no mínimo 6 caracteres.');
      return;
    }

    isRequestInProgress.current = true;
    setIsLoading(true);

    try {
      const res = isRegisterMode
        ? await firebaseAuthService.signUpWithEmail(cleanName, cleanEmail, password)
        : await firebaseAuthService.signInWithEmail(cleanEmail, password);

      if (res.success && res.user) {
        login(res.user);
        router.replace('/home');
      } else {
        setErrorMessage(res.message || 'Falha ao autenticar. Verifique seus dados.');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Ocorreu um erro ao processar. Tente novamente.';
      setErrorMessage(msg);
    } finally {
      isRequestInProgress.current = false;
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    if (isRequestInProgress.current || isLoading) return;

    setErrorMessage('');
    isRequestInProgress.current = true;
    setIsLoading(true);

    try {
      const res = await firebaseAuthService.signInWithGoogle();

      if (res.success && res.user) {
        login(res.user);
        router.replace('/home');
      } else if (res.cancelled) {
        // Cancelamento voluntário: limpa sem exibir erro alarmante
        setErrorMessage('');
      } else {
        setErrorMessage(res.message || 'Falha ao conectar com Google.');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erro ao conectar com Google.';
      setErrorMessage(msg);
    } finally {
      isRequestInProgress.current = false;
      setIsLoading(false);
    }
  };

  const handleGuestLogin = async () => {
    if (isRequestInProgress.current || isLoading) return;

    setErrorMessage('');
    isRequestInProgress.current = true;
    setIsLoading(true);

    try {
      const res = await firebaseAuthService.signInAsGuest();

      if (res.success && res.user) {
        login(res.user);
        router.replace('/home');
      } else {
        setErrorMessage(res.message || 'Falha ao entrar como convidado.');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erro ao entrar como convidado.';
      setErrorMessage(msg);
    } finally {
      isRequestInProgress.current = false;
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Logo Principal */}
          <View style={styles.logoContainer}>
            <Image 
              source={require('../Logo/icon.png')} 
              style={styles.logoImage}
              resizeMode="contain"
            />
          </View>

          {/* Alternância de Modo: Entrar ou Criar Conta */}
          <View style={styles.tabToggle}>
            <TouchableOpacity 
              style={[styles.toggleBtn, !isRegisterMode && styles.toggleBtnActive]}
              onPress={() => { if (!isLoading) { setIsRegisterMode(false); setErrorMessage(''); } }}
              activeOpacity={0.8}
              disabled={isLoading}
            >
              <Text style={[styles.toggleBtnText, !isRegisterMode && styles.toggleBtnTextActive]}>
                Entrar
              </Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.toggleBtn, isRegisterMode && styles.toggleBtnActive]}
              onPress={() => { if (!isLoading) { setIsRegisterMode(true); setErrorMessage(''); } }}
              activeOpacity={0.8}
              disabled={isLoading}
            >
              <Text style={[styles.toggleBtnText, isRegisterMode && styles.toggleBtnTextActive]}>
                Criar Conta
              </Text>
            </TouchableOpacity>
          </View>

          {/* Mensagem de Erro Amigável */}
          {errorMessage ? (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>{errorMessage}</Text>
            </View>
          ) : null}

          {/* Formulário com E-mail e Senha */}
          <View style={styles.form}>
            {isRegisterMode && (
              <View style={styles.inputWrapper}>
                <User size={20} color={theme.colors.text.muted} style={styles.inputIcon} />
                <TextInput
                  placeholder="Nome de Jogador ou Apelido"
                  placeholderTextColor="#94A3B8"
                  value={name}
                  onChangeText={setName}
                  autoCapitalize="words"
                  editable={!isLoading}
                  style={styles.input}
                />
              </View>
            )}

            <View style={styles.inputWrapper}>
              <Mail size={20} color={theme.colors.text.muted} style={styles.inputIcon} />
              <TextInput
                placeholder="Seu e-mail"
                placeholderTextColor="#94A3B8"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                editable={!isLoading}
                style={styles.input}
              />
            </View>

            <View style={styles.inputWrapper}>
              <Lock size={20} color={theme.colors.text.muted} style={styles.inputIcon} />
              <TextInput
                placeholder="Senha (mínimo 6 dígitos)"
                placeholderTextColor="#94A3B8"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                editable={!isLoading}
                style={styles.input}
              />
              <TouchableOpacity 
                onPress={() => setShowPassword(!showPassword)}
                style={styles.eyeBtn}
                disabled={isLoading}
              >
                {showPassword ? (
                  <EyeOff size={20} color={theme.colors.text.muted} />
                ) : (
                  <Eye size={20} color={theme.colors.text.muted} />
                )}
              </TouchableOpacity>
            </View>

            {/* Link para Recuperação de Senha (exclusivo da aba Entrar) */}
            {!isRegisterMode && (
              <TouchableOpacity
                onPress={() => {
                  setResetEmail(email);
                  setResetMessage({ text: '', type: null });
                  setIsResetModalVisible(true);
                }}
                style={styles.forgotPasswordBtn}
                disabled={isLoading}
              >
                <Text style={styles.forgotPasswordText}>Esqueceu sua senha?</Text>
              </TouchableOpacity>
            )}

            {/* Botão Principal de Envio */}
            <TouchableOpacity 
              style={[styles.submitButton, isLoading && styles.submitButtonDisabled]}
              activeOpacity={0.85}
              disabled={isLoading}
              onPress={handleAuthSubmit}
            >
              {isLoading ? (
                <ActivityIndicator color="#FFF" />
              ) : (
                <View style={styles.submitRow}>
                  <Text style={styles.submitButtonText}>
                    {isRegisterMode ? 'CRIAR MINHA CONTA' : 'ENTRAR NO JOGO'}
                  </Text>
                  <ArrowRight size={20} color="#FFF" />
                </View>
              )}
            </TouchableOpacity>
          </View>

          {/* Divisor */}
          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>OU CONECTE COM</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Opções Convidado e Google */}
          <View style={styles.socialButtons}>
            <TouchableOpacity 
              style={[styles.guestBtn, isLoading && styles.submitButtonDisabled]}
              activeOpacity={0.85}
              disabled={isLoading}
              onPress={handleGuestLogin}
            >
              <UserCheck size={20} color={theme.colors.brand.purple} />
              <Text style={styles.guestBtnText}>Entrar como Convidado</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.socialBtn, isLoading && styles.submitButtonDisabled]}
              activeOpacity={0.85}
              disabled={isLoading}
              onPress={handleGoogleLogin}
            >
              <Image source={require('../Logo/google.png')} style={styles.socialIcon} />
              <Text style={styles.socialBtnText}>Continuar com Google</Text>
            </TouchableOpacity>
          </View>

          {/* Tutorial / Onboarding */}
          <TouchableOpacity 
            style={styles.tutorialLink}
            activeOpacity={0.7}
            disabled={isLoading}
            onPress={() => router.push('/onboarding')}
          >
            <Text style={styles.tutorialLinkText}>Novo por aqui? Conheça o BrainPOP</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Modal de Recuperação de Senha */}
      <Modal
        visible={isResetModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => {
          if (!isResetLoading) setIsResetModalVisible(false);
        }}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.modalBackdrop}
        >
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Recuperar Senha</Text>
            <Text style={styles.modalSubtitle}>
              Digite seu e-mail cadastrado para receber as instruções de redefinição de senha.
            </Text>

            {resetMessage.text ? (
              <View
                style={[
                  styles.resetAlertBox,
                  resetMessage.type === 'success'
                    ? styles.resetAlertSuccess
                    : styles.resetAlertError,
                ]}
              >
                <Text
                  style={[
                    styles.resetAlertText,
                    resetMessage.type === 'success'
                      ? styles.resetAlertTextSuccess
                      : styles.resetAlertTextError,
                  ]}
                >
                  {resetMessage.text}
                </Text>
              </View>
            ) : null}

            <View style={[styles.inputWrapper, { marginBottom: 16 }]}>
              <Mail size={20} color={theme.colors.text.muted} style={styles.inputIcon} />
              <TextInput
                placeholder="Seu e-mail"
                placeholderTextColor="#94A3B8"
                value={resetEmail}
                onChangeText={setResetEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                editable={!isResetLoading}
                style={styles.input}
              />
            </View>

            <TouchableOpacity
              style={[styles.submitButton, isResetLoading && styles.submitButtonDisabled]}
              activeOpacity={0.85}
              disabled={isResetLoading}
              onPress={handlePasswordReset}
            >
              {isResetLoading ? (
                <ActivityIndicator color="#FFF" />
              ) : (
                <Text style={styles.submitButtonText}>ENVIAR INSTRUÇÕES</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.modalCancelBtn}
              onPress={() => setIsResetModalVisible(false)}
              disabled={isResetLoading}
            >
              <Text style={styles.modalCancelText}>Voltar ao Login</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.bg.app,
  },
  scrollContent: {
    paddingHorizontal: theme.spacing.containerMargin,
    paddingTop: theme.spacing.xs,
    paddingBottom: theme.spacing['4xl'],
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: theme.spacing.xs,
    marginBottom: theme.spacing.sm,
  },
  logoImage: {
    width: 280,
    height: 280,
  },
  tabToggle: {
    flexDirection: 'row',
    backgroundColor: theme.colors.bg.soft,
    borderRadius: theme.radius.xl,
    padding: 4,
    marginBottom: theme.spacing.lg,
  },
  toggleBtn: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: theme.radius.lg,
  },
  toggleBtnActive: {
    backgroundColor: '#FFF',
    ...theme.shadows.pillowy,
  },
  toggleBtnText: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: 14,
    color: theme.colors.text.muted,
  },
  toggleBtnTextActive: {
    color: theme.colors.brand.magenta,
  },
  errorBox: {
    backgroundColor: '#FEE2E2',
    borderWidth: 1,
    borderColor: '#FCA5A5',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: theme.radius.md,
    marginBottom: theme.spacing.md,
  },
  errorText: {
    color: '#B91C1C',
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: 13,
    textAlign: 'center',
  },
  form: {
    gap: 14,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderWidth: 1.5,
    borderColor: theme.colors.border.soft,
    borderRadius: theme.radius.xl,
    paddingHorizontal: 16,
    height: 56,
    ...theme.shadows.card,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    height: '100%',
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: 15,
    color: theme.colors.text.primary,
  },
  eyeBtn: {
    padding: 6,
  },
  submitButton: {
    backgroundColor: theme.colors.brand.magenta,
    borderRadius: theme.radius.xl,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
    ...theme.shadows.magentaGlow,
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
  submitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  submitButtonText: {
    fontFamily: theme.typography.fontFamily.black,
    fontSize: 15,
    color: '#FFF',
    letterSpacing: 0.5,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
    gap: 12,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: theme.colors.border.soft,
  },
  dividerText: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: 11,
    color: theme.colors.text.muted,
    letterSpacing: 0.5,
  },
  socialButtons: {
    gap: 12,
  },
  guestBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F5F3FF',
    borderWidth: 1.5,
    borderColor: '#DDD6FE',
    borderRadius: theme.radius.xl,
    height: 54,
    gap: 12,
    ...theme.shadows.card,
  },
  guestBtnText: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: 14,
    color: '#6D28D9',
  },
  socialBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF',
    borderWidth: 1.5,
    borderColor: theme.colors.border.soft,
    borderRadius: theme.radius.xl,
    height: 54,
    gap: 12,
    ...theme.shadows.card,
  },
  socialIcon: {
    width: 22,
    height: 22,
  },
  socialBtnText: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: 14,
    color: theme.colors.text.primary,
  },
  tutorialLink: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    marginTop: 8,
  },
  tutorialLinkText: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: 13,
    color: theme.colors.brand.purple,
    textDecorationLine: 'underline',
  },
  forgotPasswordBtn: {
    alignSelf: 'flex-end',
    paddingVertical: 6,
    paddingHorizontal: 4,
    marginTop: -4,
    marginBottom: 8,
  },
  forgotPasswordText: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: 13,
    color: theme.colors.brand.purple,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalCard: {
    backgroundColor: '#FFF',
    width: '100%',
    maxWidth: 400,
    borderRadius: theme.radius['2xl'],
    padding: 24,
    ...theme.shadows.card,
  },
  modalTitle: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: 20,
    color: theme.colors.text.primary,
    marginBottom: 8,
  },
  modalSubtitle: {
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: 14,
    color: theme.colors.text.body,
    marginBottom: 16,
    lineHeight: 20,
  },
  modalCancelBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    marginTop: 8,
  },
  modalCancelText: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: 14,
    color: theme.colors.text.muted,
  },
  resetAlertBox: {
    padding: 12,
    borderRadius: theme.radius.lg,
    marginBottom: 16,
  },
  resetAlertSuccess: {
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  resetAlertError: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  resetAlertText: {
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: 13,
    lineHeight: 18,
  },
  resetAlertTextSuccess: {
    color: '#065F46',
  },
  resetAlertTextError: {
    color: '#991B1B',
  },
});
