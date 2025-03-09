/**
 * 歌单相关API的类型定义
 * @description 包含歌单API请求参数和响应数据的类型定义
 */
import { Playlist, RecommendPlaylist, PlaylistCategory } from '@/types/models/playlist';
import { Song } from '@/types/models/song';
import { ApiResponse } from './common';

/**
 * 推荐歌单响应类型
 */
export interface RecommendPlaylistResponse extends ApiResponse {
  /** 推荐歌单列表 */
  result: RecommendPlaylist[];
}

/**
 * 歌单详情响应类型
 */
export interface PlaylistDetailResponse extends ApiResponse {
  /** 歌单详情 */
  playlist: Playlist;
  /** 歌单权限 */
  privileges?: any[];
}

/**
 * 歌单歌曲响应类型
 */
export interface PlaylistTracksResponse extends ApiResponse {
  /** 歌曲列表 */
  songs: Song[];
  /** 歌曲权限 */
  privileges?: any[];
}

/**
 * 热门歌单分类响应类型
 */
export interface HotPlaylistCategoriesResponse extends ApiResponse {
  /** 热门歌单分类列表 */
  tags: Array<{
    /** 分类ID */
    id: number;
    /** 分类名称 */
    name: string;
    /** 分类热度 */
    hot: boolean;
  }>;
}

/**
 * 所有歌单分类响应类型
 */
export interface PlaylistCategoriesResponse extends ApiResponse {
  /** 所有分类 */
  categories: Record<string, string>;
  /** 分类列表 */
  sub: PlaylistCategory[];
}

/**
 * 歌单列表响应类型
 */
export interface TopPlaylistsResponse extends ApiResponse {
  /** 歌单列表 */
  playlists: Playlist[];
  /** 总数 */
  total: number;
  /** 更多 */
  more: boolean;
  /** 分类名称 */
  cat: string;
}

/**
 * 歌单收藏/取消收藏响应类型
 */
export interface SubscribePlaylistResponse extends ApiResponse {
  /** 收藏状态 */
  subscribed: boolean;
}

/**
 * 用户歌单响应类型
 */
export interface UserPlaylistsResponse extends ApiResponse {
  /** 用户歌单列表 */
  playlist: Playlist[];
  /** 更多 */
  more: boolean;
}

/**
 * 歌单评论响应类型
 */
export interface PlaylistCommentsResponse extends ApiResponse {
  /** 评论列表 */
  comments: any[];
  /** 热门评论 */
  hotComments?: any[];
  /** 总数 */
  total: number;
  /** 更多 */
  more: boolean;
} 