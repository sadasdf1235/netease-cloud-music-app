/// <reference types="vite/client" />

/**
 * 环境变量类型声明
 * @description 为 Vite 环境变量提供类型声明，不覆盖框架库官方导出。
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
