import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState, useEffect } from 'react';
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
import { useRouter } from 'expo-router';
import { ChevronLeft, User, Crown } from 'lucide-react-native';
import { useUserStore } from '../src/store/useUserStore';
import { BottomNav } from '../src/components/BottomNav';
import { firebaseLeaderboardService, LeaderboardPlayer } from '../src/services/firebaseLeaderboardService';

const DEFAULT_RANKING: LeaderboardPlayer[] = [
  { id: '1', name: 'Sofia G.', totalXp: 14500, level: 12, avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80', badge: '🥇', wins: 45, title: 'Mestre Curioso' },
  { id: '2', name: 'Lucas R.', totalXp: 12800, level: 10, avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80', badge: '🥈', wins: 38, title: 'Estrategista' },
  { id: '3', name: 'Ana Silva', totalXp: 11200, level: 9, avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80', badge: '🥉', wins: 31, title: 'Sábia' },
  { id: '4', name: 'Matheus K.', totalXp: 9200, level: 8, avatarUrl: 'https://api.dicebear.com/7.x/avataaars/png?seed=Matheus', wins: 24, title: 'Curioso' },
  { id: '5', name: 'Beatriz L.', totalXp: 7800, level: 7, avatarUrl: 'https://api.dicebear.com/7.x/avataaars/png?seed=Beatriz', wins: 19, title: 'Aspirante' },
  { id: '6', name: 'Gabriel S.', totalXp: 6400, level: 6, avatarUrl: 'https://api.dicebear.com/7.x/avataaars/png?seed=Gabriel', wins: 15, title: 'Aspirante' },
];

export default function LeaderboardScreen() {
  const router = useRouter();
  const [tab, setTab] = useState<'semanal' | 'global'>('semanal');
  const [ranking, setRanking] = useState<LeaderboardPlayer[]>(DEFAULT_RANKING);
  const { name, level, currentXp, avatarUrl } = useUserStore();

  useEffect(() => {
    let unsubscribe: () => void = () => {};

    const loadRanking = async () => {
      const data = await firebaseLeaderboardService.fetchTopPlayers(15);
      if (data && data.length > 0) {
        setRanking(data);
      }

      unsubscribe = firebaseLeaderboardService.subscribeToTopPlayers(15, (liveData) => {
        if (liveData && liveData.length > 0) {
          setRanking(liveData);
        }
      });
    };

    loadRanking();
    return () => unsubscribe();
  }, []);

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
          <Text style={styles.headerTitle}>Classificação</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Abas */}
        <View style={styles.tabContainer}>
          <TouchableOpacity 
            style={[styles.tab, tab === 'semanal' && styles.tabActive]} 
            onPress={() => setTab('semanal')}
            activeOpacity={0.8}
          >
            <Text style={[styles.tabText, tab === 'semanal' && styles.tabTextActive]}>Semanal</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tab, tab === 'global' && styles.tabActive]} 
            onPress={() => setTab('global')}
            activeOpacity={0.8}
          >
            <Text style={[styles.tabText, tab === 'global' && styles.tabTextActive]}>Geral</Text>
          </TouchableOpacity>
        </View>

        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Pódio dos 3 Melhores */}
          <View style={styles.podium}>
            {/* 2º Lugar - Prata */}
            {ranking[1] && (
              <View style={styles.podiumItem}>
                <View style={[styles.avatarBox, styles.avatarSilver]}>
                  <Image source={{ uri: ranking[1].avatarUrl }} style={styles.avatarImg} />
                  <View style={styles.podiumBadgeSilver}>
                    <Text style={styles.podiumBadgeText}>2</Text>
                  </View>
                </View>
                <Text style={styles.podiumName} numberOfLines={1}>{ranking[1].name}</Text>
                <Text style={styles.podiumXP}>{ranking[1].totalXp.toLocaleString()} XP</Text>
              </View>
            )}

            {/* 1º Lugar - Ouro */}
            {ranking[0] && (
              <View style={[styles.podiumItem, styles.podiumFirst]}>
                <Crown size={24} color={theme.colors.warning.amber} style={styles.crownIcon} />
                <View style={[styles.avatarBox, styles.avatarGold]}>
                  <Image source={{ uri: ranking[0].avatarUrl }} style={styles.avatarImg} />
                  <View style={styles.podiumBadgeGold}>
                    <Text style={styles.podiumBadgeText}>1</Text>
                  </View>
                </View>
                <Text style={styles.podiumName} numberOfLines={1}>{ranking[0].name}</Text>
                <Text style={[styles.podiumXP, styles.podiumXpGold]}>{ranking[0].totalXp.toLocaleString()} XP</Text>
              </View>
            )}

            {/* 3º Lugar - Bronze */}
            {ranking[2] && (
              <View style={styles.podiumItem}>
                <View style={[styles.avatarBox, styles.avatarBronze]}>
                  <Image source={{ uri: ranking[2].avatarUrl }} style={styles.avatarImg} />
                  <View style={styles.podiumBadgeBronze}>
                    <Text style={styles.podiumBadgeText}>3</Text>
                  </View>
                </View>
                <Text style={styles.podiumName} numberOfLines={1}>{ranking[2].name}</Text>
                <Text style={styles.podiumXP}>{ranking[2].totalXp.toLocaleString()} XP</Text>
              </View>
            )}
          </View>

          {/* Lista do 4º em diante */}
          <View style={styles.list}>
            {ranking.slice(3).map((item, index) => (
              <Card key={item.id} style={styles.rankCard}>
                <View style={styles.rankInfo}>
                  <Text style={styles.rankNumber}>#{index + 4}</Text>
                  <View style={styles.miniAvatar}>
                    {item.avatarUrl ? (
                      <Image source={{ uri: item.avatarUrl }} style={styles.avatarImg} />
                    ) : (
                      <User color={theme.colors.text.muted} size={18} />
                    )}
                  </View>
                  <View>
                    <Text style={styles.itemName}>{item.name}</Text>
                    <Text style={styles.itemLevel}>Nível {item.level}</Text>
                  </View>
                </View>
                <View style={styles.rankStats}>
                  <Text style={styles.itemXP}>{item.totalXp.toLocaleString()}</Text>
                  <Text style={styles.xpLabel}>XP</Text>
                </View>
              </Card>
            ))}
          </View>
        </ScrollView>

        {/* Card Fixo do Jogador */}
        <Card style={styles.userRankStick}>
          <View style={styles.rankInfo}>
            <Text style={styles.userRankNumber}>#14</Text>
            <View style={styles.userAvatarBox}>
              <Image source={{ uri: avatarUrl }} style={styles.avatarImg} />
            </View>
            <View>
              <Text style={styles.userName}>{name} (Você)</Text>
              <Text style={styles.itemLevel}>Nível {level}</Text>
            </View>
          </View>
          <View style={styles.rankStats}>
            <Text style={styles.userXP}>{currentXp.toLocaleString()}</Text>
            <Text style={styles.xpLabel}>XP</Text>
          </View>
        </Card>
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
  tabContainer: {
    flexDirection: 'row',
    marginHorizontal: theme.spacing.containerMargin,
    backgroundColor: theme.colors.bg.soft,
    borderRadius: theme.radius.xl,
    padding: 4,
    marginVertical: theme.spacing.sm,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: theme.radius.lg,
  },
  tabActive: {
    backgroundColor: theme.colors.bg.surface,
    ...theme.shadows.pillowy,
  },
  tabText: {
    fontSize: theme.typography.sizes.bodySm,
    fontFamily: theme.typography.fontFamily.bold,
    color: theme.colors.text.muted,
  },
  tabTextActive: {
    color: theme.colors.brand.magenta,
  },
  scrollContent: {
    paddingHorizontal: theme.spacing.containerMargin,
    paddingBottom: 170,
  },
  podium: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    gap: 16,
    marginBottom: theme.spacing.xl,
    marginTop: theme.spacing.lg,
  },
  podiumItem: {
    alignItems: 'center',
    width: 90,
  },
  podiumFirst: {
    width: 104,
    marginBottom: 16,
  },
  crownIcon: {
    marginBottom: 4,
  },
  avatarBox: {
    borderRadius: 40,
    borderWidth: 3,
    backgroundColor: theme.colors.bg.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    position: 'relative',
    ...theme.shadows.card,
  },
  avatarImg: {
    width: '100%',
    height: '100%',
    borderRadius: 40,
  },
  avatarGold: {
    width: 80,
    height: 80,
    borderColor: '#F59E0B',
  },
  avatarSilver: {
    width: 66,
    height: 66,
    borderColor: '#94A3B8',
  },
  avatarBronze: {
    width: 66,
    height: 66,
    borderColor: '#D97706',
  },
  podiumBadgeGold: {
    position: 'absolute',
    bottom: -6,
    backgroundColor: '#F59E0B',
    borderRadius: 10,
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  podiumBadgeSilver: {
    position: 'absolute',
    bottom: -6,
    backgroundColor: '#94A3B8',
    borderRadius: 10,
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  podiumBadgeBronze: {
    position: 'absolute',
    bottom: -6,
    backgroundColor: '#D97706',
    borderRadius: 10,
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  podiumBadgeText: {
    color: '#FFF',
    fontFamily: theme.typography.fontFamily.black,
    fontSize: 10,
  },
  podiumName: {
    fontSize: 13,
    fontFamily: theme.typography.fontFamily.bold,
    color: theme.colors.text.primary,
    textAlign: 'center',
  },
  podiumXP: {
    fontSize: 11,
    color: theme.colors.text.muted,
    fontFamily: theme.typography.fontFamily.bold,
    marginTop: 2,
  },
  podiumXpGold: {
    color: theme.colors.brand.magenta,
  },
  list: {
    gap: 10,
  },
  rankCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    ...theme.shadows.pillowy,
  },
  rankInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  rankNumber: {
    fontSize: 14,
    fontFamily: theme.typography.fontFamily.black,
    color: theme.colors.text.muted,
    width: 28,
  },
  userRankNumber: {
    fontSize: 14,
    fontFamily: theme.typography.fontFamily.black,
    color: theme.colors.brand.magenta,
    width: 28,
  },
  miniAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: theme.colors.bg.soft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userAvatarBox: {
    width: 38,
    height: 38,
    borderRadius: 19,
    overflow: 'hidden',
  },
  itemName: {
    fontSize: 13,
    fontFamily: theme.typography.fontFamily.bold,
    color: theme.colors.text.primary,
  },
  userName: {
    fontSize: 13,
    fontFamily: theme.typography.fontFamily.black,
    color: theme.colors.brand.magenta,
  },
  itemLevel: {
    fontSize: 10,
    color: theme.colors.text.muted,
    fontFamily: theme.typography.fontFamily.medium,
  },
  rankStats: {
    alignItems: 'flex-end',
  },
  itemXP: {
    fontSize: 14,
    fontFamily: theme.typography.fontFamily.extraBold,
    color: theme.colors.brand.cyan,
  },
  userXP: {
    fontSize: 14,
    fontFamily: theme.typography.fontFamily.black,
    color: theme.colors.brand.magenta,
  },
  xpLabel: {
    fontSize: 8,
    fontFamily: theme.typography.fontFamily.black,
    color: theme.colors.text.muted,
  },
  userRankStick: {
    position: 'absolute',
    bottom: 84,
    left: theme.spacing.containerMargin,
    right: theme.spacing.containerMargin,
    backgroundColor: theme.colors.bg.surface,
    borderWidth: 2,
    borderColor: theme.colors.brand.magenta,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    ...theme.shadows.magentaGlow,
  },
});
