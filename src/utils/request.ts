import axios from 'axios';
import type { AxiosInstance, AxiosRequestConfig } from 'axios';
import { message } from 'ant-design-vue';
import apiCache, { withCache } from './apiCache';
import { useUserStore } from '@/stores/user';

// 创建axios实例
const request: AxiosInstance = axios.create({
  baseURL: 'http://localhost:3000', // 本地开发环境
  timeout: 15000, // 请求超时时间
  withCredentials: true // 允许跨域携带cookie
});

// 请求拦截器
request.interceptors.request.use(
  (config) => {
    // 在发送请求之前做些什么
    const userStore = useUserStore();
    if (userStore.cookie) {
      config.params = { ...config.params, cookie: userStore.cookie };
    }
    return config;
  },
  (error) => {
    // 对请求错误做些什么
    message.error('请求发送失败');
    return Promise.reject(error);
  }
);

// 响应拦截器
request.interceptors.response.use(
  (response) => {
    // 对响应数据做点什么
    return response.data;
  },
  (error) => {
    // 对响应错误做点什么
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
 * @param config 配置项
 * @returns Promise
 */
export function get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
  return request.get<any, T>(url, config);
}

/**
 * POST请求
 * @param url 请求地址
 * @param data 请求数据
 * @param config 配置项
 * @returns Promise
 */
export function post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
  return request.post<any, T>(url, data, config);
}

/**
 * 带缓存的GET请求
 * @param url 请求地址
 * @param config 配置项
 * @returns Promise
 */
export function getCached<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
  return withCache<T>(`${url}${config?.params ? JSON.stringify(config.params) : ''}`)(
    () => get<T>(url, config)
  );
}

export default request;