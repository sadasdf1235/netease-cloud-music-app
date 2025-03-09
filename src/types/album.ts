import type { Artist } from './artist';

/**
 * 专辑类型
 */
export interface Album {
  id: number;
  name: string;
  picUrl: string;
  artist: Artist;
  artists: Artist[];
  publishTime: number;
  size: number;
  songs?: number;
  description?: string;
  company?: string;
  subType?: string;
  type?: string;
  tags?: string[];
  alias?: string[];
  liked?: boolean;
}

/**
 * 专辑详情类型
 */
export interface AlbumDetail extends Album {
  info: {
    commentCount: number;
    shareCount: number;
    likedCount: number;
    liked: boolean;
  };
  songs: number;
  description: string;
  company: string;
  briefDesc: string;
}

/**
 * 专辑动态信息类型
 */
export interface AlbumDynamic {
  commentCount: number;
  shareCount: number;
  likedCount: number;
  liked: boolean;
  subCount: number;
  subscribed: boolean;
}

/**
 * 新专辑筛选参数
 */
export interface NewAlbumParams {
  limit?: number;
  offset?: number;
  area?: string;
  type?: string;
  year?: number;
  month?: number;
}