 /**
 * 用户状态管理相关的类型定义
 * @description 包含用户状态、登录信息等类型定义
 */
import { UserProfile, UserState } from '../models/user';

/**
 * 用户操作类型
 */
export interface UserActions {
  /** 设置登录状态 */
  setLoginState: (state: boolean) => void;
  /** 设置用户资料 */
  setProfile: (profile: UserProfile) => void;
  /** 设置登录Cookie */
  setCookie: (cookie: string) => void;
  /** 登录操作 */
  login: (params: {
    username: string;
    password: string;
    type: number;
  }) => Promise<boolean>;
  /** 登出操作 */
  logout: () => void;
  /** 检查登录状态 */
  checkLoginStatus: () => Promise<boolean>;
}