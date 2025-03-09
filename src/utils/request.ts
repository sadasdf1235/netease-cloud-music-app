import axios, { type AxiosInstance, type AxiosRequestConfig } from 'axios';
import { message } from 'ant-design-vue';
import { useUserStore } from '@/stores/user';
import { getCacheData, setCacheData } from './apiCache';

// 创建axios实例
const request: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 15000,
  withCredentials: true
});

// 请求拦截器
request.interceptors.request.use(
  (config) => {
    const userStore = useUserStore();
    if (userStore.cookie) {
      config.params = { ...config.params, cookie: userStore.cookie };
    }
    return config;
  },
  (error) => {
    message.error('请求发送失败');
    return Promise.reject(error);
  }
);

// 响应拦截器
request.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          message.error('未授权，请登录');
          break;
        case 403:
          message.error('拒绝访问');
          break;
        case 404:
          message.error('请求地址出错');
          break;
        case 500:
          message.error('服务器内部错误');
          break;
        default:
          message.error('未知错误');
      }
    } else {
      message.error('网络异常');
    }
    return Promise.reject(error);
  }
);

/**
 * GET请求
 * @param url 请求地址
 * @param params 请求参数
 */
export function get<T>(url: string, params?: Record<string, any>): Promise<T> {
  return request.get(url, { params });
}

/**
 * POST请求
 * @param url 请求地址
 * @param data 请求数据
 * @param config 请求配置
 */
export function post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
  return request.post(url, data, config);
}

/**
 * 带缓存的GET请求
 * @param url 请求地址
 * @param params 请求参数
 * @param ttl 缓存时间（毫秒）
 */
export function getCached<T>(url: string, params?: Record<string, any>, ttl = 5 * 60 * 1000): Promise<T> {
  const cacheKey = `${url}?${JSON.stringify(params)}`;
  const cachedData = getCacheData<T>(cacheKey);

  if (cachedData) {
    return Promise.resolve(cachedData);
  }

  return get<T>(url, params).then((data) => {
    setCacheData(cacheKey, data, ttl);
    return data;
  });
}

export default request;