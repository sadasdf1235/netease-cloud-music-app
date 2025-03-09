/**
 * 图片懒加载指令
 * @description 图片懒加载指令，优化图片加载性能
 */
import type { App, Directive } from 'vue';

interface LazyLoadOptions {
  /** 加载中占位图URL */
  loading?: string;
  /** 加载失败占位图URL */
  error?: string;
  /** 调试模式 */
  debug?: boolean;
}

// 默认配置
const defaultOptions: LazyLoadOptions = {
  loading: 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7', // 1x1px透明图
  error: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0Ij48cGF0aCBmaWxsPSJub25lIiBkPSJNMCAwaDI0djI0SDB6Ii8+PHBhdGggZD0iTTUuMjQgNS45M2EzIDMgMCAwIDAgMCA0LjE0TDkuMTcgMTRsLTMuOTMgMy45M2EzIDMgMCAwIDAgNC4xNCA0LjE0TDEzLjMgMTguMTNsNC4xNCA0LjE0YTMgMyAwIDAgMCA0LjE0LTQuMTRMMTcuNjMgMTRsMy45My0zLjkzYTMgMyAwIDAgMC00LjE0LTQuMTRMMTMuMyA5Ljg3IDkuMzggNS45M2EzIDMgMCAwIDAtNC4xNCAweiIgZmlsbD0icmdiYSgyNTIsNTgsODYsMC45OTkpIi8+PC9zdmc+',
  debug: false
};

// 记录已加载过的图片
const loadedImages = new Set<string>();

/**
 * 检查元素是否在可视区域内
 * @param el 要检查的元素
 * @returns 是否在可视区域内
 */
function isInViewport(el: HTMLElement): boolean {
  const rect = el.getBoundingClientRect();

  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

/**
 * 图片懒加载指令
 * @param options 配置选项
 * @returns Vue指令
 */
export function createLazyLoadDirective(options?: LazyLoadOptions): Directive {
  const mergedOptions = { ...defaultOptions, ...options };

  // 存储每个元素的原始src和loading状态
  const elementMap = new WeakMap<HTMLElement, { src: string, loading: boolean }>();

  // 初始化IntersectionObserver
  const observer = typeof IntersectionObserver !== 'undefined'
    ? new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLImageElement;
            const data = elementMap.get(el);

            if (data && !data.loading) {
              loadImage(el, data.src);
            }
          }
        });
      }, { threshold: 0.01 })
    : null;

  /**
   * 加载图片
   * @param el 图片元素
   * @param src 图片源地址
   */
  function loadImage(el: HTMLImageElement, src: string): void {
    // 如果已经加载过，直接设置
    if (loadedImages.has(src)) {
      el.src = src;
      observer?.unobserve(el);
      return;
    }

    // 标记为加载中
    const data = elementMap.get(el);
    if (data) {
      data.loading = true;
    }

    // 设置加载中状态
    el.src = mergedOptions.loading || '';

    // 创建新图片对象进行预加载
    const img = new Image();
    img.onload = () => {
      el.src = src;
      loadedImages.add(src);
      observer?.unobserve(el);

      // 更新加载状态
      if (data) {
        data.loading = false;
      }

      if (mergedOptions.debug) {
        console.log('[LazyLoad] 加载成功:', src);
      }
    };

    img.onerror = () => {
      el.src = mergedOptions.error || '';

      // 更新加载状态
      if (data) {
        data.loading = false;
      }

      if (mergedOptions.debug) {
        console.error('[LazyLoad] 加载失败:', src);
      }
    };

    img.src = src;
  }

  /**
   * 回退方案：使用滚动监听
   */
  function checkImagesInViewport(): void {
    const elements = document.querySelectorAll('[v-lazy]');

    elements.forEach((el) => {
      if (isInViewport(el as HTMLElement)) {
        const data = elementMap.get(el as HTMLElement);

        if (data && !data.loading) {
          loadImage(el as HTMLImageElement, data.src);
        }
      }
    });
  }

  // 如果不支持IntersectionObserver，使用滚动监听
  if (!observer) {
    window.addEventListener('scroll', checkImagesInViewport, { passive: true });
    window.addEventListener('resize', checkImagesInViewport, { passive: true });
    window.addEventListener('orientationchange', checkImagesInViewport, { passive: true });
  }

  return {
    mounted(el: HTMLImageElement, binding) {
      // 存储原始src
      const src = binding.value || el.getAttribute('data-src');

      if (!src) {
        console.warn('[LazyLoad] 没有提供图片地址');
        return;
      }

      // 设置加载中占位图
      el.src = mergedOptions.loading || '';

      // 存储元素信息
      elementMap.set(el, { src, loading: false });

      // 添加自定义属性，用于回退方案
      el.setAttribute('v-lazy', '');

      // 使用IntersectionObserver监听
      if (observer) {
        observer.observe(el);
      } else {
        // 回退方案：检查是否在可视区域内
        if (isInViewport(el)) {
          loadImage(el, src);
        }
      }
    },

    updated(el: HTMLImageElement, binding) {
      // 如果src变化，更新存储
      const newSrc = binding.value || el.getAttribute('data-src');
      const data = elementMap.get(el);

      if (data && newSrc && data.src !== newSrc) {
        data.src = newSrc;
        data.loading = false;

        // 如果在可视区域内，加载新图片
        if (observer) {
          if (el.getBoundingClientRect().top < window.innerHeight) {
            loadImage(el, newSrc);
          }
        } else if (isInViewport(el)) {
          loadImage(el, newSrc);
        }
      }
    },

    unmounted(el: HTMLImageElement) {
      // 移除观察
      observer?.unobserve(el);

      // 清除存储
      elementMap.delete(el);
    }
  };
}

/**
 * 注册懒加载指令
 * @param app Vue应用实例
 * @param options 配置选项
 */
export function registerLazyLoad(app: App, options?: LazyLoadOptions): void {
  app.directive('lazy', createLazyLoadDirective(options));
}

export default {
  install(app: App, options?: LazyLoadOptions) {
    registerLazyLoad(app, options);
  }
};