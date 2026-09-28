import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useEffect, useState, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Animated,
  ScrollView,
  Alert
} from 'react-native';
import { theme } from '../src/theme';
import { 
  X, 
  ChevronLeft, 
  Swords, 
  Check, 
  Coins, 
  ArrowRight,
  Crown,
  Heart,
  Dices
} from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useUserStore } from '../src/store/useUserStore';
import { useGameStore, DUEL_BOTS, DuelBot } from '../src/store/useGameStore';
import { getDuelRankByTrophies } from '../src/data/duelRanks';
import { DuelRankBadge } from '../src/components/DuelRankBadge';

export default function MatchmakingScreen() {
  const router = useRouter();
  const { name, avatarUrl, coins, spendCoins, duelTrophies } = useUserStore();
  const { startDuelMatch } = useGameStore();

  // Etapas do fluxo: 'select_bet' -> 'dice_roll' -> 'versus'
  const [step, setStep] = useState<'select_bet' | 'dice_roll' | 'versus'>('select_bet');
  const [selectedBot, setSelectedBot] = useState<DuelBot>(DUEL_BOTS[1]); // Padrão: Bia Gamer (Médio)
  
  // Aposta em Moedas (máx 1000)
  const defaultBet = Math.min(100, Math.max(10, coins > 0 ? coins : 50));
  const [betAmount, setBetAmount] = useState<number>(defaultBet);

  // Rolagem de Dados (1 a 6)
  const [isRolling, setIsRolling] = useState(false);
  const [playerDice, setPlayerDice] = useState<number>(1);
  const [opponentDice, setOpponentDice] = useState<number>(1);
  const [diceRollFinished, setDiceRollFinished] = useState(false);
  const [isPlayerLeader, setIsPlayerLeader] = useState<boolean>(false);

  // Animação de contagem regressiva
  const [countdown, setCountdown] = useState(3);
  const pulseAnim = useRef(new Animated.Value(1)).current;

  const currentRankInfo = getDuelRankByTrophies(duelTrophies);

  useEffect(() => {
    if (step === 'versus') {
      const loopAnim = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.06,
            duration: 900,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 900,
            useNativeDriver: true,
          })
        ])
      );
      loopAnim.start();
      return () => loopAnim.stop();
    }
  }, [step, pulseAnim]);

  useEffect(() => {
    if (step === 'versus' && countdown > 0) {
      const timer = setTimeout(() => setCountdown((prev) => prev - 1), 1100);
      return () => clearTimeout(timer);
    } else if (step === 'versus' && countdown === 0) {
      handleFinalStart();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, countdown]);

  const handleConfirmBet = () => {
    if (coins < betAmount) {
      Alert.alert(
        'Moedas Insuficientes',
        `Você tem ${coins} moedas, mas precisa de ${betAmount} para esta aposta. Reduza a aposta ou resgate moedas na loja!`,
        [
          { text: 'Ajustar para Meu Saldo', onPress: () => setBetAmount(Math.min(coins, 1000)) },
          { text: 'Ok', style: 'cancel' }
        ]
      );
      return;
    }

    setStep('dice_roll');
    startDiceRollAnimation();
  };

  const startDiceRollAnimation = () => {
    setIsRolling(true);
    setDiceRollFinished(false);

    let rollCount = 0;
    const interval = setInterval(() => {
      rollCount++;
      setPlayerDice(Math.floor(Math.random() * 6) + 1);
      setOpponentDice(Math.floor(Math.random() * 6) + 1);

      if (rollCount >= 14) {
        clearInterval(interval);
        
        // Decisão definitiva (garante que não haja empate no dado final)
        let finalPlayer = Math.floor(Math.random() * 6) + 1;
        let finalOpponent = Math.floor(Math.random() * 6) + 1;
        while (finalPlayer === finalOpponent) {
          finalOpponent = Math.floor(Math.random() * 6) + 1;
        }

        setPlayerDice(finalPlayer);
        setOpponentDice(finalOpponent);
        setIsPlayerLeader(finalPlayer > finalOpponent);
        setIsRolling(false);
        setDiceRollFinished(true);
      }
    }, 100);
  };

  const handleProceedToVersus = () => {
    // Validação estrita de escrow: desconta a aposta antes de iniciar o duelo
    const deducted = spendCoins(betAmount);
    if (!deducted) {
      Alert.alert(
        'Saldo Insuficiente',
        `Você não possui moedas suficientes para cobrir a aposta de ${betAmount}. Reduza a aposta para continuar.`
      );
      setStep('select_bet');
      return;
    }
    setStep('versus');
    setCountdown(3);
  };

  const handleFinalStart = () => {
    startDuelMatch({
      bot: selectedBot,
      bet: betAmount,
      playerRoll: playerDice,
      opponentRoll: opponentDice,
      isPlayerLeader,
      questionCount: 15,
    });
    router.replace('/quiz');
  };

  // -------------------------------------------------------------
  // TELA 1: SELEÇÃO DE OPONENTE & APOSTA
  // -------------------------------------------------------------
  if (step === 'select_bet') {
    const betOptions = [50, 100, 250, 500, 1000];

    return (
      <View style={styles.container}>
        <SafeAreaView style={{ flex: 1 }} edges={['top']}>
          {/* Header */}
          <View style={styles.selectHeader}>
            <TouchableOpacity onPress={() => router.replace('/modes')} style={styles.backBtn}>
              <ChevronLeft size={28} color={theme.colors.text.primary} />
            </TouchableOpacity>
            <View style={{ alignItems: 'center' }}>
              <Text style={styles.selectTitle}>DUELO 1V1 APOSTADO</Text>
              <Text style={styles.selectSubTitle}>Aposte, Dispute o Líder e Conquiste o Elo</Text>
            </View>
            <View style={{ width: 40 }} />
          </View>

          <ScrollView 
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Player Elo Status Banner */}
            <View style={styles.eloBanner}>
              <DuelRankBadge rank={currentRankInfo.currentRank} size="sm" showTag={false} />
              <View style={{ flex: 1, marginLeft: 12 }}>
                <View style={styles.rowBetween}>
                  <Text style={[styles.eloRankTitle, { color: currentRankInfo.currentRank.primaryColor }]}>
                    {currentRankInfo.currentRank.name}
                  </Text>
                  <Text style={styles.eloTrophiesText}>🏆 {duelTrophies} Troféus</Text>
                </View>
                <Text style={styles.eloSubtext}>
                  {currentRankInfo.nextRank 
                    ? `Faltam ${currentRankInfo.trophiesNeededForNext} troféus para ${currentRankInfo.nextRank.name}`
                    : 'Rank Máximo Atingido! 👑'}
                </Text>
              </View>
            </View>

            {/* SEÇÃO DE APOSTA */}
            <View style={styles.sectionBox}>
              <View style={styles.sectionHeaderRow}>
                <View style={styles.sectionTitleRow}>
                  <Coins size={22} color="#F59E0B" />
                  <Text style={styles.sectionTitle}>VALOR DA APOSTA</Text>
                </View>
                <View style={styles.balanceBadge}>
                  <Text style={styles.balanceText}>Saldo: {coins.toLocaleString()} 🪙</Text>
                </View>
              </View>

              <Text style={styles.sectionDesc}>
                Ambos os jogadores colocam o mesmo valor na mesa. O vencedor leva o pote todo! (Máx: 1.000)
              </Text>

              {/* Display do Pote */}
              <View style={styles.potDisplayCard}>
                <View style={styles.potCol}>
                  <Text style={styles.potLabel}>SUA APOSTA</Text>
                  <View style={styles.coinValueRow}>
                    <Coins size={14} color="#D97706" />
                    <Text style={styles.potVal}>
                      {betAmount.toLocaleString('pt-BR')}
                    </Text>
                  </View>
                </View>
                <View style={styles.potDivider}>
                  <Text style={styles.potVsText}>+</Text>
                </View>
                <View style={styles.potCol}>
                  <Text style={styles.potLabel}>RIVAL</Text>
                  <View style={styles.coinValueRow}>
                    <Coins size={14} color="#D97706" />
                    <Text style={styles.potVal}>
                      {betAmount.toLocaleString('pt-BR')}
                    </Text>
                  </View>
                </View>
                <View style={styles.potDivider}>
                  <Text style={styles.potVsText}>=</Text>
                </View>
                <View style={[styles.potCol, styles.potTotalCol]}>
                  <Text style={styles.potTotalLabel}>POTE TOTAL</Text>
                  <View style={styles.coinValueRow}>
                    <Coins size={15} color="#A16207" />
                    <Text style={styles.potTotalVal}>
                      {(betAmount * 2).toLocaleString('pt-BR')}
                    </Text>
                  </View>
                </View>
              </View>

              {/* Botões Rápidos de Aposta */}
              <View style={styles.betPillsRow}>
                {betOptions.map((amount) => {
                  const isSelected = betAmount === amount;
                  const isDisabled = coins < amount;
                  return (
                    <TouchableOpacity
                      key={amount}
                      activeOpacity={0.8}
                      disabled={isDisabled}
                      style={[
                        styles.betPill,
                        isSelected && styles.betPillActive,
                        isDisabled && styles.betPillDisabled
                      ]}
                      onPress={() => setBetAmount(amount)}
                    >
                      <View style={styles.coinValueRow}>
                        <Coins 
                          size={13} 
                          color={isSelected ? '#B45309' : (isDisabled ? '#94A3B8' : '#D97706')} 
                        />
                        <Text style={[
                          styles.betPillText,
                          isSelected && styles.betPillTextActive,
                          isDisabled && styles.betPillTextDisabled
                        ]}>
                          {amount.toLocaleString('pt-BR')}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* SEÇÃO DE ESCOLHA DO OPONENTE */}
            <View style={styles.sectionBox}>
              <View style={styles.sectionTitleRow}>
                <Swords size={22} color={theme.colors.brand.purple} />
                <Text style={styles.sectionTitle}>ESCOLHA O ADVERSÁRIO</Text>
              </View>
              <Text style={styles.sectionDesc}>
                Selecione o nível do duelista. Oponentes mais fortes garantem duelos acirrados!
              </Text>

              <View style={styles.botList}>
                {DUEL_BOTS.map((bot) => {
                  const isSelected = selectedBot.id === bot.id;
                  return (
                    <TouchableOpacity
                      key={bot.id}
                      activeOpacity={0.88}
                      style={[
                        styles.botCard,
                        isSelected && [styles.botCardSelected, { borderColor: bot.color }]
                      ]}
                      onPress={() => setSelectedBot(bot)}
                    >
                      <View style={[styles.botAvatarWrapper, { borderColor: bot.color }]}>
                        <Image source={{ uri: bot.avatarUrl }} style={styles.botAvatar} />
                        {isSelected && (
                          <View style={[styles.selectedCheck, { backgroundColor: bot.color }]}>
                            <Check size={12} color="#FFF" />
                          </View>
                        )}
                      </View>

                      <View style={{ flex: 1 }}>
                        <View style={styles.botNameRow}>
                          <Text style={styles.botName}>{bot.name}</Text>
                          <View style={[styles.difficultyBadge, { backgroundColor: bot.color + '20' }]}>
                            <Text style={[styles.difficultyBadgeText, { color: bot.color }]}>
                              {bot.difficultyLabel.toUpperCase()}
                            </Text>
                          </View>
                        </View>
                        <Text style={styles.botTagline}>{bot.tagline}</Text>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          </ScrollView>

          {/* Bottom Action Bar */}
          <View style={styles.selectBottomBar}>
            <TouchableOpacity 
              style={[styles.challengeBtn, { backgroundColor: selectedBot.color }]}
              activeOpacity={0.88}
              onPress={handleConfirmBet}
            >
              <Dices size={24} color="#FFF" />
              <View style={styles.coinValueRow}>
                <Text style={styles.challengeBtnText}>APOSTAR</Text>
                <Coins size={16} color="#FFF" />
                <Text style={styles.challengeBtnText}>
                  {betAmount.toLocaleString('pt-BR')}
                </Text>
                <Text style={styles.challengeBtnText}>E ROLAR DADOS</Text>
              </View>
              <ArrowRight size={20} color="#FFF" />
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </View>
    );
  }

  // -------------------------------------------------------------
  // TELA 2: O GRANDE SORTEIO DO DADO (LÍDER COM 3 VIDAS)
  // -------------------------------------------------------------
  if (step === 'dice_roll') {
    return (
      <View style={styles.container}>
        <LinearGradient 
          colors={['#1E1B4B', '#311042', '#0F172A']}
          style={StyleSheet.absoluteFill}
        />
        <SafeAreaView style={{ flex: 1, justifyContent: 'space-between' }} edges={['top']}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => setStep('select_bet')} style={styles.closeButton}>
              <X size={26} color="#FFF" />
            </TouchableOpacity>
            <Text style={styles.headerTitleWhite}>DISPUTA DA LIDERANÇA</Text>
            <View style={{ width: 44 }} />
          </View>

          {/* Dice Arena Content */}
          <View style={styles.diceArena}>
            <Text style={styles.diceArenaSubtitle}>
              Quem tirar o número mais alto no dado de 1 a 6 será o Líder e ganha 3 VIDAS na partida!
            </Text>

            <View style={styles.diceFaceOffRow}>
              {/* Player Dice Column */}
              <View style={styles.diceColumn}>
                <Image 
                  source={{ uri: avatarUrl || 'https://api.dicebear.com/7.x/avataaars/png?seed=Player' }} 
                  style={styles.dicePlayerAvatar} 
                />
                <Text style={styles.dicePlayerName}>{name || 'Você'}</Text>
                
                <View style={[
                  styles.diceBox, 
                  diceRollFinished && isPlayerLeader && styles.diceBoxWinner
                ]}>
                  <Text style={styles.diceNumberText}>{playerDice}</Text>
                </View>

                {diceRollFinished && (
                  <View style={[styles.livesBadge, isPlayerLeader ? styles.livesBadgeWinner : styles.livesBadgeNormal]}>
                    <Heart size={14} color="#FFF" fill="#FFF" />
                    <Text style={styles.livesBadgeText}>
                      {isPlayerLeader ? '3 VIDAS (LÍDER)' : '1 VIDA'}
                    </Text>
                  </View>
                )}
              </View>

              {/* VS Divider */}
              <View style={styles.diceVsDivider}>
                <Dices size={36} color={isRolling ? '#F59E0B' : '#CBD5E1'} />
                <Text style={styles.diceVsText}>VS</Text>
              </View>

              {/* Opponent Dice Column */}
              <View style={styles.diceColumn}>
                <Image 
                  source={{ uri: selectedBot.avatarUrl }} 
                  style={[styles.dicePlayerAvatar, { borderColor: selectedBot.color }]} 
                />
                <Text style={[styles.dicePlayerName, { color: selectedBot.color }]}>{selectedBot.name}</Text>
                
                <View style={[
                  styles.diceBox, 
                  diceRollFinished && !isPlayerLeader && styles.diceBoxWinner
                ]}>
                  <Text style={styles.diceNumberText}>{opponentDice}</Text>
                </View>

                {diceRollFinished && (
                  <View style={[styles.livesBadge, !isPlayerLeader ? styles.livesBadgeWinner : styles.livesBadgeNormal]}>
                    <Heart size={14} color="#FFF" fill="#FFF" />
                    <Text style={styles.livesBadgeText}>
                      {!isPlayerLeader ? '3 VIDAS (LÍDER)' : '1 VIDA'}
                    </Text>
                  </View>
                )}
              </View>
            </View>

            {/* Announcement Banner */}
            {diceRollFinished ? (
              <View style={[styles.resultBanner, isPlayerLeader ? styles.resultBannerWin : styles.resultBannerLoss]}>
                <Crown size={26} color={isPlayerLeader ? '#F59E0B' : '#EF4444'} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.resultBannerTitle}>
                    {isPlayerLeader ? 'VOCÊ TIROU O MAIOR DADO E É O LÍDER! 👑' : `${selectedBot.name.toUpperCase()} É O LÍDER! 👑`}
                  </Text>
                  <Text style={styles.resultBannerDesc}>
                    {isPlayerLeader 
                      ? 'Você entra na arena com 3 VIDAS. O adversário começa com apenas 1 VIDA!'
                      : 'O adversário tem 3 VIDAS. Você começa com apenas 1 VIDA. Não pode errar!'}
                  </Text>
                </View>
              </View>
            ) : (
              <View style={styles.rollingBanner}>
                <Text style={styles.rollingText}>Rolando os dados... 🎲</Text>
              </View>
            )}
          </View>

          {/* Bottom Button */}
          <View style={styles.selectBottomBarDark}>
            {diceRollFinished ? (
              <TouchableOpacity 
                style={styles.proceedDuelBtn}
                activeOpacity={0.88}
                onPress={handleProceedToVersus}
              >
                <Swords size={22} color="#FFF" />
                <Text style={styles.proceedDuelBtnText}>IR PARA O CONFRONTO</Text>
                <ArrowRight size={20} color="#FFF" />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity 
                style={[styles.proceedDuelBtn, { opacity: 0.6 }]}
                disabled={true}
              >
                <Text style={styles.proceedDuelBtnText}>SORTEANDO LÍDER...</Text>
              </TouchableOpacity>
            )}
          </View>
        </SafeAreaView>
      </View>
    );
  }

  // -------------------------------------------------------------
  // TELA 3: VERSUS FINAL COM CONTAGEM REGRESSIVA
  // -------------------------------------------------------------
  return (
    <View style={styles.container}>
      <LinearGradient 
        colors={[theme.colors.brand.purple, '#831843', '#1E1B4B']}
        style={StyleSheet.absoluteFill}
      />
      
      <SafeAreaView style={{ flex: 1, justifyContent: 'space-between' }} edges={['top']}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => setStep('dice_roll')} style={styles.closeButton}>
            <X size={28} color="#FFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitleWhite}>ARENA 1V1</Text>
          <View style={{ width: 48 }} />
        </View>

        {/* Main Versus Content */}
        <View style={styles.versusMain}>
          {/* Pot Badge */}
          <View style={styles.versusPotPill}>
            <Text style={styles.versusPotText}>POTE EM DISPUTA:</Text>
            <Coins size={16} color="#FBBF24" />
            <Text style={styles.versusPotText}>
              {(betAmount * 2).toLocaleString('pt-BR')}
            </Text>
          </View>

          <View style={styles.versusContainer}>
            {/* Player 1 (Você) */}
            <View style={styles.playerColumn}>
              <Animated.View style={[
                styles.avatarWrapper, 
                { borderColor: isPlayerLeader ? '#F59E0B' : '#CBD5E1', transform: [{ scale: pulseAnim }] }
              ]}>
                <Image 
                  source={{ uri: avatarUrl || 'https://api.dicebear.com/7.x/avataaars/png?seed=Player' }} 
                  style={styles.avatar} 
                />
                {isPlayerLeader && (
                  <View style={styles.crownBadge}>
                    <Crown size={16} color="#FFF" />
                  </View>
                )}
              </Animated.View>

              <Text style={styles.playerName} numberOfLines={1}>{name || 'Você'}</Text>
              
              <View style={[styles.livesPill, isPlayerLeader && styles.livesPillLeader]}>
                <Text style={styles.livesPillText}>
                  {isPlayerLeader ? '❤️❤️❤️ 3 Vidas' : '❤️ 1 Vida'}
                </Text>
              </View>
            </View>

            {/* VS Center */}
            <View style={styles.vsDivider}>
              <Text style={styles.vsText}>VS</Text>
            </View>

            {/* Player 2 (Bot) */}
            <View style={styles.playerColumn}>
              <Animated.View style={[
                styles.avatarWrapper, 
                { borderColor: !isPlayerLeader ? '#F59E0B' : selectedBot.color, transform: [{ scale: pulseAnim }] }
              ]}>
                <Image 
                  source={{ uri: selectedBot.avatarUrl }} 
                  style={styles.avatar} 
                />
                {!isPlayerLeader && (
                  <View style={styles.crownBadge}>
                    <Crown size={16} color="#FFF" />
                  </View>
                )}
              </Animated.View>

              <Text style={styles.playerName} numberOfLines={1}>{selectedBot.name}</Text>
              
              <View style={[styles.livesPill, !isPlayerLeader && styles.livesPillLeader]}>
                <Text style={styles.livesPillText}>
                  {!isPlayerLeader ? '❤️❤️❤️ 3 Vidas' : '❤️ 1 Vida'}
                </Text>
              </View>
            </View>
          </View>

          {/* Troféu em Disputa */}
          <View style={styles.trophyPill}>
            <Text style={styles.trophyPillText}>
              🏆 Vencedor ganha +1 Troféu rumo ao {currentRankInfo.nextRank?.name || 'Desafiante'}!
            </Text>
          </View>
        </View>

        {/* Countdown Action */}
        <View style={styles.countdownBox}>
          <Text style={styles.countdownNumber}>
            {countdown > 0 ? countdown : 'VALENDO!'}
          </Text>
          <Text style={styles.countdownSub}>Quem zerar as vidas é eliminado!</Text>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.bg.app,
  },
  selectHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 8,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
    ...theme.shadows.pillowy,
  },
  selectTitle: {
    fontFamily: theme.typography.fontFamily.black,
    fontSize: 18,
    color: theme.colors.text.primary,
    letterSpacing: 0.8,
  },
  selectSubTitle: {
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: 11,
    color: theme.colors.text.muted,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 100,
    gap: 16,
  },
  eloBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    padding: 14,
    borderRadius: theme.radius.xl,
    borderWidth: 1.5,
    borderColor: theme.colors.border.soft,
    ...theme.shadows.card,
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  eloRankTitle: {
    fontFamily: theme.typography.fontFamily.black,
    fontSize: 16,
  },
  eloTrophiesText: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: 13,
    color: theme.colors.text.primary,
  },
  eloSubtext: {
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: 11,
    color: theme.colors.text.muted,
    marginTop: 2,
  },
  sectionBox: {
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: theme.radius.xl,
    borderWidth: 1.5,
    borderColor: theme.colors.border.soft,
    ...theme.shadows.card,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionTitle: {
    fontFamily: theme.typography.fontFamily.black,
    fontSize: 15,
    color: theme.colors.text.primary,
    letterSpacing: 0.5,
  },
  balanceBadge: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  balanceText: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: 12,
    color: '#B45309',
  },
  sectionDesc: {
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: 12,
    color: theme.colors.text.muted,
    marginTop: 4,
    marginBottom: 14,
    lineHeight: 16,
  },
  potDisplayCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F8FAFC',
    borderRadius: theme.radius.lg,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 14,
  },
  potCol: {
    alignItems: 'center',
    flex: 1,
  },
  potLabel: {
    fontSize: 9,
    fontFamily: theme.typography.fontFamily.bold,
    color: theme.colors.text.muted,
  },
  potVal: {
    fontSize: 14,
    fontFamily: theme.typography.fontFamily.black,
    color: theme.colors.text.primary,
    marginTop: 2,
  },
  potDivider: {
    paddingHorizontal: 4,
  },
  potVsText: {
    fontSize: 16,
    fontFamily: theme.typography.fontFamily.black,
    color: '#94A3B8',
  },
  potTotalCol: {
    backgroundColor: '#FEF9C3',
    paddingVertical: 6,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: '#FDE047',
  },
  potTotalLabel: {
    fontSize: 9,
    fontFamily: theme.typography.fontFamily.black,
    color: '#854D0E',
  },
  potTotalVal: {
    fontSize: 15,
    fontFamily: theme.typography.fontFamily.black,
    color: '#A16207',
    marginTop: 1,
  },
  betPillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  betPill: {
    flex: 1,
    minWidth: '18%',
    paddingVertical: 10,
    borderRadius: theme.radius.md,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  betPillActive: {
    backgroundColor: '#FEF3C7',
    borderColor: '#F59E0B',
  },
  betPillDisabled: {
    opacity: 0.4,
  },
  coinValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  betPillText: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: 12,
    color: '#334155',
  },
  betPillTextActive: {
    color: '#92400E',
    fontFamily: theme.typography.fontFamily.black,
  },
  betPillTextDisabled: {
    color: '#64748B',
  },
  botList: {
    gap: 10,
  },
  botCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: theme.radius.lg,
    backgroundColor: '#F8FAFC',
    borderWidth: 2,
    borderColor: 'transparent',
    gap: 12,
  },
  botCardSelected: {
    backgroundColor: '#FFF',
    ...theme.shadows.card,
  },
  botAvatarWrapper: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    position: 'relative',
    backgroundColor: '#E2E8F0',
  },
  botAvatar: {
    width: '100%',
    height: '100%',
    borderRadius: 25,
  },
  selectedCheck: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#FFF',
  },
  botNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  botName: {
    fontSize: 14,
    fontFamily: theme.typography.fontFamily.bold,
    color: theme.colors.text.primary,
  },
  difficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  difficultyBadgeText: {
    fontSize: 10,
    fontFamily: theme.typography.fontFamily.black,
  },
  botTagline: {
    fontSize: 11,
    fontFamily: theme.typography.fontFamily.medium,
    color: theme.colors.text.muted,
  },
  selectBottomBar: {
    padding: 16,
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderTopColor: theme.colors.border.soft,
  },
  challengeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 56,
    borderRadius: theme.radius.xl,
    gap: 10,
    ...theme.shadows.card,
  },
  challengeBtnText: {
    color: '#FFF',
    fontFamily: theme.typography.fontFamily.black,
    fontSize: 15,
    letterSpacing: 0.5,
  },

  // DICE ROLL SCREEN
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  headerTitleWhite: {
    color: '#FFF',
    fontFamily: theme.typography.fontFamily.black,
    fontSize: 18,
    letterSpacing: 0.8,
  },
  closeButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  diceArena: {
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  diceArenaSubtitle: {
    color: '#E0E7FF',
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: 13,
    textAlign: 'center',
    marginBottom: 28,
    lineHeight: 18,
  },
  diceFaceOffRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    marginBottom: 24,
  },
  diceColumn: {
    alignItems: 'center',
    width: 120,
  },
  dicePlayerAvatar: {
    width: 68,
    height: 68,
    borderRadius: 34,
    borderWidth: 3,
    borderColor: '#FFF',
    marginBottom: 6,
  },
  dicePlayerName: {
    color: '#FFF',
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: 14,
    marginBottom: 12,
  },
  diceBox: {
    width: 88,
    height: 88,
    backgroundColor: '#FFF',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: '#94A3B8',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 8,
  },
  diceBoxWinner: {
    borderColor: '#F59E0B',
    backgroundColor: '#FEF3C7',
    transform: [{ scale: 1.08 }],
  },
  diceNumberText: {
    fontFamily: theme.typography.fontFamily.black,
    fontSize: 44,
    color: '#0F172A',
  },
  livesBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    marginTop: 12,
  },
  livesBadgeWinner: {
    backgroundColor: '#10B981',
  },
  livesBadgeNormal: {
    backgroundColor: '#64748B',
  },
  livesBadgeText: {
    color: '#FFF',
    fontFamily: theme.typography.fontFamily.black,
    fontSize: 11,
  },
  diceVsDivider: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  diceVsText: {
    color: '#FFF',
    fontFamily: theme.typography.fontFamily.black,
    fontSize: 16,
    marginTop: 4,
  },
  resultBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: 'rgba(255,255,255,0.95)',
    padding: 16,
    borderRadius: theme.radius.xl,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 6,
  },
  resultBannerWin: {
    borderLeftWidth: 6,
    borderLeftColor: '#10B981',
  },
  resultBannerLoss: {
    borderLeftWidth: 6,
    borderLeftColor: '#EF4444',
  },
  resultBannerTitle: {
    fontFamily: theme.typography.fontFamily.black,
    fontSize: 13,
    color: theme.colors.text.primary,
  },
  resultBannerDesc: {
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: 11,
    color: theme.colors.text.muted,
    marginTop: 2,
    lineHeight: 15,
  },
  rollingBanner: {
    padding: 16,
    borderRadius: theme.radius.xl,
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  rollingText: {
    color: '#FFF',
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: 14,
  },
  selectBottomBarDark: {
    padding: 16,
  },
  proceedDuelBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 56,
    backgroundColor: theme.colors.brand.magenta,
    borderRadius: theme.radius.xl,
    gap: 10,
    ...theme.shadows.magentaGlow,
  },
  proceedDuelBtnText: {
    color: '#FFF',
    fontFamily: theme.typography.fontFamily.black,
    fontSize: 15,
    letterSpacing: 0.6,
  },

  // VERSUS FINAL SCREEN
  versusMain: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  versusPotPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(0,0,0,0.3)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 30,
    borderWidth: 1,
    borderColor: 'rgba(251, 191, 36, 0.4)',
  },
  versusPotText: {
    color: '#FDE047',
    fontFamily: theme.typography.fontFamily.black,
    fontSize: 13,
    letterSpacing: 0.5,
  },
  versusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    gap: 20,
  },
  playerColumn: {
    alignItems: 'center',
    width: 120,
  },
  avatarWrapper: {
    width: 104,
    height: 104,
    borderRadius: 52,
    borderWidth: 4,
    position: 'relative',
    backgroundColor: '#FFF',
  },
  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: 52,
  },
  crownBadge: {
    position: 'absolute',
    top: -12,
    right: -4,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#F59E0B',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFF',
  },
  playerName: {
    color: '#FFF',
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: 16,
    marginTop: 10,
    marginBottom: 6,
  },
  livesPill: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 14,
  },
  livesPillLeader: {
    backgroundColor: '#10B981',
  },
  livesPillText: {
    color: '#FFF',
    fontFamily: theme.typography.fontFamily.black,
    fontSize: 12,
  },
  vsDivider: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  vsText: {
    color: theme.colors.brand.magenta,
    fontFamily: theme.typography.fontFamily.black,
    fontSize: 18,
  },
  trophyPill: {
    marginTop: 36,
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
  },
  trophyPillText: {
    color: '#FFF',
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: 12,
    textAlign: 'center',
  },
  countdownBox: {
    alignItems: 'center',
    paddingBottom: 24,
  },
  countdownNumber: {
    color: '#FFF',
    fontFamily: theme.typography.fontFamily.black,
    fontSize: 48,
    letterSpacing: 1,
  },
  countdownSub: {
    color: '#CBD5E1',
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: 12,
    marginTop: 4,
  },
});
