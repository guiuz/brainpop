import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import React, { useEffect, useState, useRef, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  BackHandler,
  Image,
  Modal,
  AppState
} from 'react-native';
import { theme } from '../src/theme';
import { Card } from '../src/components/Card';
import { Button } from '../src/components/Button';
import { OptionCard, OptionStatus } from '../src/components/OptionCard';
import { ProgressBar } from '../src/components/ProgressBar';
import { PowerUpBar } from '../src/components/PowerUpBar';
import { useGameStore } from '../src/store/useGameStore';
import { useUserStore } from '../src/store/useUserStore';
import { 
  Timer,
  Flame,
  Info,
  Lightbulb,
  Swords,
  X,
  LogOut,
  Crown,
  Heart,
  Coins,
  ShieldAlert
} from 'lucide-react-native';
import { useRouter } from 'expo-router';

const OPTION_LETTERS = ['A', 'B', 'C', 'D'];

export default function QuizScreen() {
  const router = useRouter();
  
  const {
    isActive,
    gameMode,
    duelBot,
    opponentScore,
    duelBet,
    isPlayerLeader,
    playerDuelLives,
    opponentDuelLives,
    duelEliminationStatus,
    questions,
    currentQuestionIndex,
    selectedOptionIndex,
    isAnswerSubmitted,
    isCorrect,
    isTimeout,
    disabledOptionIndices,
    hintMessage,
    score,
    comboStreak,
    timeRemaining,
    totalTimePerQuestion,
    selectOption,
    submitAnswer,
    nextQuestion,
    tickTimer,
    startMatch,
    endMatch
  } = useGameStore();

  const insets = useSafeAreaInsets();
  const { name: userName, avatarUrl: userAvatar } = useUserStore();
  const [showGiveUpModal, setShowGiveUpModal] = useState(false);

  // Autoavanço controlado no Timeout com cleanup
  const [autoAdvanceCountdown, setAutoAdvanceCountdown] = useState<number | null>(null);
  const autoAdvanceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const autoAdvanceIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const questionIndexAtTimerStartRef = useRef<number>(-1);

  const clearAutoAdvanceTimer = useCallback(() => {
    if (autoAdvanceTimerRef.current) {
      clearTimeout(autoAdvanceTimerRef.current);
      autoAdvanceTimerRef.current = null;
    }
    if (autoAdvanceIntervalRef.current) {
      clearInterval(autoAdvanceIntervalRef.current);
      autoAdvanceIntervalRef.current = null;
    }
    setAutoAdvanceCountdown(null);
    questionIndexAtTimerStartRef.current = -1;
  }, []);

  // Inicializar partida caso não haja perguntas
  useEffect(() => {
    if (questions.length === 0 || !isActive) {
      startMatch({ questionCount: 10 });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Back handler do Android
  useEffect(() => {
    const onBackPress = () => {
      setShowGiveUpModal(true);
      return true;
    };

    const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
    return () => subscription.remove();
  }, []);

  // Sincronização com AppState ao retornar do background e pausa do timer em background
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (nextAppState.match(/inactive|background/)) {
        clearAutoAdvanceTimer();
      }
      if (nextAppState === 'active' && isActive && !isAnswerSubmitted) {
        const state = useGameStore.getState();
        if (state.isAnswerSubmitted || !state.isActive) return;
        const now = Date.now();
        if (state.questionDeadlineAt && now >= state.questionDeadlineAt) {
          state.submitTimeout();
        } else if (state.questionDeadlineAt) {
          const remaining = Math.max(0, Math.ceil((state.questionDeadlineAt - now) / 1000));
          useGameStore.setState({ timeRemaining: remaining });
        }
      }
    });
    return () => {
      subscription.remove();
      clearAutoAdvanceTimer();
    };
  }, [isActive, isAnswerSubmitted, clearAutoAdvanceTimer]);

  // Temporizador de alta fidelidade
  useEffect(() => {
    if (!isActive || isAnswerSubmitted) return;

    const timer = setInterval(() => {
      const state = useGameStore.getState();
      if (!state.isActive || state.isAnswerSubmitted) {
        clearInterval(timer);
        return;
      }
      state.tickTimer();
    }, 400);

    return () => clearInterval(timer);
  }, [isActive, isAnswerSubmitted, currentQuestionIndex, tickTimer]);

  const handleGiveUp = () => {
    setShowGiveUpModal(true);
  };

  const handleConfirmGiveUp = () => {
    clearAutoAdvanceTimer();
    setShowGiveUpModal(false);
    endMatch();
    router.replace('/home');
  };

  const handleSelectOption = (index: number) => {
    if (isAnswerSubmitted) return;
    selectOption(index);
  };

  const handleConfirmAnswer = () => {
    if (selectedOptionIndex === null || isAnswerSubmitted) return;
    submitAnswer();
  };

  const handleNextOrFinish = useCallback(() => {
    clearAutoAdvanceTimer();
    if (gameMode === 'duel' && duelEliminationStatus !== 'playing') {
      router.replace('/result');
      return;
    }
    const hasNext = nextQuestion();
    if (!hasNext) {
      router.replace('/result');
    }
  }, [clearAutoAdvanceTimer, gameMode, duelEliminationStatus, nextQuestion, router]);

  // Autoavanço no Timeout com contagem regressiva de 3 segundos e cleanup rigoroso
  useEffect(() => {
    if (!isActive || !isAnswerSubmitted || !isTimeout) {
      clearAutoAdvanceTimer();
      return;
    }

    // Inicia countdown de autoavanço
    questionIndexAtTimerStartRef.current = currentQuestionIndex;
    setAutoAdvanceCountdown(3);

    let count = 3;
    autoAdvanceIntervalRef.current = setInterval(() => {
      count -= 1;
      if (count > 0) {
        setAutoAdvanceCountdown(count);
      } else {
        if (autoAdvanceIntervalRef.current) {
          clearInterval(autoAdvanceIntervalRef.current);
          autoAdvanceIntervalRef.current = null;
        }
      }
    }, 1000);

    autoAdvanceTimerRef.current = setTimeout(() => {
      const state = useGameStore.getState();
      // Garantia absoluta: timer antigo NUNCA avança a pergunta seguinte se ela já trocou
      if (
        state.isActive &&
        state.currentQuestionIndex === questionIndexAtTimerStartRef.current &&
        state.isAnswerSubmitted
      ) {
        clearAutoAdvanceTimer();
        handleNextOrFinish();
      } else {
        clearAutoAdvanceTimer();
      }
    }, 3000);

    return () => {
      clearAutoAdvanceTimer();
    };
  }, [isActive, isAnswerSubmitted, isTimeout, currentQuestionIndex, clearAutoAdvanceTimer, handleNextOrFinish]);

  const currentQ = questions[currentQuestionIndex];
  if (!currentQ) return null;

  const totalQuestions = questions.length || 10;
  const progressRatio = (currentQuestionIndex + 1) / totalQuestions;
  const timeProgress = timeRemaining / totalTimePerQuestion;

  const getOptionStatus = (index: number): OptionStatus => {
    if (disabledOptionIndices.includes(index)) {
      return 'disabled';
    }
    if (!isAnswerSubmitted) {
      return selectedOptionIndex === index ? 'selected' : 'default';
    }
    const option = currentQ.options[index];
    if (option && option.id === currentQ.correctId) {
      return 'correct';
    }
    if (selectedOptionIndex === index && !isCorrect) {
      return 'wrong';
    }
    return 'default';
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Top Bar: Progresso e Tempo */}
      <View style={styles.topBar}>
        <View style={styles.headerInfo}>
          <TouchableOpacity 
            style={styles.giveUpBtn}
            activeOpacity={0.75}
            onPress={handleGiveUp}
          >
            <X size={14} color="#64748B" />
            <Text style={styles.giveUpText}>Desistir</Text>
          </TouchableOpacity>

          <Text style={styles.questionCounter}>
            Pergunta <Text style={styles.boldText}>{currentQuestionIndex + 1}</Text> de {totalQuestions}
          </Text>

          <View style={[
            styles.timerBadge, 
            timeRemaining <= 5 && styles.timerBadgeUrgent
          ]}>
            <Timer size={16} color={timeRemaining <= 5 ? '#EF4444' : theme.colors.text.muted} />
            <Text style={[
              styles.timerText, 
              timeRemaining <= 5 && styles.timerTextUrgent
            ]}>
              {String(timeRemaining).padStart(2, '0')}s
            </Text>
          </View>
        </View>

        {/* Progress Bars */}
        <ProgressBar 
          progress={progressRatio} 
          height={6} 
          gradientColors={[theme.colors.brand.cyan, theme.colors.brand.magenta]}
          style={{ marginBottom: 6 }}
        />
        <ProgressBar 
          progress={timeProgress} 
          height={3} 
          gradientColors={timeRemaining <= 5 ? ['#EF4444', '#F87171'] : ['#22C55E', '#14B8A6']}
          trackColor="#F1F5F9"
        />
      </View>

      {/* Score & Combo Bar OU Duelo 1v1 Bar com Vidas, Líder e Pote */}
      {gameMode === 'duel' && duelBot ? (
        <Card style={styles.duelScoreCard}>
          {/* Player Side */}
          <View style={styles.duelSide}>
            <View style={styles.duelAvatarWrapper}>
              <Image 
                source={{ uri: userAvatar || 'https://api.dicebear.com/7.x/avataaars/png?seed=Player' }} 
                style={[
                  styles.duelAvatarMini,
                  isPlayerLeader && styles.duelAvatarLeader
                ]} 
              />
              {isPlayerLeader && (
                <View style={styles.crownBadgeMini}>
                  <Crown size={10} color="#FFF" fill="#FFF" />
                </View>
              )}
            </View>

            <View style={styles.duelPlayerInfo}>
              <View style={styles.nameLeaderRow}>
                <Text style={styles.duelName} numberOfLines={1}>{userName || 'Você'}</Text>
                {isPlayerLeader && (
                  <View style={styles.leaderPill}>
                    <Text style={styles.leaderPillText}>LÍDER</Text>
                  </View>
                )}
              </View>

              {/* Vidas do Jogador (3 se Líder, 1 se Desafiante) */}
              <View style={styles.heartsRow}>
                {Array.from({ length: isPlayerLeader ? 3 : 1 }).map((_, i) => (
                  <Heart 
                    key={`player-heart-${i}`} 
                    size={12} 
                    color={i < playerDuelLives ? '#EF4444' : '#CBD5E1'} 
                    fill={i < playerDuelLives ? '#EF4444' : 'transparent'} 
                  />
                ))}
                <Text style={styles.livesCountText}>
                  {playerDuelLives}/{isPlayerLeader ? 3 : 1} vidas
                </Text>
              </View>

              <Text style={[styles.duelScore, score >= opponentScore && { color: theme.colors.success.greenDark }]}>
                {score} pts
              </Text>
            </View>
          </View>

          {/* VS Center Indicator com Pote */}
          <View style={styles.duelCenter}>
            <View style={styles.potContainer}>
              <Coins size={11} color="#D97706" />
              <Text style={styles.potLabel}>{duelBet * 2}</Text>
            </View>
            <View style={styles.duelVsCircle}>
              <Swords size={12} color="#FFF" />
            </View>
            <Text style={styles.duelStatusText}>
              {duelEliminationStatus === 'opponent_eliminated'
                ? '🏆 Ganhou!'
                : duelEliminationStatus === 'player_eliminated'
                  ? '☠️ Caiu!'
                  : score > opponentScore 
                    ? 'Na frente! 🔥' 
                    : score < opponentScore 
                      ? `${duelBot.name.split(' ')[0]} ⚡` 
                      : 'Empate ⚔️'}
            </Text>
          </View>

          {/* Bot Side */}
          <View style={[styles.duelSide, { justifyContent: 'flex-end' }]}>
            <View style={[styles.duelPlayerInfo, { alignItems: 'flex-end' }]}>
              <View style={styles.nameLeaderRow}>
                {!isPlayerLeader && (
                  <View style={styles.leaderPill}>
                    <Text style={styles.leaderPillText}>LÍDER</Text>
                  </View>
                )}
                <Text style={[styles.duelName, { color: duelBot.color }]} numberOfLines={1}>{duelBot.name}</Text>
              </View>

              {/* Vidas do Oponente (3 se Líder, 1 se Desafiante) */}
              <View style={styles.heartsRow}>
                <Text style={styles.livesCountText}>
                  {opponentDuelLives}/{!isPlayerLeader ? 3 : 1} vidas
                </Text>
                {Array.from({ length: !isPlayerLeader ? 3 : 1 }).map((_, i) => (
                  <Heart 
                    key={`bot-heart-${i}`} 
                    size={12} 
                    color={i < opponentDuelLives ? '#EF4444' : '#CBD5E1'} 
                    fill={i < opponentDuelLives ? '#EF4444' : 'transparent'} 
                  />
                ))}
              </View>

              <Text style={[styles.duelScore, opponentScore > score && { color: duelBot.color }]}>
                {opponentScore} pts
              </Text>
            </View>

            <View style={styles.duelAvatarWrapper}>
              <Image 
                source={{ uri: duelBot.avatarUrl }} 
                style={[
                  styles.duelAvatarMini, 
                  { borderColor: duelBot.color },
                  !isPlayerLeader && styles.duelAvatarLeader
                ]} 
              />
              {!isPlayerLeader && (
                <View style={styles.crownBadgeMini}>
                  <Crown size={10} color="#FFF" fill="#FFF" />
                </View>
              )}
            </View>
          </View>
        </Card>
      ) : (
        <Card style={styles.statsCard}>
          <View style={styles.statCol}>
            <Text style={styles.statTitle}>SCORE</Text>
            <Text style={styles.statVal}>{score.toLocaleString()}</Text>
          </View>
          <View style={[styles.statCol, styles.colBorder]}>
            <Text style={styles.statTitle}>COMBO</Text>
            <View style={styles.row}>
              <Text style={[styles.statVal, { color: theme.colors.warning.orange }]}>
                {comboStreak}x
              </Text>
              {comboStreak > 1 && (
                <Flame size={16} color={theme.colors.warning.orange} fill={theme.colors.warning.orange} />
              )}
            </View>
          </View>
          <View style={styles.statCol}>
            <Text style={styles.statTitle}>CATEGORIA</Text>
            <Text style={styles.categoryBadgeText} numberOfLines={1}>
              {currentQ.category || 'Geral'}
            </Text>
          </View>
        </Card>
      )}

      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Power-ups compactos posicionados imediatamente antes da pergunta */}
        {!isAnswerSubmitted && (
          <PowerUpBar style={styles.powerupBar} />
        )}

        {/* Question Box */}
        <View style={styles.questionCard}>
          <Text style={styles.questionText}>
            {currentQ.question}
          </Text>
        </View>

        {/* Hint Banner (Quando Power-up de Dica é acionado) */}
        {hintMessage && !isAnswerSubmitted && (
          <View style={styles.hintCard}>
            <View style={styles.hintHeader}>
              <Lightbulb size={20} color={theme.colors.warning.amber} />
              <Text style={styles.hintTitle}>Dica Tática Ativada!</Text>
            </View>
            <Text style={styles.hintText}>{hintMessage}</Text>
          </View>
        )}

        {/* Alternatives */}
        <View style={styles.optionsList}>
          {currentQ.options.map((opt, idx) => (
            <OptionCard
              key={opt.id || idx}
              label={opt.id || OPTION_LETTERS[idx]}
              text={opt.text}
              status={getOptionStatus(idx)}
              onPress={() => handleSelectOption(idx)}
            />
          ))}
        </View>

        {/* Card de Feedback / Explicação (Após responder ou no timeout) */}
        {isAnswerSubmitted && (
          <View style={[
            styles.explanationCard,
            isCorrect ? styles.explanationCorrect : styles.explanationWrong
          ]}>
            <View style={styles.explanationHeader}>
              <Info size={18} color={isCorrect ? theme.colors.success.greenDark : theme.colors.danger.red} />
              <Text style={[
                styles.explanationTitle,
                { color: isCorrect ? theme.colors.success.greenDark : theme.colors.danger.red }
              ]}>
                {isCorrect 
                  ? 'Excelente! Resposta Certa' 
                  : (selectedOptionIndex === null || isTimeout)
                    ? 'Tempo esgotado!' 
                    : 'Ops! Resposta Incorreta'}
              </Text>
            </View>
            <Text style={styles.explanationBody}>
              {currentQ.explanation 
                ? currentQ.explanation 
                : (selectedOptionIndex === null || isTimeout)
                  ? `O tempo para esta pergunta terminou. A alternativa correta é a letra ${currentQ.correctId}.`
                  : `A alternativa correta é a letra ${currentQ.correctId}.`}
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Bottom Sticky Action Button respeitando o inset inferior */}
      <View style={[styles.bottomBar, { paddingBottom: Math.max(insets.bottom, 16) }]}>
        {!isAnswerSubmitted ? (
          <Button
            title="CONFIRMAR"
            variant="primary"
            onPress={handleConfirmAnswer}
            disabled={selectedOptionIndex === null}
          />
        ) : (
          <Button
            title={
              gameMode === 'duel' && duelEliminationStatus !== 'playing'
                ? (duelEliminationStatus === 'opponent_eliminated' ? "🏆 VITÓRIA! VER RESULTADO" : "☠️ ELIMINADO! VER RESULTADO")
                : (currentQuestionIndex >= totalQuestions - 1
                    ? (autoAdvanceCountdown !== null ? `VER RESULTADO (${autoAdvanceCountdown}s)` : "VER RESULTADO")
                    : (autoAdvanceCountdown !== null ? `PRÓXIMA PERGUNTA (${autoAdvanceCountdown}s)` : "PRÓXIMA PERGUNTA"))
            }
            variant={
              gameMode === 'duel' && duelEliminationStatus === 'opponent_eliminated'
                ? "secondary"
                : isCorrect
                  ? "secondary"
                  : "primary"
            }
            onPress={handleNextOrFinish}
          />
        )}
      </View>

      {/* Modal de Confirmação de Desistência */}
      <Modal
        visible={showGiveUpModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowGiveUpModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.giveUpModalCard}>
            <View style={styles.giveUpIconCircle}>
              <LogOut size={28} color="#EF4444" />
            </View>

            <Text style={styles.giveUpModalTitle}>Desistir da Partida?</Text>
            <Text style={styles.giveUpModalDesc}>
              Se você sair agora, seu progresso nesta rodada será perdido e você voltará para a tela inicial.
            </Text>

            <View style={styles.giveUpModalBtnRow}>
              <TouchableOpacity
                style={styles.giveUpCancelBtn}
                activeOpacity={0.8}
                onPress={() => setShowGiveUpModal(false)}
              >
                <Text style={styles.giveUpCancelBtnText}>Continuar Jogando</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.giveUpConfirmBtn}
                activeOpacity={0.85}
                onPress={handleConfirmGiveUp}
              >
                <Text style={styles.giveUpConfirmBtnText}>Sair</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal de Morte Súbita / Eliminação do Duelo */}
      <Modal
        visible={gameMode === 'duel' && duelEliminationStatus !== 'playing'}
        transparent
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.eliminationModalCard}>
            <View style={[
              styles.eliminationIconCircle,
              { backgroundColor: duelEliminationStatus === 'opponent_eliminated' ? '#FEF3C7' : '#FEE2E2' }
            ]}>
              {duelEliminationStatus === 'opponent_eliminated' ? (
                <Crown size={34} color="#D97706" fill="#D97706" />
              ) : (
                <ShieldAlert size={34} color="#EF4444" />
              )}
            </View>

            <Text style={styles.eliminationModalTitle}>
              {duelEliminationStatus === 'opponent_eliminated' 
                ? 'OPONENTE ELIMINADO! 🏆' 
                : 'VOCÊ FOI ELIMINADO! ☠️'}
            </Text>

            <Text style={styles.eliminationModalDesc}>
              {duelEliminationStatus === 'opponent_eliminated'
                ? `As vidas de ${duelBot?.name} chegaram a zero! Você sobreviveu à disputa e levou o Pote de ${duelBet * 2} moedas mais Troféu de Duelo!`
                : `Suas vidas acabaram nesta rodada de Duelo 1v1. ${duelBot?.name} sobreviveu e levou a aposta.`}
            </Text>

            {duelEliminationStatus === 'opponent_eliminated' && (
              <View style={styles.eliminationPrizePill}>
                <Coins size={16} color="#D97706" />
                <Text style={styles.eliminationPrizeText}>+{duelBet * 2} Moedas Ganhas</Text>
              </View>
            )}

            <TouchableOpacity
              style={[
                styles.eliminationProceedBtn,
                { backgroundColor: duelEliminationStatus === 'opponent_eliminated' ? theme.colors.success.greenDark : theme.colors.brand.magenta }
              ]}
              activeOpacity={0.88}
              onPress={() => router.replace('/result')}
            >
              <Text style={styles.eliminationProceedBtnText}>
                {duelEliminationStatus === 'opponent_eliminated' ? 'COLETAR PRÊMIOS & SUBIR DE ELO' : 'VER RESULTADO DO DUELO'}
              </Text>
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
  topBar: {
    paddingHorizontal: theme.spacing.containerMargin,
    paddingTop: theme.spacing.sm,
    paddingBottom: theme.spacing.xs,
  },
  headerInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
  },
  giveUpBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: theme.radius.full,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  giveUpText: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: 11,
    color: '#64748B',
  },
  questionCounter: {
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.sizes.bodySm,
    color: theme.colors.text.muted,
  },
  boldText: {
    fontFamily: theme.typography.fontFamily.bold,
    color: theme.colors.text.primary,
  },
  timerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: theme.colors.bg.soft,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: theme.radius.full,
  },
  timerBadgeUrgent: {
    backgroundColor: '#FEE2E2',
  },
  timerText: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: theme.typography.sizes.bodySm,
    color: theme.colors.text.body,
  },
  timerTextUrgent: {
    color: '#DC2626',
  },
  statsCard: {
    flexDirection: 'row',
    marginHorizontal: theme.spacing.containerMargin,
    marginTop: theme.spacing.xs,
    marginBottom: theme.spacing.sm,
    paddingVertical: theme.spacing.sm,
  },
  statCol: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  colBorder: {
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: theme.colors.border.soft,
  },
  statTitle: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: 10,
    color: theme.colors.text.muted,
    marginBottom: 2,
  },
  statVal: {
    fontFamily: theme.typography.fontFamily.black,
    fontSize: 16,
    color: theme.colors.text.primary,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  duelScoreCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: theme.spacing.containerMargin,
    marginTop: theme.spacing.xs,
    marginBottom: theme.spacing.sm,
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: '#FFF',
    borderRadius: theme.radius.xl,
    borderWidth: 1.5,
    borderColor: theme.colors.brand.purple + '30',
    ...theme.shadows.card,
  },
  duelSide: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  duelAvatarWrapper: {
    position: 'relative',
  },
  duelAvatarMini: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: theme.colors.brand.magenta,
  },
  duelAvatarLeader: {
    borderColor: '#EAB308',
    borderWidth: 2.5,
  },
  crownBadgeMini: {
    position: 'absolute',
    top: -5,
    right: -4,
    backgroundColor: '#EAB308',
    borderRadius: 8,
    padding: 2,
    borderWidth: 1,
    borderColor: '#FFF',
  },
  duelPlayerInfo: {
    flex: 1,
  },
  nameLeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  leaderPill: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 4,
    borderWidth: 0.5,
    borderColor: '#FDE68A',
  },
  leaderPillText: {
    fontFamily: theme.typography.fontFamily.black,
    fontSize: 8,
    color: '#B45309',
  },
  heartsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginVertical: 2,
  },
  livesCountText: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: 9,
    color: theme.colors.text.muted,
  },
  duelName: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: 12,
    color: theme.colors.text.primary,
  },
  duelScore: {
    fontFamily: theme.typography.fontFamily.black,
    fontSize: 13,
    color: theme.colors.text.primary,
  },
  duelCenter: {
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  potContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: theme.radius.full,
    marginBottom: 3,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  potLabel: {
    fontFamily: theme.typography.fontFamily.black,
    fontSize: 10,
    color: '#B45309',
  },
  duelVsCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: theme.colors.brand.magenta,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
  },
  duelStatusText: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: 9,
    color: theme.colors.text.muted,
    textAlign: 'center',
  },
  categoryBadgeText: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: 12,
    color: theme.colors.brand.magenta,
    textTransform: 'capitalize',
  },
  scrollContent: {
    paddingHorizontal: theme.spacing.containerMargin,
    paddingBottom: 100,
    paddingTop: theme.spacing.xs,
  },
  questionCard: {
    backgroundColor: theme.colors.bg.surface,
    borderRadius: theme.radius.xl,
    padding: theme.spacing.lg,
    marginVertical: theme.spacing.sm,
    ...theme.shadows.pillowy,
  },
  questionText: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: 18,
    lineHeight: 26,
    color: theme.colors.text.primary,
    textAlign: 'center',
  },
  optionsList: {
    marginTop: theme.spacing.sm,
  },
  hintCard: {
    backgroundColor: '#FFFBEB',
    borderRadius: theme.radius.lg,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    borderWidth: 1.5,
    borderColor: theme.colors.warning.amber,
    ...theme.shadows.pillowy,
  },
  hintHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  hintTitle: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: 14,
    color: '#B45309',
  },
  hintText: {
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: 13,
    color: '#78350F',
    lineHeight: 18,
  },
  explanationCard: {
    borderRadius: theme.radius.lg,
    padding: theme.spacing.md,
    marginTop: theme.spacing.sm,
    marginBottom: theme.spacing.md,
    borderWidth: 1.5,
  },
  explanationCorrect: {
    backgroundColor: '#F0FDF4',
    borderColor: theme.colors.success.green,
  },
  explanationWrong: {
    backgroundColor: '#FEF2F2',
    borderColor: theme.colors.danger.red,
  },
  explanationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  explanationTitle: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: 13,
  },
  explanationBody: {
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: 13,
    color: theme.colors.text.body,
    lineHeight: 18,
  },
  powerupBar: {
    marginBottom: 8,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFF',
    paddingHorizontal: theme.spacing.containerMargin,
    paddingVertical: theme.spacing.md,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    ...theme.shadows.card,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  giveUpModalCard: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: '#FFF',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    ...theme.shadows.card,
  },
  giveUpIconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FEE2E2',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  giveUpModalTitle: {
    fontFamily: theme.typography.fontFamily.black,
    fontSize: 20,
    color: theme.colors.text.primary,
    marginBottom: 8,
    textAlign: 'center',
  },
  giveUpModalDesc: {
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: 14,
    color: theme.colors.text.muted,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  giveUpModalBtnRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    width: '100%',
  },
  giveUpCancelBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: theme.radius.full,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  giveUpCancelBtnText: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: 13,
    color: '#475569',
  },
  giveUpConfirmBtn: {
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: theme.radius.full,
    backgroundColor: '#EF4444',
    alignItems: 'center',
    justifyContent: 'center',
    ...theme.shadows.card,
  },
  giveUpConfirmBtnText: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: 13,
    color: '#FFF',
  },
  eliminationModalCard: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: '#FFF',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    ...theme.shadows.card,
  },
  eliminationIconCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    ...theme.shadows.pillowy,
  },
  eliminationModalTitle: {
    fontFamily: theme.typography.fontFamily.black,
    fontSize: 19,
    color: theme.colors.text.primary,
    marginBottom: 8,
    textAlign: 'center',
  },
  eliminationModalDesc: {
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: 13,
    color: theme.colors.text.muted,
    textAlign: 'center',
    lineHeight: 19,
    marginBottom: 16,
  },
  eliminationPrizePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: theme.radius.full,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  eliminationPrizeText: {
    fontFamily: theme.typography.fontFamily.black,
    fontSize: 13,
    color: '#B45309',
  },
  eliminationProceedBtn: {
    width: '100%',
    paddingVertical: 14,
    borderRadius: theme.radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    ...theme.shadows.card,
  },
  eliminationProceedBtnText: {
    fontFamily: theme.typography.fontFamily.black,
    fontSize: 13,
    color: '#FFF',
    letterSpacing: 0.5,
  },
});
