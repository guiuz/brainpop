/**
 * @jest-environment node
 */

import * as fs from 'fs';
import * as path from 'path';
import {
  initializeTestEnvironment,
  assertFails,
  assertSucceeds,
  RulesTestEnvironment,
} from '@firebase/rules-unit-testing';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';

// Desativa mocks globais do jest.setup.js para permitir comunicação real com o emulador
jest.unmock('firebase/firestore');
jest.unmock('firebase/app');

describe('Firestore Security Rules — Testes Reais com Firebase Emulator Suite', () => {
  let testEnv: RulesTestEnvironment;
  const PROJECT_ID = 'demo-brainpop';

  beforeAll(async () => {
    const rulesPath = path.resolve(__dirname, '../../../firestore.rules');
    const rules = fs.readFileSync(rulesPath, 'utf8');

    testEnv = await initializeTestEnvironment({
      projectId: PROJECT_ID,
      firestore: {
        rules,
        host: '127.0.0.1',
        port: 8080,
      },
    });
  });

  afterAll(async () => {
    if (testEnv) {
      await testEnv.cleanup();
    }
  });

  beforeEach(async () => {
    if (testEnv) {
      await testEnv.clearFirestore();
    }
  });

  describe('Coleção /users/{userId} — Criação de Perfil', () => {
    it('deve permitir que o usuário crie seu próprio perfil com economia inicial válida', async () => {
      const aliceContext = testEnv.authenticatedContext('alice');
      const aliceDb = aliceContext.firestore();

      const userDocRef = doc(aliceDb, 'users/alice');
      await assertSucceeds(
        setDoc(userDocRef, {
          name: 'Alice',
          coins: 500,
          gems: 15,
          lives: 5,
          xp: 0,
          totalXp: 0,
          level: 1,
          duelTrophies: 0,
        })
      );
    });

    it('deve rejeitar criação de perfil com economia fraudada (moedas excessivas)', async () => {
      const bobContext = testEnv.authenticatedContext('bob');
      const bobDb = bobContext.firestore();

      const userDocRef = doc(bobDb, 'users/bob');
      await assertFails(
        setDoc(userDocRef, {
          name: 'Bob',
          coins: 999999, // Fraude de saldo inicial
          gems: 15,
          lives: 5,
          xp: 0,
          totalXp: 0,
          level: 1,
        })
      );
    });

    it('não deve permitir que um usuário crie o perfil de outro usuário', async () => {
      const aliceContext = testEnv.authenticatedContext('alice');
      const aliceDb = aliceContext.firestore();

      const impostorDocRef = doc(aliceDb, 'users/bob');
      await assertFails(
        setDoc(impostorDocRef, {
          name: 'Bob Falso',
          coins: 500,
        })
      );
    });
  });

  describe('Coleção /users/{userId} — Atualização e Whitelist Estrita', () => {
    beforeEach(async () => {
      // Cria o documento base da Alice via contexto administrativo com bypass de regras
      await testEnv.withSecurityRulesDisabled(async (context) => {
        const adminDb = context.firestore();
        await setDoc(doc(adminDb, 'users/alice'), {
          name: 'Alice Original',
          avatarUrl: 'https://images.unsplash.com/photo-alice',
          title: 'Novato',
          coins: 500,
          gems: 15,
          lives: 5,
          xp: 100,
          totalXp: 100,
          level: 1,
          duelTrophies: 10,
          inventory: { fiftyFifty: 3, extraTime: 2 },
          stats: { totalWins: 5, totalMatches: 10 },
          friends: ['charlie'],
          settings: { soundEnabled: true, vibrationEnabled: true, notificationsEnabled: true },
          fcmToken: 'token_original',
          hasCompletedOnboarding: false,
          hasConfiguredInitialPermissions: false,
        });
      });
    });

    it('deve permitir que a titular atualize campos da whitelist com tipos e formatos válidos', async () => {
      const aliceDb = testEnv.authenticatedContext('alice').firestore();
      const aliceRef = doc(aliceDb, 'users/alice');

      // Atualiza avatarUrl válido
      await assertSucceeds(
        updateDoc(aliceRef, {
          avatarUrl: 'https://images.unsplash.com/novo-avatar',
        })
      );

      // Atualiza settings válidas
      await assertSucceeds(
        updateDoc(aliceRef, {
          settings: { soundEnabled: false, vibrationEnabled: false, notificationsEnabled: true },
        })
      );

      // Atualiza flags de onboarding e permissões
      await assertSucceeds(
        updateDoc(aliceRef, {
          hasCompletedOnboarding: true,
          hasConfiguredInitialPermissions: true,
        })
      );

      // Atualiza fcmToken
      await assertSucceeds(
        updateDoc(aliceRef, {
          fcmToken: 'token_novo_123',
        })
      );
    });

    it('deve REJEITAR avatarUrl que não utilize protocolo HTTPS/HTTP ou que seja inválido', async () => {
      const aliceDb = testEnv.authenticatedContext('alice').firestore();
      const aliceRef = doc(aliceDb, 'users/alice');

      await assertFails(
        updateDoc(aliceRef, {
          avatarUrl: 'javascript:alert(1)',
        })
      );

      await assertFails(
        updateDoc(aliceRef, {
          avatarUrl: '', // tamanho 0 proibido
        })
      );
    });

    it('deve REJEITAR settings com tipo incorreto (ex: booleano como string)', async () => {
      const aliceDb = testEnv.authenticatedContext('alice').firestore();
      const aliceRef = doc(aliceDb, 'users/alice');

      await assertFails(
        updateDoc(aliceRef, {
          settings: { soundEnabled: 'sim' as any },
        })
      );
    });

    it('deve BLOQUEAR alteração direta pelo cliente em moedas, gemas, vidas, xp, level e stats', async () => {
      const aliceDb = testEnv.authenticatedContext('alice').firestore();
      const aliceRef = doc(aliceDb, 'users/alice');

      await assertFails(updateDoc(aliceRef, { coins: 999999 }));
      await assertFails(updateDoc(aliceRef, { gems: 100 }));
      await assertFails(updateDoc(aliceRef, { lives: 10 }));
      await assertFails(updateDoc(aliceRef, { xp: 5000 }));
      await assertFails(updateDoc(aliceRef, { totalXp: 5000 }));
      await assertFails(updateDoc(aliceRef, { level: 10 }));
      await assertFails(updateDoc(aliceRef, { duelTrophies: 100 }));
      await assertFails(updateDoc(aliceRef, { inventory: { fiftyFifty: 99 } }));
      await assertFails(updateDoc(aliceRef, { stats: { totalWins: 99 } }));
    });

    it('deve BLOQUEAR campos removidos da whitelist (title, lastActiveDate, updatedAt, name)', async () => {
      const aliceDb = testEnv.authenticatedContext('alice').firestore();
      const aliceRef = doc(aliceDb, 'users/alice');

      await assertFails(updateDoc(aliceRef, { title: 'Lendário' }));
      await assertFails(updateDoc(aliceRef, { lastActiveDate: '2026-09-21' }));
      await assertFails(updateDoc(aliceRef, { updatedAt: '2026-09-21T00:00:00Z' }));
      // Alteração de name deve ser via Cloud Function
      await assertFails(updateDoc(aliceRef, { name: 'Alice Hackeada' }));
    });

    it('deve BLOQUEAR que outro usuário (Bob) altere o perfil ou o array de amigos de Alice', async () => {
      const bobDb = testEnv.authenticatedContext('bob').firestore();
      const aliceRef = doc(bobDb, 'users/alice');

      // Tentativa de alterar amigos no documento alheio (brecha corrigida)
      await assertFails(
        updateDoc(aliceRef, {
          friends: ['bob'],
        })
      );

      // Tentativa de alterar configurações alheias
      await assertFails(
        updateDoc(aliceRef, {
          hasCompletedOnboarding: true,
        })
      );
    });
  });

  describe('Coleção /matches/{matchId} — Histórico Pessoal', () => {
    it('deve permitir ao próprio jogador criar o registro de sua partida com score seguro', async () => {
      const aliceDb = testEnv.authenticatedContext('alice').firestore();
      const matchRef = doc(aliceDb, 'matches/match_1');

      await assertSucceeds(
        setDoc(matchRef, {
          userId: 'alice',
          score: 1500,
          category: 'Ciência',
        })
      );
    });

    it('deve rejeitar criação de partida com score superior ao limite seguro (5000) ou negativo', async () => {
      const aliceDb = testEnv.authenticatedContext('alice').firestore();
      const matchRef = doc(aliceDb, 'matches/match_2');

      await assertFails(
        setDoc(matchRef, {
          userId: 'alice',
          score: 99999, // Acima do teto de 5000
        })
      );

      await assertFails(
        setDoc(matchRef, {
          userId: 'alice',
          score: -50, // Negativo
        })
      );
    });

    it('deve permitir leitura de partida apenas pelo titular e bloquear para terceiros', async () => {
      await testEnv.withSecurityRulesDisabled(async (context) => {
        const adminDb = context.firestore();
        await setDoc(doc(adminDb, 'matches/alice_match'), {
          userId: 'alice',
          score: 1000,
        });
      });

      const aliceDb = testEnv.authenticatedContext('alice').firestore();
      const bobDb = testEnv.authenticatedContext('bob').firestore();

      await assertSucceeds(getDoc(doc(aliceDb, 'matches/alice_match')));
      await assertFails(getDoc(doc(bobDb, 'matches/alice_match')));
    });

    it('deve proibir alteração ou exclusão de partidas por qualquer cliente', async () => {
      await testEnv.withSecurityRulesDisabled(async (context) => {
        const adminDb = context.firestore();
        await setDoc(doc(adminDb, 'matches/alice_match'), {
          userId: 'alice',
          score: 1000,
        });
      });

      const aliceDb = testEnv.authenticatedContext('alice').firestore();
      await assertFails(updateDoc(doc(aliceDb, 'matches/alice_match'), { score: 2000 }));
    });
  });

  describe('Coleção /duels/{duelId} — Duelos 1v1', () => {
    beforeEach(async () => {
      await testEnv.withSecurityRulesDisabled(async (context) => {
        const adminDb = context.firestore();
        await setDoc(doc(adminDb, 'duels/duel_123'), {
          player1Id: 'alice',
          player2Id: 'bob',
          status: 'playing',
          bet: 100,
        });
      });
    });

    it('deve permitir leitura do duelo estritamente para os participantes (Alice e Bob)', async () => {
      const aliceDb = testEnv.authenticatedContext('alice').firestore();
      const bobDb = testEnv.authenticatedContext('bob').firestore();
      const charlieDb = testEnv.authenticatedContext('charlie').firestore();

      await assertSucceeds(getDoc(doc(aliceDb, 'duels/duel_123')));
      await assertSucceeds(getDoc(doc(bobDb, 'duels/duel_123')));
      // Charlie é espectador/terceiro não autorizado
      await assertFails(getDoc(doc(charlieDb, 'duels/duel_123')));
    });

    it('deve permitir criação de duelo com status waiting sem vencedor pré-definido', async () => {
      const aliceDb = testEnv.authenticatedContext('alice').firestore();
      const newDuelRef = doc(aliceDb, 'duels/duel_new');

      await assertSucceeds(
        setDoc(newDuelRef, {
          player1Id: 'alice',
          player2Id: 'bob',
          status: 'waiting',
          bet: 50,
        })
      );
    });

    it('deve REJEITAR criação de duelo onde o cliente já declara o vencedor', async () => {
      const aliceDb = testEnv.authenticatedContext('alice').firestore();
      const cheatedDuelRef = doc(aliceDb, 'duels/duel_cheated');

      await assertFails(
        setDoc(cheatedDuelRef, {
          player1Id: 'alice',
          player2Id: 'bob',
          status: 'waiting',
          winner: 'alice', // Proibido no cliente
        })
      );
    });

    it('deve BLOQUEAR qualquer cliente de alterar resultados ou dados do duelo (backend authoritative)', async () => {
      const aliceDb = testEnv.authenticatedContext('alice').firestore();
      const duelRef = doc(aliceDb, 'duels/duel_123');

      // Cliente tentando se declarar vencedor
      await assertFails(
        updateDoc(duelRef, {
          winner: 'alice',
          status: 'completed',
        })
      );
    });
  });

  describe('Bloqueio Geral de Documentos Não Mapeados', () => {
    it('deve rejeitar leitura e escrita em qualquer coleção não mapeada', async () => {
      const aliceDb = testEnv.authenticatedContext('alice').firestore();
      const unmappedRef = doc(aliceDb, 'configuracoes_secretas/admin');

      await assertFails(setDoc(unmappedRef, { segredo: 123 }));
      await assertFails(getDoc(unmappedRef));
    });
  });
});
