import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import express, { Request, Response, NextFunction } from "express";
import cors from "cors";

admin.initializeApp();

const app = express();
app.use(cors({ origin: true }));
app.use(express.json());

/**
 * Middleware de Autenticação Segura via Firebase ID Token
 * Garante que apenas usuários autenticados chamem endpoints protegidos
 * e deriva o UID do token decodificado de forma confiável.
 */
interface AuthenticatedRequest extends Request {
  user?: admin.auth.DecodedIdToken;
}

const authenticateFirebaseUser = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Token de autorização Bearer não fornecido ou inválido." });
  }

  const idToken = authHeader.split("Bearer ")[1];
  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    req.user = decodedToken;
    return next();
  } catch {
    return res.status(401).json({ error: "Token de autenticação expirado ou inválido." });
  }
};

/**
 * Ranking Global em Tempo Real
 * Ordenado pelo campo canônico totalXp para consistência em todo o ecossistema.
 */
app.get("/ranking", async (_req: Request, res: Response) => {
  try {
    const snapshot = await admin.firestore()
      .collection("users")
      .orderBy("totalXp", "desc")
      .limit(10)
      .get();
    
    const ranking = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    return res.status(200).json(ranking);
  } catch {
    return res.status(500).json({ error: "Erro ao carregar ranking global ordenado por totalXp." });
  }
});

/**
 * Verificação de Partidas e Anti-Fraude Econômica
 * Conforme determinação de auditoria técnica:
 * Enquanto não existir um motor autoritativo de perguntas e respostas no servidor,
 * este endpoint retorna HTTP 501 incondicionalmente após a autenticação,
 * sem alterar XP, moedas, streak, bestStreak ou processed_matches.
 */
app.post("/verify-match", authenticateFirebaseUser, async (req: AuthenticatedRequest, res: Response) => {
  const uid = req.user?.uid;
  if (!uid) {
    return res.status(401).json({ error: "Usuário não autenticado." });
  }

  return res.status(501).json({
    error: "Motor autoritativo de validação de perguntas e respostas ainda não implementado no servidor. Concessão de pontuação client-side desativada para prevenção de fraude.",
    code: "AUTHORITATIVE_QUESTION_ENGINE_NOT_IMPLEMENTED",
  });
});

/**
 * Alteração Autorizada de Nome com Custo e Moderação
 * A alteração de nome possui custo econômico (10.000 moedas após a 1ª vez)
 * e regras de moderação, sendo executada via Cloud Function transacional.
 */
app.post("/change-username", authenticateFirebaseUser, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const uid = req.user?.uid;
    if (!uid) {
      return res.status(401).json({ error: "Usuário não autenticado." });
    }

    const { newName } = req.body;
    if (typeof newName !== "string") {
      return res.status(400).json({ error: "Nome inválido." });
    }

    const cleanName = newName.trim();
    if (cleanName.length < 3 || cleanName.length > 20) {
      return res.status(400).json({ error: "O nome deve ter entre 3 e 20 caracteres." });
    }

    // Validação de formato alfanumérico e espaços
    const validFormatRegex = /^[a-zA-Z0-9_\sáàâãéèêíïóôõöúçñÁÀÂÃÉÈÊÍÏÓÔÕÖÚÇÑ]+$/;
    if (!validFormatRegex.test(cleanName)) {
      return res.status(400).json({ error: "O nome contém caracteres especiais inválidos." });
    }

    // Moderação de palavras ofensivas básicas
    const forbiddenWords = ["admin", "root", "system", "moderator", "suporte"];
    const isForbidden = forbiddenWords.some((word) => cleanName.toLowerCase().includes(word));
    if (isForbidden) {
      return res.status(400).json({ error: "Este nome de jogador é restrito ou inválido." });
    }

    const userRef = admin.firestore().collection("users").doc(uid);

    const result = await admin.firestore().runTransaction(async (transaction) => {
      const userDoc = await transaction.get(userRef);
      if (!userDoc.exists) {
        throw new Error("Perfil de usuário não encontrado.");
      }

      const userData = userDoc.data() || {};
      const nameChangesCount = typeof userData.nameChangesCount === "number" ? userData.nameChangesCount : 0;
      const isFirstTime = nameChangesCount === 0;
      const cost = isFirstTime ? 0 : 10000;
      const currentCoins = typeof userData.coins === "number" ? userData.coins : 0;

      if (!isFirstTime && currentCoins < cost) {
        throw new Error(`Saldo insuficiente! Alterar o nome custa ${cost} moedas (você possui ${currentCoins}).`);
      }

      transaction.update(userRef, {
        name: cleanName,
        coins: admin.firestore.FieldValue.increment(-cost),
        nameChangesCount: admin.firestore.FieldValue.increment(1),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      return { cleanName, cost, nameChangesCount: nameChangesCount + 1 };
    });

    return res.status(200).json({
      success: true,
      message: result.cost === 0 
        ? "Nome inicial registrado com sucesso!" 
        : `Nome alterado com sucesso! (${result.cost} moedas debitadas)`,
      name: result.cleanName,
      cost: result.cost,
    });
  } catch (error: any) {
    return res.status(400).json({ error: error?.message || "Erro ao processar alteração de nome." });
  }
});

