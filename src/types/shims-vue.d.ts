/**
 * Vue类型声明文件
 * @description 为Vue相关模块提供类型声明
 */

declare module '*.vue' {
  import type { DefineComponent } from 'vue';
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

declare module 'vue' {
  export interface GlobalComponents {
    RouterLink: typeof import('vue-router')['RouterLink'];
    RouterView: typeof import('vue-router')['RouterView'];
  }
}

declare module 'vue-router' {
  interface RouteMeta {
    title?: string;
    requiresAuth?: boolean;
    layout?: string;
    keepAlive?: boolean;
  }
} 