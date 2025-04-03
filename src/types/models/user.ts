/**
 * 用户相关类型定义
 */

// 用户基本信息
export interface UserProfile {
  userId: number;
  nickname: string;
  avatarUrl: string;
  gender: number;
  birthday: number;
  region: string[];
  signature: string;
  level: number;
  follows: number;
  followeds: number;
  vipType: number;
}

// 歌单信息
export interface Playlist {
  id: number;
  name: string;
  coverImgUrl: string;
  trackCount: number;
  creator: {
    userId: number;
    nickname: string;
  };
}

// 听歌排行数据
export interface ListenRankItem {
  song: {
    id: number;
    name: string;
    ar: Array<{
      id: number;
      name: string;
      avatarUrl?: string;
    }>;
    al: {
      picUrl: string;
    };
  };
  playCount: number;
}

// 听歌排行响应
export interface ListenRankResponse {
  weekData: ListenRankItem[];
  allData: ListenRankItem[];
}

// 用户歌单响应
export interface UserPlaylistsResponse {
  playlist: Playlist[];
}

// 音乐风格
export interface MusicStyle {
  name: string;
  percentage: number;
}

// 听歌时间分布
export interface TimeDistribution {
  label: string;
  value: string;
}

// 常听歌手
export interface TopArtist {
  id: number;
  name: string;
  avatarUrl: string;
  playCount: number;
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