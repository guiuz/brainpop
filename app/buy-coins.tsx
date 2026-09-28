import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator
} from 'react-native';
import { theme } from '../src/theme';
import { Card } from '../src/components/Card';
import { useRouter } from 'expo-router';
import { 
  Coins, 
  Sparkles, 
  Crown,
  ChevronLeft,
  Tv
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useUserStore } from '../src/store/useUserStore';
import { playBillingService, PlayProductItem } from '../src/services/playBillingService';
import { adMobService } from '../src/services/adMobService';
import * as RNIap from 'react-native-iap';

export default function BuyCoinsScreen() {
  const router = useRouter();
  const { id: userId, coins } = useUserStore();
  const [products, setProducts] = useState<PlayProductItem[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  // Inicializa IAP e pré-carrega AdMob
  useEffect(() => {
    let isMounted = true;

    async function setupBilling() {
      setIsLoadingProducts(true);
      try {
        await playBillingService.init();
        const loadedProducts = await playBillingService.fetchProducts();
        if (isMounted) {
          setProducts(loadedProducts);
        }
      } catch (err) {
        console.warn('Erro ao carregar produtos do Play Billing:', err);
      } finally {
        if (isMounted) {
          setIsLoadingProducts(false);
        }
      }
    }

    setupBilling();
    adMobService.preloadAd('daily_coins_rewarded');

    // Listener para transações pendentes/concluídas do Google Play
    const purchaseUpdateSubscription = RNIap.purchaseUpdatedListener(async (purchase: RNIap.ProductPurchase) => {
      if (!userId) return;

      try {
        const result = await playBillingService.processAndFinishPurchase(purchase, userId);
        setProcessingId(null);

        if (result.success) {
          Alert.alert(
            'Compra Concluída! 🎉',
            result.message,
            [{ text: 'Maravilha!' }]
          );
        } else if (result.alreadyProcessed) {
          Alert.alert(
            'Compra Já Processada',
            'Esta compra já havia sido creditada na sua conta anteriormente.',
            [{ text: 'OK' }]
          );
        } else {
          Alert.alert(
            'Validação de Compra',
            result.message || 'Não foi possível validar a compra com o servidor.',
            [{ text: 'OK' }]
          );
        }
      } catch (procErr: any) {
        setProcessingId(null);
        Alert.alert('Erro ao Processar', procErr?.message || 'Falha ao processar a compra.');
      }
    });

    const purchaseErrorSubscription = RNIap.purchaseErrorListener((error: RNIap.PurchaseError) => {
      setProcessingId(null);
      if (
        error.code === 'E_USER_CANCELLED' || 
        (error.responseCode as any) === RNIap.ErrorCode.E_USER_CANCELLED ||
        error.message?.toLowerCase().includes('cancel')
      ) {
        // Usuário cancelou no modal nativo da Play Store: silencioso ou informativo
        return;
      }
      Alert.alert(
        'Falha na Compra',
        error.message || 'Ocorreu um erro ao comunicar com a Google Play Store.',
        [{ text: 'Entendido' }]
      );
    });

    return () => {
      isMounted = false;
      purchaseUpdateSubscription.remove();
      purchaseErrorSubscription.remove();
      playBillingService.cleanup();
    };
  }, [userId]);

  // Fluxo de Anúncio AdMob Real
  const handleWatchDailyAd = () => {
    Alert.alert(
      'Recurso em Homologação',
      'A concessão de moedas por anúncios em vídeo está temporariamente suspensa aguardando a integração do sistema de validação criptográfica (SSV) no servidor.',
      [{ text: 'Entendido' }]
    );
  };

  // Fluxo de Compra Play Store Real
  const handlePurchase = async (pack: PlayProductItem) => {
    if (!userId) {
      Alert.alert('Autenticação Necessária', 'Você precisa estar conectado para realizar compras na loja.');
      return;
    }

    setProcessingId(pack.productId);

    try {
      await playBillingService.requestPurchase(pack.productId);
    } catch (err: any) {
      setProcessingId(null);
      if (err?.message?.includes('cancelled') || err?.code === 'E_USER_CANCELLED') {
        return;
      }
      Alert.alert(
        'Google Play Store',
        err?.message || 'Não foi possível abrir a tela de pagamento da Google Play.',
        [{ text: 'OK' }]
      );
    }
  };

  const comboPacks = products.filter((p) => p.isCombo);
  const standardPacks = products.filter((p) => !p.isCombo);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header com saldo */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.circleBtn} 
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <ChevronLeft color={theme.colors.text.primary} size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Moedas & Loja</Text>
        <View style={styles.balanceBadge}>
          <Coins size={16} color={theme.colors.warning.amber} />
          <Text style={styles.balanceText}>{coins.toLocaleString('pt-BR')}</Text>
        </View>
      </View>

      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Banner Promocional */}
        <LinearGradient
          colors={theme.gradients.cta}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.heroBanner}
        >
          <View style={styles.heroContent}>
            <View style={styles.heroIconBox}>
              <Crown size={28} color="#FFF" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.heroTitle}>Turbine Sua Jornada</Text>
              <Text style={styles.heroSubtitle}>
                Moedas permitem recarregar vidas e desbloquear power-ups táticos ilimitados!
              </Text>
            </View>
          </View>
        </LinearGradient>

        {/* RECOMPENSA DIÁRIA EM VÍDEO ADMOB (25 MOEDAS POR DIA) */}
        <View style={styles.dailyAdCard}>
          <View style={styles.dailyAdHeader}>
            <View style={styles.dailyAdIconBox}>
              <Tv size={26} color="#FFF" />
            </View>
            <View style={{ flex: 1 }}>
              <View style={styles.adBadgeRow}>
                <Text style={styles.dailyAdTitle}>Moedas Diárias (Vídeo)</Text>
                <View style={[styles.statusBadge, styles.statusBadgeDone]}>
                  <Text style={[styles.statusBadgeText, styles.statusTextDone]}>
                    EM HOMOLOGAÇÃO
                  </Text>
                </View>
              </View>
              <Text style={styles.dailyAdSubtitle}>
                Recompensas em vídeo temporariamente suspensas para integração autoritativa (SSV) no servidor.
              </Text>
            </View>
          </View>

          <TouchableOpacity 
            style={[
              styles.watchAdBtn,
              styles.watchAdBtnDisabled
            ]}
            activeOpacity={0.85}
            onPress={handleWatchDailyAd}
          >
            <Text style={[styles.watchAdBtnText, styles.watchAdBtnTextDisabled]}>
              RECOMPENSAS EM HOMOLOGAÇÃO NO SERVIDOR
            </Text>
          </TouchableOpacity>
        </View>

        {/* Seção 1: Super Combos com Bônus */}
        <View style={styles.sectionTitleRow}>
          <Sparkles size={18} color={theme.colors.brand.magenta} />
          <Text style={styles.sectionTitle}>COMBOS ESPECIAIS COM BÔNUS</Text>
        </View>

        {isLoadingProducts ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={theme.colors.brand.magenta} />
            <Text style={styles.loadingText}>Carregando preços da Google Play Store...</Text>
          </View>
        ) : (
          <View style={styles.packagesList}>
            {comboPacks.map((pack) => {
              const total = pack.coins + (pack.bonusCoins || 0);
              const isProcessing = processingId === pack.productId;

              return (
                <TouchableOpacity
                  key={pack.productId}
                  activeOpacity={0.9}
                  disabled={isProcessing}
                  onPress={() => handlePurchase(pack)}
                >
                  <Card style={styles.comboCard}>
                    {pack.badge && (
                      <View style={[styles.badgeRibbon, { backgroundColor: pack.badgeColor || theme.colors.brand.magenta }]}>
                        <Text style={styles.badgeRibbonText}>{pack.badge}</Text>
                      </View>
                    )}

                    <View style={styles.comboCardContent}>
                      <View style={styles.coinGraphic}>
                        <LinearGradient
                          colors={pack.gradientColors}
                          style={styles.coinIconCircle}
                        >
                          <Coins size={26} color="#FFF" />
                        </LinearGradient>
                      </View>

                      <View style={styles.packInfo}>
                        <Text style={styles.packTitle}>{pack.title}</Text>
                        <View style={styles.coinAmountRow}>
                          <Text style={styles.totalCoinsText}>{total.toLocaleString('pt-BR')} 🪙</Text>
                          <Text style={styles.breakdownText}>
                            ({pack.coins.toLocaleString('pt-BR')} + <Text style={{ color: theme.colors.brand.magenta, fontFamily: theme.typography.fontFamily.bold }}>{pack.bonusCoins} Bônus</Text>)
                          </Text>
                        </View>
                      </View>

                      <View style={styles.priceContainer}>
                        {isProcessing ? (
                          <ActivityIndicator size="small" color={theme.colors.brand.magenta} />
                        ) : (
                          <View style={styles.priceButton}>
                            <Text style={styles.priceButtonText}>{pack.localizedPrice}</Text>
                          </View>
                        )}
                      </View>
                    </View>
                  </Card>
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        {/* Seção 2: Pacotes Padrão */}
        <View style={[styles.sectionTitleRow, { marginTop: 24 }]}>
          <Coins size={18} color={theme.colors.info.teal} />
          <Text style={styles.sectionTitle}>PACOTES BÁSICOS</Text>
        </View>

        {!isLoadingProducts && (
          <View style={styles.packagesList}>
            {standardPacks.map((pack) => {
              const isProcessing = processingId === pack.productId;

              return (
                <TouchableOpacity
                  key={pack.productId}
                  activeOpacity={0.9}
                  disabled={isProcessing}
                  onPress={() => handlePurchase(pack)}
                >
                  <Card style={styles.standardCard}>
                    <View style={styles.standardContent}>
                      <View style={styles.standardIconCircle}>
                        <Coins size={22} color={theme.colors.info.teal} />
                      </View>

                      <View style={{ flex: 1 }}>
                        <Text style={styles.standardTitle}>{pack.title}</Text>
                        <Text style={styles.standardCoins}>{pack.coins.toLocaleString('pt-BR')} Moedas</Text>
                      </View>

                      <View style={styles.priceContainer}>
                        {isProcessing ? (
                          <ActivityIndicator size="small" color={theme.colors.info.teal} />
                        ) : (
                          <View style={[styles.priceButton, styles.standardPriceButton]}>
                            <Text style={styles.standardPriceText}>{pack.localizedPrice}</Text>
                          </View>
                        )}
                      </View>
                    </View>
                  </Card>
                </TouchableOpacity>
              );
            })}
          </View>
        )}
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
  balanceBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FFF',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: theme.radius.full,
    ...theme.shadows.pillowy,
  },
  balanceText: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: 13,
    color: theme.colors.text.primary,
  },
  scrollContent: {
    paddingHorizontal: theme.spacing.containerMargin,
    paddingTop: theme.spacing.sm,
    paddingBottom: theme.spacing['5xl'],
  },
  heroBanner: {
    borderRadius: theme.radius.xl,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    ...theme.shadows.card,
  },
  heroContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  heroIconBox: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroTitle: {
    fontSize: 16,
    fontFamily: theme.typography.fontFamily.black,
    color: '#FFF',
  },
  heroSubtitle: {
    fontSize: 11,
    fontFamily: theme.typography.fontFamily.medium,
    color: 'rgba(255,255,255,0.9)',
    marginTop: 2,
    lineHeight: 16,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 12,
    fontFamily: theme.typography.fontFamily.black,
    color: theme.colors.text.primary,
    letterSpacing: 0.5,
  },
  packagesList: {
    gap: 12,
  },
  loadingContainer: {
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  loadingText: {
    fontSize: 12,
    fontFamily: theme.typography.fontFamily.medium,
    color: theme.colors.text.muted,
  },
  comboCard: {
    padding: 14,
    backgroundColor: '#FFF',
    borderRadius: theme.radius.xl,
    position: 'relative',
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: '#F1F5F9',
    ...theme.shadows.card,
  },
  badgeRibbon: {
    position: 'absolute',
    top: 0,
    right: 0,
    paddingHorizontal: 12,
    paddingVertical: 3,
    borderBottomLeftRadius: 12,
  },
  badgeRibbonText: {
    color: '#FFF',
    fontSize: 9,
    fontFamily: theme.typography.fontFamily.black,
    letterSpacing: 0.5,
  },
  comboCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  coinGraphic: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  coinIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    ...theme.shadows.pillowy,
  },
  packInfo: {
    flex: 1,
  },
  packTitle: {
    fontSize: 14,
    fontFamily: theme.typography.fontFamily.bold,
    color: theme.colors.text.primary,
  },
  coinAmountRow: {
    marginTop: 2,
  },
  totalCoinsText: {
    fontSize: 16,
    fontFamily: theme.typography.fontFamily.black,
    color: theme.colors.brand.magenta,
  },
  breakdownText: {
    fontSize: 10,
    fontFamily: theme.typography.fontFamily.medium,
    color: theme.colors.text.muted,
  },
  priceContainer: {
    minWidth: 78,
    alignItems: 'flex-end',
  },
  priceButton: {
    backgroundColor: theme.colors.brand.magenta,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: theme.radius.full,
    ...theme.shadows.magentaGlow,
  },
  priceButtonText: {
    color: '#FFF',
    fontFamily: theme.typography.fontFamily.black,
    fontSize: 12,
  },
  standardCard: {
    padding: 14,
    backgroundColor: '#FFF',
    borderRadius: theme.radius.xl,
    ...theme.shadows.pillowy,
  },
  standardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  standardIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: theme.colors.info.teal + '15',
    alignItems: 'center',
    justifyContent: 'center',
  },
  standardTitle: {
    fontSize: 14,
    fontFamily: theme.typography.fontFamily.bold,
    color: theme.colors.text.primary,
  },
  standardCoins: {
    fontSize: 12,
    fontFamily: theme.typography.fontFamily.semibold,
    color: theme.colors.info.tealDark,
    marginTop: 2,
  },
  standardPriceButton: {
    backgroundColor: theme.colors.bg.soft,
    shadowOpacity: 0,
    elevation: 0,
    borderWidth: 1,
    borderColor: theme.colors.border.soft,
  },
  standardPriceText: {
    color: theme.colors.text.primary,
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: 12,
  },
  dailyAdCard: {
    backgroundColor: '#FFF',
    borderRadius: theme.radius.xl,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.lg,
    borderWidth: 1.5,
    borderColor: theme.colors.brand.purple + '40',
    ...theme.shadows.card,
  },
  dailyAdHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  dailyAdIconBox: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.colors.brand.purple,
    alignItems: 'center',
    justifyContent: 'center',
    ...theme.shadows.pillowy,
  },
  adBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  dailyAdTitle: {
    fontSize: 15,
    fontFamily: theme.typography.fontFamily.black,
    color: theme.colors.text.primary,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: theme.radius.full,
  },
  statusBadgeReady: {
    backgroundColor: 'rgba(34, 197, 94, 0.15)',
  },
  statusBadgeDone: {
    backgroundColor: theme.colors.bg.soft,
  },
  statusBadgeText: {
    fontSize: 9,
    fontFamily: theme.typography.fontFamily.black,
    letterSpacing: 0.5,
  },
  statusTextReady: {
    color: theme.colors.success.greenDark,
  },
  statusTextDone: {
    color: theme.colors.text.muted,
  },
  dailyAdSubtitle: {
    fontSize: 12,
    fontFamily: theme.typography.fontFamily.medium,
    color: theme.colors.text.muted,
    lineHeight: 16,
  },
  watchAdBtn: {
    backgroundColor: theme.colors.brand.magenta,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 48,
    borderRadius: theme.radius.xl,
    ...theme.shadows.magentaGlow,
  },
  watchAdBtnDisabled: {
    backgroundColor: theme.colors.bg.soft,
    elevation: 0,
    shadowOpacity: 0,
    borderWidth: 1,
    borderColor: theme.colors.border.soft,
  },
  watchAdBtnText: {
    color: '#FFF',
    fontFamily: theme.typography.fontFamily.black,
    fontSize: 13,
    letterSpacing: 0.5,
  },
  watchAdBtnTextDisabled: {
    color: theme.colors.text.muted,
  },
});
