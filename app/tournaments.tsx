import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, Bell, Trophy, Rocket, GraduationCap, Brain } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { theme } from '../src/theme';
import { BottomNav } from '../src/components/BottomNav';
import { useGameStore } from '../src/store/useGameStore';
import { useUserStore } from '../src/store/useUserStore';

export default function TournamentsScreen() {
  const router = useRouter();
  const { startMatch } = useGameStore();
  const { joinTournament } = useUserStore();

  const handleJoinChampionship = () => {
    Alert.alert(
      'Global Championship 🏆',
      'Deseja entrar na rodada oficial do campeonato agora? Você responderá 10 perguntas contra o tempo para somar pontos na tabela geral!',
      [
        { text: 'Mais Tarde', style: 'cancel' },
        { 
          text: 'Jogar Agora!', 
          onPress: () => {
            joinTournament();
            startMatch({ questionCount: 10, mode: 'solo' });
            router.push('/quiz');
          }
        }
      ]
    );
  };

  const handleJoinTournament = (title: string, prize: string) => {
    Alert.alert(
      `${title} ⚔️`,
      `Torneio com premiação de ${prize}.\nDeseja disputar a chave classificatória agora?`,
      [
        { text: 'Voltar', style: 'cancel' },
        { 
          text: 'Entrar na Chave', 
          onPress: () => {
            joinTournament();
            startMatch({ questionCount: 10, mode: 'solo' });
            router.push('/quiz');
          }
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <TouchableOpacity onPress={() => router.back()} style={styles.iconButton}>
              <ChevronLeft size={24} color={theme.colors.brand.magenta} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Torneios</Text>
          </View>
          <TouchableOpacity 
            style={styles.iconButton}
            onPress={() => Alert.alert('Notificações de Torneios', 'Você receberá avisos no início de cada nova temporada!')}
          >
            <Bell size={24} color={theme.colors.brand.magenta} />
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Banner Destaque */}
          <LinearGradient
            colors={['#8B5CF6', '#EC4899']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.promoBanner}
          >
            <View style={styles.promoIconBg}>
              <Trophy size={140} color="rgba(255,255,255,0.2)" />
            </View>
            <View style={styles.promoContent}>
              <View style={styles.promoTitleRow}>
                <Text style={styles.promoEmoji}>🏆</Text>
                <Text style={styles.promoTitle}>Global Championship</Text>
              </View>
              <Text style={styles.promoSubtitle}>
                12.4K jogadores • Termina em <Text style={{ fontFamily: theme.typography.fontFamily.bold }}>23h</Text>
              </Text>
              <TouchableOpacity 
                style={styles.promoButton}
                activeOpacity={0.85}
                onPress={handleJoinChampionship}
              >
                <Text style={styles.promoButtonText}>Participar</Text>
              </TouchableOpacity>
            </View>
          </LinearGradient>

          {/* Seção: Em andamento */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Em andamento</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalScroll}>
              
              {/* Card 1 */}
              <TouchableOpacity 
                style={styles.horizontalCard}
                activeOpacity={0.85}
                onPress={() => handleJoinTournament('Blitz Mensal', '2.500 Gems')}
              >
                <View style={styles.cardHeader}>
                  <View style={[styles.iconBox, { backgroundColor: 'rgba(103, 232, 249, 0.2)' }]}>
                    <Rocket size={20} color="#14B8A6" />
                  </View>
                  <View style={styles.badgeSuccess}>
                    <Text style={styles.badgeSuccessText}>INSCRITO</Text>
                  </View>
                </View>
                <View>
                  <Text style={styles.cardTitle}>Blitz Mensal</Text>
                  <Text style={styles.cardSubtitle}>64 Competidores</Text>
                </View>
                <View style={styles.rewardRow}>
                  <Text style={styles.rewardIcon}>💎</Text>
                  <Text style={styles.rewardText}>2.500 Gems</Text>
                </View>
              </TouchableOpacity>

              {/* Card 2 */}
              <TouchableOpacity 
                style={styles.horizontalCard}
                activeOpacity={0.85}
                onPress={() => handleJoinTournament('Duelo de Lendas', '5.000 Gems')}
              >
                <View style={styles.cardHeader}>
                  <View style={[styles.iconBox, { backgroundColor: 'rgba(139, 92, 246, 0.1)' }]}>
                    <GraduationCap size={20} color="#8B5CF6" />
                  </View>
                </View>
                <View>
                  <Text style={styles.cardTitle}>Duelo de Lendas</Text>
                  <Text style={styles.cardSubtitle}>128 Competidores</Text>
                </View>
                <View style={styles.rewardRow}>
                  <Text style={styles.rewardIcon}>💎</Text>
                  <Text style={styles.rewardText}>5.000 Gems</Text>
                </View>
              </TouchableOpacity>

              {/* Card 3 */}
              <TouchableOpacity 
                style={styles.horizontalCard}
                activeOpacity={0.85}
                onPress={() => handleJoinTournament('Brainiac Open', '1.000 Gems')}
              >
                <View style={styles.cardHeader}>
                  <View style={[styles.iconBox, { backgroundColor: 'rgba(177, 14, 107, 0.1)' }]}>
                    <Brain size={20} color="#EC4899" />
                  </View>
                </View>
                <View>
                  <Text style={styles.cardTitle}>Brainiac Open</Text>
                  <Text style={styles.cardSubtitle}>32 Competidores</Text>
                </View>
                <View style={styles.rewardRow}>
                  <Text style={styles.rewardIcon}>💎</Text>
                  <Text style={styles.rewardText}>1.000 Gems</Text>
                </View>
              </TouchableOpacity>

            </ScrollView>
          </View>

          {/* Seção: Próximos */}
          <View style={[styles.section, { paddingBottom: 40 }]}>
            <Text style={styles.sectionTitle}>Próximos</Text>
            <View style={styles.verticalList}>
              
              {/* Item 1 */}
              <TouchableOpacity 
                style={styles.listItem}
                activeOpacity={0.85}
                onPress={() => handleJoinTournament('Copa Novatos', '500 Gems')}
              >
                <View style={styles.listLeft}>
                  <View style={styles.dateBox}>
                    <Text style={styles.dateMonth}>SET</Text>
                    <Text style={styles.dateDay}>24</Text>
                  </View>
                  <View>
                    <Text style={styles.listTitle}>Copa Novatos</Text>
                    <Text style={styles.listSubtitle}>Inscrição: 100 🪙</Text>
                  </View>
                </View>
                <View style={styles.listRight}>
                  <Text style={styles.listRewardVal}>💎 500</Text>
                  <Text style={styles.listRewardLabel}>PRÊMIO</Text>
                </View>
              </TouchableOpacity>

              {/* Item 2 */}
              <TouchableOpacity 
                style={styles.listItem}
                activeOpacity={0.85}
                onPress={() => handleJoinTournament('Night Quiz Pro', '1.200 Gems')}
              >
                <View style={styles.listLeft}>
                  <View style={styles.dateBox}>
                    <Text style={styles.dateMonth}>SET</Text>
                    <Text style={styles.dateDay}>26</Text>
                  </View>
                  <View>
                    <Text style={styles.listTitle}>Night Quiz Pro</Text>
                    <Text style={styles.listSubtitle}>Inscrição: 500 🪙</Text>
                  </View>
                </View>
                <View style={styles.listRight}>
                  <Text style={styles.listRewardVal}>💎 1.2K</Text>
                  <Text style={styles.listRewardLabel}>PRÊMIO</Text>
                </View>
              </TouchableOpacity>

              {/* Item 3 */}
              <TouchableOpacity 
                style={styles.listItem}
                activeOpacity={0.85}
                onPress={() => handleJoinTournament('Desafio de FDS', '800 Gems')}
              >
                <View style={styles.listLeft}>
                  <View style={styles.dateBox}>
                    <Text style={styles.dateMonth}>OUT</Text>
                    <Text style={styles.dateDay}>02</Text>
                  </View>
                  <View>
                    <Text style={styles.listTitle}>Desafio de FDS</Text>
                    <Text style={styles.listSubtitle}>Grátis</Text>
                  </View>
                </View>
                <View style={styles.listRight}>
                  <Text style={styles.listRewardVal}>💎 800</Text>
                  <Text style={styles.listRewardLabel}>PRÊMIO</Text>
                </View>
              </TouchableOpacity>

            </View>
          </View>

        </ScrollView>
      </SafeAreaView>

      {/* Bottom Navigation Padronizado */}
      <BottomNav />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    height: 64,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    backgroundColor: 'rgba(250, 248, 255, 0.8)',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  iconButton: {
    padding: 4,
  },
  headerTitle: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: 22,
    color: '#131b2e',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
  },
  promoBanner: {
    height: 160,
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
    justifyContent: 'center',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 8,
    overflow: 'hidden',
  },
  promoIconBg: {
    position: 'absolute',
    right: -10,
    top: -10,
    transform: [{ rotate: '12deg' }],
  },
  promoContent: {
    zIndex: 10,
  },
  promoTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  promoEmoji: {
    fontSize: 20,
  },
  promoTitle: {
    fontFamily: theme.typography.fontFamily.semibold,
    fontSize: 18,
    color: '#ffffff',
    lineHeight: 23,
  },
  promoSubtitle: {
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 12,
  },
  promoButton: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 24,
    paddingVertical: 8,
    borderRadius: 9999,
    alignSelf: 'flex-start',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 4,
  },
  promoButtonText: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: 14,
    color: '#b10e6b',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontFamily: theme.typography.fontFamily.semibold,
    fontSize: 18,
    color: '#131b2e',
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  horizontalScroll: {
    gap: 16,
    paddingBottom: 16,
  },
  horizontalCard: {
    width: 240,
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 4,
    gap: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeSuccess: {
    backgroundColor: '#16A34A',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 9999,
  },
  badgeSuccessText: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: 10,
    color: '#ffffff',
    letterSpacing: 0.5,
  },
  cardTitle: {
    fontFamily: theme.typography.fontFamily.semibold,
    fontSize: 18,
    color: '#131b2e',
  },
  cardSubtitle: {
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: 14,
    color: '#574048',
    marginTop: 2,
  },
  rewardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  rewardIcon: {
    fontSize: 14,
  },
  rewardText: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: 14,
    color: '#F59E0B',
  },
  verticalList: {
    gap: 12,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 4,
  },
  listLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  dateBox: {
    width: 56,
    height: 56,
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dateMonth: {
    fontFamily: theme.typography.fontFamily.semibold,
    fontSize: 12,
    color: '#574048',
  },
  dateDay: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: 22,
    color: '#b10e6b',
  },
  listTitle: {
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: 16,
    color: '#131b2e',
  },
  listSubtitle: {
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: 14,
    color: '#574048',
    marginTop: 2,
  },
  listRight: {
    alignItems: 'flex-end',
  },
  listRewardVal: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: 14,
    color: '#F59E0B',
  },
  listRewardLabel: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: 10,
    color: '#574048',
    marginTop: 2,
  },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
    backgroundColor: 'rgba(250, 248, 255, 0.9)',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingBottom: 24,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 10,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  navItemActiveBg: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderRadius: 12,
  },
  navItemActiveBgVisible: {
    backgroundColor: '#d23284',
  },
  navText: {
    fontFamily: theme.typography.fontFamily.semibold,
    fontSize: 12,
    color: '#574048',
    marginTop: 2,
  },
  navTextActive: {
    color: '#fffbff',
  },
});
