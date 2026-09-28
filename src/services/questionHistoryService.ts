import AsyncStorage from '@react-native-async-storage/async-storage';
import { normalizeCategory } from '../utils/questionSelector';

const RECENT_QUESTIONS_STORAGE_KEY = '@brainpop_recent_questions_v1';
const MAX_RECENT_QUESTIONS_PER_CATEGORY = 40;

// Cache em memória para leitura síncrona/instantânea durante a inicialização de partidas
let memoryCache: Record<string, string[]> = {};
let isCacheLoaded = false;

export const questionHistoryService = {
  /**
   * Carrega todo o histórico persistente para o cache em memória.
   */
  async loadHistory(): Promise<Record<string, string[]>> {
    if (isCacheLoaded) return memoryCache;
    try {
      const raw = await AsyncStorage.getItem(RECENT_QUESTIONS_STORAGE_KEY);
      if (raw) {
        memoryCache = JSON.parse(raw);
      }
    } catch (e) {
      console.warn('Erro ao carregar histórico de perguntas:', e);
    } finally {
      isCacheLoaded = true;
    }
    return memoryCache;
  },

  /**
   * Obtém os IDs recentes para uma categoria ou modo global.
   * Retorna os IDs ordenados do mais antigo ao mais recente.
   */
  getRecentIds(category = 'all'): string[] {
    const key = normalizeCategory(category);
    const specific = memoryCache[key] || [];
    const globalIds = key !== 'all' ? (memoryCache['all'] || []) : [];
    // Combina mantendo ordem de antiguidade sem duplicatas
    const combined = Array.from(new Set([...globalIds, ...specific]));
    return combined.slice(-MAX_RECENT_QUESTIONS_PER_CATEGORY);
  },

  /**
   * Obtém os IDs recentes de forma assíncrona garantindo carga prévia do storage.
   */
  async getRecentIdsAsync(category = 'all'): Promise<string[]> {
    await this.loadHistory();
    return this.getRecentIds(category);
  },

  /**
   * Registra novas perguntas visualizadas no histórico da categoria e no histórico global.
   * Mantém o limite de ~30-40 perguntas por categoria em fila FIFO (mais antigas na frente).
   */
  async recordRecentIds(category: string, newIds: string[]): Promise<void> {
    if (!newIds || newIds.length === 0) return;

    await this.loadHistory();

    const catKey = normalizeCategory(category);
    const updateCategoryList = (key: string) => {
      const current = memoryCache[key] || [];
      // Remove ocorrências anteriores dos IDs que estão sendo inseridos novamente
      const filtered = current.filter((id) => !newIds.includes(id));
      const updated = [...filtered, ...newIds];
      memoryCache[key] = updated.slice(-MAX_RECENT_QUESTIONS_PER_CATEGORY);
    };

    updateCategoryList(catKey);
    if (catKey !== 'all') {
      updateCategoryList('all');
    }

    try {
      await AsyncStorage.setItem(
        RECENT_QUESTIONS_STORAGE_KEY,
        JSON.stringify(memoryCache)
      );
    } catch (e) {
      console.warn('Erro ao salvar histórico de perguntas:', e);
    }
  },

  /**
   * Limpa o histórico de perguntas recentes.
   */
  async clearHistory(): Promise<void> {
    memoryCache = {};
    isCacheLoaded = true;
    try {
      await AsyncStorage.removeItem(RECENT_QUESTIONS_STORAGE_KEY);
    } catch (e) {
      console.warn('Erro ao limpar histórico de perguntas:', e);
    }
  },
};
