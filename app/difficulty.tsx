import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView
} from 'react-native';
import { theme } from '../src/theme';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { 
  ChevronLeft, 
  CheckCircle2, 
  Brain,
  Play
} from 'lucide-react-native';
import { useGameStore } from '../src/store/useGameStore';

const DIFFICULTIES = [
  {
    id: 'easy' as const,
    label: 'Fácil',
    description: 'Perfeito para aquecer — 70% de acerto esperado',
    emoji: '🌱',
    color: theme.colors.success.green,
    bg: '#F0FDF4',
    iconBg: '#DCFCE7',
    bonusXp: '1x XP',
  },
  {
    id: 'medium' as const,
    label: 'Médio',
    description: 'Desafio equilibrado com ritmo moderado',
    emoji: '🔥',
    color: theme.colors.warning.orange,
    bg: '#FFFBEB',
    iconBg: '#FEF3C7',
    bonusXp: '1.5x XP',
  },
  {
    id: 'hard' as const,
    label: 'Difícil',
    description: 'Para verdadeiros mestres — tempo reduzido e mais XP',
    emoji: '💀',
    color: theme.colors.brand.magenta,
    bg: '#FDF2F8',
    iconBg: '#FCE7F3',
    bonusXp: '2.5x XP',
  },
];

export default function DifficultyScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const category = (params.category as string) || 'all';

  const [selectedDifficulty, setSelectedDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const { startMatch } = useGameStore();

  const handleStartGame = () => {
    // Consumir vida ou permitir caso esteja treinando
    startMatch({
      category,
      difficulty: selectedDifficulty,
      questionCount: 10,
    });
    router.replace('/quiz');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => router.back()} 
          style={styles.circleBtn}
          activeOpacity={0.7}
        >
          <ChevronLeft color={theme.colors.text.primary} size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Dificuldade</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.subtitle}>Selecione o nível de intensidade para a rodada</Text>

        <View style={styles.optionsList}>
          {DIFFICULTIES.map((item) => {
            const isSelected = selectedDifficulty === item.id;
            return (
              <TouchableOpacity
                key={item.id}
                activeOpacity={0.8}
                onPress={() => setSelectedDifficulty(item.id)}
                style={[
                  styles.difficultyCard,
                  { backgroundColor: isSelected ? '#FFF' : item.bg },
                  isSelected && { borderColor: item.color, borderWidth: 2.5 }
                ]}
              >
                <View style={[styles.emojiContainer, { backgroundColor: item.iconBg }]}>
                  <Text style={styles.emoji}>{item.emoji}</Text>
                </View>
                
                <View style={styles.cardInfo}>
                  <View style={styles.titleRow}>
                    <Text style={[styles.cardTitle, { color: item.color }]}>{item.label}</Text>
                    <View style={[styles.badgeXp, { backgroundColor: item.color + '20' }]}>
                      <Text style={[styles.badgeXpText, { color: item.color }]}>{item.bonusXp}</Text>
                    </View>
                  </View>
                  <Text style={styles.cardDesc}>{item.description}</Text>
                </View>

                {isSelected && (
                  <CheckCircle2 color={item.color} size={22} />
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Dica de Bônus */}
        <View style={styles.tipCard}>
          <Brain color={theme.colors.brand.magenta} size={32} />
          <Text style={styles.tipText}>
            Dificuldades maiores concedem muito mais moedas e aceleram seu progresso de nível!
          </Text>
        </View>
      </ScrollView>

      {/* Botão de Iniciar */}
      <View style={styles.footer}>
        <TouchableOpacity 
          activeOpacity={0.9} 
          style={styles.ctaButton}
          onPress={handleStartGame}
        >
          <Text style={styles.ctaText}>INICIAR PARTIDA</Text>
          <Play color="#FFF" size={20} fill="#FFF" />
        </TouchableOpacity>
      </View>
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
    paddingBottom: 110,
  },
  optionsList: {
    gap: theme.spacing.md,
  },
  difficultyCard: {
    minHeight: 90,
    borderRadius: theme.radius.xl,
    padding: theme.spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'transparent',
    ...theme.shadows.pillowy,
  },
  emojiContainer: {
    width: 52,
    height: 52,
    borderRadius: theme.radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: {
    fontSize: 26,
  },
  cardInfo: {
    flex: 1,
    marginLeft: theme.spacing.md,
    marginRight: theme.spacing.xs,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  cardTitle: {
    fontSize: theme.typography.sizes.body,
    fontFamily: theme.typography.fontFamily.bold,
  },
  badgeXp: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  badgeXpText: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: 10,
  },
  cardDesc: {
    fontSize: 12,
    color: theme.colors.text.muted,
    marginTop: 2,
    lineHeight: 16,
  },
  tipCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: theme.colors.bg.surface,
    padding: theme.spacing.lg,
    borderRadius: theme.radius.xl,
    marginTop: theme.spacing.xl,
    ...theme.shadows.pillowy,
  },
  tipText: {
    flex: 1,
    fontSize: 12,
    fontFamily: theme.typography.fontFamily.medium,
    color: theme.colors.text.body,
    lineHeight: 18,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: theme.spacing.containerMargin,
    paddingBottom: theme.spacing.xl,
    backgroundColor: '#FFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    ...theme.shadows.card,
  },
  ctaButton: {
    height: 56,
    borderRadius: theme.radius['2xl'],
    backgroundColor: theme.colors.brand.magenta,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    ...theme.shadows.magentaGlow,
  },
  ctaText: {
    fontSize: 18,
    fontFamily: theme.typography.fontFamily.black,
    color: '#FFF',
    letterSpacing: 1,
  },
});
