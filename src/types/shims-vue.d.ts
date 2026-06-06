import 'vue-router';

declare module '*.vue' {
  import type { DefineComponent } from 'vue';
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

declare module 'vue-router' {
  interface RouteMeta {
    title?: string;
    requiresAuth?: boolean;
    layout?: string;
    keepAlive?: boolean;
  }
}