/**
 * Catálogo Oficial Autoritativo da Loja no Servidor
 * Preço e itens são estritamente determinados pelo servidor, nunca pelo cliente.
 */
export const OFFICIAL_SHOP_CATALOG: Record<
  string,
  {
    title: string;
    price: number;
    currency: "coins" | "gems";
    rewardType: "life_refill" | "powerup_fifty" | "powerup_time" | "powerup_skip" | "powerup_hint" | "powerup_combo_bundle";
    rewardAmount: number;
  }
> = {
  life_refill_full: {
    title: "Recarga Total de Vidas",
    price: 150,
    currency: "coins",
    rewardType: "life_refill",
    rewardAmount: 5,
  },
  powerup_pack_fifty: {
    title: "Pacote 50/50 (x3)",
    price: 100,
    currency: "coins",
    rewardType: "powerup_fifty",
    rewardAmount: 3,
  },
  powerup_pack_time: {
    title: "Tempo Extra +15s (x3)",
    price: 90,
    currency: "coins",
    rewardType: "powerup_time",
    rewardAmount: 3,
  },
  powerup_pack_skip: {
    title: "Pular Pergunta (x2)",
    price: 120,
    currency: "coins",
    rewardType: "powerup_skip",
    rewardAmount: 2,
  },
  powerup_pack_hint: {
    title: "Pacote Dica Astral (x2)",
    price: 110,
    currency: "coins",
    rewardType: "powerup_hint",
    rewardAmount: 2,
  },
  powerup_combo_bundle: {
    title: "Super Combo Tático",
    price: 260,
    currency: "coins",
    rewardType: "powerup_combo_bundle",
    rewardAmount: 2,
  },
};

/**
 * Compra de Itens da Loja com Validação de Catálogo e Débito no Servidor
 */
