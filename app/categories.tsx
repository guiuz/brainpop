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
  Atom, 
  Globe, 
  History, 
  Palette, 
  BookOpen, 
  Dna,
  ChevronLeft,
  BookMarked
} from 'lucide-react-native';

const CATEGORIES = [
  { id: 'all', title: 'Todas as Matérias', icon: BookOpen, color: theme.colors.info.teal, count: '250 questões' },
  { id: 'historia', title: 'História & Civilizações', icon: History, color: theme.colors.warning.orange, count: '50 questões' },
  { id: 'geografia', title: 'Geografia & Mundo', icon: Globe, color: theme.colors.brand.cyan, count: '50 questões' },
  { id: 'ciencia', title: 'Ciência & Natureza', icon: Dna, color: theme.colors.success.green, count: '50 questões' },
  { id: 'literatura', title: 'Literatura & Livros', icon: BookMarked, color: theme.colors.brand.purple, count: '50 questões' },
  { id: 'cultura_pop', title: 'Entretenimento & Pop', icon: Palette, color: theme.colors.brand.magenta, count: '50 questões' },
  { id: 'desafio_misto', title: 'Desafio Rápido', icon: Atom, color: '#6366F1', count: 'Embaralhado' },
];

export default function CategorySelectionScreen() {
  const router = useRouter();

  const handleSelectCategory = (catId: string) => {
    // Salvar categoria e avançar para seleção de dificuldade
    router.push({ pathname: '/difficulty', params: { category: catId } });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.circleBtn} 
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <ChevronLeft color={theme.colors.text.primary} size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Categorias</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.subtitle}>Escolha seu campo de batalha do conhecimento</Text>

        <View style={styles.grid}>
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            return (
              <TouchableOpacity 
                key={cat.id} 
                style={styles.cardWrapper}
                activeOpacity={0.8}
                onPress={() => handleSelectCategory(cat.id)}
              >
                <Card style={styles.card}>
                  <View style={[styles.iconBox, { backgroundColor: cat.color + '15' }]}>
                    <Icon color={cat.color} size={36} />
                  </View>
                  <Text style={styles.cardTitle}>{cat.title}</Text>
                  <Text style={styles.cardCount}>{cat.count}</Text>
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
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  cardWrapper: {
    width: '48%',
  },
  card: {
    height: 156,
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.md,
    ...theme.shadows.card,
  },
  iconBox: {
    width: 60,
    height: 60,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.sm,
  },
  cardTitle: {
    fontSize: 13,
    fontFamily: theme.typography.fontFamily.bold,
    color: theme.colors.text.primary,
    textAlign: 'center',
  },
  cardCount: {
    fontSize: 10,
    fontFamily: theme.typography.fontFamily.medium,
    color: theme.colors.text.muted,
    marginTop: 2,
  },
});
