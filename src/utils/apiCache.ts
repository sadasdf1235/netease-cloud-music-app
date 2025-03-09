 /**
 * API缓存工具
 * @description 用于缓存API请求结果，提高性能
 */
import { getStorage, setStorage, removeStorage } from './storage';

/**
 * 缓存项接口
 */
interface CacheItem<T> {
  /** 缓存数据 */
  data: T;
  /** 过期时间戳 */
  expiry: number;
}

/** 缓存键前缀 */
const CACHE_PREFIX = 'api_cache_';

/** 默认缓存时间（5分钟） */
const DEFAULT_CACHE_TIME = 5 * 60 * 1000;

/**
 * 设置API缓存
 * @param key 缓存键
 * @param data 缓存数据
 * @param expireTime 过期时间（毫秒）
 */
export function setApiCache<T>(key: string, data: T, expireTime = DEFAULT_CACHE_TIME): void {
  const cacheKey = `${CACHE_PREFIX}${key}`;
  const cacheItem: CacheItem<T> = {
    data,
    expiry: Date.now() + expireTime
  };

  setStorage(cacheKey, cacheItem);
}

/**
 * 获取API缓存
 * @param key 缓存键
 * @returns 缓存数据，如果不存在或已过期则返回null
 */
export function getApiCache<T>(key: string): T | null {
  const cacheKey = `${CACHE_PREFIX}${key}`;
  const cacheItem = getStorage<CacheItem<T>>(cacheKey);

  // 检查缓存是否存在且未过期
  if (cacheItem && cacheItem.expiry > Date.now()) {
    return cacheItem.data;
  }

  // 如果缓存已过期，清除它
  if (cacheItem) {
    removeStorage(cacheKey);
  }

  return null;
}

/**
 * 删除API缓存
 * @param key 缓存键
 */
export function removeApiCache(key: string): void {
  const cacheKey = `${CACHE_PREFIX}${key}`;
  removeStorage(cacheKey);
}

/**
 * 清除所有API缓存
 */
export function clearApiCache(): void {
  try {
    // 获取所有localStorage键
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(CACHE_PREFIX)) {
        localStorage.removeItem(key);
      }
    }
  } catch (error) {
    console.error('清除API缓存失败', error);
  }
}

/**
 * 带缓存的API请求包装器
 * @param apiCall API调用函数
 * @param cacheKey 缓存键
 * @param cacheTime 缓存时间（毫秒）
 * @returns API调用结果
 */
export async function withCache<T>(
  apiCall: () => Promise<T>,
  cacheKey: string,
  cacheTime = DEFAULT_CACHE_TIME
): Promise<T> {
  // 尝试从缓存获取数据
  const cachedData = getApiCache<T>(cacheKey);
  if (cachedData) {
    return cachedData;
  }

  // 如果没有缓存，调用API
  const data = await apiCall();

  // 缓存结果
  setApiCache(cacheKey, data, cacheTime);

  return data;
}