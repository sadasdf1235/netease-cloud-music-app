/**
 * 数据缓存组合式函数
 * @description 提供数据缓存和预加载功能
 */
import { ref, onMounted, onUnmounted } from 'vue';

interface CacheOptions {
  key: string;
  ttl?: number; // 缓存过期时间（毫秒）
  preload?: boolean; // 是否预加载
}

interface CacheItem<T> {
  data: T;
  timestamp: number;
}

/**
 * 数据缓存管理
 */
export function useDataCache<T>(options: CacheOptions) {
  const { key, ttl = 5 * 60 * 1000, preload = false } = options;
  const data = ref<T | null>(null);
  const isLoading = ref(false);
  const error = ref<Error | null>(null);

  /**
   * 从缓存获取数据
   */
  function getFromCache(): T | null {
    const cached = localStorage.getItem(key);
    if (!cached) return null;

    const { data, timestamp }: CacheItem<T> = JSON.parse(cached);
    if (Date.now() - timestamp > ttl) {
      localStorage.removeItem(key);
      return null;
    }

    return data;
  }

  /**
   * 保存数据到缓存
   */
  function saveToCache(value: T) {
    const cacheItem: CacheItem<T> = {
      data: value,
      timestamp: Date.now()
    };
    localStorage.setItem(key, JSON.stringify(cacheItem));
  }

  /**
   * 清除缓存
   */
  function clearCache() {
    localStorage.removeItem(key);
    data.value = null;
  }

  /**
   * 加载数据
   */
  async function loadData(fetchFn: () => Promise<T>) {
    if (isLoading.value) return;

    try {
      isLoading.value = true;
      error.value = null;

      // 尝试从缓存获取
      const cached = getFromCache();
      if (cached) {
        data.value = cached;
        return;
      }

      // 从API获取
      const result = await fetchFn();
      data.value = result;
      saveToCache(result);
    } catch (e) {
      error.value = e as Error;
      console.error(`加载数据失败: ${key}`, e);
    } finally {
      isLoading.value = false;
    }
  }

  /**
   * 预加载数据
   */
  function preloadData(fetchFn: () => Promise<T>) {
    if (preload) {
      loadData(fetchFn);
    }
  }

  // 组件卸载时清理
  onUnmounted(() => {
    if (!preload) {
      clearCache();
    }
  });

  return {
    data,
    isLoading,
    error,
    loadData,
    clearCache,
    preloadData
  };
} 