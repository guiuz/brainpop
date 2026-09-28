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
import { ChevronLeft, ShieldCheck, Lock, Eye, Database, Bell, FileText } from 'lucide-react-native';

export default function PrivacyPolicyScreen() {
  const router = useRouter();

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
        <Text style={styles.headerTitle}>Política de Privacidade</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Banner Hero */}
        <Card style={styles.heroCard}>
          <View style={styles.heroIconBox}>
            <ShieldCheck size={32} color={theme.colors.brand.magenta} />
          </View>
          <Text style={styles.heroTitle}>Sua Privacidade é Prioridade</Text>
          <Text style={styles.heroSub}>
            Última atualização: Setembro de 2026. Saiba como o BrainPOP protege e gerencia suas informações no jogo.
          </Text>
        </Card>

        {/* Seção 1 */}
        <Card style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Database size={20} color={theme.colors.info.teal} />
            <Text style={styles.sectionTitle}>1. Coleta e Uso de Informações</Text>
          </View>
          <Text style={styles.paragraph}>
            Coletamos informações essenciais para o funcionamento da sua experiência de jogo, incluindo:
          </Text>
          <View style={styles.bulletList}>
            <Text style={styles.bulletItem}>• Pontuações, nível de jogador, histórico de partidas e acertos por matéria.</Text>
            <Text style={styles.bulletItem}>• Nome de exibição, avatar e identificador exclusivo de conta.</Text>
            <Text style={styles.bulletItem}>• Moedas acumuladas, vidas e inventário de power-ups adquiridos.</Text>
          </View>
        </Card>

        {/* Seção 2 */}
        <Card style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Lock size={20} color={theme.colors.brand.purple} />
            <Text style={styles.sectionTitle}>2. Segurança dos Seus Dados</Text>
          </View>
          <Text style={styles.paragraph}>
            Utilizamos criptografia padrão de mercado e protocolos seguros para armazenar seu progresso. Suas senhas e credenciais de login nunca são expostas nem comercializadas com terceiros.
          </Text>
        </Card>

        {/* Seção 3 */}
        <Card style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Eye size={20} color={theme.colors.warning.orange} />
            <Text style={styles.sectionTitle}>3. Ranking e Visibilidade</Text>
          </View>
          <Text style={styles.paragraph}>
            No Ranking Global e Torneios, apenas seu nome de jogador, avatar e pontuação total de XP são públicos para outros competidores. Nenhuma informação pessoal ou de pagamento é compartilhada.
          </Text>
        </Card>

        {/* Seção 4 */}
        <Card style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Bell size={20} color={theme.colors.success.green} />
            <Text style={styles.sectionTitle}>4. Notificações e Preferências</Text>
          </View>
          <Text style={styles.paragraph}>
            Você pode ativar ou desativar notificações de desafios diários, vidas regeneradas e sons diretamente no menu de Configurações do app a qualquer momento.
          </Text>
        </Card>

        {/* Seção 5 */}
        <Card style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <FileText size={20} color={theme.colors.brand.cyan} />
            <Text style={styles.sectionTitle}>5. Seus Direitos (LGPD)</Text>
          </View>
          <Text style={styles.paragraph}>
            Você tem total direito de solicitar a exclusão ou redefinição dos seus dados de jogador. Para exercer seus direitos, basta utilizar a opção "Redefinir Progresso" ou entrar em contato através do nosso canal de suporte.
          </Text>
        </Card>

        {/* Seção 6: Anúncios Google AdMob e Consentimento UMP */}
        <Card style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <ShieldCheck size={20} color={theme.colors.brand.magenta} />
            <Text style={styles.sectionTitle}>6. Anúncios Premiados (Google AdMob) e Consentimento</Text>
          </View>
          <Text style={styles.paragraph}>
            O BrainPOP exibe anúncios premiados em vídeo por meio do Google AdMob exclusivamente mediante ação voluntária do jogador para resgatar moedas diárias ou revisar erros.
          </Text>
          <Text style={[styles.paragraph, { marginTop: 6 }]}>
            Utilizamos a plataforma de consentimento do usuário (UMP) do Google para garantir transparência nas preferências de anúncios. Você pode revisar e atualizar suas opções de consentimento a qualquer momento na aba Configurações.
          </Text>
        </Card>

        {/* Seção 7: Público-Alvo e Proteção Etária (Famílias / COPPA) */}
        <Card style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Lock size={20} color={theme.colors.info.teal} />
            <Text style={styles.sectionTitle}>7. Proteção Etária e Diretrizes de Família</Text>
          </View>
          <Text style={styles.paragraph}>
            O BrainPOP é classificado como LIVRE e tem como compromisso oferecer um ambiente seguro e educativo para todas as idades.
          </Text>
          <Text style={[styles.paragraph, { marginTop: 6 }]}>
            Todos os anúncios respeitam a classificação máxima de conteúdo PG e as diretrizes do programa Google Play Families Policy, sem exibição de conteúdo inadequado e sem rastreamento intrusivo de menores.
          </Text>
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
    backgroundColor: theme.colors.brand.magenta + '15',
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
  sectionCard: {
    padding: theme.spacing.md,
    backgroundColor: '#FFF',
    ...theme.shadows.pillowy,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 14,
    fontFamily: theme.typography.fontFamily.bold,
    color: theme.colors.text.primary,
  },
  paragraph: {
    fontSize: 13,
    fontFamily: theme.typography.fontFamily.regular,
    color: theme.colors.text.body,
    lineHeight: 20,
  },
  bulletList: {
    marginTop: 6,
    gap: 4,
  },
  bulletItem: {
    fontSize: 12,
    fontFamily: theme.typography.fontFamily.medium,
    color: theme.colors.text.body,
    lineHeight: 18,
  },
});
