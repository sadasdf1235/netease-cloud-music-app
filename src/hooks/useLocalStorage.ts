/**
 * 本地存储Hook
 * @description 提供本地存储操作的封装，支持过期时间设置
 */
import { ref, watch } from 'vue';

interface StorageOptions {
  /** 存储前缀，用于区分不同的存储空间 */
  prefix?: string;
  /** 过期时间（毫秒），默认为永不过期 */
  expires?: number;
  /** 是否立即从本地获取初始值，默认为true */
  immediate?: boolean;
  /** 是否在窗口关闭前保存，默认为true */
  saveOnUnload?: boolean;
}

interface StorageData<T> {
  /** 存储的值 */
  value: T;
  /** 存储时间戳 */
  timestamp: number;
  /** 过期时间（毫秒） */
  expires?: number;
}

/**
 * 本地存储Hook
 * @param key 存储键名
 * @param initialValue 初始值
 * @param options 存储选项
 * @returns 包含存储值和操作方法的对象
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T,
  options: StorageOptions = {}
) {
  const {
    prefix = 'app:',
    expires,
    immediate = true,
    saveOnUnload = true,
  } = options;

  // 完整键名（添加前缀）
  const fullKey = `${prefix}${key}`;
  // 存储的值（响应式）
  const storedValue = ref<T>(initialValue);

  /**
   * 从本地存储中读取值
   * @returns 存储的值或初始值
   */
  const readValue = (): T => {
    try {
      const item = window.localStorage.getItem(fullKey);

      if (item) {
        const data = JSON.parse(item) as StorageData<T>;

        // 检查是否过期
        if (data.expires && data.timestamp + data.expires < Date.now()) {
          window.localStorage.removeItem(fullKey);
          return initialValue;
        }

        return data.value;
      }
    } catch (error) {
      console.error(`读取本地存储出错 (key: ${fullKey}):`, error);
    }

    return initialValue;
  };

  /**
   * 将值写入本地存储
   * @param value 要存储的值
   */
  const writeValue = (value: T): void => {
    try {
      const data: StorageData<T> = {
        value,
        timestamp: Date.now(),
      };

      if (expires) {
        data.expires = expires;
      }

      window.localStorage.setItem(fullKey, JSON.stringify(data));
      storedValue.value = value;
    } catch (error) {
      console.error(`写入本地存储出错 (key: ${fullKey}):`, error);
    }
  };

  /**
   * 从本地存储中移除值
   */
  const removeValue = (): void => {
    try {
      window.localStorage.removeItem(fullKey);
      storedValue.value = initialValue;
    } catch (error) {
      console.error(`删除本地存储出错 (key: ${fullKey}):`, error);
    }
  };

  // 初始化：如果设置为立即获取，则从本地存储中读取初始值
  if (immediate) {
    storedValue.value = readValue();
  }

  // 监听值变化，自动写入本地存储
  watch(
    storedValue,
    (newValue) => {
      writeValue(newValue);
    },
    { deep: true }
  );

  // 窗口关闭前保存
  if (saveOnUnload && typeof window !== 'undefined') {
    window.addEventListener('beforeunload', () => {
      writeValue(storedValue.value);
    });
  }

  return {
    value: storedValue,
    read: readValue,
    write: writeValue,
    remove: removeValue,
  };
}

export default useLocalStorage;