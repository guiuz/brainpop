import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Linking,
  Alert
} from 'react-native';
import { theme } from '../src/theme';
import { Card } from '../src/components/Card';
import { useRouter } from 'expo-router';
import { 
  ChevronLeft, 
  ChevronDown, 
  ChevronUp, 
  HelpCircle, 
  Mail, 
  Zap, 
  Heart, 
  Coins, 
  Trophy, 
  Sparkles
} from 'lucide-react-native';

interface FAQItem {
  question: string;
  answer: string;
  icon: any;
  category: string;
}

const FAQS: FAQItem[] = [
  {
    category: 'Jogo & Dinâmica',
    question: 'Como funciona o sistema de pontuação e combo?',
    answer: 'Cada acerto concede 100 pontos base. Quanto mais rápido você responder, maior será o bônus de tempo (+10 pontos/segundo restante). Acertos consecutivos ativam Combos multiplicadores (+25 pontos por sequência acumulada)!',
    icon: Zap,
  },
  {
    category: 'Jogo & Dinâmica',
    question: 'Como regenero minhas vidas quando acabam?',
    answer: 'Suas vidas se regeneram automaticamente com o passar do tempo. Se preferir continuar jogando sem esperar, você pode recarregar instantaneamente todas as 5 vidas na Loja de Moedas.',
    icon: Heart,
  },
  {
    category: 'Power-ups & Táticas',
    question: 'Para que serve cada Power-up durante o Quiz?',
    answer: '• 50/50: Elimina 2 alternativas incorretas.\n• Tempo Extra (+15s): Adiciona 15 segundos para pensar.\n• Pular: Avança para a próxima pergunta sem perder pontos nem quebrar combo.\n• Dica: Descarta 1 opção errada e fornece uma pista estratégica do tema!',
    icon: Sparkles,
  },
  {
    category: 'Economia & Moedas',
    question: 'Como posso ganhar mais Moedas no jogo?',
    answer: 'Você ganha moedas ao completar partidas, acertar sequências de perguntas, concluir o Desafio Diário e vencer Duelos 1v1. Você também pode adquirir pacotes e combos especiais na aba Loja!',
    icon: Coins,
  },
  {
    category: 'Competição & Rankings',
    question: 'Quando o Ranking Global e os Torneios são atualizados?',
    answer: 'O ranking de XP é atualizado em tempo real após cada partida concluída. Os Torneios e Copas semanais distribuem premiações exclusivas em Gemas e Moedas aos primeiros colocados.',
    icon: Trophy,
  },
];

