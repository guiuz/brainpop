import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  Modal,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { theme } from '../src/theme';
import { Card } from '../src/components/Card';
import { ProgressBar } from '../src/components/ProgressBar';
import { BottomNav } from '../src/components/BottomNav';
import { useRouter } from 'expo-router';
import { 
  User, 
  Settings, 
  ChevronLeft, 
  Trophy, 
  ChevronRight,
  Sparkles,
  Camera,
  Edit3,
  Coins,
  Check,
  X
} from 'lucide-react-native';
import { useUserStore } from '../src/store/useUserStore';

// Galeria de Avatares BrainPOP
const AVATAR_PRESETS = [
  'https://api.dicebear.com/7.x/bottts/png?seed=CyberBrain',
  'https://api.dicebear.com/7.x/avataaars/png?seed=AlexGamer',
  'https://api.dicebear.com/7.x/avataaars/png?seed=LucasDev',
  'https://api.dicebear.com/7.x/avataaars/png?seed=SophiaQueen',
  'https://api.dicebear.com/7.x/avataaars/png?seed=GamerPro',
  'https://api.dicebear.com/7.x/bottts/png?seed=RoboQuiz',
  'https://api.dicebear.com/7.x/avataaars/png?seed=VictorKing',
  'https://api.dicebear.com/7.x/avataaars/png?seed=BellaSmart',
  'https://api.dicebear.com/7.x/bottts/png?seed=BrainPOPStar',
  'https://api.dicebear.com/7.x/avataaars/png?seed=MasterMind',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=250&q=80',
];