app.post("/buy-shop-item", authenticateFirebaseUser, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const uid = req.user?.uid;
    if (!uid) {
      return res.status(401).json({ error: "Usuário não autenticado." });
    }

    const { itemId } = req.body || {};
    if (typeof itemId !== "string" || !OFFICIAL_SHOP_CATALOG[itemId]) {
      return res.status(400).json({ error: "Item inexistente ou não encontrado no catálogo do servidor." });
    }

    const catalogItem = OFFICIAL_SHOP_CATALOG[itemId];
    const userRef = admin.firestore().collection("users").doc(uid);

    const result = await admin.firestore().runTransaction(async (transaction) => {
      const userDoc = await transaction.get(userRef);
      if (!userDoc.exists) {
        throw new Error("Perfil de usuário não encontrado.");
      }

      const userData = userDoc.data() || {};
      const currentCoins = typeof userData.coins === "number" ? userData.coins : 0;
      const currentGems = typeof userData.gems === "number" ? userData.gems : 0;

      if (catalogItem.currency === "coins") {
        if (currentCoins < catalogItem.price) {
          throw new Error(`Saldo insuficiente de moedas. Requer ${catalogItem.price}, você possui ${currentCoins}.`);
        }
      } else if (catalogItem.currency === "gems") {
        if (currentGems < catalogItem.price) {
          throw new Error(`Saldo insuficiente de gemas. Requer ${catalogItem.price}, você possui ${currentGems}.`);
        }
      }

      const currentInventory = userData.inventory || { fiftyFifty: 0, extraTime: 0, skip: 0, hint: 0 };
      const updatedInventory = { ...currentInventory };
      let updatedLives = typeof userData.lives === "number" ? userData.lives : 5;

      if (catalogItem.rewardType === "life_refill") {
        updatedLives = 5;
      } else if (catalogItem.rewardType === "powerup_fifty") {
        updatedInventory.fiftyFifty = (updatedInventory.fiftyFifty || 0) + catalogItem.rewardAmount;
      } else if (catalogItem.rewardType === "powerup_time") {
        updatedInventory.extraTime = (updatedInventory.extraTime || 0) + catalogItem.rewardAmount;
      } else if (catalogItem.rewardType === "powerup_skip") {
        updatedInventory.skip = (updatedInventory.skip || 0) + catalogItem.rewardAmount;
      } else if (catalogItem.rewardType === "powerup_hint") {
        updatedInventory.hint = (updatedInventory.hint || 0) + catalogItem.rewardAmount;
      } else if (catalogItem.rewardType === "powerup_combo_bundle") {
        updatedInventory.fiftyFifty = (updatedInventory.fiftyFifty || 0) + 2;
        updatedInventory.extraTime = (updatedInventory.extraTime || 0) + 2;
        updatedInventory.skip = (updatedInventory.skip || 0) + 2;
        updatedInventory.hint = (updatedInventory.hint || 0) + 2;
        updatedLives = Math.min(5, updatedLives + 1);
      }

      const updates: Record<string, any> = {
        inventory: updatedInventory,
        lives: updatedLives,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      };

      if (catalogItem.currency === "coins") {
        updates.coins = admin.firestore.FieldValue.increment(-catalogItem.price);
      } else {
        updates.gems = admin.firestore.FieldValue.increment(-catalogItem.price);
      }

      transaction.update(userRef, updates);

      const newBalance = catalogItem.currency === "coins"
        ? currentCoins - catalogItem.price
        : currentGems - catalogItem.price;

      return {
        catalogItem,
        newBalance,
        inventory: updatedInventory,
        lives: updatedLives,
      };
    });

    return res.status(200).json({
      success: true,
      message: `Você adquiriu "${result.catalogItem.title}" com sucesso!`,
      newBalance: result.newBalance,
      currency: result.catalogItem.currency,
      inventory: result.inventory,
      lives: result.lives,
    });
  } catch (error: any) {
    return res.status(400).json({ error: error?.message || "Erro ao processar compra na loja." });
  }
});

/**
 * Débito Autoritativo de Power-Up no Servidor
 * Garante que nenhum power-up seja consumido sem decrementar o inventário atômico.
 */
