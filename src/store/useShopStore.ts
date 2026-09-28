import { create } from 'zustand';
import { useUserStore } from './useUserStore';

export interface ShopItem {
  id: string;
  title: string;
  description: string;
  category: 'powerups' | 'lives' | 'coins' | 'cosmetics';
  price: number;
  currency: 'coins' | 'gems' | 'real_brl';
  rewardType: 'powerup_fifty' | 'powerup_time' | 'powerup_skip' | 'powerup_hint' | 'life_refill' | 'coins_pack';
  rewardAmount: number;
  badge?: string;
  iconName: string;
  color: string;
}

export interface ShopState {
  items: ShopItem[];
  isProcessingPurchase: boolean;
  buyItem: (itemId: string) => { success: boolean; message: string };
}

export const INITIAL_SHOP_ITEMS: ShopItem[] = [
  {
    id: 'life_refill_full',
    title: 'Recarga Total de Vidas',
    description: 'Recupere todas as suas 5 vidas instantaneamente',
    category: 'lives',
    price: 150,
    currency: 'coins',
    rewardType: 'life_refill',
    rewardAmount: 5,
    iconName: 'Heart',
    color: '#EF4444',
    badge: 'POPULAR',
  },
  {
    id: 'powerup_pack_fifty',
    title: 'Pacote 50/50 (x3)',
    description: 'Elimine metade das opções erradas em 3 perguntas',
    category: 'powerups',
    price: 100,
    currency: 'coins',
    rewardType: 'powerup_fifty',
    rewardAmount: 3,
    iconName: 'Sparkles',
    color: '#8B5CF6',
  },
  {
    id: 'powerup_pack_time',
    title: 'Tempo Extra +15s (x3)',
    description: 'Ganhe 15 segundos adicionais para pensar com calma',
    category: 'powerups',
    price: 90,
    currency: 'coins',
    rewardType: 'powerup_time',
    rewardAmount: 3,
    iconName: 'Clock',
    color: '#14B8A6',
  },
  {
    id: 'powerup_pack_skip',
    title: 'Pular Pergunta (x2)',
    description: 'Pule perguntas difíceis sem penalidade',
    category: 'powerups',
    price: 120,
    currency: 'coins',
    rewardType: 'powerup_skip',
    rewardAmount: 2,
    iconName: 'FastForward',
    color: '#F97316',
  },
  {
    id: 'powerup_pack_hint',
    title: 'Pacote Dica Astral (x2)',
    description: 'Receba dicas contextuais eliminando alternativas',
    category: 'powerups',
    price: 110,
    currency: 'coins',
    rewardType: 'powerup_hint',
    rewardAmount: 2,
    iconName: 'HelpCircle',
    color: '#3B82F6',
  },
  {
    id: 'powerup_combo_bundle',
    title: 'Super Combo Tático',
    description: '2x de cada power-up + 1 vida extra',
    category: 'powerups',
    price: 260,
    currency: 'coins',
    rewardType: 'powerup_fifty',
    rewardAmount: 2,
    iconName: 'Zap',
    color: '#EC4899',
    badge: 'MELHOR VALOR',
  },
];

export const useShopStore = create<ShopState>((set, get) => ({
  isProcessingPurchase: false,
  items: INITIAL_SHOP_ITEMS,

  buyItem: (itemId: string) => {
    if (get().isProcessingPurchase) {
      return { success: false, message: 'Processando transação anterior, aguarde...' };
    }

    const item = get().items.find((i) => i.id === itemId);
    if (!item) return { success: false, message: 'Item não encontrado.' };

    if (item.price <= 0 || !Number.isFinite(item.price)) {
      return { success: false, message: 'Preço de item inválido.' };
    }

    set({ isProcessingPurchase: true });

    try {
      const userState = useUserStore.getState();

      if (item.currency === 'coins') {
        if (userState.coins < item.price) {
          return { success: false, message: 'Moedas insuficientes! Jogue mais partidas para ganhar.' };
        }

        const spent = userState.spendCoins(item.price);
        if (!spent) return { success: false, message: 'Falha ao processar transação de moedas.' };

        // Entregar recompensa
        if (item.id === 'powerup_combo_bundle') {
          userState.addPowerUpItem('fiftyFifty', 2);
          userState.addPowerUpItem('extraTime', 2);
          userState.addPowerUpItem('skip', 2);
          userState.addPowerUpItem('hint', 2);
          userState.addLife(1);
        } else if (item.rewardType === 'life_refill') {
          userState.refillLives();
        } else if (item.rewardType === 'powerup_fifty') {
          userState.addPowerUpItem('fiftyFifty', item.rewardAmount);
        } else if (item.rewardType === 'powerup_time') {
          userState.addPowerUpItem('extraTime', item.rewardAmount);
        } else if (item.rewardType === 'powerup_skip') {
          userState.addPowerUpItem('skip', item.rewardAmount);
        } else if (item.rewardType === 'powerup_hint') {
          userState.addPowerUpItem('hint', item.rewardAmount);
        }

        return { success: true, message: `Você adquiriu "${item.title}" com sucesso!` };
      }

      if (item.currency === 'gems') {
        if (userState.gems < item.price) {
          return { success: false, message: 'Gemas insuficientes!' };
        }

        const spent = userState.spendGems(item.price);
        if (!spent) return { success: false, message: 'Falha ao processar transação de gemas.' };

        if (item.rewardType === 'life_refill') {
          userState.refillLives();
        } else if (item.rewardType === 'powerup_fifty') {
          userState.addPowerUpItem('fiftyFifty', item.rewardAmount);
        }

        return { success: true, message: `Você adquiriu "${item.title}" com sucesso!` };
      }

      return { success: false, message: 'Método de pagamento não suportado nesta versão.' };
    } finally {
      set({ isProcessingPurchase: false });
    }
  },
}));
