/**
 * 指令导出索引文件
 * @description 统一导出所有自定义指令，方便在项目中引用
 */
import type { App } from 'vue';
import LazyLoad, { registerLazyLoad } from './LazyLoad';

/**
 * 注册所有指令
 * @param app Vue应用实例
 */
export function registerDirectives(app: App): void {
  // 注册图片懒加载指令
  registerLazyLoad(app);

  // 可在此处注册其他指令
}

// 导出图片懒加载指令
export { LazyLoad };

export default {
  install(app: App) {
    registerDirectives(app);
  }
};