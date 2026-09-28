import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image
} from 'react-native';
import { theme } from '../src/theme';
import { Card } from '../src/components/Card';
import { Button } from '../src/components/Button';
import { HeaderBar } from '../src/components/HeaderBar';
import { BottomNav } from '../src/components/BottomNav';
import { useUserStore } from '../src/store/useUserStore';
import { 
  Trophy, 
  Star, 
  Gamepad2,
  ChevronRight,
  Sparkles
} from 'lucide-react-native';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const router = useRouter();
  const { 
    name, 
    level, 
    title, 
    avatarUrl, 
    currentXp, 
    xpToNextLevel, 
    coins, 
    dailyStreak,
    stats,
    hasCompletedDailyChallengeToday,
    nameChangesCount,
    hasCompletedProfileTutorial,
    checkDailyStreak
  } = useUserStore();

  useEffect(() => {
    checkDailyStreak();
  }, [checkDailyStreak]);

  const handlePlayNow = () => {
    router.push('/modes');
  };

  const xpProgress = Math.min(currentXp / Math.max(xpToNextLevel, 1), 1);

  return (
    <View style={styles.container}>
      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        {/* Header com Vidas, Streaks e Moedas */}
        <HeaderBar showStats showSettings />

        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Logo Centralizada / Banner */}
          <View style={styles.logoRow}>
            <Image 
              source={require('../Logo/icon.png')} 
              style={styles.logoImage}
              resizeMode="contain"
            />
            <TouchableOpacity 
              style={styles.pvpBadge}
              activeOpacity={0.8}
              onPress={() => router.push('/matchmaking')}
            >
              <Gamepad2 size={16} color="#FFF" />
              <Text style={styles.pvpText}>Duelo 1v1</Text>
            </TouchableOpacity>
          </View>

          {/* Tutorial Inicial de Perfil */}
          {!hasCompletedProfileTutorial && nameChangesCount === 0 && (
            <TouchableOpacity 
              style={styles.tutorialBanner}
              activeOpacity={0.88}
              onPress={() => router.push('/profile' as any)}
            >
              <View style={styles.tutorialIconWrapper}>
                <Sparkles size={20} color="#FFF" />
              </View>
              <View style={{ flex: 1 }}>
                <View style={styles.tutorialTitleRow}>
                  <Text style={styles.tutorialTitle}>Personalize seu Perfil</Text>
                  <View style={styles.freeBadge}>
                    <Text style={styles.freeBadgeText}>1ª TROCA GRÁTIS</Text>
                  </View>
                </View>
                <Text style={styles.tutorialSubtitle}>
                  Toque para escolher seu avatar e definir seu nome de jogador único!
                </Text>
              </View>
              <View style={styles.tutorialArrow}>
                <ChevronRight size={18} color="#FFF" />
              </View>
            </TouchableOpacity>
          )}

          {/* Profile Card */}
          <TouchableOpacity 
            activeOpacity={0.9} 
            onPress={() => router.push('/profile' as any)}
          >
            <Card style={styles.profileCard}>
              <View style={styles.profileInfo}>
                <View style={styles.avatarGradient}>
                  <View style={styles.avatarInner}>
                    <Image 
                      source={{ uri: avatarUrl }}
                      style={styles.avatarImage}
                    />
                  </View>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.userName}>{name}</Text>
                  <Text style={styles.userLevel}>
                    Nível {String(level).padStart(2, '0')} • <Text style={{ color: theme.colors.brand.magenta, fontFamily: theme.typography.fontFamily.bold }}>{title}</Text>
                  </Text>

                  {/* XP Progress Mini Bar */}
                  <View style={styles.xpBarContainer}>
                    <View style={styles.xpTrack}>
                      <View style={[styles.xpFill, { width: `${xpProgress * 100}%` }]} />
                    </View>
                    <Text style={styles.xpText}>{currentXp}/{xpToNextLevel} XP</Text>
                  </View>
                </View>
                <ChevronRight size={20} color={theme.colors.text.muted} />
              </View>
            </Card>
          </TouchableOpacity>

          {/* Metric Badges Row */}
          <View style={styles.statsRow}>
            <Card variant="gradient-teal" style={styles.statCard}>
              <Text style={styles.statNumber}>{currentXp.toLocaleString()}</Text>
              <Text style={styles.statLabel}>XP Total</Text>
            </Card>
            <Card variant="gradient-orange" style={styles.statCard}>
              <Text style={styles.statNumber}>{dailyStreak}</Text>
              <Text style={styles.statLabel}>Streak 🔥</Text>
            </Card>
            <Card variant="gradient-cyan" style={styles.statCard}>
              <Text style={styles.statNumber}>{coins}</Text>
              <Text style={styles.statLabel}>Moedas 🪙</Text>
            </Card>
          </View>



          {/* CTA Principal - JOGAR AGORA */}
          <Button 
            title="JOGAR AGORA" 
            onPress={handlePlayNow} 
            variant="primary"
            style={styles.playButton}
          />

          {/* Ações Secundárias */}
          <View style={styles.secondaryActions}>
            <TouchableOpacity 
              style={[styles.actionPill, styles.pillCyan]}
              activeOpacity={0.8}
              onPress={() => router.push('/daily-challenge')}
            >
              <Star size={18} color={theme.colors.brand.cyan} fill={theme.colors.brand.cyan} />
              <View style={styles.actionPillTextContainer}>
                <Text style={styles.pillTitle} numberOfLines={1}>Desafio Diário</Text>
                <Text style={styles.pillSubtitle} numberOfLines={1}>
                  {hasCompletedDailyChallengeToday ? 'Concluído hoje ✓' : '+200 XP Bônus'}
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.actionPill, styles.pillGreen]} 
              activeOpacity={0.8}
              onPress={() => router.push('/leaderboard')}
            >
              <Trophy size={18} color={theme.colors.success.green} />
              <View style={styles.actionPillTextContainer}>
                <Text style={styles.pillTitle} numberOfLines={1}>Ranking</Text>
                <Text style={styles.pillSubtitle} numberOfLines={1}>Top Jogadores</Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Estatísticas Rápidas do Jogador */}
          <View style={styles.bigStatsRow}>
            <Card style={styles.bigStatCard}>
              <Text style={styles.bigEmoji}>🎯</Text>
              <View style={styles.bigStatTextCenter}>
                <Text style={[styles.bigStatNumber, { color: theme.colors.info.tealDark }]}>
                  {stats.totalCorrectAnswers}
                </Text>
                <Text style={styles.bigStatLabel}>Acertos Totais</Text>
              </View>
            </Card>

            <Card style={styles.bigStatCard}>
              <Text style={styles.bigEmoji}>🏆</Text>
              <View style={styles.bigStatTextCenter}>
                <Text style={[styles.bigStatNumber, { color: theme.colors.success.greenDark }]}>
                  {stats.totalWins}
                </Text>
                <Text style={styles.bigStatLabel}>Vitórias</Text>
              </View>
            </Card>
          </View>

          {/* Banner de Loja e Power-ups */}
          <TouchableOpacity 
            activeOpacity={0.85}
            onPress={() => router.push('/shop')}
            style={styles.shopBanner}
          >
            <View style={styles.shopBannerIcon}>
              <Sparkles size={24} color="#FFF" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.shopBannerTitle}>Loja de Power-ups & Vidas</Text>
              <Text style={styles.shopBannerSubtitle}>Turbine suas chances nas partidas</Text>
            </View>
            <ChevronRight size={20} color="#FFF" />
          </TouchableOpacity>
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
  logoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: theme.spacing.xs,
    marginBottom: theme.spacing.sm,
  },
  logoImage: {
    height: 44,
    width: 130,
  },
  pvpBadge: {
    backgroundColor: theme.colors.brand.purple,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: theme.radius.full,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    ...theme.shadows.pillowy,
  },
  pvpText: {
    color: '#FFF',
    fontFamily: theme.typography.fontFamily.black,
    fontSize: 12,
  },
  scrollContent: {
    paddingHorizontal: theme.spacing.containerMargin,
    paddingTop: theme.spacing.xs,
    paddingBottom: 110,
  },
  profileCard: {
    marginTop: theme.spacing.sm,
    ...theme.shadows.card,
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  avatarGradient: {
    width: 54,
    height: 54,
    borderRadius: 27,
    padding: 2,
    backgroundColor: theme.colors.brand.magenta,
  },
  avatarInner: {
    width: '100%',
    height: '100%',
    borderRadius: 25,
    backgroundColor: '#FFF',
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  userName: {
    fontFamily: theme.typography.fontFamily.black,
    fontSize: 17,
    color: theme.colors.text.primary,
  },
  userLevel: {
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: 13,
    color: theme.colors.text.muted,
  },
  xpBarContainer: {
    marginTop: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  xpTrack: {
    flex: 1,
    height: 6,
    backgroundColor: '#E2E8F0',
    borderRadius: 3,
    overflow: 'hidden',
  },
  xpFill: {
    height: '100%',
    backgroundColor: theme.colors.brand.magenta,
    borderRadius: 3,
  },
  xpText: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: 11,
    color: theme.colors.text.muted,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: theme.spacing.lg,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  statNumber: {
    fontFamily: theme.typography.fontFamily.black,
    fontSize: 20,
    color: '#FFF',
  },
  statLabel: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: 11,
    color: 'rgba(255,255,255,0.85)',
    textTransform: 'uppercase',
  },
  playButton: {
    marginTop: theme.spacing.xl,
    marginBottom: theme.spacing.md,
  },
  secondaryActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionPill: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: theme.radius.xl,
    borderWidth: 1.5,
    backgroundColor: '#FFFFFF',
    ...theme.shadows.pillowy,
  },
  actionPillTextContainer: {
    flex: 1,
    minWidth: 0,
    backgroundColor: 'transparent',
  },
  pillCyan: {
    borderColor: theme.colors.brand.cyan,
  },
  pillGreen: {
    borderColor: theme.colors.success.green,
  },
  pillTitle: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: 13,
    color: theme.colors.text.primary,
    backgroundColor: 'transparent',
  },
  pillSubtitle: {
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: 10,
    color: theme.colors.text.muted,
    backgroundColor: 'transparent',
  },
  bigStatsRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: theme.spacing.lg,
  },
  bigStatCard: {
    flex: 1,
    alignItems: 'center',
    gap: 6,
    paddingVertical: 16,
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: theme.colors.border.soft,
  },
  bigEmoji: {
    fontSize: 28,
  },
  bigStatTextCenter: {
    alignItems: 'center',
  },
  bigStatNumber: {
    fontFamily: theme.typography.fontFamily.black,
    fontSize: 26,
    lineHeight: 32,
  },
  bigStatLabel: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: 11,
    color: theme.colors.text.muted,
    textTransform: 'uppercase',
  },
  shopBanner: {
    marginTop: theme.spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.brand.purple,
    padding: theme.spacing.md,
    borderRadius: theme.radius.xl,
    gap: 12,
    ...theme.shadows.pillowy,
  },
  shopBannerIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  shopBannerTitle: {
    color: '#FFF',
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: 14,
  },
  shopBannerSubtitle: {
    color: 'rgba(255,255,255,0.8)',
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: 11,
  },
  tutorialBanner: {
    marginTop: theme.spacing.xs,
    marginBottom: theme.spacing.xs,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderWidth: 1.5,
    borderColor: theme.colors.brand.magenta,
    borderRadius: theme.radius.xl,
    padding: 14,
    gap: 12,
    ...theme.shadows.magentaGlow,
  },
  tutorialIconWrapper: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: theme.colors.brand.magenta,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tutorialTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 2,
  },
  tutorialTitle: {
    fontFamily: theme.typography.fontFamily.black,
    fontSize: 13,
    color: theme.colors.text.primary,
  },
  freeBadge: {
    backgroundColor: 'rgba(236, 72, 153, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: theme.radius.full,
  },
  freeBadgeText: {
    fontSize: 9,
    fontFamily: theme.typography.fontFamily.black,
    color: theme.colors.brand.magenta,
    letterSpacing: 0.5,
  },
  tutorialSubtitle: {
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: 11,
    color: theme.colors.text.muted,
    lineHeight: 15,
  },
  tutorialArrow: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: theme.colors.brand.magenta,
    alignItems: 'center',
    justifyContent: 'center',
  },

});
