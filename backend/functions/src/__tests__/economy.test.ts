// Mocks do Firestore e Firebase Admin
const mockGet = jest.fn();
const mockUpdate = jest.fn();
const mockSet = jest.fn();
const mockRunTransaction = jest.fn((cb: any) => cb({
  get: mockGet,
  set: mockSet,
  update: mockUpdate,
}));

jest.mock('firebase-admin', () => {
  const actualAdmin = jest.requireActual('firebase-admin');
  return {
    ...actualAdmin,
    apps: [{}],
    initializeApp: jest.fn(),
    auth: () => ({
      verifyIdToken: jest.fn((token: string) => {
        if (token === 'valid_token_alice') {
          return Promise.resolve({ uid: 'alice_123', email: 'alice@brainpop.app' });
        }
        return Promise.reject(new Error('Invalid token'));
      }),
    }),
    firestore: Object.assign(
      () => ({
        collection: jest.fn((colName: string) => ({
          doc: jest.fn((docId: string) => ({
            id: docId,
            path: `${colName}/${docId}`,
          })),
        })),
        runTransaction: (cb: any) => mockRunTransaction(cb),
      }),
      {
        FieldValue: {
          serverTimestamp: jest.fn(() => 'MOCK_TIMESTAMP'),
          increment: jest.fn((n) => n),
        },
      }
    ),
  };
});

import http from 'http';
import { OFFICIAL_SHOP_CATALOG, app } from '../index';

