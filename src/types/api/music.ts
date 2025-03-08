 /**
 * 音乐API相关的类型定义
 * @description 包含音乐API请求参数和响应数据的类型定义
 */
import { Song, Album, Artist } from '../models/song';
import { Playlist, RecommendPlaylist } from '../models/playlist';

/**
 * API通用响应格式
 */
export interface ApiResponse<T> {
  /** 状态码，200表示成功 */
  code: number;
  /** 响应消息 */
  message?: string;
  /** 响应数据 */
  data?: T;
  /** 错误消息 */
  msg?: string;
}

/**
 * 轮播图响应类型
 */
export interface BannerResponse {
  /** 轮播图列表 */
  banners: Array<{
    /** 图片链接 */
    imageUrl: string;
    /** 目标链接 */
    url?: string;
    /** 标题 */
    titleColor: string;
    /** 类型标题 */
    typeTitle: string;
    /** 类型 */
    targetType: number;
    /** 目标ID */
    targetId: number;
  }>;
  /** 状态码 */
  code: number;
}

/**
 * 推荐歌单响应类型
 */
export interface RecommendPlaylistResponse {
  /** 推荐歌单列表 */
  result: RecommendPlaylist[];
  /** 状态码 */
  code: number;
}

/**
 * 歌单详情响应类型
 */
export interface PlaylistDetailResponse {
  /** 歌单信息 */
  playlist: Playlist;
  /** 权限信息 */
  privileges?: any[];
  /** 状态码 */
  code: number;
}

/**
 * 歌单歌曲响应类型
 */
export interface PlaylistTracksResponse {
  /** 歌曲列表 */
  songs: Song[];
  /** 权限信息 */
  privileges?: any[];
  /** 状态码 */
  code: number;
}

/**
 * 获取歌曲URL响应类型
 */
export interface SongUrlResponse {
  /** 歌曲URL数据 */
  data: Array<{
    /** 歌曲ID */
    id: number;
    /** 播放链接 */
    url: string;
    /** 码率 */
    br: number;
    /** 大小 */
    size: number;
    /** 类型 */
    type: string;
  }>;
  /** 状态码 */
  code: number;
}