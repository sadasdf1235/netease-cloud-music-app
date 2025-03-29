/**
 * 路由Hook函数
 * @description 导出Vue Router的Hook函数，解决类型问题
 */
import type { Router, RouteLocationNormalizedLoaded } from 'vue-router';
import { useRouter as vueUseRouter, useRoute as vueUseRoute } from 'vue-router';

/**
 * 获取路由实例
 * @returns Vue Router实例
 */
export function useRouter(): Router {
  return vueUseRouter();
}

/**
 * 获取当前路由
 * @returns 当前路由信息
 */
export function useRoute(): RouteLocationNormalizedLoaded {
  return vueUseRoute();
}

export type { Router, RouteLocationNormalizedLoaded }; 