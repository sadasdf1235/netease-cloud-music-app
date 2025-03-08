 /**
 * 本地存储相关工具函数
 * @description 提供简便的localStorage操作方法
 */

/**
 * 从localStorage中获取数据
 * @param key 存储键名
 * @param defaultValue 默认值
 * @returns 获取的数据，如果不存在则返回默认值
 */
export function getStorage<T>(key: string, defaultValue?: T): T | undefined {
    try {
      const item = localStorage.getItem(key);
      if (item !== null) {
        return JSON.parse(item);
      }
      return defaultValue;
    } catch (error) {
      console.error(`获取存储数据失败: ${key}`, error);
      return defaultValue;
    }
  }
  
  /**
   * 将数据存储到localStorage
   * @param key 存储键名
   * @param value 要存储的数据
   */
  export function setStorage<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`存储数据失败: ${key}`, error);
    }
  }
  
  /**
   * 从localStorage中移除数据
   * @param key 存储键名
   */
  export function removeStorage(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`移除存储数据失败: ${key}`, error);
    }
  }
  
  /**
   * 清空localStorage中的所有数据
   */
  export function clearStorage(): void {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('清空存储数据失败', error);
    }
  }