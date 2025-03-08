 /**
 * 用户相关模型的类型定义
 * @description 包含用户基本信息、登录状态等类型定义
 */

/**
 * 用户资料类型
 */
export interface UserProfile {
    /** 用户ID */
    userId: number;
    /** 用户昵称 */
    nickname: string;
    /** 用户头像URL */
    avatarUrl: string;
    /** 用户背景图URL */
    backgroundUrl?: string;
    /** 用户签名 */
    signature?: string;
    /** 用户性别（1男性，2女性，0未知） */
    gender?: number;
    /** 用户关注数 */
    follows?: number;
    /** 用户粉丝数 */
    followeds?: number;
    /** 用户等级 */
    level?: number;
    /** VIP类型 */
    vipType?: number;
  }
  
  /**
   * 用户状态类型
   */
  export interface UserState {
    /** 是否已登录 */
    isLoggedIn: boolean;
    /** 登录令牌 */
    token?: string;
    /** 用户资料 */
    profile?: UserProfile;
    /** 登录时间戳 */
    loginTime?: number;
    /** Cookie字符串 */
    cookie?: string;
  }
  
  /**
   * 登录参数类型
   */
  export interface LoginParams {
    /** 手机号码或邮箱 */
    username: string;
    /** 密码或验证码 */
    password: string;
    /** 登录类型：1表示手机号登录，2表示邮箱登录 */
    type: number;
  }