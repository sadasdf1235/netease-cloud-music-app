/**
 * 类型补丁文件
 * @description 为项目中的类型问题提供临时修复
 */

// 导入所需类型
import 'vue-router';
import 'vue';
import 'pinia';

// 为Vue Router添加组合式API导出
declare module 'vue-router' {
  export interface Router {
    push(to: any): Promise<void>;
    replace(to: any): Promise<void>;
    go(delta: number): void;
    back(): void;
    forward(): void;
  }
  
  export interface RouteLocationNormalizedLoaded {
    path: string;
    name: string | null | undefined;
    params: Record<string, string>;
    query: Record<string, string | string[]>;
    hash: string;
    fullPath: string;
    matched: any[];
    meta: Record<string, any>;
  }
  
  // 导出组合式API
  export function useRouter(): Router;
  export function useRoute(): RouteLocationNormalizedLoaded;
}

// 为Vue添加组合式API导出
declare module 'vue' {
  export function reactive<T extends object>(target: T): T;
  export function nextTick<T = void>(this: T, fn?: (this: T) => void): Promise<void>;
}

// 为Pinia添加defineStore API
declare module 'pinia' {
  export interface StateTree {}
  export interface _GettersTree<S extends StateTree> {}
  
  export interface DefineStoreOptions<
    Id extends string,
    S extends StateTree,
    G,
    A
  > {
    id: Id;
    state?: () => S;
    getters?: G;
    actions?: A;
  }
  
  export type StoreDefinition<
    Id extends string,
    S extends StateTree,
    G,
    A
  > = {
    (): any;
    $id: Id;
  };
  
  export function defineStore<
    Id extends string,
    S extends StateTree = {},
    G = {},
    A = {}
  >(
    id: Id,
    options: Omit<DefineStoreOptions<Id, S, G, A>, 'id'>
  ): StoreDefinition<Id, S, G, A>;
  
  export function defineStore<
    Id extends string,
    S extends StateTree = {},
    G = {},
    A = {}
  >(options: DefineStoreOptions<Id, S, G, A>): StoreDefinition<Id, S, G, A>;
} 