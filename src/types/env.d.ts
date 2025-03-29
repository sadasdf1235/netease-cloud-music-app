/// <reference types="vite/client" />

/**
 * 环境变量类型声明
 * @description 为环境变量和全局变量提供类型声明
 */

// 声明环境变量类型
interface ImportMetaEnv {
  /** API基础URL */
  readonly VITE_API_URL: string;
  /** 环境类型 */
  readonly MODE: string;
  /** 是否为开发环境 */
  readonly DEV: boolean;
  /** 是否为生产环境 */
  readonly PROD: boolean;
  /** 项目SSR模式 */
  readonly SSR: boolean;
  readonly VITE_APP_TITLE: string;
  readonly VITE_API_BASE_URL: string;
  readonly VITE_APP_ENV: string;
}

// 扩展ImportMeta接口
interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// 声明Node环境变量
declare namespace NodeJS {
  interface ProcessEnv {
    /** Node环境 */
    NODE_ENV: 'development' | 'production' | 'test';
    /** 是否在浏览器环境 */
    BROWSER: boolean;
    /** Vite相关环境变量 */
    [key: `VITE_${string}`]: string | undefined;
  }
}

// 为Vue Router补充类型声明
declare module 'vue-router' {
  // 导出组合式API函数
  export function useRouter(): Router;
  export function useRoute(): RouteLocationNormalizedLoaded;
}

// 为Pinia补充类型声明
declare module 'pinia' {
  export function defineStore<Id extends string, S extends StateTree = {}, G extends _GettersTree<S> = {}, A = {}>(
    id: Id,
    options: Omit<DefineStoreOptions<Id, S, G, A>, 'id'>
  ): StoreDefinition<Id, S, G, A>;
  
  export function defineStore<Id extends string, S extends StateTree = {}, G extends _GettersTree<S> = {}, A = {}>(
    options: DefineStoreOptions<Id, S, G, A>
  ): StoreDefinition<Id, S, G, A>;
}

// 为Vue组合式API补充类型声明
declare module 'vue' {
  export function reactive<T extends object>(target: T): T;
  export function nextTick(fn?: () => void): Promise<void>;
} 