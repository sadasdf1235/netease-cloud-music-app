 /**
 * 用户API相关的类型定义
 * @description 包含用户登录、资料相关API的请求参数和响应数据的类型定义
 */
import { UserProfile } from '../models/user';

/**
 * 手机号登录参数类型
 */
export interface PhoneLoginParams {
  /** 手机号码 */
  phone: string;
  /** 密码 */
  password: string;
  /** 国家区号 */
  countrycode?: string;
}

/**
 * 邮箱登录参数类型
 */
export interface EmailLoginParams {
  /** 邮箱地址 */
  email: string;
  /** 密码 */
  password: string;
}

/**
 * 登录响应类型
 */
export interface LoginResponse {
  /** 登录状态码 */
  code: number;
  /** 登录token */
  token?: string;
  /** 登录Cookie */
  cookie?: string;
  /** 账号信息 */
  account?: {
    /** 账号ID */
    id: number;
    /** 用户名 */
    userName: string;
    /** 类型 */
    type: number;
    /** 状态 */
    status: number;
  };
  /** 用户资料 */
  profile?: UserProfile;
  /** 绑定信息 */
  bindings?: any[];
}

/**
 * 用户详情响应类型
 */
export interface UserDetailResponse {
  /** 状态码 */
  code: number;
  /** 用户资料信息 */
  profile: UserProfile;
  /** 用户等级信息 */
  level?: number;
  /** 听歌记录 */
  listenSongs?: number;
  /** 创建的歌单 */
  createDays?: number;
  /** 创建的电台 */
  createTime?: number;
}

/**
 * 用户歌单响应类型
 */
export interface UserPlaylistResponse {
  /** 状态码 */
  code: number;
  /** 更多信息 */
  more: boolean;
  /** 歌单列表 */
  playlist: Array<{
    /** 歌单ID */
    id: number;
    /** 歌单名称 */
    name: string;
    /** 歌单封面 */
    coverImgUrl: string;
    /** 创建者 */
    creator: {
      /** 用户ID */
      userId: number;
      /** 用户昵称 */
      nickname: string;
    };
    /** 歌曲数量 */
    trackCount: number;
    /** 播放次数 */
    playCount: number;
    /** 创建时间 */
    createTime: number;
  }>;
}