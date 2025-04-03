/**
 * HTTP请求工具
 * @description 基于axios封装的HTTP请求工具，支持请求缓存和错误处理
 */
import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosError } from 'axios';
import { message } from 'ant-design-vue';
import { useUserStore } from '@/stores/user';
import { getCacheData, setCacheData } from './apiCache';
import { handleApiError, globalErrorHandler, ErrorType, createError } from './errorHandler';

/**
 * 默认请求配置
 */
const DEFAULT_CONFIG: AxiosRequestConfig = {
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 15000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json;charset=UTF-8'
  }
};

/**
 * 创建axios实例
 */
const request: AxiosInstance = axios.create(DEFAULT_CONFIG);

/**
 * 请求拦截器
 */
request.interceptors.request.use(
  (config) => {
    // 添加用户凭证
    const userStore = useUserStore();
    if (userStore.cookie) {
      config.params = { ...config.params, cookie: userStore.cookie };
    }

    // 开发环境打印请求信息
    if (import.meta.env.DEV) {
      console.log(`🚀 请求: ${config.method?.toUpperCase()} ${config.url}`, config.params || config.data || {});
    }

    return config;
  },
  (error) => {
    // 请求错误处理
    const errorInfo = createError(
      ErrorType.API,
      '请求配置错误',
      'REQUEST_ERROR',
      error
    );
    globalErrorHandler(errorInfo, message);
    return Promise.reject(error);
  }
);

/**
 * 响应拦截器
 */
request.interceptors.response.use(
  (response) => {
    // 网易云API错误处理
    const data = response.data;

    // 网易云API返回code不为200时，视为业务错误
    if (data && data.code !== undefined && data.code !== 200) {
      const errorInfo = createError(
        ErrorType.BUSINESS,
        data.msg || '操作失败',
        data.code,
        data
      );
      globalErrorHandler(errorInfo, message);
      return Promise.reject(errorInfo);
    }

    return data;
  },
  (error: AxiosError) => {
    // 使用统一的错误处理
    const errorInfo = handleApiError(error);
    globalErrorHandler(errorInfo, message);
    return Promise.reject(errorInfo);
  }
);

/**
 * GET请求
 * @param url 请求地址
 * @param params 请求参数
 * @param config 额外的请求配置
 * @returns 请求Promise
 */
export function get<T = any>(
  url: string,
  params?: Record<string, any>,
  config?: AxiosRequestConfig
): Promise<T> {
  return request.get(url, { ...config, params });
}

/**
 * POST请求
 * @param url 请求地址
 * @param data 请求数据
 * @param config 额外的请求配置
 * @returns 请求Promise
 */
export function post<T = any>(
  url: string,
  data?: any,
  config?: AxiosRequestConfig
): Promise<T> {
  return request.post(url, data, config);
}

/**
 * 带缓存的GET请求
 * @param url 请求地址
 * @param params 请求参数
 * @param ttl 缓存时间（毫秒）
 * @param config 额外的请求配置
 * @returns 请求Promise
 */
export function getCached<T = any>(
  url: string,
  params?: Record<string, any>,
  ttl = 5 * 60 * 1000,
  config?: AxiosRequestConfig
): Promise<T> {
  const cacheKey = `${url}?${JSON.stringify(params)}`;
  const cachedData = getCacheData<T>(cacheKey);

  if (cachedData) {
    return Promise.resolve(cachedData);
  }

  return get<T>(url, params, config).then((data) => {
    setCacheData(cacheKey, data, ttl);
    return data;
  });
}

/**
 * 批量请求
 * @param requests 请求Promise数组
 * @returns 所有请求的结果数组
 */
export function batchRequests<T = any>(requests: Promise<any>[]): Promise<T[]> {
  return Promise.all(requests);
}

// 导出默认实例
export default request;