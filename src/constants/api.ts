 /**
 * API相关常量
 * @description 定义API接口地址和常量
 */

/**
 * API基础URL配置
 */
export const API_BASE_URL = {
    /** 默认API地址 */
    DEFAULT: 'https://netease-cloud-music-api.vercel.app',
    /** 备用API地址 */
    BACKUP: 'https://autumnfish.cn'
  };
  
  /**
   * API超时时间（毫秒）
   */
  export const API_TIMEOUT = 10000;
  
  /**
   * API请求方法枚举
   */
  export enum RequestMethod {
    /** GET请求 */
    GET = 'get',
    /** POST请求 */
    POST = 'post',
    /** PUT请求 */
    PUT = 'put',
    /** DELETE请求 */
    DELETE = 'delete'
  }
  
  /**
   * 本地存储键名
   */
  export const STORAGE_KEY = {
    /** 用户Cookie */
    USER_COOKIE: 'user_cookie',
    /** 用户信息 */
    USER_PROFILE: 'user_profile',
    /** 登录状态 */
    LOGIN_STATE: 'login_state',
    /** 播放列表 */
    PLAYLIST: 'playlist',
    /** 播放历史 */
    PLAY_HISTORY: 'play_history',
    /** 主题设置 */
    THEME: 'theme'
  };