/**
 * 专辑相关类型定义
 */

import type { Artist } from './artist';

/**
 * 专辑信息
 */
export interface Album {
  id: number;
  name: string;
  picUrl: string;
  artist: Artist;
  artists: Artist[];
  description?: string;
  publishTime: number;
  size: number;
  company?: string;
  type?: string;
  tags?: string[];
  paid: boolean;
  onSale: boolean;
}

/**
 * 专辑详情
 */
export interface AlbumDetail extends Album {
  info: {
    commentCount: number;
    shareCount: number;
    likedCount: number;
  };
}

/**
 * 专辑动态信息
 */
export interface AlbumDynamic {
  commentCount: number;
  shareCount: number;
  subCount: number;
  likedCount: number;
  isSub: boolean;
  playCount: number;
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