app.post("/consume-power-up", authenticateFirebaseUser, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const uid = req.user?.uid;
    if (!uid) {
      return res.status(401).json({ error: "Usuário não autenticado." });
    }

    const { powerUpType } = req.body || {};
    const validPowerUps = ["fiftyFifty", "extraTime", "skip", "hint"];
    if (!validPowerUps.includes(powerUpType)) {
      return res.status(400).json({ error: "Tipo de power-up inválido." });
    }

    const userRef = admin.firestore().collection("users").doc(uid);

    const result = await admin.firestore().runTransaction(async (transaction) => {
      const userDoc = await transaction.get(userRef);
      if (!userDoc.exists) {
        throw new Error("Perfil de usuário não encontrado.");
      }

      const userData = userDoc.data() || {};
      const inventory = userData.inventory || {};
      const currentQty = typeof inventory[powerUpType] === "number" ? inventory[powerUpType] : 0;

      if (currentQty <= 0) {
        throw new Error(`Saldo insuficiente de ${powerUpType} no inventário.`);
      }

      const updatedInventory = {
        ...inventory,
        [powerUpType]: currentQty - 1,
      };

      transaction.update(userRef, {
        inventory: updatedInventory,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      return {
        powerUpType,
        remaining: currentQty - 1,
        inventory: updatedInventory,
      };
    });

    return res.status(200).json({
      success: true,
      message: `Power-up ${result.powerUpType} consumido com sucesso.`,
      remaining: result.remaining,
      inventory: result.inventory,
    });
  } catch (error: any) {
    return res.status(400).json({ error: error?.message || "Erro ao consumir power-up." });
  }
});

/**
 * Recompensa Diária de Vídeo AdMob com Exigência de Comprovação Verificável (SSV)
 * Bloqueia concessões cegas de 25 moedas sem assinatura do Google AdMob.
 */
app.post("/claim-daily-ad", authenticateFirebaseUser, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const uid = req.user?.uid;
    if (!uid) {
      return res.status(401).json({ error: "Usuário não autenticado." });
    }

    const { ssvToken, ssvSignature } = req.body || {};

    if (!ssvToken || !ssvSignature) {
      return res.status(403).json({
        error: "Comprovação verificável da recompensa do anúncio AdMob (Server-Side Verification) necessária. Concessão client-side desativada para proteção da economia.",
        code: "ADMOB_SSV_VERIFICATION_REQUIRED",
      });
    }

    return res.status(501).json({
      error: "Validação criptográfica de chave pública AdMob SSV em homologação no backend. Recompensa não concedida sem comprovação verificável.",
      code: "ADMOB_SSV_KEY_PENDING",
    });
  } catch (error: any) {
    return res.status(400).json({ error: error?.message || "Erro ao processar recompensa de anúncio." });
  }
});

/**
 * Coleta Autoritativa de Missão Diária com Validação de Cumprimento no Servidor
 */
app.post("/claim-daily-mission", authenticateFirebaseUser, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const uid = req.user?.uid;
    if (!uid) {
      return res.status(401).json({ error: "Usuário não autenticado." });
    }

    const { missionKey } = req.body || {};
    if (!missionKey) {
      return res.status(400).json({ error: "Chave de missão não informada." });
    }

    return res.status(501).json({
      error: "Validação autoritativa do cumprimento de missões no servidor pendente da ativação do motor de validação de partidas. Concessão client-side desativada para proteção da economia.",
      code: "MISSION_SERVER_VALIDATION_PENDING",
    });
  } catch (error: any) {
    return res.status(400).json({ error: error?.message || "Erro ao processar coleta de missão." });
  }
});

export { app };
export const api = functions.https.onRequest(app);

// Notificação Push para Novo Duelo
export const onNewDuel = functions.firestore
  .document("duels/{duelId}")
  .onCreate(async (snapshot) => {
    const data = snapshot.data();
    const opponentId = data?.opponentId;
    if (!opponentId) return;

    const userDoc = await admin.firestore().collection("users").doc(opponentId).get();
    const fcmToken = userDoc.data()?.fcmToken;

    if (fcmToken) {
      await admin.messaging().send({
        token: fcmToken,
        notification: {
          title: "Novo Duelo!",
          body: `${data.challengerName || "Um jogador"} te desafiou para um BrainPOP!`,
        },
      });
    }
  });

// Validação Autoritativa de Google Play Billing
export { validateGooglePlayPurchase } from './validateGooglePlayPurchase';
