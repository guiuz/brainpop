import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Alert
} from 'react-native';
import { theme } from '../src/theme';
import { useRouter } from 'expo-router';
import { 
  Gift, 
  Brain, 
  Swords, 
  Zap, 
  Coins, 
  CheckCircle2, 
  Play 
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { HeaderBar } from '../src/components/HeaderBar';
import { BottomNav } from '../src/components/BottomNav';
import { useUserStore } from '../src/store/useUserStore';
import { useGameStore } from '../src/store/useGameStore';
import { dailyMissionService, UserDailyMissions, MissionKey } from '../src/services/dailyMissionService';

export default function DailyChallengeScreen() {
  const router = useRouter();
  const { id: userId, hasCompletedDailyChallengeToday } = useUserStore();
  const { startMatch } = useGameStore();

  const [missionsData, setMissionsData] = useState<UserDailyMissions | null>(null);

  const loadMissions = useCallback(async () => {
    if (!userId) return;
    const data = await dailyMissionService.getDailyMissions(userId);
    setMissionsData(data);
  }, [userId]);

  useEffect(() => {
    loadMissions();
  }, [loadMissions]);

  const handleCollectMission = async (_key: MissionKey) => {
    Alert.alert(
      'Recurso em Homologação',
      'A validação e coleta autoritativa de missões no servidor está em fase de homologação. Recompensas temporariamente suspensas para proteção da economia.',
      [{ text: 'Entendido' }]
    );
  };

  const handleStartDailyMatch = () => {
    startMatch({
      mode: 'daily',
      questionCount: 5,
    });
    router.push('/quiz');
  };

  const m1 = missionsData?.missions?.play_match;
  const m2 = missionsData?.missions?.play_duel;
  const m3 = missionsData?.missions?.correct_streak;

  return (
    <View style={styles.container}>
      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        {/* Header com Vidas e Moedas */}
        <HeaderBar showBack />

        <ScrollView 
          contentContainerStyle={styles.scrollContent} 
          showsVerticalScrollIndicator={false}
        >
          {/* Daily Banner Card */}
          <View style={styles.rewardCard}>
            <View style={styles.rewardHeader}>
              <View style={{ flex: 1, paddingRight: 8 }}>
                <Text style={styles.rewardTitle}>Desafio do Dia</Text>
                <Text style={styles.rewardSubtitle}>
                  Partida especial de 5 perguntas com recompensas dobradas!
                </Text>
              </View>
              <LinearGradient
                colors={theme.gradients.statOrange}
                style={styles.chestBox}
              >
                <Gift color="#FFF" size={32} />
              </LinearGradient>
            </View>
            
            <View style={styles.progressSection}>
              <View style={styles.progressLabels}>
                <Text style={styles.progressValue}>
                  STATUS: {hasCompletedDailyChallengeToday ? 'CONCLUÍDO HOJE ✓' : 'DISPONÍVEL'}
                </Text>
              </View>
              
              {!hasCompletedDailyChallengeToday ? (
                <TouchableOpacity 
                  style={styles.startDailyBtn}
                  activeOpacity={0.85}
                  onPress={handleStartDailyMatch}
                >
                  <Play size={18} color="#FFF" fill="#FFF" />
                  <Text style={styles.startDailyBtnText}>JOGAR DESAFIO DIÁRIO</Text>
                </TouchableOpacity>
              ) : (
                <View style={styles.completedBadge}>
                  <CheckCircle2 size={20} color={theme.colors.success.green} />
                  <Text style={styles.completedBadgeText}>Você já garantiu seu bônus diário!</Text>
                </View>
              )}
            </View>
          </View>

          <Text style={styles.sectionTitle}>Missões Diárias</Text>

          {/* Aviso de Homologação de Missões */}
          <View style={{ marginHorizontal: 20, marginBottom: 16, padding: 12, backgroundColor: '#FFFBEB', borderRadius: 12, borderWidth: 1, borderColor: '#FDE68A' }}>
            <Text style={{ fontSize: 13, color: '#B45309', fontFamily: theme.typography.fontFamily.bold, marginBottom: 4 }}>
              ⏳ Validação Autoritativa em Homologação
            </Text>
            <Text style={{ fontSize: 12, color: '#92400E', lineHeight: 17 }}>
              O progresso das missões é registrado localmente. A coleta de moedas e XP está temporariamente suspensa aguardando a ativação do motor autoritativo de validação de partidas no servidor.
            </Text>
          </View>

          {/* Mission 1: Treino Rápido */}
          <View style={[styles.missionCard, m1?.completed && !m1?.claimed && styles.missionReady]}>
            <View style={[styles.missionIconBox, { backgroundColor: theme.colors.success.lime + '20' }]}>
              <Brain color={theme.colors.success.lime} size={28} />
            </View>
            <View style={styles.missionInfo}>
              <Text style={styles.missionTitle}>Treino Rápido</Text>
              <Text style={styles.missionDesc}>Jogue 1 partida de qualquer matéria</Text>
              <View style={styles.rewardPill}>
                <Coins size={12} color={theme.colors.warning.orange} />
                <Text style={styles.rewardPillText}>
                  +60 Moedas • +50 XP ({m1?.current ?? 0}/{m1?.target ?? 1})
                </Text>
              </View>
            </View>
            
            {m1?.claimed ? (
              <View style={styles.collectedTag}>
                <Text style={styles.collectedText}>COLETADO ✓</Text>
              </View>
            ) : m1?.completed ? (
              <TouchableOpacity 
                style={styles.collectButton}
                activeOpacity={0.8}
                onPress={() => handleCollectMission('play_match')}
              >
                <LinearGradient
                  colors={['#F59E0B', '#D97706']}
                  style={styles.collectButtonGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  <Text style={[styles.collectButtonText, { fontSize: 11 }]}>EM HOMOLOGAÇÃO</Text>
                </LinearGradient>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity 
                style={styles.actionButton}
                onPress={() => router.push('/categories')}
              >
                <Text style={styles.actionButtonText}>JOGAR</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Mission 2: Guerreiro do Duelo */}
          <View style={[styles.missionCard, m2?.completed && !m2?.claimed && styles.missionReady]}>
            <View style={[styles.missionIconBox, { backgroundColor: theme.colors.info.cyanSoft + '30' }]}>
              <Swords color={theme.colors.info.tealDark} size={28} />
            </View>
            <View style={styles.missionInfo}>
              <Text style={styles.missionTitle}>Guerreiro do Duelo</Text>
              <Text style={styles.missionDesc}>Participe do Matchmaking 1v1</Text>
              <View style={styles.rewardPill}>
                <Coins size={12} color={theme.colors.warning.orange} />
                <Text style={styles.rewardPillText}>
                  +80 Moedas • +60 XP ({m2?.current ?? 0}/{m2?.target ?? 1})
                </Text>
              </View>
            </View>

            {m2?.claimed ? (
              <View style={styles.collectedTag}>
                <Text style={styles.collectedText}>COLETADO ✓</Text>
              </View>
            ) : m2?.completed ? (
              <TouchableOpacity 
                style={styles.collectButton}
                activeOpacity={0.8}
                onPress={() => handleCollectMission('play_duel')}
              >
                <LinearGradient
                  colors={['#F59E0B', '#D97706']}
                  style={styles.collectButtonGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  <Text style={[styles.collectButtonText, { fontSize: 11 }]}>EM HOMOLOGAÇÃO</Text>
                </LinearGradient>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity 
                style={styles.actionButton}
                onPress={() => router.push('/matchmaking')}
              >
                <Text style={styles.actionButtonText}>JOGAR</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Mission 3: Foco Total */}
          <View style={[styles.missionCard, m3?.completed && !m3?.claimed && styles.missionReady]}>
            <View style={[styles.missionIconBox, { backgroundColor: theme.colors.brand.magenta + '20' }]}>
              <Zap color={theme.colors.brand.magenta} size={28} />
            </View>
            <View style={styles.missionInfo}>
              <Text style={styles.missionTitle}>Foco Total</Text>
              <Text style={styles.missionDesc}>Acerte 5 perguntas seguidas em uma partida</Text>
              <View style={styles.rewardPill}>
                <Coins size={12} color={theme.colors.warning.orange} />
                <Text style={styles.rewardPillText}>
                  +100 Moedas • +80 XP ({m3?.current ?? 0}/{m3?.target ?? 5})
                </Text>
              </View>
            </View>
            
            {m3?.claimed ? (
              <View style={styles.collectedTag}>
                <Text style={styles.collectedText}>COLETADO ✓</Text>
              </View>
            ) : m3?.completed ? (
              <TouchableOpacity 
                style={styles.collectButton}
                activeOpacity={0.8}
                onPress={() => handleCollectMission('correct_streak')}
              >
                <LinearGradient
                  colors={['#F59E0B', '#D97706']}
                  style={styles.collectButtonGradient}
                >
                  <Text style={[styles.collectButtonText, { fontSize: 11 }]}>EM HOMOLOGAÇÃO</Text>
                </LinearGradient>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity 
                style={styles.actionButton}
                onPress={() => router.push('/categories')}
              >
                <Text style={styles.actionButtonText}>JOGAR</Text>
              </TouchableOpacity>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>

      <BottomNav />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.bg.app,
  },
  scrollContent: {
    paddingHorizontal: theme.spacing.containerMargin,
    paddingTop: theme.spacing.sm,
    paddingBottom: 110,
  },
  rewardCard: {
    backgroundColor: '#FFF',
    borderRadius: theme.radius['2xl'],
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
    ...theme.shadows.card,
  },
  rewardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  rewardTitle: {
    fontFamily: theme.typography.fontFamily.black,
    fontSize: 20,
    color: theme.colors.text.primary,
  },
  rewardSubtitle: {
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: 13,
    color: theme.colors.text.muted,
    marginTop: 4,
    lineHeight: 18,
  },
  chestBox: {
    width: 60,
    height: 60,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ rotate: '3deg' }],
    ...theme.shadows.pillowy,
  },
  progressSection: {
    marginTop: 4,
  },
  progressLabels: {
    marginBottom: 10,
  },
  progressValue: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: 12,
    color: theme.colors.brand.magenta,
    letterSpacing: 0.5,
  },
  startDailyBtn: {
    backgroundColor: theme.colors.brand.magenta,
    height: 48,
    borderRadius: theme.radius.xl,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    ...theme.shadows.magentaGlow,
  },
  startDailyBtnText: {
    color: '#FFF',
    fontFamily: theme.typography.fontFamily.black,
    fontSize: 14,
    letterSpacing: 0.5,
  },
  completedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#F0FDF4',
    padding: 12,
    borderRadius: theme.radius.lg,
  },
  completedBadgeText: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: 13,
    color: theme.colors.success.greenDark,
  },
  sectionTitle: {
    fontFamily: theme.typography.fontFamily.black,
    fontSize: 18,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.md,
  },
  missionCard: {
    backgroundColor: '#FFF',
    borderRadius: theme.radius.xl,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
    ...theme.shadows.pillowy,
  },
  missionReady: {
    borderWidth: 1.5,
    borderColor: 'rgba(132, 204, 22, 0.4)',
  },
  missionIconBox: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  missionInfo: {
    flex: 1,
  },
  missionTitle: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: 15,
    color: theme.colors.text.primary,
  },
  missionDesc: {
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: 12,
    color: theme.colors.text.muted,
    marginTop: 2,
  },
  rewardPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.bg.soft,
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: theme.radius.full,
    gap: 4,
    marginTop: 6,
  },
  rewardPillText: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: 11,
    color: theme.colors.text.body,
  },
  collectButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  collectButtonGradient: {
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  collectButtonText: {
    fontFamily: theme.typography.fontFamily.black,
    fontSize: 11,
    color: '#FFF',
  },
  collectedTag: {
    backgroundColor: theme.colors.bg.soft,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  collectedText: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: 11,
    color: theme.colors.success.greenDark,
  },
  actionButton: {
    borderWidth: 1.5,
    borderColor: theme.colors.info.teal,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 10,
  },
  actionButtonText: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: 11,
    color: theme.colors.info.tealDark,
  },
});