describe('Backend Autoritativo de Economia (Loja, Power-ups, Anúncios e Missões)', () => {
  const mockUserId = 'alice_123';
  let server: http.Server;
  let baseUrl: string;

  beforeAll((done) => {
    server = http.createServer(app);
    server.listen(0, '127.0.0.1', () => {
      const port = (server.address() as any).port;
      baseUrl = `http://127.0.0.1:${port}`;
      done();
    });
  });

  afterAll((done) => {
    server.close(done);
  });

  const simulateRequest = async (method: string, path: string, headers: any, body: any) => {
    const reqInit: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(headers || {}),
      },
    };
    if (body && (method === 'POST' || method === 'PUT')) {
      reqInit.body = JSON.stringify(body);
    }
    const response = await fetch(`${baseUrl}${path}`, reqInit);
    const data = await response.json();
    return { status: response.status, body: data };
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Catálogo Oficial no Servidor', () => {
    it('Contém os itens oficiais com preços e recompensas autoritativas', () => {
      expect(OFFICIAL_SHOP_CATALOG).toBeDefined();
      expect(OFFICIAL_SHOP_CATALOG.powerup_pack_fifty.price).toBe(100);
      expect(OFFICIAL_SHOP_CATALOG.powerup_pack_time.price).toBe(90);
      expect(OFFICIAL_SHOP_CATALOG.powerup_pack_skip.price).toBe(120);
      expect(OFFICIAL_SHOP_CATALOG.powerup_pack_hint.price).toBe(110);
      expect(OFFICIAL_SHOP_CATALOG.life_refill_full.price).toBe(150);
      expect(OFFICIAL_SHOP_CATALOG.powerup_combo_bundle.price).toBe(260);
    });
  });

  describe('Compra de Itens na Loja (/buy-shop-item)', () => {
    it('Rejeita requisição sem token de autenticação (HTTP 401)', async () => {
      const res = await simulateRequest('POST', '/buy-shop-item', {}, { itemId: 'powerup_pack_fifty' });
      expect(res.status).toBe(401);
      expect(res.body.error).toContain('Token de autorização');
    });

    it('Rejeita item que não existe no catálogo do servidor (HTTP 400)', async () => {
      const res = await simulateRequest(
        'POST',
        '/buy-shop-item',
        { authorization: 'Bearer valid_token_alice' },
        { itemId: 'item_falso_inexistente', price: 1 } // Cliente tenta forçar preço 1
      );
      expect(res.status).toBe(400);
      expect(res.body.error).toContain('Item inexistente');
    });

    it('Rejeita compra se usuário não tiver moedas suficientes (HTTP 400)', async () => {
      mockGet.mockResolvedValue({
        exists: true,
        data: () => ({ coins: 50, gems: 0 }),
      });

      const res = await simulateRequest(
        'POST',
        '/buy-shop-item',
        { authorization: 'Bearer valid_token_alice' },
        { itemId: 'powerup_pack_fifty' } // Preço oficial é 100
      );

      expect(res.status).toBe(400);
      expect(res.body.error).toContain('Saldo insuficiente de moedas');
      expect(mockUpdate).not.toHaveBeenCalled();
    });

    it('Executa compra com sucesso: debita preço do servidor e credita power-up no inventário (HTTP 200)', async () => {
      mockGet.mockResolvedValue({
        exists: true,
        data: () => ({
          coins: 200,
          inventory: { fiftyFifty: 1, extraTime: 0, skip: 0, hint: 0 },
        }),
      });

      const res = await simulateRequest(
        'POST',
        '/buy-shop-item',
        { authorization: 'Bearer valid_token_alice' },
        { itemId: 'powerup_pack_fifty', price: 10, rewardAmount: 999 } // Parâmetros fraudulentos ignorados!
      );

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.newBalance).toBe(100); // 200 - 100
      expect(res.body.inventory.fiftyFifty).toBe(4); // 1 + 3 (recompensa oficial do servidor)
      expect(mockUpdate).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          inventory: expect.objectContaining({ fiftyFifty: 4 }),
        })
      );
    });
  });

  describe('Débito Autoritativo de Power-Ups (/consume-power-up)', () => {
    it('Rejeita requisição sem autenticação (HTTP 401)', async () => {
      const res = await simulateRequest('POST', '/consume-power-up', {}, { powerUpType: 'fiftyFifty' });
      expect(res.status).toBe(401);
    });

    it('Rejeita tipo de power-up inválido (HTTP 400)', async () => {
      const res = await simulateRequest(
        'POST',
        '/consume-power-up',
        { authorization: 'Bearer valid_token_alice' },
        { powerUpType: 'invalido' }
      );
      expect(res.status).toBe(400);
      expect(res.body.error).toContain('Tipo de power-up inválido');
    });

    it('Rejeita consumo se o usuário não possuir o power-up no inventário (HTTP 400)', async () => {
      mockGet.mockResolvedValue({
        exists: true,
        data: () => ({
          inventory: { fiftyFifty: 0, extraTime: 2 },
        }),
      });

      const res = await simulateRequest(
        'POST',
        '/consume-power-up',
        { authorization: 'Bearer valid_token_alice' },
        { powerUpType: 'fiftyFifty' }
      );

      expect(res.status).toBe(400);
      expect(res.body.error).toContain('Saldo insuficiente de fiftyFifty');
      expect(mockUpdate).not.toHaveBeenCalled();
    });

    it('Debita autoritativamente o power-up e decrementa no Firestore (HTTP 200)', async () => {
      mockGet.mockResolvedValue({
        exists: true,
        data: () => ({
          inventory: { fiftyFifty: 3, extraTime: 2, skip: 1, hint: 1 },
        }),
      });

      const res = await simulateRequest(
        'POST',
        '/consume-power-up',
        { authorization: 'Bearer valid_token_alice' },
        { powerUpType: 'fiftyFifty' }
      );

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.remaining).toBe(2);
      expect(res.body.inventory.fiftyFifty).toBe(2);
      expect(mockUpdate).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          inventory: expect.objectContaining({ fiftyFifty: 2 }),
        })
      );
    });
  });

  describe('Recompensa Diária de Anúncio (/claim-daily-ad)', () => {
    it('Rejeita chamada sem comprovação verificável de anúncio (HTTP 403)', async () => {
      const res = await simulateRequest(
        'POST',
        '/claim-daily-ad',
        { authorization: 'Bearer valid_token_alice' },
        {} // Sem SSV
      );

      expect(res.status).toBe(403);
      expect(res.body.code).toBe('ADMOB_SSV_VERIFICATION_REQUIRED');
      expect(mockUpdate).not.toHaveBeenCalled();
    });

    it('Mantém pendente enquanto a validação de chave pública SSV estiver em homologação (HTTP 501)', async () => {
      const res = await simulateRequest(
        'POST',
        '/claim-daily-ad',
        { authorization: 'Bearer valid_token_alice' },
        { ssvToken: 'mock_token', ssvSignature: 'mock_sig' }
      );

      expect(res.status).toBe(501);
      expect(res.body.code).toBe('ADMOB_SSV_KEY_PENDING');
      expect(mockUpdate).not.toHaveBeenCalled();
    });
  });

  describe('Cumprimento de Missões Diárias (/claim-daily-mission)', () => {
    it('Rejeita coleta de missão se cumprimento não puder ser validado no servidor (HTTP 501)', async () => {
      const res = await simulateRequest(
        'POST',
        '/claim-daily-mission',
        { authorization: 'Bearer valid_token_alice' },
        { missionKey: 'win_1_match' }
      );

      expect(res.status).toBe(501);
      expect(res.body.code).toBe('MISSION_SERVER_VALIDATION_PENDING');
      expect(mockUpdate).not.toHaveBeenCalled();
    });
  });
});
