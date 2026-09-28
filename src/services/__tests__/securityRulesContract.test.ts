import * as fs from 'fs';
import * as path from 'path';

describe('Firestore Security Rules — Validação de Contrato e Regras Anti-Fraude', () => {
  const rulesPath = path.resolve(__dirname, '../../../firestore.rules');
  let rulesContent: string;

  beforeAll(() => {
    expect(fs.existsSync(rulesPath)).toBe(true);
    rulesContent = fs.readFileSync(rulesPath, 'utf8');
  });

  it('deve restringir allow update em users/{userId} exclusivamente a campos de perfil seguros', () => {
    // Whitelist estrita permitida:
    const allowedKeys = [
      'avatarUrl',
      'settings',
      'fcmToken',
      'hasCompletedOnboarding',
      'hasConfiguredInitialPermissions',
    ];

    for (const key of allowedKeys) {
      expect(rulesContent).toContain(`'${key}'`);
    }

    expect(rulesContent).toContain('affected.hasOnly');

    // Campos econômicos, sensíveis ou delegados a Cloud Function NUNCA devem estar na lista permitida de update
    const forbiddenFields = [
      'coins',
      'gems',
      'lives',
      'xp',
      'totalXp',
      'level',
      'duelTrophies',
      'inventory',
      'stats',
      'title',
      'lastActiveDate',
      'updatedAt',
      'name',
      'friends',
    ];

    for (const field of forbiddenFields) {
      const fieldRegex = new RegExp(`hasOnly\\([^)]*['"]${field}['"][^)]*\\)`);
      expect(fieldRegex.test(rulesContent)).toBe(false);
    }
  });

  it('não deve permitir que usuários externos alterem o array de amigos no documento alheio', () => {
    // A vulnerabilidade antiga permitia affectedKeys().hasOnly(['friends']) sem checagem de isOwner
    expect(rulesContent).not.toMatch(/hasOnly\(\['friends'\]\)/);
    // Toda atualização em users/{userId} deve exigir isOwner(userId)
    expect(rulesContent).toContain('isValidUserUpdate(userId)');
    expect(rulesContent).toContain('isOwner(userId) &&');
  });

  it('deve restringir a leitura de duelos estritamente aos participantes do duelo', () => {
    expect(rulesContent).toContain('resource.data.player1Id == request.auth.uid || resource.data.player2Id == request.auth.uid');
  });

  it('deve proibir escrita/atualização direta de resultados de duelo pelo cliente', () => {
    // match /duels/{duelId} deve conter allow update, delete: if false;
    expect(rulesContent).toContain('match /duels/{duelId}');
    expect(rulesContent).toContain('allow update, delete: if false;');
  });

  it('deve conter bloqueio global padrão de leitura e escrita (allow read, write: if false;)', () => {
    expect(rulesContent).toContain('match /{document=**}');
    expect(rulesContent).toContain('allow read, write: if false;');
  });
});
