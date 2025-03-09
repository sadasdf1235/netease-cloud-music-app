// 用户个人信息
export interface UserProfile {
  userId: number;
  nickname: string;
  avatarUrl: string;
  backgroundUrl?: string;
  signature?: string;
  followeds?: number; // 粉丝数
  follows?: number; // 关注数
  playlistCount?: number; // 创建的歌单数
  level?: number; // 等级
  vipType?: number; // VIP类型
  createTime?: number;
  createDays?: number;
  birthday?: number;
  gender?: number;
  city?: number;
  province?: number;
}

// 登录参数
export interface LoginParams {
  phone: string;
  password: string;
  countrycode?: string;
}

// 登录响应
export interface LoginResponse {
  code: number;
  token: string;
  profile: UserProfile;
  cookie: string;
}

// 用户设置
export interface UserSettings {
  theme: 'light' | 'dark' | 'auto';
  quality: 'standard' | 'higher' | 'exhigh';
  volume: number;
  notification: boolean;
}