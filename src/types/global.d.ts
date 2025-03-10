/**
 * 全局类型声明文件
 * @description 为所有模块提供全局类型声明
 */

// Vue相关模块
declare module 'vue' {
  import { ComponentPublicInstance, FunctionalComponent, ComponentOptions, DefineComponent, ComputedRef, Ref } from '@vue/runtime-core';
  
  export { 
    ComponentPublicInstance, 
    FunctionalComponent, 
    ComponentOptions, 
    DefineComponent,
    ComputedRef,
    Ref
  };
  
  export function ref<T>(value: T): Ref<T>;
  export function ref<T = any>(): Ref<T | undefined>;
  
  export function computed<T>(getter: () => T): ComputedRef<T>;
  export function computed<T>(options: { get: () => T; set: (value: T) => void }): ComputedRef<T>;
  
  export function watch<T>(source: T | Ref<T> | (() => T), callback: (newValue: T, oldValue: T) => void, options?: any): () => void;
  
  export function onMounted(callback: () => void): void;
  export function onUnmounted(callback: () => void): void;
}

// Pinia相关模块
declare module 'pinia' {
  export function storeToRefs<T extends object>(store: T): {
    [K in keyof T]: T[K] extends Function ? T[K] : Ref<T[K]>
  };
  
  export interface PiniaCustomProperties {
    // 在这里可以添加自定义的Pinia属性
  }
}

// 全局工具类型
declare global {
  type DeepPartial<T> = {
    [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
  };
  
  type Nullable<T> = T | null;
  
  type RecordAny = Record<string, any>;
} 