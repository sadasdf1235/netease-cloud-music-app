/**
 * API请求Hook
 * @description 提供API请求的状态管理、错误处理和自动重试功能
 */
import { ref, computed, onMounted, type Ref } from 'vue';

/**
 * 请求配置选项
 */
export interface RequestOptions {
  /** 是否自动执行请求（组件挂载时） */
  immediate?: boolean;
  /** 请求出错时是否自动重试 */
  retryOnError?: boolean;
  /** 最大重试次数 */
  maxRetries?: number;
  /** 重试延迟(ms) */
  retryDelay?: number;
  /** 请求超时时间(ms) */
  timeout?: number;
  /** 成功回调 */
  onSuccess?: (data: any) => void;
  /** 错误回调 */
  onError?: (error: Error) => void;
  /** 完成回调（无论成功失败） */
  onFinally?: () => void;
}

/**
 * 请求结果类型
 */
export interface RequestResult<T> {
  /** 请求数据 */
  data: Ref<T | null>;
  /** 加载状态 */
  loading: Ref<boolean>;
  /** 是否有错误 */
  error: Ref<Error | null>;
  /** 请求成功状态 */
  success: Ref<boolean>;
  /** 执行请求函数 */
  run: (params?: any) => Promise<T | null>;
  /** 重置状态函数 */
  reset: () => void;
  /** 当前重试次数 */
  retryCount: Ref<number>;
  /** 是否正在重试 */
  isRetrying: Ref<boolean>;
}

/**
 * 默认请求配置
 */
const defaultOptions: RequestOptions = {
  immediate: true,
  retryOnError: false,
  maxRetries: 3,
  retryDelay: 1000,
  timeout: 10000
};

/**
 * API请求Hook
 * @param requestFn API请求函数
 * @param params 请求参数
 * @param options 配置选项
 * @returns 请求状态和方法
 */
export function useRequest<T = any, P = any>(
  requestFn: (params?: P) => Promise<T>,
  params?: P,
  options?: RequestOptions
): RequestResult<T> {
  // 合并配置
  const mergedOptions = { ...defaultOptions, ...options };
  
  // 状态变量
  const data = ref<T | null>(null) as Ref<T | null>;
  const loading = ref(false);
  const error = ref<Error | null>(null);
  const success = ref(false);
  const retryCount = ref(0);
  const isRetrying = ref(false);
  const controller = ref<AbortController | null>(null);
  
  /**
   * 取消请求
   */
  const abort = () => {
    if (controller.value) {
      controller.value.abort();
      controller.value = null;
    }
  };
  
  /**
   * 重置所有状态
   */
  const reset = () => {
    abort();
    data.value = null;
    loading.value = false;
    error.value = null;
    success.value = false;
    retryCount.value = 0;
    isRetrying.value = false;
  };
  
  /**
   * 执行请求
   * @param runParams 可选的运行时参数，覆盖初始参数
   * @returns 请求结果
   */
  const run = async (runParams?: P): Promise<T | null> => {
    try {
      // 取消之前的请求
      abort();
      
      // 设置状态
      loading.value = true;
      error.value = null;
      success.value = false;
      
      // 创建新的AbortController
      controller.value = new AbortController();
      
      // 设置超时
      const timeoutId = setTimeout(() => {
        abort();
        throw new Error(`请求超时（${mergedOptions.timeout}ms）`);
      }, mergedOptions.timeout);
      
      // 使用参数执行请求函数
      const finalParams = runParams !== undefined ? runParams : params;
      const result = await requestFn(finalParams);
      
      // 清除超时
      clearTimeout(timeoutId);
      
      // 设置成功状态
      data.value = result;
      success.value = true;
      
      // 执行成功回调
      mergedOptions.onSuccess?.(result);
      
      return result;
    } catch (err) {
      const errorObj = err instanceof Error ? err : new Error(String(err));
      error.value = errorObj;
      
      // 执行错误回调
      mergedOptions.onError?.(errorObj);
      
      // 如果需要重试且未达到最大重试次数
      if (
        mergedOptions.retryOnError && 
        retryCount.value < (mergedOptions.maxRetries || 0)
      ) {
        isRetrying.value = true;
        retryCount.value++;
        
        // 延迟重试
        await new Promise(resolve => setTimeout(resolve, mergedOptions.retryDelay));
        
        // 递归调用自身重试
        isRetrying.value = false;
        return run(runParams);
      }
      
      return null;
    } finally {
      // 如果不是正在重试，则设置loading为false
      if (!isRetrying.value) {
        loading.value = false;
        // 执行完成回调
        mergedOptions.onFinally?.();
      }
    }
  };
  
  // 如果设置了自动执行，则在组件挂载后自动执行请求
  if (mergedOptions.immediate) {
    onMounted(() => {
      run();
    });
  }
  
  return {
    data,
    loading,
    error,
    success,
    run,
    reset,
    retryCount,
    isRetrying
  };
}

/**
 * 批量请求Hook
 * @param requestFns API请求函数数组
 * @param options 配置选项
 * @returns 所有请求的状态和方法
 */
export function useBatchRequests<T = any>(
  requestFns: Array<() => Promise<any>>,
  options?: RequestOptions
): {
  data: Ref<T[]>;
  loading: Ref<boolean>;
  error: Ref<Error | null>;
  success: Ref<boolean>;
  run: () => Promise<T[]>;
  reset: () => void;
} {
  const mergedOptions = { ...defaultOptions, ...options };
  
  const data = ref<T[]>([]) as Ref<T[]>;
  const loading = ref(false);
  const error = ref<Error | null>(null);
  const success = ref(false);
  
  /**
   * 重置所有状态
   */
  const reset = () => {
    data.value = [];
    loading.value = false;
    error.value = null;
    success.value = false;
  };
  
  /**
   * 执行所有请求
   * @returns 所有请求的结果数组
   */
  const run = async (): Promise<T[]> => {
    try {
      loading.value = true;
      error.value = null;
      success.value = false;
      
      // 并行执行所有请求
      const results = await Promise.all(requestFns.map(fn => fn()));
      
      data.value = results;
      success.value = true;
      
      // 执行成功回调
      mergedOptions.onSuccess?.(results);
      
      return results;
    } catch (err) {
      const errorObj = err instanceof Error ? err : new Error(String(err));
      error.value = errorObj;
      
      // 执行错误回调
      mergedOptions.onError?.(errorObj);
      
      return [];
    } finally {
      loading.value = false;
      // 执行完成回调
      mergedOptions.onFinally?.();
    }
  };
  
  // 如果设置了自动执行，则在组件挂载后自动执行请求
  if (mergedOptions.immediate) {
    onMounted(() => {
      run();
    });
  }
  
  return {
    data,
    loading,
    error,
    success,
    run,
    reset
  };
} 