export default function HelpScreen() {
  const router = useRouter();
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);

  const toggleExpand = (idx: number) => {
    setExpandedIndex(expandedIndex === idx ? null : idx);
  };

  const handleContactSupport = () => {
    Alert.alert(
      'Fale com o Suporte',
      'Deseja enviar um e-mail para a equipe do BrainPOP?\n\nsuporte@brainpop.app',
      [
        { text: 'Fechar', style: 'cancel' },
        { 
          text: 'Enviar E-mail', 
          onPress: () => {
            Linking.openURL('mailto:suporte@brainpop.app?subject=Dúvida%20ou%20Suporte%20BrainPOP');
          } 
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.circleBtn} 
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <ChevronLeft color={theme.colors.text.primary} size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Ajuda & FAQ</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Card */}
        <Card style={styles.heroCard}>
          <View style={styles.heroIconBox}>
            <HelpCircle size={32} color={theme.colors.brand.cyan} />
          </View>
          <Text style={styles.heroTitle}>Como podemos te ajudar?</Text>
          <Text style={styles.heroSub}>
            Tire suas dúvidas sobre regras, power-ups, pontuações e funcionamento do BrainPOP.
          </Text>
        </Card>

        {/* Lista de FAQ */}
        <Text style={styles.sectionHeaderTitle}>PERGUNTAS FREQUENTES</Text>

        <View style={styles.faqList}>
          {FAQS.map((faq, idx) => {
            const isExpanded = expandedIndex === idx;
            const Icon = faq.icon;

            return (
              <TouchableOpacity
                key={idx}
                activeOpacity={0.85}
                onPress={() => toggleExpand(idx)}
              >
                <Card style={[styles.faqCard, isExpanded && styles.faqCardExpanded]}>
                  <View style={styles.faqHeader}>
                    <View style={styles.faqIconWrapper}>
                      <Icon size={18} color={theme.colors.brand.magenta} />
                    </View>
                    <Text style={styles.faqQuestion}>{faq.question}</Text>
                    {isExpanded ? (
                      <ChevronUp size={20} color={theme.colors.text.muted} />
                    ) : (
                      <ChevronDown size={20} color={theme.colors.text.muted} />
                    )}
                  </View>

                  {isExpanded && (
                    <View style={styles.faqBody}>
                      <View style={styles.divider} />
                      <Text style={styles.faqAnswer}>{faq.answer}</Text>
                    </View>
                  )}
                </Card>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Card de Contato Suporte */}
        <Card style={styles.contactCard}>
          <View style={styles.contactLeft}>
            <View style={styles.contactIcon}>
              <Mail size={24} color="#FFF" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.contactTitle}>Ainda precisa de ajuda?</Text>
              <Text style={styles.contactSub}>Nossa equipe responde em até 24h.</Text>
            </View>
          </View>
          <TouchableOpacity 
            style={styles.contactBtn}
            activeOpacity={0.8}
            onPress={handleContactSupport}
          >
            <Text style={styles.contactBtnText}>Falar com Suporte</Text>
          </TouchableOpacity>
        </Card>
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
    fontSize: 18,
    fontFamily: theme.typography.fontFamily.black,
    color: theme.colors.text.primary,
  },
  scrollContent: {
    paddingHorizontal: theme.spacing.containerMargin,
    paddingTop: theme.spacing.sm,
    paddingBottom: theme.spacing['4xl'],
    gap: 12,
  },
  heroCard: {
    alignItems: 'center',
    padding: theme.spacing.lg,
    backgroundColor: '#FFF',
    ...theme.shadows.card,
  },
  heroIconBox: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: theme.colors.brand.cyan + '15',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  heroTitle: {
    fontSize: 18,
    fontFamily: theme.typography.fontFamily.black,
    color: theme.colors.text.primary,
    textAlign: 'center',
    marginBottom: 4,
  },
  heroSub: {
    fontSize: 12,
    fontFamily: theme.typography.fontFamily.medium,
    color: theme.colors.text.muted,
    textAlign: 'center',
    lineHeight: 18,
  },
  sectionHeaderTitle: {
    fontSize: 11,
    fontFamily: theme.typography.fontFamily.bold,
    color: theme.colors.text.muted,
    marginTop: 8,
    letterSpacing: 0.5,
  },
  faqList: {
    gap: 10,
  },
  faqCard: {
    padding: 14,
    backgroundColor: '#FFF',
    ...theme.shadows.pillowy,
  },
  faqCardExpanded: {
    borderColor: theme.colors.brand.magenta,
    borderWidth: 1.5,
  },
  faqHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  faqIconWrapper: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.colors.brand.magenta + '15',
    alignItems: 'center',
    justifyContent: 'center',
  },
  faqQuestion: {
    flex: 1,
    fontSize: 13,
    fontFamily: theme.typography.fontFamily.bold,
    color: theme.colors.text.primary,
    lineHeight: 18,
  },
  faqBody: {
    marginTop: 10,
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.border.soft,
    marginBottom: 10,
  },
  faqAnswer: {
    fontSize: 13,
    fontFamily: theme.typography.fontFamily.regular,
    color: theme.colors.text.body,
    lineHeight: 20,
  },
  contactCard: {
    backgroundColor: theme.colors.brand.purple,
    padding: theme.spacing.lg,
    marginTop: 8,
    borderRadius: theme.radius.xl,
    gap: 14,
    ...theme.shadows.pillowy,
  },
  contactLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  contactIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  contactTitle: {
    color: '#FFF',
    fontSize: 15,
    fontFamily: theme.typography.fontFamily.bold,
  },
  contactSub: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 12,
    fontFamily: theme.typography.fontFamily.medium,
  },
  contactBtn: {
    backgroundColor: '#FFF',
    paddingVertical: 12,
    borderRadius: theme.radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contactBtnText: {
    color: theme.colors.brand.purple,
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: 13,
  },
});
