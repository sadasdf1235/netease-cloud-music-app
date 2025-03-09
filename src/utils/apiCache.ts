/**
 * API缓存工具
 * @description 提供API请求缓存功能，减少重复请求
 */

interface CacheItem<T> {
  data: T;
  timestamp: number;
  expires: number;
}

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
    return Date.now() - item.timestamp > item.expires;
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
      expires,
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

export default apiCache;