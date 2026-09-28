import { SafeAreaView } from 'react-native-safe-area-context';
import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity
} from 'react-native';
import { theme } from '../src/theme';
import { Card } from '../src/components/Card';
import { useRouter } from 'expo-router';
import { 
  Gamepad2, 
  Swords, 
  GraduationCap,
  ChevronLeft
} from 'lucide-react-native';

const MODES = [
  { 
    id: 'arcade', 
    title: 'Arcade', 
    icon: Gamepad2, 
    color: theme.colors.brand.magenta, 
    badge: 'CLÁSSICO',
    desc: 'Corra contra o cronômetro, acumule combos e bata seus recordes de pontuação.' 
  },
  { 
    id: 'duelo', 
    title: 'Duelo 1v1', 
    icon: Swords, 
    color: theme.colors.brand.purple, 
    badge: 'COMPETITIVO',
    desc: 'Aposte moedas, role os dados pelo posto de Líder com 3 vidas e dispute o Desafiante!' 
  },
  { 
    id: 'treino', 
    title: 'Treino', 
    icon: GraduationCap, 
    color: theme.colors.info.teal, 
    badge: 'LIVRE',
    desc: 'Explore perguntas de todas as categorias sem pressão e sem perder vidas.' 
  },
];

export default function ModeSelectionScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.circleBtn} 
          onPress={() => router.push('/home')}
          activeOpacity={0.7}
        >
          <ChevronLeft color={theme.colors.text.primary} size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Escolha o Modo</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.subtitle}>Selecione como você deseja jogar hoje</Text>

        <View style={styles.list}>
          {MODES.map((mode) => {
            const Icon = mode.icon;
            return (
              <TouchableOpacity 
                key={mode.id} 
                style={styles.modeCardWrapper}
                activeOpacity={0.88}
                onPress={() => {
                  if (mode.id === 'duelo') {
                    router.push('/matchmaking');
                  } else if (mode.id === 'treino') {
                    router.push({ pathname: '/categories', params: { mode: 'practice' } });
                  } else {
                    router.push({ pathname: '/categories', params: { mode: 'arcade' } });
                  }
                }}
              >
                <Card style={styles.modeCard}>
                  {/* Icon and Badge Header */}
                  <View style={styles.cardHeader}>
                    <View style={[styles.iconBox, { backgroundColor: mode.color + '15' }]}>
                      <Icon color={mode.color} size={32} />
                    </View>
                    <View style={[styles.badgePill, { backgroundColor: mode.color + '20' }]}>
                      <Text style={[styles.badgeText, { color: mode.color }]}>{mode.badge}</Text>
                    </View>
                  </View>

                  {/* Title and Description */}
                  <Text style={styles.modeTitle}>{mode.title}</Text>
                  <Text style={styles.modeDesc}>{mode.desc}</Text>
                </Card>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
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
  subtitle: {
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.sizes.bodySm,
    color: theme.colors.text.muted,
    marginBottom: theme.spacing.lg,
  },
  scrollContent: {
    paddingHorizontal: theme.spacing.containerMargin,
    paddingTop: theme.spacing.sm,
    paddingBottom: theme.spacing['3xl'],
  },
  list: {
    gap: 16,
  },
  modeCardWrapper: {
    width: '100%',
  },
  modeCard: {
    padding: theme.spacing.lg,
    ...theme.shadows.card,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.md,
  },
  iconBox: {
    width: 60,
    height: 60,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgePill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 10,
    fontFamily: theme.typography.fontFamily.black,
    letterSpacing: 0.8,
  },
  modeTitle: {
    fontSize: theme.typography.sizes.h2,
    fontFamily: theme.typography.fontFamily.black,
    color: theme.colors.text.primary,
    marginBottom: 6,
  },
  modeDesc: {
    fontSize: 13,
    fontFamily: theme.typography.fontFamily.medium,
    color: theme.colors.text.muted,
    lineHeight: 18,
  },
});
