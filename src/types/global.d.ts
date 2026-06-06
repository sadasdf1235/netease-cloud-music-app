/**
 * 全局类型声明文件
 * @description 只放置项目级工具类型，避免覆盖 Vue、Pinia 等库的官方声明。
 */
declare global {
  type DeepPartial<T> = {
    [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
  };
  
  type Nullable<T> = T | null;
  
  type RecordAny = Record<string, any>;
}

export {};