export default function ProfileScreen() {
  const router = useRouter();
  const { 
    name, 
    level, 
    title, 
    avatarUrl, 
    currentXp, 
    xpToNextLevel, 
    coins, 
    stats,
    nameChangesCount,
    changeUsername,
    changeAvatar,
    completeProfileTutorial
  } = useUserStore();

  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [showNameModal, setShowNameModal] = useState(false);
  const [tempName, setTempName] = useState(name);
  const [customAvatarInput, setCustomAvatarInput] = useState('');

  const xpProgress = Math.min(currentXp / Math.max(xpToNextLevel, 1), 1);
  const winRate = stats.totalMatches > 0 
    ? Math.round((stats.totalWins / stats.totalMatches) * 100) 
    : 0;

  const isFirstChange = nameChangesCount === 0;
  const canAffordNameChange = isFirstChange || coins >= 10000;

  const handleSaveName = () => {
    if (!tempName.trim()) {
      Alert.alert('Atenção', 'Digite um nome válido.');
      return;
    }

    if (!isFirstChange && coins < 10000) {
      Alert.alert(
        'Moedas Insuficientes 🪙',
        `Você precisa de 10.000 moedas para alterar o nome novamente. Seu saldo atual é de ${coins} moedas.`,
        [
          { text: 'Cancelar', style: 'cancel' },
          { text: 'Ir para Loja', onPress: () => { setShowNameModal(false); router.push('/shop'); } }
        ]
      );
      return;
    }

    const result = changeUsername(tempName);
    if (result.success) {
      completeProfileTutorial();
      setShowNameModal(false);
      Alert.alert('Sucesso 🎉', result.message);
    } else {
      Alert.alert('Erro', result.message);
    }
  };

  const handleSelectAvatar = (url: string) => {
    changeAvatar(url);
    completeProfileTutorial();
    setShowAvatarModal(false);
    Alert.alert('Foto Atualizada! 📸', 'Seu novo avatar foi salvo com sucesso.');
  };

  const handleCustomAvatarUrl = () => {
    if (!customAvatarInput.trim() || !customAvatarInput.startsWith('http')) {
      Alert.alert('Atenção', 'Insira uma URL de imagem válida (começando com http:// ou https://).');
      return;
    }
    handleSelectAvatar(customAvatarInput.trim());
    setCustomAvatarInput('');
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
          <Text style={styles.headerTitle}>Perfil do Jogador</Text>
          <TouchableOpacity 
            style={styles.circleBtn} 
            onPress={() => router.push('/settings' as any)}
            activeOpacity={0.7}
          >
            <Settings color={theme.colors.text.primary} size={20} />
          </TouchableOpacity>
        </View>

        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Profile Hero */}
          <View style={styles.profileHero}>
            <TouchableOpacity 
              activeOpacity={0.85}
              onPress={() => setShowAvatarModal(true)}
              style={styles.avatarLargeWrapper}
            >
              <Image source={{ uri: avatarUrl }} style={styles.avatarLarge} />
              <View style={styles.cameraBadge}>
                <Camera size={14} color="#FFF" />
              </View>
              <View style={styles.levelBadge}>
                <Text style={styles.levelText}>{level}</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity 
              activeOpacity={0.8}
              onPress={() => {
                setTempName(name);
                setShowNameModal(true);
              }}
              style={styles.nameRow}
            >
              <Text style={styles.userName}>{name}</Text>
              <View style={styles.editPencil}>
                <Edit3 size={16} color={theme.colors.brand.magenta} />
              </View>
            </TouchableOpacity>

            <Text style={styles.userTitle}>{title}</Text>

            {/* Status da alteração de nome */}
            <TouchableOpacity 
              activeOpacity={0.8}
              onPress={() => {
                setTempName(name);
                setShowNameModal(true);
              }}
              style={[
                styles.nameBadgePill, 
                isFirstChange ? styles.nameBadgeFree : styles.nameBadgePaid
              ]}
            >
              {isFirstChange ? (
                <>
                  <Sparkles size={14} color={theme.colors.brand.magenta} />
                  <Text style={styles.nameBadgeTextFree}>1ª Alteração de Nome Grátis</Text>
                </>
              ) : (
                <>
                  <Coins size={14} color={theme.colors.warning.orange} />
                  <Text style={styles.nameBadgeTextPaid}>Trocar Nome: 10.000 Moedas</Text>
                </>
              )}
            </TouchableOpacity>

            {/* XP Progress Bar */}
            <View style={styles.xpCard}>
              <View style={styles.xpHeader}>
                <Text style={styles.xpCardLabel}>NÍVEL {level} → {level + 1}</Text>
                <Text style={styles.xpCardValue}>{currentXp} / {xpToNextLevel} XP</Text>
              </View>
              <ProgressBar 
                progress={xpProgress} 
                height={8} 
                gradientColors={[theme.colors.brand.magenta, theme.colors.brand.cyan]}
              />
            </View>
          </View>

          {/* Stats Grid */}
          <View style={styles.statsGrid}>
            <Card style={styles.statCard}>
              <Text style={[styles.statValue, { color: theme.colors.brand.magenta }]}>
                {stats.totalMatches}
              </Text>
              <Text style={styles.statLabel}>PARTIDAS</Text>
            </Card>
            <Card style={styles.statCard}>
              <Text style={[styles.statValue, { color: theme.colors.success.greenDark }]}>
                {winRate}%
              </Text>
              <Text style={styles.statLabel}>TAXA VITÓRIA</Text>
            </Card>
            <Card style={styles.statCard}>
              <Text style={[styles.statValue, { color: theme.colors.warning.orange }]}>
                {stats.bestStreak}🔥
              </Text>
              <Text style={styles.statLabel}>RECORDE</Text>
            </Card>
          </View>

          {/* Desempenho por Categoria */}
          <Card style={styles.categoryCard}>
            <Text style={styles.categoryCardTitle}>Acurácia por Matéria</Text>
            {Object.entries(stats.categoryStats).length === 0 ? (
              <Text style={styles.emptyStatsText}>Jogue partidas para desbloquear estatísticas por matéria!</Text>
            ) : (
              Object.entries(stats.categoryStats).map(([cat, data]) => {
                const rate = data.total > 0 ? Math.round((data.correct / data.total) * 100) : 0;
                return (
                  <View key={cat} style={styles.catRow}>
                    <View style={styles.catInfo}>
                      <Text style={styles.catName}>{cat.toUpperCase()}</Text>
                      <Text style={styles.catPercent}>{rate}% ({data.correct}/{data.total})</Text>
                    </View>
                    <ProgressBar 
                      progress={rate / 100} 
                      height={6} 
                      gradientColors={[theme.colors.info.teal, theme.colors.brand.cyan]}
                      trackColor="#F1F5F9"
                    />
                  </View>
                );
              })
            )}
          </Card>

          {/* Menu de Atalhos */}
          <View style={styles.menu}>
            <TouchableOpacity 
              style={styles.menuItem} 
              activeOpacity={0.8}
              onPress={() => router.push('/friends')}
            >
              <View style={styles.menuLeft}>
                <User color={theme.colors.brand.purple} size={22} />
                <Text style={styles.menuText}>Lista de Amigos</Text>
              </View>
              <ChevronRight color={theme.colors.text.muted} size={20} />
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.menuItem} 
              activeOpacity={0.8}
              onPress={() => router.push('/tournaments')}
            >
              <View style={styles.menuLeft}>
                <Trophy color={theme.colors.warning.amber} size={22} />
                <Text style={styles.menuText}>Torneios & Ligas</Text>
              </View>
              <ChevronRight color={theme.colors.text.muted} size={20} />
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>

      {/* Modal Alterar Nome */}
      <Modal
        visible={showNameModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowNameModal(false)}
      >
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.modalOverlay}
        >
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Edit3 size={20} color={theme.colors.brand.magenta} />
                <Text style={styles.modalTitle}>Alterar Nome de Jogador</Text>
              </View>
              <TouchableOpacity onPress={() => setShowNameModal(false)}>
                <X size={20} color={theme.colors.text.muted} />
              </TouchableOpacity>
            </View>

            <View style={[
              styles.costAlertBox, 
              isFirstChange ? styles.costAlertFree : styles.costAlertPaid
            ]}>
              {isFirstChange ? (
                <>
                  <Sparkles size={18} color={theme.colors.brand.magenta} />
                  <Text style={styles.costAlertTextFree}>
                    🎉 Esta é a sua <Text style={{ fontWeight: 'bold' }}>1ª alteração gratuita</Text>!
                  </Text>
                </>
              ) : (
                <>
                  <Coins size={18} color={theme.colors.warning.orange} />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.costAlertTextPaid}>
                      ⚠️ Alterações adicionais custam <Text style={{ fontWeight: 'bold' }}>10.000 moedas</Text>.
                    </Text>
                    <Text style={styles.costAlertSubText}>
                      Seu saldo: {coins} moedas {coins < 10000 && '(Insuficiente)'}
                    </Text>
                  </View>
                </>
              )}
            </View>

            <Text style={styles.inputLabel}>Novo Nome (3 a 20 caracteres):</Text>
            <View style={styles.textInputWrapper}>
              <User size={18} color={theme.colors.text.muted} style={{ marginRight: 8 }} />
              <TextInput
                style={styles.textInput}
                value={tempName}
                onChangeText={setTempName}
                placeholder="Ex: MestreDoQuiz"
                placeholderTextColor="#94A3B8"
                maxLength={20}
                autoFocus
              />
            </View>

            <TouchableOpacity 
              style={[
                styles.saveBtn, 
                !canAffordNameChange && styles.saveBtnDisabled
              ]}
              onPress={handleSaveName}
              activeOpacity={0.85}
            >
              <Check size={20} color="#FFF" />
              <Text style={styles.saveBtnText}>
                {isFirstChange ? 'CONFIRMAR NOME (GRÁTIS)' : 'PAGAR 10.000 E ALTERAR'}
              </Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* Modal Selecionar Avatar */}
      <Modal
        visible={showAvatarModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowAvatarModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCard, { maxHeight: '80%' }]}>
            <View style={styles.modalHeader}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Camera size={20} color={theme.colors.brand.magenta} />
                <Text style={styles.modalTitle}>Escolha seu Avatar</Text>
              </View>
              <TouchableOpacity onPress={() => setShowAvatarModal(false)}>
                <X size={20} color={theme.colors.text.muted} />
              </TouchableOpacity>
            </View>
            <Text style={styles.modalSubTitle}>Selecione um visual para se destacar nos duelos 1v1:</Text>

            <ScrollView contentContainerStyle={styles.avatarGrid} showsVerticalScrollIndicator={false}>
              {AVATAR_PRESETS.map((url, idx) => {
                const isSelected = avatarUrl === url;
                return (
                  <TouchableOpacity
                    key={idx}
                    activeOpacity={0.8}
                    style={[
                      styles.avatarOption,
                      isSelected && styles.avatarOptionSelected
                    ]}
                    onPress={() => handleSelectAvatar(url)}
                  >
                    <Image source={{ uri: url }} style={styles.avatarOptionImg} />
                    {isSelected && (
                      <View style={styles.avatarCheckBadge}>
                        <Check size={12} color="#FFF" />
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            <View style={styles.customAvatarSection}>
              <Text style={styles.inputLabel}>Ou cole o link de uma imagem:</Text>
              <View style={styles.customInputRow}>
                <TextInput
                  style={[styles.textInput, { height: 44 }]}
                  placeholder="https://sua-foto.png"
                  placeholderTextColor="#94A3B8"
                  value={customAvatarInput}
                  onChangeText={setCustomAvatarInput}
                  autoCapitalize="none"
                />
                <TouchableOpacity 
                  style={styles.applyCustomBtn}
                  onPress={handleCustomAvatarUrl}
                >
                  <Text style={styles.applyCustomText}>Usar</Text>
                </TouchableOpacity>
              </View>
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
  profileHero: {
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  avatarLargeWrapper: {
    width: 104,
    height: 104,
    borderRadius: 52,
    backgroundColor: theme.colors.bg.surface,
    borderWidth: 3.5,
    borderColor: theme.colors.brand.magenta,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.sm,
    position: 'relative',
    ...theme.shadows.magentaGlow,
  },
  avatarLarge: {
    width: 96,
    height: 96,
    borderRadius: 48,
  },
  cameraBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: theme.colors.brand.magenta,
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFF',
    ...theme.shadows.pillowy,
  },
  levelBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    backgroundColor: theme.colors.brand.cyan,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2.5,
    borderColor: '#FFF',
  },
  levelText: {
    color: '#FFF',
    fontFamily: theme.typography.fontFamily.black,
    fontSize: 13,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  userName: {
    fontSize: 22,
    fontFamily: theme.typography.fontFamily.black,
    color: theme.colors.text.primary,
  },
  editPencil: {
    backgroundColor: 'rgba(236, 72, 153, 0.1)',
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userTitle: {
    fontSize: 13,
    fontFamily: theme.typography.fontFamily.bold,
    color: theme.colors.brand.magenta,
    marginTop: 2,
  },
  nameBadgePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: theme.radius.full,
    marginTop: 8,
  },
  nameBadgeFree: {
    backgroundColor: 'rgba(236, 72, 153, 0.1)',
    borderWidth: 1,
    borderColor: theme.colors.brand.magenta + '40',
  },
  nameBadgePaid: {
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    borderWidth: 1,
    borderColor: theme.colors.warning.orange + '40',
  },
  nameBadgeTextFree: {
    fontSize: 11,
    fontFamily: theme.typography.fontFamily.bold,
    color: theme.colors.brand.magenta,
  },
  nameBadgeTextPaid: {
    fontSize: 11,
    fontFamily: theme.typography.fontFamily.bold,
    color: theme.colors.warning.orange,
  },
  xpCard: {
    width: '100%',
    backgroundColor: theme.colors.bg.surface,
    borderRadius: theme.radius.xl,
    padding: 14,
    marginTop: theme.spacing.md,
    ...theme.shadows.pillowy,
  },
  xpHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  xpCardLabel: {
    fontSize: 11,
    fontFamily: theme.typography.fontFamily.bold,
    color: theme.colors.text.muted,
  },
  xpCardValue: {
    fontSize: 11,
    fontFamily: theme.typography.fontFamily.bold,
    color: theme.colors.brand.magenta,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: theme.spacing.lg,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 8,
  },
  statValue: {
    fontSize: 20,
    fontFamily: theme.typography.fontFamily.black,
  },
  statLabel: {
    fontSize: 9,
    color: theme.colors.text.muted,
    fontFamily: theme.typography.fontFamily.bold,
    marginTop: 2,
    textAlign: 'center',
  },
  categoryCard: {
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
  categoryCardTitle: {
    fontSize: 14,
    fontFamily: theme.typography.fontFamily.black,
    color: theme.colors.text.primary,
    marginBottom: 12,
  },
  emptyStatsText: {
    fontSize: 12,
    fontFamily: theme.typography.fontFamily.medium,
    color: theme.colors.text.muted,
    textAlign: 'center',
    paddingVertical: 12,
  },
  catRow: {
    marginBottom: 12,
  },
  catInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  catName: {
    fontSize: 11,
    fontFamily: theme.typography.fontFamily.bold,
    color: theme.colors.text.body,
  },
  catPercent: {
    fontSize: 11,
    fontFamily: theme.typography.fontFamily.bold,
    color: theme.colors.info.tealDark,
  },
  menu: {
    gap: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.bg.surface,
    padding: 16,
    borderRadius: theme.radius.xl,
    ...theme.shadows.pillowy,
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  menuText: {
    fontSize: 14,
    fontFamily: theme.typography.fontFamily.bold,
    color: theme.colors.text.primary,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 24,
    paddingBottom: Platform.OS === 'ios' ? 40 : 28,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: theme.typography.fontFamily.black,
    color: theme.colors.text.primary,
  },
  modalSubTitle: {
    fontSize: 13,
    fontFamily: theme.typography.fontFamily.medium,
    color: theme.colors.text.muted,
    marginBottom: 16,
  },
  costAlertBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 12,
    borderRadius: 16,
    marginBottom: 16,
  },
  costAlertFree: {
    backgroundColor: 'rgba(236, 72, 153, 0.08)',
    borderWidth: 1,
    borderColor: theme.colors.brand.magenta + '30',
  },
  costAlertPaid: {
    backgroundColor: 'rgba(245, 158, 11, 0.08)',
    borderWidth: 1,
    borderColor: theme.colors.warning.orange + '30',
  },
  costAlertTextFree: {
    fontSize: 13,
    fontFamily: theme.typography.fontFamily.medium,
    color: theme.colors.brand.magenta,
  },
  costAlertTextPaid: {
    fontSize: 13,
    fontFamily: theme.typography.fontFamily.bold,
    color: theme.colors.text.primary,
  },
  costAlertSubText: {
    fontSize: 11,
    fontFamily: theme.typography.fontFamily.medium,
    color: theme.colors.text.muted,
    marginTop: 2,
  },
  inputLabel: {
    fontSize: 12,
    fontFamily: theme.typography.fontFamily.bold,
    color: theme.colors.text.muted,
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  textInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: theme.colors.border.soft,
    borderRadius: 16,
    paddingHorizontal: 14,
    height: 52,
    backgroundColor: '#FFF',
    marginBottom: 20,
    ...theme.shadows.pillowy,
  },
  textInput: {
    flex: 1,
    fontSize: 15,
    fontFamily: theme.typography.fontFamily.bold,
    color: theme.colors.text.primary,
  },
  saveBtn: {
    backgroundColor: theme.colors.brand.magenta,
    borderRadius: 16,
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    ...theme.shadows.magentaGlow,
  },
  saveBtnDisabled: {
    opacity: 0.5,
  },
  saveBtnText: {
    color: '#FFF',
    fontSize: 14,
    fontFamily: theme.typography.fontFamily.black,
    letterSpacing: 0.5,
  },
  avatarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'center',
    paddingVertical: 8,
  },
  avatarOption: {
    width: 68,
    height: 68,
    borderRadius: 34,
    borderWidth: 3,
    borderColor: 'transparent',
    padding: 2,
    position: 'relative',
  },
  avatarOptionSelected: {
    borderColor: theme.colors.brand.magenta,
    ...theme.shadows.magentaGlow,
  },
  avatarOptionImg: {
    width: '100%',
    height: '100%',
    borderRadius: 30,
  },
  avatarCheckBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: theme.colors.brand.magenta,
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFF',
  },
  customAvatarSection: {
    marginTop: 16,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border.soft,
    paddingTop: 12,
  },
  customInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  applyCustomBtn: {
    backgroundColor: theme.colors.brand.purple,
    paddingHorizontal: 16,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  applyCustomText: {
    color: '#FFF',
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: 13,
  },
});
