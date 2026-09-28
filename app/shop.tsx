import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Alert 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  Sparkles, 
  Clock, 
  FastForward, 
  Heart, 
  Zap, 
  Coins, 
  Tv 
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { theme } from '../src/theme';
import { Card } from '../src/components/Card';
import { HeaderBar } from '../src/components/HeaderBar';
import { BottomNav } from '../src/components/BottomNav';
import { useRouter } from 'expo-router';
import { useShopStore, ShopItem } from '../src/store/useShopStore';
import { useUserStore } from '../src/store/useUserStore';
import { adMobService } from '../src/services/adMobService';

export default function ShopScreen() {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState<'all' | 'powerups' | 'lives'>('all');
  const { items, buyItem } = useShopStore();
  const { coins } = useUserStore();

  React.useEffect(() => {
    adMobService.preloadAd('daily_coins_rewarded');
  }, []);

  const handleBuy = (item: ShopItem) => {
    const result = buyItem(item.id);
    Alert.alert(
      result.success ? 'Compra Realizada! 🎉' : 'Atenção',
      result.message,
      [{ text: 'OK' }]
    );
  };

  const handleWatchDailyAd = () => {
    Alert.alert(
      'Recurso em Homologação',
      'A concessão de moedas por anúncios em vídeo está temporariamente suspensa aguardando a integração do sistema de validação criptográfica (SSV) no servidor.',
      [{ text: 'Entendido' }]
    );
  };

  const filteredItems = activeCategory === 'all' 
    ? items 
    : items.filter((item) => item.category === activeCategory);

  const getItemIcon = (iconName: string) => {
    switch (iconName) {
      case 'Heart': return Heart;
      case 'Sparkles': return Sparkles;
      case 'Clock': return Clock;
      case 'FastForward': return FastForward;
      default: return Zap;
    }
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        {/* Header com Vidas, Streaks e Moedas */}
        <HeaderBar showBack showStats />

        <ScrollView 
          contentContainerStyle={styles.scrollContent} 
          showsVerticalScrollIndicator={false}
        >
          {/* Banner Promocional */}
          <LinearGradient
            colors={theme.gradients.cta}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.promoBanner}
          >
            <View style={styles.promoBadge}>
              <Text style={styles.promoBadgeText}>OFERTA ESPECIAL</Text>
            </View>
            <Text style={styles.promoTitle}>Super Combo Tático</Text>
            <Text style={styles.promoSubtitle}>
              2x de cada Power-up para garantir suas vitórias no ranking!
            </Text>
            <TouchableOpacity 
              style={styles.promoBtn}
              activeOpacity={0.85}
              onPress={() => handleBuy(items.find(i => i.id === 'powerup_combo_bundle') || items[0])}
            >
              <Coins size={16} color={theme.colors.brand.magenta} />
              <Text style={styles.promoBtnText}>Comprar por 260 Moedas</Text>
            </TouchableOpacity>
          </LinearGradient>

          {/* Banner Rápido: Comprar Moedas */}
          <TouchableOpacity 
            style={styles.buyCoinsBanner}
            activeOpacity={0.85}
            onPress={() => router.push('/buy-coins')}
          >
            <View style={styles.buyCoinsLeft}>
              <View style={styles.buyCoinsIconBox}>
                <Coins size={24} color="#FFF" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.buyCoinsTitle}>Comprar Pacotes de Moedas</Text>
                <Text style={styles.buyCoinsSubtitle}>Combos com até +4.000 moedas de bônus!</Text>
              </View>
            </View>
            <View style={styles.buyCoinsBtn}>
              <Text style={styles.buyCoinsBtnText}>VER LOJA</Text>
            </View>
          </TouchableOpacity>

          {/* Banner Recompensa Diária em Vídeo (+25 Moedas) */}
          <TouchableOpacity 
            style={[styles.dailyAdBanner, styles.dailyAdBannerDone]}
            activeOpacity={0.85}
            onPress={handleWatchDailyAd}
          >
            <View style={styles.dailyAdContentRow}>
              <View style={[styles.dailyAdIconBox, { backgroundColor: 'rgba(255,255,255,0.1)' }]}>
                <Tv size={22} color="#FFF" />
              </View>
              <View style={{ flex: 1 }}>
                <View style={styles.dailyAdTitleRow}>
                  <Text style={styles.dailyAdTitle}>+25 Moedas Diárias (Vídeo)</Text>
                  <View style={[styles.adStatusBadge, styles.adBadgeDone]}>
                    <Text style={[styles.adStatusText, styles.adTextDone]}>
                      EM HOMOLOGAÇÃO
                    </Text>
                  </View>
                </View>
                <Text style={styles.dailyAdSubtitle}>
                  Recompensas em vídeo temporariamente suspensas para validação criptográfica (SSV) no servidor.
                </Text>
              </View>
            </View>
          </TouchableOpacity>

          {/* Filtros de Categoria */}
          <View style={styles.tabFilterRow}>
            <TouchableOpacity 
              style={[styles.tabFilter, activeCategory === 'all' && styles.tabFilterActive]}
              onPress={() => setActiveCategory('all')}
            >
              <Text style={[styles.tabFilterText, activeCategory === 'all' && styles.tabFilterTextActive]}>
                Todos
              </Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.tabFilter, activeCategory === 'powerups' && styles.tabFilterActive]}
              onPress={() => setActiveCategory('powerups')}
            >
              <Text style={[styles.tabFilterText, activeCategory === 'powerups' && styles.tabFilterTextActive]}>
                Power-ups
              </Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.tabFilter, activeCategory === 'lives' && styles.tabFilterActive]}
              onPress={() => setActiveCategory('lives')}
            >
              <Text style={[styles.tabFilterText, activeCategory === 'lives' && styles.tabFilterTextActive]}>
                Vidas
              </Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.tabFilter, styles.tabCoins]}
              onPress={() => router.push('/buy-coins')}
            >
              <Text style={[styles.tabFilterText, { color: theme.colors.warning.orange }]}>
                Moedas 🪙
              </Text>
            </TouchableOpacity>
          </View>

          {/* Lista de Itens */}
          <View style={styles.itemsList}>
            {filteredItems.map((item) => {
              const Icon = getItemIcon(item.iconName);
              const canAfford = coins >= item.price;

              return (
                <Card key={item.id} style={styles.itemCard}>
                  <View style={[styles.itemIconBox, { backgroundColor: item.color + '15' }]}>
                    <Icon color={item.color} size={32} />
                  </View>

                  <View style={styles.itemInfo}>
                    <View style={styles.itemTitleRow}>
                      <Text style={styles.itemTitle}>{item.title}</Text>
                      {item.badge && (
                        <View style={[styles.itemBadge, { backgroundColor: item.color }]}>
                          <Text style={styles.itemBadgeText}>{item.badge}</Text>
                        </View>
                      )}
                    </View>
                    <Text style={styles.itemDesc}>{item.description}</Text>
                  </View>

                  <TouchableOpacity 
                    style={[
                      styles.buyButton, 
                      !canAfford && styles.buyButtonDisabled
                    ]}
                    activeOpacity={0.8}
                    onPress={() => handleBuy(item)}
                  >
                    <Coins size={14} color="#FFF" />
                    <Text style={styles.buyButtonText}>{item.price}</Text>
                  </TouchableOpacity>
                </Card>
              );
            })}
          </View>
        </ScrollView>
      </SafeAreaView>

      <BottomNav />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.bg.app,
  },
  scrollContent: {
    paddingHorizontal: theme.spacing.containerMargin,
    paddingTop: theme.spacing.sm,
    paddingBottom: 110,
  },
  promoBanner: {
    borderRadius: theme.radius['2xl'],
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    ...theme.shadows.magentaGlow,
  },
  promoBadge: {
    backgroundColor: 'rgba(255,255,255,0.25)',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: theme.radius.full,
    marginBottom: 6,
  },
  promoBadgeText: {
    fontFamily: theme.typography.fontFamily.black,
    fontSize: 10,
    color: '#FFF',
  },
  promoTitle: {
    fontFamily: theme.typography.fontFamily.black,
    fontSize: 22,
    color: '#FFF',
  },
  promoSubtitle: {
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: 12,
    color: 'rgba(255,255,255,0.9)',
    marginTop: 4,
    marginBottom: 14,
  },
  promoBtn: {
    backgroundColor: '#FFF',
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: theme.radius.xl,
    ...theme.shadows.pillowy,
  },
  promoBtnText: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: 13,
    color: theme.colors.brand.magenta,
  },
  tabFilterRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: theme.spacing.md,
  },
  tabFilter: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: theme.radius.full,
    backgroundColor: theme.colors.bg.surface,
    borderWidth: 1,
    borderColor: theme.colors.border.soft,
  },
  tabFilterActive: {
    backgroundColor: theme.colors.brand.magenta,
    borderColor: theme.colors.brand.magenta,
  },
  tabCoins: {
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    borderColor: theme.colors.warning.amber,
  },
  buyCoinsBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.brand.purple,
    borderRadius: theme.radius.xl,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.lg,
    ...theme.shadows.pillowy,
  },
  buyCoinsLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  buyCoinsIconBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buyCoinsTitle: {
    color: '#FFF',
    fontSize: 14,
    fontFamily: theme.typography.fontFamily.bold,
  },
  buyCoinsSubtitle: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 11,
    fontFamily: theme.typography.fontFamily.medium,
  },
  buyCoinsBtn: {
    backgroundColor: '#FFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: theme.radius.full,
  },
  buyCoinsBtnText: {
    color: theme.colors.brand.purple,
    fontFamily: theme.typography.fontFamily.black,
    fontSize: 11,
  },
  tabFilterText: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: 12,
    color: theme.colors.text.muted,
  },
  tabFilterTextActive: {
    color: '#FFF',
  },
  itemsList: {
    gap: 12,
  },
  itemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    ...theme.shadows.pillowy,
  },
  itemTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexWrap: 'wrap',
    marginBottom: 2,
  },
  itemBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  itemBadgeText: {
    fontFamily: theme.typography.fontFamily.black,
    fontSize: 8,
    color: '#FFF',
  },
  itemIconBox: {
    width: 52,
    height: 52,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  itemInfo: {
    flex: 1,
    marginRight: 8,
  },
  itemTitle: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: 14,
    color: theme.colors.text.primary,
  },
  itemDesc: {
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: 11,
    color: theme.colors.text.muted,
    marginTop: 2,
    lineHeight: 15,
  },
  buyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: theme.colors.brand.magenta,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: theme.radius.lg,
    ...theme.shadows.pillowy,
  },
  buyButtonDisabled: {
    backgroundColor: '#CBD5E1',
    elevation: 0,
  },
  buyButtonText: {
    fontFamily: theme.typography.fontFamily.black,
    fontSize: 12,
    color: '#FFF',
  },
  dailyAdBanner: {
    backgroundColor: '#FFF',
    borderWidth: 1.5,
    borderColor: theme.colors.brand.purple + '40',
    borderRadius: theme.radius.xl,
    padding: 14,
    marginBottom: theme.spacing.lg,
    flexDirection: 'column',
    alignItems: 'stretch',
    gap: 10,
    ...theme.shadows.card,
  },
  dailyAdBannerDone: {
    backgroundColor: '#F8FAFC',
    borderColor: theme.colors.border.soft,
  },
  dailyAdContentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    gap: 12,
  },
  dailyAdIconBox: {
    width: 42,
    height: 42,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.brand.magenta,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dailyAdTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 2,
  },
  dailyAdTitle: {
    fontFamily: theme.typography.fontFamily.black,
    fontSize: 14,
    color: theme.colors.text.primary,
  },
  adStatusBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: theme.radius.full,
  },
  adBadgeReady: {
    backgroundColor: 'rgba(34, 197, 94, 0.15)',
  },
  adBadgeDone: {
    backgroundColor: theme.colors.bg.soft,
  },
  adStatusText: {
    fontFamily: theme.typography.fontFamily.black,
    fontSize: 8,
    letterSpacing: 0.5,
  },
  adTextReady: {
    color: theme.colors.success.greenDark,
  },
  adTextDone: {
    color: theme.colors.text.muted,
  },
  dailyAdSubtitle: {
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: 11,
    color: theme.colors.text.muted,
    lineHeight: 15,
  },
  adPlayBtn: {
    backgroundColor: theme.colors.brand.magenta,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: theme.radius.full,
    alignSelf: 'flex-end',
    minWidth: 120,
    ...theme.shadows.magentaGlow,
  },
  adPlayBtnText: {
    color: '#FFF',
    fontFamily: theme.typography.fontFamily.black,
    fontSize: 11,
  },
});
