/**
 * API缓存工具
 * @description 提供API请求缓存功能，减少重复请求
 */

interface CacheItem<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

const cache = new Map<string, CacheItem<any>>();

/**
 * 获取缓存数据
 * @param key 缓存键
 * @returns 缓存数据，如果过期或不存在则返回null
 */
export function getCacheData<T>(key: string): T | null {
  const item = cache.get(key);
  if (!item) return null;

  const now = Date.now();
  if (now - item.timestamp > item.ttl) {
    cache.delete(key);
    return null;
  }

  return item.data;
}

/**
 * 设置缓存数据
 * @param key 缓存键
 * @param data 缓存数据
 * @param ttl 过期时间（毫秒）
 */
export function setCacheData<T>(key: string, data: T, ttl: number): void {
  cache.set(key, {
    data,
    timestamp: Date.now(),
    ttl
  });
}

/**
 * 清除缓存数据
 * @param key 缓存键，如果不传则清除所有缓存
 */
export function clearCache(key?: string): void {
  if (key) {
    cache.delete(key);
  } else {
    cache.clear();
  }
}

/**
 * 清除过期缓存
 */
export function clearExpiredCache(): void {
  const now = Date.now();
  for (const [key, item] of cache.entries()) {
    if (now - item.timestamp > item.ttl) {
      cache.delete(key);
    }
  }
}

// 定期清理过期缓存
setInterval(clearExpiredCache, 5 * 60 * 1000);

interface CacheOptions {
  /** 缓存时间（毫秒） */
  expires?: number;
  /** 是否强制刷新 */
  forceRefresh?: boolean;
}

class ApiCache {
  private cache: Map<string, CacheItem<any>>;
  private defaultExpires: number;

  constructor(defaultExpires: number = 5 * 60 * 1000) { // 默认5分钟
    this.cache = new Map();
    this.defaultExpires = defaultExpires;
  }

  /**
   * 生成缓存键
   * @param key 基础键名
   * @param params 请求参数
   * @returns 缓存键
   */
  private generateKey(key: string, params?: Record<string, any>): string {
    if (!params) return key;
    return `${key}:${JSON.stringify(params)}`;
  }

  /**
   * 检查缓存是否过期
   * @param item 缓存项
   * @returns 是否过期
   */
  private isExpired(item: CacheItem<any>): boolean {
    return Date.now() - item.timestamp > item.ttl;
  }

  /**
   * 设置缓存
   * @param key 缓存键
   * @param data 数据
   * @param options 缓存选项
   */
  set<T>(key: string, data: T, options: CacheOptions = {}): void {
    const cacheKey = this.generateKey(key, options);
    const expires = options.expires || this.defaultExpires;

    this.cache.set(cacheKey, {
      data,
      timestamp: Date.now(),
      ttl: expires,
    });
  }

  /**
   * 获取缓存
   * @param key 缓存键
   * @param params 请求参数
   * @returns 缓存数据或undefined
   */
  get<T>(key: string, params?: Record<string, any>): T | undefined {
    const cacheKey = this.generateKey(key, params);
    const item = this.cache.get(cacheKey);

    if (!item) return undefined;
    if (this.isExpired(item)) {
      this.cache.delete(cacheKey);
      return undefined;
    }

    return item.data;
  }

  /**
   * 删除缓存
   * @param key 缓存键
   * @param params 请求参数
   */
  delete(key: string, params?: Record<string, any>): void {
    const cacheKey = this.generateKey(key, params);
    this.cache.delete(cacheKey);
  }

  /**
   * 清除所有缓存
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * 清除过期缓存
   */
  clearExpired(): void {
    for (const [key, item] of this.cache.entries()) {
      if (this.isExpired(item)) {
        this.cache.delete(key);
      }
    }
  }
}

// 创建全局缓存实例
const apiCache = new ApiCache();

/**
 * 缓存装饰器
 * @param key 缓存键
 * @param options 缓存选项
 */
export function withCache<T>(
  key: string,
  options: CacheOptions = {}
): (target: () => Promise<T>) => Promise<T> {
  return async (target: () => Promise<T>) => {
    // 如果强制刷新，直接请求
    if (options.forceRefresh) {
      const data = await target();
      apiCache.set(key, data, options);
      return data;
    }

    // 尝试从缓存获取
    const cached = apiCache.get<T>(key);
    if (cached !== undefined) {
      return cached;
    }

    // 缓存未命中，发起请求
    const data = await target();
    apiCache.set(key, data, options);
    return data;
  };
}

/**
 * 简化版的缓存包装函数，用于直接包装API调用
 * 与原withCache函数不同，这个函数采用更简单的调用方式
 * @param apiCall API调用函数
 * @param cacheKey 缓存键
 * @param ttl 缓存时间（毫秒）
 * @returns Promise<T> 包含缓存的Promise
 */
export function withSimpleCache<T>(
  apiCall: () => Promise<T>,
  cacheKey: string,
  ttl: number
): Promise<T> {
  const cachedData = getCacheData<T>(cacheKey);
  if (cachedData) {
    return Promise.resolve(cachedData);
  }
  return apiCall().then(data => {
    setCacheData(cacheKey, data, ttl);
    return data;
  });
}

export default apiCache;