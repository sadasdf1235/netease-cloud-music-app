/**
 * 歌曲相关类型定义
 */

/**
 * 歌手信息
 */
export interface Artist {
  /** 歌手ID */
  id: number;
  /** 歌手姓名 */
  name: string;
  /** 歌手头像 */
  picUrl?: string;
  /** 别名 */
  alias?: string[];
}

/**
 * 专辑信息
 */
export interface Album {
  /** 专辑ID */
  id: number;
  /** 专辑名称 */
  name: string;
  /** 专辑封面 */
  picUrl: string;
  /** 发行时间 */
  publishTime?: number;
  /** 歌手 */
  artists?: Artist[];
}

/**
 * 歌曲信息
 */
export interface Track {
  /** 歌曲ID */
  id: number;
  /** 歌曲名称 */
  name: string;
  /** 歌手 */
  ar: Artist[];
  /** 专辑 */
  al: Album;
  /** 时长(毫秒) */
  dt: number;
  /** 歌曲来源 */
  source?: string;
  /** 歌曲URL */
  url?: string;
  /** 是否有版权 */
  fee?: number;
  /** 是否喜欢 */
  liked?: boolean;
  /** 歌词 */
  lyrics?: string;
  /** VIP信息 */
  vip?: {
    type: number;
    desc: string;
  };
  /** 歌曲热度 */
  popularity?: number;
  /** 歌曲评论数 */
  commentCount?: number;
} 