/**
 * API通用类型定义
 * @description 所有API请求和响应的通用类型
 */

/**
 * API通用响应格式
 */
export interface ApiResponse<T = any> {
  /** 状态码，200表示成功 */
  code: number;
  /** 响应消息 */
  message?: string;
  /** 响应数据 */
  data?: T;
  /** 错误消息 */
  msg?: string;
} 