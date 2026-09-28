import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Share,
  Alert,
  Modal
} from 'react-native';
import { theme } from '../src/theme';
import { Card } from '../src/components/Card';
import { Button } from '../src/components/Button';
import { useRouter } from 'expo-router';
import { 
  Trophy, 
  Flame, 
  Coins, 
  Share2, 
  RotateCcw, 
  Zap, 
  CheckCircle2, 
  Tv,
  Play,
  Sparkles,
  Swords,
  Crown,
  Heart,
  ChevronRight,
  X,
  GraduationCap,
} from 'lucide-react-native';
import { useGameStore } from '../src/store/useGameStore';
import { useUserStore } from '../src/store/useUserStore';
import { adMobService } from '../src/services/adMobService';
import { getPerformanceFeedback } from '../src/utils/performanceFeedback';
import { DUEL_RANKS, getDuelRankByTrophies, DuelRank } from '../src/data/duelRanks';
import { DuelRankBadge } from '../src/components/DuelRankBadge';
import { dailyMissionService } from '../src/services/dailyMissionService';

export default function ResultScreen() {
  const router = useRouter();
  
  const { 
    score, 
    correctAnswersCount, 
    questions, 
    maxComboStreak, 
    xpEarned, 
    coinsEarned,
    category,
    gameMode,
    duelBot,
    opponentScore,
    hasUsedAdRevive,
    startMatch,
    startReviewRound,
    answeredQuestionLog,
    duelBet,
    isPlayerLeader,
    playerDuelLives,
    opponentDuelLives,
    duelEliminationStatus,
    reviewSession
  } = useGameStore();

  const { 
    recordMatchResult, 
    recordDuelOutcome, 
    duelTrophies, 
    name: userName 
  } = useUserStore();

  const [showRanksModal, setShowRanksModal] = useState(false);
  const [isAdLoading, setIsAdLoading] = useState(false);
  const [duelOutcome, setDuelOutcome] = useState<{
    won: boolean;
    earnedTrophies: number;
    newTotalTrophies: number;
    rankedUp: boolean;
    currentRank: DuelRank;
    coinsEarnedOrLost: number;
  } | null>(null);

  const totalQuestions = questions.length || 10;
  const accuracyPercent = Math.round((correctAnswersCount / Math.max(totalQuestions, 1)) * 100);
  const performance = getPerformanceFeedback(correctAnswersCount, totalQuestions);

  const isReview = gameMode === 'review';
  const isDuel = !isReview && gameMode === 'duel' && duelBot !== null;
  const isPlayerEliminated = isDuel && (playerDuelLives === 0 || duelEliminationStatus === 'player_eliminated');
  const isOpponentEliminated = isDuel && (opponentDuelLives === 0 || duelEliminationStatus === 'opponent_eliminated');

  // Lógica de vitória do Duelo 1v1 com morte súbita
  const isDuelWon = isDuel
    ? (isOpponentEliminated || (!isPlayerEliminated && (playerDuelLives > opponentDuelLives || (playerDuelLives === opponentDuelLives && score > opponentScore))))
    : accuracyPercent >= 60;

  const isDuelDraw = isDuel && !isPlayerEliminated && !isOpponentEliminated && playerDuelLives === opponentDuelLives && score === opponentScore;
  const isVictory = isDuel ? isDuelWon : accuracyPercent >= 60;

  useEffect(() => {
    adMobService.preloadAd('second_chance_rewarded');
  }, []);

  useEffect(() => {
    // 1. Se estiver no modo de revisão pedagógica ('review'), NUNCA grava resultado nem altera progresso
    if (gameMode === 'review') {
      return;
    }

    // 2. Trava estrita de gravação única por partida: se já gravou, não grava novamente
    const gameStoreState = useGameStore.getState();
    if (gameStoreState.hasRecordedMatchResult) {
      return;
    }
    gameStoreState.markMatchResultAsRecorded();

    if (isDuel) {
      // Grava o resultado do Duelo competitivo, distribui o pote e calcula o novo Elo
      const outcome = recordDuelOutcome({
        won: isDuelWon,
        betAmount: duelBet,
      });
      setDuelOutcome(outcome);
    } else {
      // Partida Solo ou Arcade normal
      recordMatchResult({
        won: isVictory,
        correctAnswers: correctAnswersCount,
        totalQuestions: totalQuestions,
        category: category,
        xpGained: xpEarned,
        coinsGained: coinsEarned,
      });
    }

    // Se o jogador alcançou 5 ou mais acertos seguidos na mesma partida, atualiza a missão Foco Total
    const userId = useUserStore.getState().id;
    if (userId && maxComboStreak >= 5) {
      dailyMissionService.recordMissionProgress(userId, { type: 'streak_achieved', streak: maxComboStreak }).catch((e) =>
        console.warn('Sync mission streak error:', e)
      );
    }
    // Grava o resultado da partida estritamente uma única vez na transição para a tela de resultados
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Dados do Elo Atual e Próximo Elo
  const rankInfo = getDuelRankByTrophies(duelOutcome ? duelOutcome.newTotalTrophies : duelTrophies);
  const currentRank = duelOutcome?.currentRank || rankInfo.currentRank;
  const nextRank = rankInfo.nextRank;

  const handlePlayAgain = () => {
    if (isDuel) {
      router.replace('/matchmaking');
    } else {
      startMatch({ 
        category, 
        questionCount: 10,
        mode: 'solo'
      });
      router.replace('/quiz');
    }
  };

  const hasWrongQuestions = answeredQuestionLog.some((item) => !item.isCorrect);

  const handleStartReviewWithAd = () => {
    if (hasUsedAdRevive) {
      Alert.alert('Limite Atingido', 'A revisão de erros via anúncio só pode ser utilizada 1 vez por partida.');
      return;
    }

    if (!hasWrongQuestions) {
      Alert.alert('Nenhum Erro!', 'Você acertou todas as perguntas desta partida! Não há erros para revisar.');
      return;
    }

    if (!adMobService.isAdReady('second_chance_rewarded')) {
      setIsAdLoading(true);
      adMobService.preloadAd('second_chance_rewarded');
      Alert.alert(
        'Preparando Anúncio...',
        'O anúncio premiado está sendo carregado. Tente novamente em alguns segundos.',
        [{ text: 'OK', onPress: () => setIsAdLoading(false) }]
      );
      return;
    }

    adMobService.showRewardedAd('second_chance_rewarded', {
      onEarnedReward: () => {
        const success = startReviewRound();
        if (success) {
          Alert.alert(
            'Revisão Liberada! 🎓',
            'Vamos começar a rodada de revisão focando apenas nas perguntas que você errou. Bons estudos!',
            [{ text: 'Começar Revisão!', onPress: () => router.replace('/quiz') }]
          );
        }
      },
      onAdFailedToShow: () => {
        Alert.alert(
          'Anúncio Indisponível',
          'Não foi possível exibir o anúncio no momento. Verifique sua conexão e tente novamente.',
          [{ text: 'OK' }]
        );
      },
    });
  };

  const handleShare = async () => {
    try {
      const shareMsg = isDuel
        ? `⚔️ Joguei um Duelo 1v1 no BrainPOP contra ${duelBot?.name}! ${isDuelWon ? 'Venci a aposta e subi de Elo!' : 'Partida acirrada!'} Meu Elo: ${currentRank.name}!`
        : `🧠 Fiz ${score.toLocaleString()} pontos no BrainPOP com ${accuracyPercent}% de precisão! Consegue bater meu recorde?`;
      await Share.share({ message: shareMsg });
    } catch (error) {
      console.log('Erro ao compartilhar', error);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header de Vitória/Derrota */}
        <View style={styles.trophyContainer}>
          <View style={[
            styles.trophyCircle, 
            { backgroundColor: isReview ? '#EFF6FF' : (isVictory ? '#FEF3C7' : '#FEE2E2') }
          ]}>
            {isReview ? (
              <GraduationCap color="#2563EB" size={56} />
            ) : isDuel ? (
              isDuelWon ? (
                <Crown color="#D97706" size={56} fill="#D97706" />
              ) : (
                <Swords color="#DC2626" size={56} />
              )
            ) : (
              <Trophy 
                color={isVictory ? theme.colors.warning.amber : theme.colors.text.muted} 
                size={56} 
              />
            )}
          </View>
          
          <Text style={[styles.victoryTitle, isReview && { color: '#2563EB' }, !isVictory && isDuel && { color: '#DC2626' }]}>
            {isReview
              ? 'REVISÃO CONCLUÍDA! 🎓'
              : isDuel 
                ? (isOpponentEliminated 
                    ? 'OPONENTE ELIMINADO! ⚔️'
                    : isDuelWon 
                      ? 'VITÓRIA NO DUELO 1V1! ⚔️' 
                      : isPlayerEliminated
                        ? 'VOCÊ FOI ELIMINADO! ☠️'
                        : isDuelDraw 
                          ? 'EMPATE ÉPICO! 🤝' 
                          : 'DERROTA NO DUELO 💔')
                : performance.title}
          </Text>

          <Text style={styles.victorySubtitle}>
            {isReview
              ? (reviewSession
                  ? `${reviewSession.correctedErrorsCount} de ${reviewSession.totalWrongQuestions} erros foram corrigidos com sucesso nesta rodada!`
                  : 'Parabéns por revisar suas questões erradas!')
              : isDuel 
                ? (isOpponentEliminated
                    ? `As vidas de ${duelBot?.name} acabaram! Você sobreviveu e levou as ${duelBet * 2} moedas do Pote!`
                    : isDuelWon 
                      ? `Parabéns! Você venceu ${duelBot?.name} e levou as ${duelBet * 2} moedas do Pote!` 
                      : isPlayerEliminated
                        ? `Suas vidas acabaram no duelo. ${duelBot?.name} sobreviveu e faturou a aposta.`
                        : isDuelDraw 
                          ? `Partida acirrada! Você e ${duelBot?.name} empataram!` 
                          : `${duelBot?.name} levou a melhor desta vez. Pratique mais e tente a revanche!`)
                : performance.subtitle}
          </Text>
        </View>

        {/* CARD ESPECIAL: RANKING & TROFÉUS DO DUELO 1V1 */}
        {isDuel && (
          <Card style={styles.rankedCard}>
            {/* Header com Botão de Ver Todos os Elos */}
            <View style={styles.rankedCardHeader}>
              <View style={styles.rankedBadgePill}>
                <Swords size={12} color={theme.colors.brand.purple} />
                <Text style={styles.rankedBadgePillText}>DUELO COMPETITIVO</Text>
              </View>
              <TouchableOpacity 
                style={styles.viewTiersBtn}
                activeOpacity={0.7}
                onPress={() => setShowRanksModal(true)}
              >
                <Text style={styles.viewTiersText}>Ver Todos os Elos</Text>
                <ChevronRight size={13} color={theme.colors.brand.purple} />
              </TouchableOpacity>
            </View>

            {/* Banner de Subida de Elo */}
            {duelOutcome?.rankedUp && (
              <View style={styles.rankUpBanner}>
                <Sparkles size={18} color="#FFF" />
                <Text style={styles.rankUpText}>
                  SUBIU DE ELO! Você alcançou {currentRank.name}!
                </Text>
              </View>
            )}

            {/* Emblema do Rank Atual */}
            <View style={styles.rankCenterSection}>
              <DuelRankBadge rank={currentRank} size="lg" />
            </View>

            {/* Ganhos do Duelo: Troféus e Moedas */}
            <View style={styles.rankedStatsRow}>
              <View style={styles.rankedStatBox}>
                <View style={styles.rankedStatIconRow}>
                  <Trophy size={16} color={theme.colors.warning.amber} />
                  <Text style={[styles.rankedStatNum, { color: isDuelWon ? theme.colors.success.greenDark : theme.colors.text.muted }]}>
                    {isDuelWon ? '+1' : '0'}
                  </Text>
                </View>
                <Text style={styles.rankedStatLabel}>
                  {isDuelWon ? 'Troféu Conquistado' : 'Sem Troféu'}
                </Text>
                <Text style={styles.rankedStatSub}>
                  Total: {duelOutcome?.newTotalTrophies ?? duelTrophies} 🏆
                </Text>
              </View>

              <View style={[styles.rankedStatBox, styles.statBoxDivider]}>
                <View style={styles.rankedStatIconRow}>
                  <Coins size={16} color="#D97706" />
                  <Text style={[styles.rankedStatNum, { color: isDuelWon ? theme.colors.success.greenDark : '#DC2626' }]}>
                    {isDuelWon ? `+${duelBet * 2}` : `-${duelBet}`}
                  </Text>
                </View>
                <Text style={styles.rankedStatLabel}>
                  {isDuelWon ? 'Pote Completo Levado' : 'Aposta Perdida'}
                </Text>
                <Text style={styles.rankedStatSub}>
                  Aposta: {duelBet} cada
                </Text>
              </View>
            </View>

            {/* Barra de Progresso para o Próximo Elo */}
            {nextRank ? (
              <View style={styles.nextRankProgressWrapper}>
                <View style={styles.nextRankTextRow}>
                  <Text style={styles.nextRankLabel}>
                    Próximo: <Text style={{ color: nextRank.primaryColor, fontFamily: theme.typography.fontFamily.bold }}>{nextRank.name}</Text>
                  </Text>
                  <Text style={styles.nextRankRequiredText}>
                    {duelOutcome?.newTotalTrophies ?? duelTrophies} / {nextRank.trophiesRequired} 🏆
                  </Text>
                </View>
                <View style={styles.nextRankTrack}>
                  <View 
                    style={[
                      styles.nextRankFill, 
                      { 
                        width: `${Math.min(100, Math.max(8, rankInfo.progressPercent))}%`,
                        backgroundColor: currentRank.primaryColor
                      }
                    ]} 
                  />
                </View>
              </View>
            ) : (
              <View style={styles.maxRankBanner}>
                <Crown size={16} color="#EAB308" fill="#EAB308" />
                <Text style={styles.maxRankText}>VOCÊ ATINGIU O ELO MÁXIMO: DESAFIANTE 3!</Text>
              </View>
            )}
          </Card>
        )}

        {/* Duelo Comparativo Card (quando em duelo) */}
        {isDuel && duelBot && (
          <Card style={styles.duelCompareCard}>
            <View style={styles.duelCompareRow}>
              {/* Jogador */}
              <View style={styles.duelComparePlayer}>
                <View style={styles.playerTitleRow}>
                  <Text style={styles.duelCompareName}>{userName || 'Você'}</Text>
                  {isPlayerLeader && (
                    <Crown size={12} color="#EAB308" fill="#EAB308" />
                  )}
                </View>
                <Text style={[styles.duelCompareScore, isDuelWon && { color: theme.colors.success.greenDark }]}>
                  {score} pts
                </Text>
                <View style={styles.compareLivesRow}>
                  <Heart size={11} color="#EF4444" fill={playerDuelLives > 0 ? '#EF4444' : 'transparent'} />
                  <Text style={styles.duelCompareSub}>
                    {playerDuelLives}/{isPlayerLeader ? 3 : 1} vidas ({isPlayerLeader ? 'Líder' : 'Desafiante'})
                  </Text>
                </View>
              </View>

              <View style={styles.duelCompareVs}>
                <Text style={styles.duelCompareVsText}>VS</Text>
              </View>

              {/* Bot */}
              <View style={styles.duelComparePlayer}>
                <View style={styles.playerTitleRow}>
                  {!isPlayerLeader && (
                    <Crown size={12} color="#EAB308" fill="#EAB308" />
                  )}
                  <Text style={[styles.duelCompareName, { color: duelBot.color }]}>{duelBot.name}</Text>
                </View>
                <Text style={[styles.duelCompareScore, !isDuelWon && !isDuelDraw && { color: duelBot.color }]}>
                  {opponentScore} pts
                </Text>
                <View style={styles.compareLivesRow}>
                  <Heart size={11} color="#EF4444" fill={opponentDuelLives > 0 ? '#EF4444' : 'transparent'} />
                  <Text style={styles.duelCompareSub}>
                    {opponentDuelLives}/{!isPlayerLeader ? 3 : 1} vidas ({!isPlayerLeader ? 'Líder' : 'Desafiante'})
                  </Text>
                </View>
              </View>
            </View>
          </Card>
        )}

        {/* Score Principal (quando Solo / Treino e NÃO em modo revisão) */}
        {!isDuel && !isReview && (
          <Card style={styles.scoreHighlightCard}>
            <Text style={styles.scoreHighlightLabel}>SUA PONTUAÇÃO FINAL</Text>
            <Text style={styles.scoreHighlightNumber}>{score.toLocaleString()}</Text>
            <View style={styles.accuracyPill}>
              <CheckCircle2 size={16} color={theme.colors.success.green} />
              <Text style={styles.accuracyPillText}>
                {correctAnswersCount}/{totalQuestions} acertos ({accuracyPercent}%)
              </Text>
            </View>
          </Card>
        )}

        {/* Card Especial: Resumo da Revisão Pedagógica (quando no modo Review) */}
        {isReview && reviewSession && (
          <Card style={styles.scoreHighlightCard}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, marginBottom: 8 }}>
              <GraduationCap size={20} color="#2563EB" />
              <Text style={{ fontSize: 13, fontFamily: theme.typography.fontFamily.bold, color: '#2563EB', letterSpacing: 0.5 }}>
                RESUMO PEDAGÓGICO DE ERROS CORRIGIDOS
              </Text>
            </View>
            <Text style={styles.scoreHighlightNumber}>
              {reviewSession.correctedErrorsCount} / {reviewSession.totalWrongQuestions}
            </Text>
            <View style={[styles.accuracyPill, { backgroundColor: '#EFF6FF', borderColor: '#BFDBFE' }]}>
              <CheckCircle2 size={16} color="#2563EB" />
              <Text style={[styles.accuracyPillText, { color: '#1E40AF' }]}>
                {Math.round(((reviewSession.correctedErrorsCount) / Math.max(reviewSession.totalWrongQuestions, 1)) * 100)}% de superação de erros
              </Text>
            </View>
            <View style={{ marginTop: 16, padding: 12, backgroundColor: '#F8FAFC', borderRadius: 12, borderWidth: 1, borderColor: '#E2E8F0' }}>
              <Text style={{ fontSize: 13, color: theme.colors.text.body, lineHeight: 18, textAlign: 'center' }}>
                💡 Revisar perguntas erradas é o método cientificamente comprovado de fixação da memória.
              </Text>
              <Text style={{ fontSize: 11, color: theme.colors.text.muted, marginTop: 6, textAlign: 'center' }}>
                ✓ Partida original protegida. Nenhum XP, moeda, aposta ou ranking alterado pela revisão.
              </Text>
            </View>
          </Card>
        )}

        {/* Recompensas da Partida (XP e Moedas Gerais) - apenas fora da revisão */}
        {!isDuel && !isReview && (
          <Card style={styles.resultsCard}>
            <View style={styles.statRow}>
              <View style={styles.statItem}>
                <View style={styles.row}>
                  <Zap size={18} color={theme.colors.brand.purple} fill={theme.colors.brand.purple} />
                  <Text style={styles.statValue}>+{xpEarned}</Text>
                </View>
                <Text style={styles.statLabel}>XP GANHO</Text>
              </View>

              <View style={[styles.statItem, styles.borderCenter]}>
                <View style={styles.row}>
                  <Flame size={18} color={theme.colors.warning.orange} fill={theme.colors.warning.orange} />
                  <Text style={styles.statValue}>{maxComboStreak}x</Text>
                </View>
                <Text style={styles.statLabel}>MAX COMBO</Text>
              </View>

              <View style={styles.statItem}>
                <View style={styles.row}>
                  <Coins size={18} color={theme.colors.warning.amber} />
                  <Text style={styles.statValue}>+{coinsEarned}</Text>
                </View>
                <Text style={styles.statLabel}>MOEDAS</Text>
              </View>
            </View>
          </Card>
        )}

        {/* SEGUNDA CHANCE: REVISAR ERROS (1x por partida apenas em Solo com erros e fora da revisão) */}
        {!isDuel && !isReview && !hasUsedAdRevive && hasWrongQuestions && (
          <View style={styles.reviveBanner}>
            <View style={styles.reviveHeader}>
              <View style={styles.reviveIconBox}>
                <Tv size={24} color="#FFF" />
              </View>
              <View style={{ flex: 1 }}>
                <View style={styles.reviveTitleRow}>
                  <Text style={styles.reviveTitle}>Revisão com Vídeo 🎓</Text>
                  <View style={styles.reviveBadge}>
                    <Text style={styles.reviveBadgeText}>1X POR PARTIDA</Text>
                  </View>
                </View>
                <Text style={styles.reviveSubtitle}>
                  Assista a um vídeo curto do Google AdMob e refaça apenas as perguntas que você errou!
                </Text>
              </View>
            </View>

            <TouchableOpacity 
              style={styles.reviveBtn}
              activeOpacity={0.85}
              disabled={isAdLoading}
              onPress={handleStartReviewWithAd}
            >
              <Play size={16} color="#FFF" fill="#FFF" />
              <Text style={styles.reviveBtnText}>REVISAR MEUS ERROS (VÍDEO)</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Ações */}
        <View style={styles.actions}>
          <Button 
            title={isDuel ? "JOGAR NOVO DUELO 1V1" : (isReview ? "JOGAR NOVA PARTIDA" : "JOGAR NOVAMENTE")} 
            onPress={handlePlayAgain} 
            icon={isDuel ? Swords : RotateCcw}
            variant="primary"
          />
          <Button 
            title="COMPARTILHAR RESULTADO" 
            variant="outline"
            onPress={handleShare} 
            icon={Share2}
          />
        </View>

        <TouchableOpacity 
          style={styles.backHomeButton}
          onPress={() => router.replace('/home')}
          activeOpacity={0.7}
        >
          <Text style={styles.backHome}>Voltar para o Menu Principal</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* MODAL: VISUALIZADOR DE TODOS OS ELOS (FERRO AO DESAFIANTE) */}
      <Modal
        visible={showRanksModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowRanksModal(false)}
      >
        <View style={styles.ranksModalOverlay}>
          <View style={styles.ranksModalContainer}>
            {/* Modal Header */}
            <View style={styles.ranksModalHeader}>
              <View>
                <Text style={styles.ranksModalTitle}>Elos de Duelo 1v1</Text>
                <Text style={styles.ranksModalSubtitle}>
                  Do Ferro ao Desafiante: vença e acumule troféus
                </Text>
              </View>
              <TouchableOpacity 
                style={styles.ranksModalCloseBtn}
                onPress={() => setShowRanksModal(false)}
                activeOpacity={0.75}
              >
                <X size={20} color="#64748B" />
              </TouchableOpacity>
            </View>

            {/* Lista dos 25 Ranks */}
            <ScrollView 
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.ranksScrollList}
            >
              {DUEL_RANKS.map((r, idx) => {
                const isUserCurrentRank = r.id === currentRank.id;
                const isUnlocked = (duelOutcome?.newTotalTrophies ?? duelTrophies) >= r.trophiesRequired;

                return (
                  <View 
                    key={r.id} 
                    style={[
                      styles.rankTierItem,
                      isUserCurrentRank && styles.rankTierItemActive,
                      !isUnlocked && styles.rankTierItemLocked
                    ]}
                  >
                    <DuelRankBadge rank={r} size="sm" showTag={false} />
                    
                    <View style={styles.rankTierItemInfo}>
                      <View style={styles.rankTierItemTitleRow}>
                        <Text style={[styles.rankTierItemName, { color: r.primaryColor }]}>
                          {r.name}
                        </Text>
                        {isUserCurrentRank && (
                          <View style={[styles.currentEloBadge, { backgroundColor: r.primaryColor }]}>
                            <Text style={styles.currentEloBadgeText}>SEU ELO</Text>
                          </View>
                        )}
                      </View>
                      <Text style={styles.rankTierItemTag}>{r.tag}</Text>
                    </View>

                    <View style={styles.rankTierItemTrophies}>
                      <Trophy size={14} color={isUnlocked ? theme.colors.warning.amber : '#94A3B8'} />
                      <Text style={[styles.rankTierItemTrophyText, isUnlocked && { color: theme.colors.text.primary }]}>
                        {r.trophiesRequired} 🏆
                      </Text>
                    </View>
                  </View>
                );
              })}
            </ScrollView>

            <TouchableOpacity 
              style={styles.ranksModalDoneBtn}
              activeOpacity={0.88}
              onPress={() => setShowRanksModal(false)}
            >
              <Text style={styles.ranksModalDoneBtnText}>ENTENDI</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.bg.app,
  },
  scrollContent: {
    alignItems: 'center',
    padding: theme.spacing.containerMargin,
    paddingTop: theme.spacing.xl,
    paddingBottom: theme.spacing['3xl'],
  },
  trophyContainer: {
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  trophyCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.md,
    ...theme.shadows.pillowy,
  },
  victoryTitle: {
    fontSize: 22,
    fontFamily: theme.typography.fontFamily.black,
    color: theme.colors.text.primary,
    textAlign: 'center',
  },
  victorySubtitle: {
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.sizes.bodySm,
    color: theme.colors.text.muted,
    textAlign: 'center',
    marginTop: 4,
    paddingHorizontal: 20,
    lineHeight: 20,
  },
  rankedCard: {
    width: '100%',
    backgroundColor: '#FFF',
    borderRadius: theme.radius.xl,
    padding: 16,
    marginBottom: theme.spacing.md,
    borderWidth: 1.5,
    borderColor: theme.colors.brand.purple + '30',
    ...theme.shadows.card,
  },
  rankedCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  rankedBadgePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: theme.colors.brand.purple + '15',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: theme.radius.full,
  },
  rankedBadgePillText: {
    fontFamily: theme.typography.fontFamily.black,
    fontSize: 10,
    color: theme.colors.brand.purple,
    letterSpacing: 0.5,
  },
  viewTiersBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  viewTiersText: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: 12,
    color: theme.colors.brand.purple,
  },
  rankUpBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: theme.colors.brand.purple,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: theme.radius.lg,
    marginBottom: 14,
    ...theme.shadows.pillowy,
  },
  rankUpText: {
    fontFamily: theme.typography.fontFamily.black,
    fontSize: 12,
    color: '#FFF',
    letterSpacing: 0.5,
  },
  rankCenterSection: {
    alignItems: 'center',
    marginVertical: 10,
  },
  rankedStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#F8FAFC',
    borderRadius: theme.radius.lg,
    paddingVertical: 12,
    marginTop: 8,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  rankedStatBox: {
    flex: 1,
    alignItems: 'center',
  },
  statBoxDivider: {
    borderLeftWidth: 1,
    borderLeftColor: '#E2E8F0',
  },
  rankedStatIconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 2,
  },
  rankedStatNum: {
    fontFamily: theme.typography.fontFamily.black,
    fontSize: 20,
  },
  rankedStatLabel: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: 11,
    color: theme.colors.text.primary,
  },
  rankedStatSub: {
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: 10,
    color: theme.colors.text.muted,
    marginTop: 1,
  },
  nextRankProgressWrapper: {
    marginTop: 4,
  },
  nextRankTextRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  nextRankLabel: {
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: 12,
    color: theme.colors.text.body,
  },
  nextRankRequiredText: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: 12,
    color: theme.colors.text.muted,
  },
  nextRankTrack: {
    height: 8,
    backgroundColor: '#F1F5F9',
    borderRadius: 4,
    overflow: 'hidden',
  },
  nextRankFill: {
    height: '100%',
    borderRadius: 4,
  },
  maxRankBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 6,
    backgroundColor: '#FEF3C7',
    borderRadius: theme.radius.md,
  },
  maxRankText: {
    fontFamily: theme.typography.fontFamily.black,
    fontSize: 10,
    color: '#B45309',
    letterSpacing: 0.5,
  },
  duelCompareCard: {
    width: '100%',
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.md,
    backgroundColor: '#FFF',
    borderWidth: 1.5,
    borderColor: theme.colors.brand.purple + '30',
    ...theme.shadows.card,
  },
  duelCompareRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  duelComparePlayer: {
    flex: 1,
    alignItems: 'center',
  },
  playerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 2,
  },
  duelCompareName: {
    fontFamily: theme.typography.fontFamily.black,
    fontSize: 13,
    color: theme.colors.text.primary,
  },
  duelCompareScore: {
    fontFamily: theme.typography.fontFamily.black,
    fontSize: 20,
    color: theme.colors.text.primary,
  },
  compareLivesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginTop: 3,
  },
  duelCompareSub: {
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: 10,
    color: theme.colors.text.muted,
  },
  duelCompareVs: {
    paddingHorizontal: 10,
  },
  duelCompareVsText: {
    fontFamily: theme.typography.fontFamily.black,
    fontSize: 18,
    color: theme.colors.brand.magenta,
    fontStyle: 'italic',
  },
  scoreHighlightCard: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    ...theme.shadows.card,
  },
  scoreHighlightLabel: {
    fontSize: 11,
    fontFamily: theme.typography.fontFamily.bold,
    color: theme.colors.text.muted,
    letterSpacing: 1,
  },
  scoreHighlightNumber: {
    fontSize: 40,
    fontFamily: theme.typography.fontFamily.black,
    color: theme.colors.brand.magenta,
    marginVertical: 4,
  },
  accuracyPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F0FDF4',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: theme.radius.full,
    marginTop: 4,
  },
  accuracyPillText: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: 12,
    color: theme.colors.success.greenDark,
  },
  resultsCard: {
    width: '100%',
    paddingVertical: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
    ...theme.shadows.pillowy,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  borderCenter: {
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: theme.colors.border.soft,
  },
  statValue: {
    fontSize: 18,
    fontFamily: theme.typography.fontFamily.extraBold,
    color: theme.colors.text.primary,
  },
  statLabel: {
    fontSize: 10,
    fontFamily: theme.typography.fontFamily.bold,
    color: theme.colors.text.muted,
    marginTop: 4,
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  actions: {
    width: '100%',
    gap: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  backHomeButton: {
    paddingVertical: theme.spacing.sm,
  },
  backHome: {
    color: theme.colors.text.muted,
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: 14,
  },
  reviveBanner: {
    width: '100%',
    backgroundColor: '#FFF',
    borderWidth: 1.5,
    borderColor: theme.colors.brand.purple + '40',
    borderRadius: theme.radius.xl,
    padding: 16,
    marginBottom: theme.spacing.lg,
    ...theme.shadows.card,
  },
  reviveHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  reviveIconBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: theme.colors.brand.purple,
    alignItems: 'center',
    justifyContent: 'center',
    ...theme.shadows.pillowy,
  },
  reviveTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  reviveTitle: {
    fontFamily: theme.typography.fontFamily.black,
    fontSize: 15,
    color: theme.colors.text.primary,
  },
  reviveBadge: {
    backgroundColor: theme.colors.brand.purple + '15',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: theme.radius.full,
  },
  reviveBadgeText: {
    fontFamily: theme.typography.fontFamily.black,
    fontSize: 9,
    color: theme.colors.brand.purple,
    letterSpacing: 0.5,
  },
  reviveSubtitle: {
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: 11,
    color: theme.colors.text.muted,
    lineHeight: 15,
  },
  reviveBtn: {
    backgroundColor: theme.colors.brand.magenta,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 48,
    borderRadius: theme.radius.xl,
    ...theme.shadows.magentaGlow,
  },
  reviveBtnText: {
    color: '#FFF',
    fontFamily: theme.typography.fontFamily.black,
    fontSize: 13,
    letterSpacing: 0.5,
  },

  // Modal de Elos
  ranksModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    justifyContent: 'flex-end',
  },
  ranksModalContainer: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    maxHeight: '85%',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 32,
    ...theme.shadows.card,
  },
  ranksModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  ranksModalTitle: {
    fontFamily: theme.typography.fontFamily.black,
    fontSize: 20,
    color: theme.colors.text.primary,
  },
  ranksModalSubtitle: {
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: 12,
    color: theme.colors.text.muted,
    marginTop: 2,
  },
  ranksModalCloseBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ranksScrollList: {
    paddingVertical: 14,
    gap: 10,
  },
  rankTierItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: theme.radius.lg,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 12,
  },
  rankTierItemActive: {
    backgroundColor: '#FEF3C7',
    borderColor: '#F59E0B',
    borderWidth: 2,
    ...theme.shadows.card,
  },
  rankTierItemLocked: {
    opacity: 0.65,
  },
  rankTierItemInfo: {
    flex: 1,
  },
  rankTierItemTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  rankTierItemName: {
    fontFamily: theme.typography.fontFamily.black,
    fontSize: 14,
  },
  currentEloBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  currentEloBadgeText: {
    fontFamily: theme.typography.fontFamily.black,
    fontSize: 8,
    color: '#FFF',
  },
  rankTierItemTag: {
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: 11,
    color: theme.colors.text.muted,
    marginTop: 2,
  },
  rankTierItemTrophies: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  rankTierItemTrophyText: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: 12,
    color: '#94A3B8',
  },
  ranksModalDoneBtn: {
    backgroundColor: theme.colors.brand.purple,
    height: 48,
    borderRadius: theme.radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    ...theme.shadows.card,
  },
  ranksModalDoneBtnText: {
    fontFamily: theme.typography.fontFamily.black,
    fontSize: 14,
    color: '#FFF',
    letterSpacing: 0.5,
  },
});
