/**
 * 音乐API相关的类型定义
 * @description 包含音乐API请求参数和响应数据的类型定义
 */
import { Song, Album, Artist } from '../models/song';
// 不再导入playlist相关类型，避免重复定义
// import { Playlist, RecommendPlaylist } from '../models/playlist';
import { ApiResponse } from './common';
import { 
  RecommendPlaylistResponse, 
  PlaylistDetailResponse, 
  PlaylistTracksResponse 
} from './playlist';

/**
 * 轮播图响应类型
 */
export interface BannerResponse extends ApiResponse {
  /** 轮播图列表 */
  banners: Array<{
    /** 图片链接 */
    imageUrl: string;
    /** 目标链接 */
    targetId: number;
    /** 广告ID */
    adid: string | null;
    /** 目标类型 */
    targetType: number;
    /** 标题 */
    titleColor: string;
    /** 类型 */
    typeTitle: string;
    /** 是否独家 */
    exclusive: boolean;
    /** 跳转地址 */
    url: string | null;
    /** 背景颜色 */
    backgroundColor?: string;
  }>;
}

/**
 * 获取歌曲URL响应类型
 */
export interface SongUrlResponse extends ApiResponse {
  /** 数据 */
  data: Array<{
    /** 歌曲ID */
    id: number;
    /** 歌曲URL */
    url: string;
    /** 码率 */
    br: number;
    /** 大小 */
    size: number;
    /** 类型 */
    type: string;
    /** 播放时间 */
    time: number;
    /** 编码类型 */
    encodeType: string;
  }>;
}