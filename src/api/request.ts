import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from "axios";
import { API_BASE_URL, API_TIMEOUT, STORAGE_KEY } from '@/constants/api';
import { ApiResponse } from '@/types';
import { getStorage } from '@/utils';

/**
 * axios请求配置接口，扩展AxiosRequestConfig
 */
export interface RequestConfig extends AxiosRequestConfig {
  /** 是否启用重试机制 */
  retry?: boolean;
  /** 最大重试次数 */
  retryCount?: number;
  /** 重试延迟(ms) */
  retryDelay?: number;
  /** 是否使用缓存 */
  useCache?: boolean;
  /** 缓存有效期(ms) */
  cacheTime?: number;
}

/**
 * 创建axios实例
 * @description 配置了baseURL、超时时间、跨域携带cookie等
 */
const service = axios.create({
  // 使用常量中定义的API地址
  baseURL: API_BASE_URL.DEFAULT,
  timeout: API_TIMEOUT,
  withCredentials: true, // 允许跨域携带cookie
});

/**
 * 请求拦截器
 * @description 在请求发送前，添加token、cookie等认证信息
 */
service.interceptors.request.use(
  (config) => {
    // 添加请求日志（生产环境可考虑移除）
    if (process.env.NODE_ENV === 'development') {
      console.info("请求:", config.url, config.params || config.data);
    }

    // 从localStorage获取cookie并添加到请求参数中
    const cookie = getStorage<string>(STORAGE_KEY.USER_COOKIE);
    if (cookie) {
      // 将cookie添加到请求参数中
      if (config.method?.toLowerCase() === "get") {
        config.params = { ...config.params, cookie };
      } else {
        config.data = { ...config.data, cookie };
      }
    }

    return config;
  },
  (error) => {
    console.error("请求错误:", error);
    return Promise.reject(error);
  }
);

/**
 * 响应拦截器
 * @description 统一处理响应数据和错误
 */
service.interceptors.response.use(
  (response) => {
    // 添加响应日志（生产环境可考虑移除）
    if (process.env.NODE_ENV === 'development') {
      console.info("响应:", response.config.url, response.data);
    }

    const res = response.data;

    // 统一处理错误状态码
    if (res.code !== 200 && res.code !== undefined) {
      const errorMsg = res.msg || res.message || "API请求错误";

      // 处理特定错误码
      switch (res.code) {
        case 301: // 需要登录
          console.warn("需要登录:", errorMsg);
          // 可以在这里添加跳转到登录页的逻辑
          break;
        case 400: // 请求参数错误
          console.error("请求参数错误:", errorMsg);
          break;
        case 404: // 资源不存在
          console.error("资源不存在:", errorMsg);
          break;
        case 501: // 服务器错误
        case 502:
        case 503:
          console.error("服务器错误:", errorMsg);
          break;
        default:
          console.error("API错误:", errorMsg);
      }

      return Promise.reject(new Error(errorMsg));
    }

    return res;
  },
  (error: AxiosError) => {
    // 网络错误处理
    if (error.response) {
      // 服务器返回了错误状态码
      console.error("HTTP错误:", error.response.status, error.message);
    } else if (error.request) {
      // 请求已发出但没有收到响应
      console.error("网络错误: 没有收到响应", error.message);
    } else {
      // 请求配置出错
      console.error("请求配置错误:", error.message);
    }
    return Promise.reject(error);
  }
);

/**
 * 封装的请求方法
 * @param config 请求配置
 * @returns Promise<T> 返回请求结果
 */
export default function request<T = any>(config: RequestConfig): Promise<T> {
  return service(config) as Promise<T>;
}

/**
 * GET请求快捷方法
 * @param url 请求地址
 * @param params 请求参数
 * @param config 其他配置
 * @returns Promise<T> 返回请求结果
 */
export function get<T = any>(url: string, params?: any, config?: RequestConfig): Promise<T> {
  return request<T>({
    url,
    method: 'get',
    params,
    ...config
  });
}

/**
 * POST请求快捷方法
 * @param url 请求地址
 * @param data 请求数据
 * @param config 其他配置
 * @returns Promise<T> 返回请求结果
 */
export function post<T = any>(url: string, data?: any, config?: RequestConfig): Promise<T> {
  return request<T>({
    url,
    method: 'post',
    data,
    ...config
  });
}