/**
 * 全局错误处理工具
 * @description 提供统一的错误处理机制，包括错误日志、错误提示等
 */
import { MessageApi } from 'naive-ui';

/**
 * 错误类型枚举
 */
export enum ErrorType {
  /** 网络错误 */
  NETWORK = 'NETWORK',
  /** API错误 */
  API = 'API',
  /** 业务错误 */
  BUSINESS = 'BUSINESS',
  /** 权限错误 */
  AUTH = 'AUTH',
  /** 未知错误 */
  UNKNOWN = 'UNKNOWN'
}

/**
 * 错误信息接口
 */
export interface ErrorInfo {
  /** 错误类型 */
  type: ErrorType;
  /** 错误码 */
  code?: number | string;
  /** 错误消息 */
  message: string;
  /** 原始错误对象 */
  originalError?: any;
  /** 错误详情 */
  details?: any;
}

/**
 * 创建错误信息
 * @param type 错误类型
 * @param message 错误消息
 * @param code 错误码
 * @param originalError 原始错误对象
 * @param details 错误详情
 * @returns 错误信息对象
 */
export function createError(
  type: ErrorType,
  message: string,
  code?: number | string,
  originalError?: any,
  details?: any
): ErrorInfo {
  return {
    type,
    code,
    message,
    originalError,
    details
  };
}

/**
 * 处理API错误
 * @param error 错误对象
 * @returns 格式化的错误信息
 */
export function handleApiError(error: any): ErrorInfo {
  // 网络错误
  if (!navigator.onLine) {
    return createError(
      ErrorType.NETWORK,
      '网络连接已断开，请检查网络设置',
      'OFFLINE',
      error
    );
  }

  // 请求超时
  if (error.message && error.message.includes('timeout')) {
    return createError(
      ErrorType.NETWORK,
      '请求超时，请稍后重试',
      'TIMEOUT',
      error
    );
  }

  // 请求被取消
  if (error.name === 'AbortError' || error.name === 'CanceledError') {
    return createError(
      ErrorType.API,
      '请求已取消',
      'ABORTED',
      error
    );
  }

  // API响应错误
  if (error.response) {
    const { status, data } = error.response;

    // 身份验证错误
    if (status === 401) {
      return createError(
        ErrorType.AUTH,
        '登录已过期，请重新登录',
        status,
        error,
        data
      );
    }

    // 权限错误
    if (status === 403) {
      return createError(
        ErrorType.AUTH,
        '没有权限执行此操作',
        status,
        error,
        data
      );
    }

    // 资源不存在
    if (status === 404) {
      return createError(
        ErrorType.API,
        '请求的资源不存在',
        status,
        error,
        data
      );
    }

    // 服务器错误
    if (status >= 500) {
      return createError(
        ErrorType.API,
        '服务器错误，请稍后重试',
        status,
        error,
        data
      );
    }

    // 其他API错误
    return createError(
      ErrorType.API,
      data?.message || '请求失败',
      status,
      error,
      data
    );
  }

  // 网易云API特定错误
  if (error.code !== undefined && error.code !== 200) {
    return createError(
      ErrorType.BUSINESS,
      error.msg || error.message || '操作失败',
      error.code,
      error
    );
  }

  // 未知错误
  return createError(
    ErrorType.UNKNOWN,
    error.message || '发生未知错误',
    'UNKNOWN',
    error
  );
}

/**
 * 显示错误消息
 * @param error 错误信息
 * @param message 消息API
 */
export function showErrorMessage(error: ErrorInfo, message: MessageApi) {
  // 根据错误类型显示不同样式的消息
  switch (error.type) {
    case ErrorType.NETWORK:
      message.warning(error.message);
      break;
    case ErrorType.AUTH:
      message.error(error.message);
      // 可以在这里添加重定向到登录页的逻辑
      break;
    case ErrorType.API:
    case ErrorType.BUSINESS:
      message.error(error.message);
      break;
    case ErrorType.UNKNOWN:
    default:
      message.error(error.message);
      break;
  }

  // 在开发环境下，在控制台输出详细错误信息
  if (process.env.NODE_ENV === 'development') {
    console.error('Error details:', error);
  }
}

/**
 * 全局错误处理函数
 * @param error 错误对象
 * @param message 消息API
 */
export function globalErrorHandler(error: any, message: MessageApi) {
  const errorInfo = handleApiError(error);
  showErrorMessage(errorInfo, message);
  return errorInfo;
} 