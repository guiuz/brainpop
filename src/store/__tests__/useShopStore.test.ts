import { useShopStore, INITIAL_SHOP_ITEMS } from '../useShopStore';
import { useUserStore } from '../useUserStore';

describe('useShopStore — Inventário, Loja e Anti-Fraude Econômica', () => {
  beforeEach(() => {
    // Restaura estado inicial de usuário e loja antes de cada teste
    useUserStore.getState().logout();
    useShopStore.setState({ isProcessingPurchase: false, items: INITIAL_SHOP_ITEMS });
    jest.restoreAllMocks();
  });

  describe('Validação de Itens do Catálogo e Tipos de Recompensa', () => {
    it('deve comprar recarga completa de vidas (rewardType: life_refill) debitando moedas', () => {
      useUserStore.getState().useLife();
      useUserStore.getState().useLife();
      expect(useUserStore.getState().lives).toBe(3);

      const coinsBefore = useUserStore.getState().coins;
      const res = useShopStore.getState().buyItem('life_refill_full');

      expect(res.success).toBe(true);
      expect(res.message).toContain('Recarga Total de Vidas');
      expect(useUserStore.getState().coins).toBe(coinsBefore - 150);
      expect(useUserStore.getState().lives).toBe(5);
    });

    it('deve comprar pacote 50/50 (rewardType: powerup_fifty) e creditar no inventário', () => {
      const coinsBefore = useUserStore.getState().coins;
      const fiftyBefore = useUserStore.getState().inventory.fiftyFifty;

      const res = useShopStore.getState().buyItem('powerup_pack_fifty');

      expect(res.success).toBe(true);
      expect(useUserStore.getState().coins).toBe(coinsBefore - 100);
      expect(useUserStore.getState().inventory.fiftyFifty).toBe(fiftyBefore + 3);
    });

    it('deve comprar tempo extra (rewardType: powerup_time) e creditar no inventário', () => {
      const coinsBefore = useUserStore.getState().coins;
      const timeBefore = useUserStore.getState().inventory.extraTime;

      const res = useShopStore.getState().buyItem('powerup_pack_time');

      expect(res.success).toBe(true);
      expect(useUserStore.getState().coins).toBe(coinsBefore - 90);
      expect(useUserStore.getState().inventory.extraTime).toBe(timeBefore + 3);
    });

    it('deve comprar pular pergunta (rewardType: powerup_skip) e creditar no inventário', () => {
      const coinsBefore = useUserStore.getState().coins;
      const skipBefore = useUserStore.getState().inventory.skip;

      const res = useShopStore.getState().buyItem('powerup_pack_skip');

      expect(res.success).toBe(true);
      expect(useUserStore.getState().coins).toBe(coinsBefore - 120);
      expect(useUserStore.getState().inventory.skip).toBe(skipBefore + 2);
    });

    it('deve comprar dica (rewardType: powerup_hint) e creditar no inventário', () => {
      const coinsBefore = useUserStore.getState().coins;
      const hintBefore = useUserStore.getState().inventory.hint;

      const res = useShopStore.getState().buyItem('powerup_pack_hint');

      expect(res.success).toBe(true);
      expect(useUserStore.getState().coins).toBe(coinsBefore - 110);
      expect(useUserStore.getState().inventory.hint).toBe(hintBefore + 2);
    });

    it('deve comprar combo bundle e creditar todos os 4 power-ups e 1 vida adicional', () => {
      useUserStore.getState().useLife();
      const livesBefore = useUserStore.getState().lives;
      const coinsBefore = useUserStore.getState().coins;
      const invBefore = { ...useUserStore.getState().inventory };

      const res = useShopStore.getState().buyItem('powerup_combo_bundle');

      expect(res.success).toBe(true);
      expect(useUserStore.getState().coins).toBe(coinsBefore - 260);
      expect(useUserStore.getState().inventory.fiftyFifty).toBe(invBefore.fiftyFifty + 2);
      expect(useUserStore.getState().inventory.extraTime).toBe(invBefore.extraTime + 2);
      expect(useUserStore.getState().inventory.skip).toBe(invBefore.skip + 2);
      expect(useUserStore.getState().inventory.hint).toBe(invBefore.hint + 2);
      expect(useUserStore.getState().lives).toBe(livesBefore + 1);
    });
  });

  describe('Saldo Exato, Saldo Insuficiente e Nenhuma Dedução Parcial', () => {
    it('deve permitir compra com saldo exato e deixar saldo zerado', () => {
      // Ajusta moedas exatamente para o preço do item (100)
      const currentCoins = useUserStore.getState().coins;
      useUserStore.getState().spendCoins(currentCoins);
      useUserStore.getState().addCoins(100);
      expect(useUserStore.getState().coins).toBe(100);

      const res = useShopStore.getState().buyItem('powerup_pack_fifty');
      expect(res.success).toBe(true);
      expect(useUserStore.getState().coins).toBe(0);
    });

    it('deve rejeitar compra de moedas quando saldo for insuficiente e não deduzir nada', () => {
      useUserStore.getState().spendCoins(useUserStore.getState().coins);
      useUserStore.getState().addCoins(50); // Item custa 100
      const invBefore = { ...useUserStore.getState().inventory };

      const res = useShopStore.getState().buyItem('powerup_pack_fifty');

      expect(res.success).toBe(false);
      expect(res.message).toContain('Moedas insuficientes');
      expect(useUserStore.getState().coins).toBe(50); // Nenhuma dedução
      expect(useUserStore.getState().inventory).toEqual(invBefore);
    });

    it('deve suportar itens pagos em gemas com saldo suficiente', () => {
      // Injeta temporariamente item em gemas no catálogo da loja
      const originalItems = useShopStore.getState().items;
      useShopStore.setState({
        items: [
          ...originalItems,
          {
            id: 'gem_life_refill',
            title: 'Vidas com Gemas',
            description: 'Recarregue usando gemas',
            category: 'lives',
            price: 10,
            currency: 'gems',
            rewardType: 'life_refill',
            rewardAmount: 5,
            iconName: 'Heart',
            color: '#EF4444',
          },
          {
            id: 'gem_fifty',
            title: '50/50 com Gemas',
            description: 'Power-up com gemas',
            category: 'powerups',
            price: 5,
            currency: 'gems',
            rewardType: 'powerup_fifty',
            rewardAmount: 2,
            iconName: 'Sparkles',
            color: '#8B5CF6',
          }
        ]
      });

      useUserStore.getState().useLife();
      const gemsBefore = useUserStore.getState().gems; // 15
      const res = useShopStore.getState().buyItem('gem_life_refill');

      expect(res.success).toBe(true);
      expect(useUserStore.getState().gems).toBe(gemsBefore - 10);
      expect(useUserStore.getState().lives).toBe(5);

      // Testa segundo item em gemas (rewardType: powerup_fifty)
      const fiftyBefore = useUserStore.getState().inventory.fiftyFifty;
      const res2 = useShopStore.getState().buyItem('gem_fifty');
      expect(res2.success).toBe(true);
      expect(useUserStore.getState().inventory.fiftyFifty).toBe(fiftyBefore + 2);
    });

    it('deve rejeitar compra com gemas insuficientes sem dedução parcial', () => {
      const originalItems = useShopStore.getState().items;
      useShopStore.setState({
        items: [
          ...originalItems,
          {
            id: 'gem_expensive',
            title: 'Item Caro',
            description: 'Muitas gemas',
            category: 'lives',
            price: 9999,
            currency: 'gems',
            rewardType: 'life_refill',
            rewardAmount: 5,
            iconName: 'Heart',
            color: '#EF4444',
          }
        ]
      });

      const gemsBefore = useUserStore.getState().gems;
      const res = useShopStore.getState().buyItem('gem_expensive');

      expect(res.success).toBe(false);
      expect(res.message).toContain('Gemas insuficientes');
      expect(useUserStore.getState().gems).toBe(gemsBefore);
    });
  });

  describe('Segurança, Concorrência e Tratamento de Erros', () => {
    it('deve bloquear compra concorrente quando transação anterior estiver em processamento', () => {
      useShopStore.setState({ isProcessingPurchase: true });

      const res = useShopStore.getState().buyItem('life_refill_full');

      expect(res.success).toBe(false);
      expect(res.message).toContain('Processando transação anterior');
    });

    it('deve rejeitar item inexistente no catálogo', () => {
      const res = useShopStore.getState().buyItem('item_inexistente_666');

      expect(res.success).toBe(false);
      expect(res.message).toContain('Item não encontrado');
    });

    it('deve rejeitar compra de item com preço inválido (zero ou negativo)', () => {
      useShopStore.setState({
        items: [
          {
            id: 'item_gratis_bugado',
            title: 'Bug',
            description: 'Preço zero',
            category: 'lives',
            price: 0,
            currency: 'coins',
            rewardType: 'life_refill',
            rewardAmount: 5,
            iconName: 'Heart',
            color: '#EF4444',
          },
          {
            id: 'item_negativo',
            title: 'Bug Negativo',
            description: 'Preço negativo',
            category: 'lives',
            price: -100,
            currency: 'coins',
            rewardType: 'life_refill',
            rewardAmount: 5,
            iconName: 'Heart',
            color: '#EF4444',
          }
        ]
      });

      const resZero = useShopStore.getState().buyItem('item_gratis_bugado');
      expect(resZero.success).toBe(false);
      expect(resZero.message).toContain('Preço de item inválido');

      const resNeg = useShopStore.getState().buyItem('item_negativo');
      expect(resNeg.success).toBe(false);
      expect(resNeg.message).toContain('Preço de item inválido');
    });

    it('deve rejeitar compra com método de moeda não suportada', () => {
      useShopStore.setState({
        items: [
          {
            id: 'item_crypto',
            title: 'Crypto Item',
            description: 'Moeda desconhecida',
            category: 'lives',
            price: 10,
            // @ts-ignore
            currency: 'bitcoin',
            rewardType: 'life_refill',
            rewardAmount: 5,
            iconName: 'Heart',
            color: '#EF4444',
          }
        ]
      });

      const res = useShopStore.getState().buyItem('item_crypto');
      expect(res.success).toBe(false);
      expect(res.message).toContain('Método de pagamento não suportado');
    });

    it('deve tratar falha no spendCoins sem liberar recompensa', () => {
      const originalSpendCoins = useUserStore.getState().spendCoins;
      useUserStore.setState({ spendCoins: () => false });
      const invBefore = { ...useUserStore.getState().inventory };

      const res = useShopStore.getState().buyItem('powerup_pack_fifty');
      expect(res.success).toBe(false);
      expect(res.message).toContain('Falha ao processar transação de moedas');
      expect(useUserStore.getState().inventory).toEqual(invBefore);
      useUserStore.setState({ spendCoins: originalSpendCoins });
    });

    it('deve tratar falha no spendGems sem liberar recompensa', () => {
      const originalSpendGems = useUserStore.getState().spendGems;
      useUserStore.setState({ spendGems: () => false });

      useShopStore.setState({
        items: [
          {
            id: 'gem_item',
            title: 'Gem Item',
            description: 'Gemas',
            category: 'lives',
            price: 5,
            currency: 'gems',
            rewardType: 'life_refill',
            rewardAmount: 5,
            iconName: 'Heart',
            color: '#EF4444',
          }
        ]
      });

      const res = useShopStore.getState().buyItem('gem_item');
      expect(res.success).toBe(false);
      expect(res.message).toContain('Falha ao processar transação de gemas');
      useUserStore.setState({ spendGems: originalSpendGems });
    });
  });
});
