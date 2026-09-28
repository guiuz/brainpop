import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  Modal
} from 'react-native';
import { theme } from '../src/theme';
import { Card } from '../src/components/Card';
import { BottomNav } from '../src/components/BottomNav';
import { useRouter } from 'expo-router';
import { 
  ChevronLeft, 
  Volume2, 
  Vibrate, 
  Bell, 
  Shield, 
  HelpCircle, 
  Info, 
  Trash2, 
  ChevronRight, 
  User, 
  LogOut,
  AlertTriangle,
  Eye
} from 'lucide-react-native';
import { useUserStore } from '../src/store/useUserStore';
import { adMobService } from '../src/services/adMobService';

export default function SettingsScreen() {
  const router = useRouter();
  const { name, level, title, settings, updateSettings, logout, resetGameProgress } = useUserStore();

  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);

  const soundEnabled = settings?.soundEnabled ?? true;
  const vibrationEnabled = settings?.vibrationEnabled ?? true;
  const notificationsEnabled = settings?.notificationsEnabled ?? true;

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const handleConfirmLogout = () => {
    setShowLogoutModal(false);
    logout();
    router.replace('/login');
  };

  const handleResetProgress = () => {
    setShowResetModal(true);
  };

  const handleConfirmReset = () => {
    setShowResetModal(false);
    resetGameProgress();
    Alert.alert('Sucesso 🎉', 'Estatísticas e progresso redefinidos com sucesso.');
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.circleBtn} 
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <ChevronLeft color={theme.colors.text.primary} size={24} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Configurações</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Sessão Perfil */}
          <Text style={styles.sectionTitle}>CONTA</Text>
          <TouchableOpacity 
            activeOpacity={0.85} 
            onPress={() => router.push('/profile')}
          >
            <Card style={styles.accountCard}>
              <View style={styles.accountInfo}>
                <View style={styles.accountAvatar}>
                  <User size={24} color={theme.colors.brand.magenta} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.accountName}>{name}</Text>
                  <Text style={styles.accountSub}>Nível {level} • {title}</Text>
                </View>
                <ChevronRight size={20} color={theme.colors.text.muted} />
              </View>
            </Card>
          </TouchableOpacity>

          {/* Preferências de Jogo */}
          <Text style={styles.sectionTitle}>PREFERÊNCIAS DO JOGO</Text>
          <Card style={styles.settingGroup}>
            <View style={styles.settingRow}>
              <View style={styles.settingLeft}>
                <Volume2 size={20} color={theme.colors.brand.magenta} />
                <Text style={styles.settingLabel}>Efeitos Sonoros</Text>
              </View>
              <Switch 
                value={soundEnabled} 
                onValueChange={(val) => updateSettings({ soundEnabled: val })}
                trackColor={{ false: '#E2E8F0', true: theme.colors.brand.magenta }}
                thumbColor="#FFF"
              />
            </View>

            <View style={styles.divider} />

            <View style={styles.settingRow}>
              <View style={styles.settingLeft}>
                <Vibrate size={20} color={theme.colors.brand.cyan} />
                <Text style={styles.settingLabel}>Vibração / Haptics</Text>
              </View>
              <Switch 
                value={vibrationEnabled} 
                onValueChange={(val) => updateSettings({ vibrationEnabled: val })}
                trackColor={{ false: '#E2E8F0', true: theme.colors.brand.cyan }}
                thumbColor="#FFF"
              />
            </View>

            <View style={styles.divider} />

            <View style={styles.settingRow}>
              <View style={styles.settingLeft}>
                <Bell size={20} color={theme.colors.warning.orange} />
                <Text style={styles.settingLabel}>Notificações Diárias</Text>
              </View>
              <Switch 
                value={notificationsEnabled} 
                onValueChange={(val) => updateSettings({ notificationsEnabled: val })}
                trackColor={{ false: '#E2E8F0', true: theme.colors.warning.orange }}
                thumbColor="#FFF"
              />
            </View>
          </Card>

          {/* Suporte & Sobre */}
          <Text style={styles.sectionTitle}>SOBRE & SUPORTE</Text>
          <Card style={styles.settingGroup}>
            <TouchableOpacity 
              style={styles.settingRow} 
              activeOpacity={0.7}
              onPress={() => Alert.alert('BrainPOP', 'Versão 1.0.0 - Build 2026\nDesenvolvido com Expo e React Native.')}
            >
              <View style={styles.settingLeft}>
                <Info size={20} color={theme.colors.info.teal} />
                <Text style={styles.settingLabel}>Versão do Aplicativo</Text>
              </View>
              <Text style={styles.settingValue}>v1.0.0</Text>
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity 
              style={styles.settingRow} 
              activeOpacity={0.7}
              onPress={() => router.push('/privacy')}
            >
              <View style={styles.settingLeft}>
                <Shield size={20} color={theme.colors.brand.purple} />
                <Text style={styles.settingLabel}>Política de Privacidade</Text>
              </View>
              <ChevronRight size={18} color={theme.colors.text.muted} />
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity 
              style={styles.settingRow} 
              activeOpacity={0.7}
              onPress={() => adMobService.showPrivacyOptionsForm()}
            >
              <View style={styles.settingLeft}>
                <Eye size={20} color={theme.colors.brand.magenta} />
                <Text style={styles.settingLabel}>Privacidade de Anúncios (UMP)</Text>
              </View>
              <ChevronRight size={18} color={theme.colors.text.muted} />
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity 
              style={styles.settingRow} 
              activeOpacity={0.7}
              onPress={() => router.push('/help')}
            >
              <View style={styles.settingLeft}>
                <HelpCircle size={20} color={theme.colors.success.green} />
                <Text style={styles.settingLabel}>Ajuda & FAQ</Text>
              </View>
              <ChevronRight size={18} color={theme.colors.text.muted} />
            </TouchableOpacity>
          </Card>

          {/* Botão Desconectar / Sair da Conta */}
          <Text style={styles.sectionTitle}>SESSÃO</Text>
          <TouchableOpacity 
            activeOpacity={0.8}
            onPress={handleLogout}
          >
            <Card style={styles.logoutCard}>
              <LogOut size={20} color={theme.colors.brand.magenta} />
              <Text style={styles.logoutText}>Desconectar da Conta</Text>
            </Card>
          </TouchableOpacity>

          {/* Zona de Perigo */}
          <Text style={[styles.sectionTitle, { color: theme.colors.danger.red }]}>ZONA DE PERIGO</Text>
          <TouchableOpacity 
            activeOpacity={0.8}
            onPress={handleResetProgress}
          >
            <Card style={styles.dangerCard}>
              <Trash2 size={20} color={theme.colors.danger.red} />
              <Text style={styles.dangerText}>Redefinir Progresso do Jogo</Text>
            </Card>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>

      {/* Modal de Desconectar */}
      <Modal
        visible={showLogoutModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowLogoutModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.logoutIconCircle}>
              <LogOut size={28} color={theme.colors.brand.magenta} />
            </View>

            <Text style={styles.modalTitle}>Desconectar da Conta?</Text>
            <Text style={styles.modalDesc}>
              Você será desconectado da sua conta atual e retornará para a tela de login.
            </Text>

            <View style={styles.modalBtnRow}>
              <TouchableOpacity
                style={styles.cancelBtn}
                activeOpacity={0.8}
                onPress={() => setShowLogoutModal(false)}
              >
                <Text style={styles.cancelBtnText}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.logoutConfirmBtn}
                activeOpacity={0.85}
                onPress={handleConfirmLogout}
              >
                <Text style={styles.logoutConfirmBtnText}>Desconectar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal de Redefinir Progresso */}
      <Modal
        visible={showResetModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowResetModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.dangerIconCircle}>
              <AlertTriangle size={28} color={theme.colors.danger.red} />
            </View>

            <Text style={styles.modalTitle}>Redefinir Dados?</Text>
            <Text style={styles.modalDesc}>
              Tem certeza? Todas as estatísticas locais, acertos e níveis serão resetados para o padrão inicial.
            </Text>

            <View style={styles.modalBtnRow}>
              <TouchableOpacity
                style={styles.cancelBtn}
                activeOpacity={0.8}
                onPress={() => setShowResetModal(false)}
              >
                <Text style={styles.cancelBtnText}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.dangerConfirmBtn}
                activeOpacity={0.85}
                onPress={handleConfirmReset}
              >
                <Text style={styles.dangerConfirmBtnText}>Redefinir</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <BottomNav />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.bg.app,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.containerMargin,
    paddingTop: theme.spacing.sm,
    paddingBottom: theme.spacing.xs,
  },
  circleBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.bg.surface,
    alignItems: 'center',
    justifyContent: 'center',
    ...theme.shadows.pillowy,
  },
  headerTitle: {
    fontSize: theme.typography.sizes.h2,
    fontFamily: theme.typography.fontFamily.black,
    color: theme.colors.text.primary,
  },
  scrollContent: {
    paddingHorizontal: theme.spacing.containerMargin,
    paddingTop: theme.spacing.md,
    paddingBottom: 120,
  },
  sectionTitle: {
    fontSize: 11,
    fontFamily: theme.typography.fontFamily.bold,
    color: theme.colors.text.muted,
    marginBottom: 8,
    marginTop: 16,
    letterSpacing: 0.5,
  },
  accountCard: {
    padding: 14,
    ...theme.shadows.card,
  },
  accountInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  accountAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: theme.colors.brand.magenta + '15',
    alignItems: 'center',
    justifyContent: 'center',
  },
  accountName: {
    fontSize: 15,
    fontFamily: theme.typography.fontFamily.black,
    color: theme.colors.text.primary,
  },
  accountSub: {
    fontSize: 12,
    fontFamily: theme.typography.fontFamily.medium,
    color: theme.colors.text.muted,
  },
  settingGroup: {
    padding: 6,
    ...theme.shadows.pillowy,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 10,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  settingLabel: {
    fontSize: 14,
    fontFamily: theme.typography.fontFamily.semibold,
    color: theme.colors.text.primary,
  },
  settingValue: {
    fontSize: 13,
    fontFamily: theme.typography.fontFamily.medium,
    color: theme.colors.text.muted,
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.border.soft,
    marginHorizontal: 10,
  },
  logoutCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    backgroundColor: '#FFF',
    borderWidth: 1.5,
    borderColor: theme.colors.brand.magenta,
    ...theme.shadows.pillowy,
  },
  logoutText: {
    color: theme.colors.brand.magenta,
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: 14,
  },
  dangerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  dangerText: {
    color: theme.colors.danger.red,
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: 14,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalCard: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: '#FFF',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    ...theme.shadows.card,
  },
  logoutIconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(236, 72, 153, 0.12)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  dangerIconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FEE2E2',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontFamily: theme.typography.fontFamily.black,
    fontSize: 20,
    color: theme.colors.text.primary,
    marginBottom: 8,
    textAlign: 'center',
  },
  modalDesc: {
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: 14,
    color: theme.colors.text.muted,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  modalBtnRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    width: '100%',
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: theme.radius.full,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelBtnText: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: 13,
    color: '#475569',
  },
  logoutConfirmBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: theme.radius.full,
    backgroundColor: theme.colors.brand.magenta,
    alignItems: 'center',
    justifyContent: 'center',
    ...theme.shadows.card,
  },
  logoutConfirmBtnText: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: 13,
    color: '#FFF',
  },
  dangerConfirmBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: theme.radius.full,
    backgroundColor: theme.colors.danger.red,
    alignItems: 'center',
    justifyContent: 'center',
    ...theme.shadows.card,
  },
  dangerConfirmBtnText: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: 13,
    color: '#FFF',
  },
});
