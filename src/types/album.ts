/**
 * 专辑类型定义
 * @description 导出统一的专辑相关类型，保持向后兼容
 * @deprecated 这个文件已经被弃用，请直接使用 './models/music' 中的类型定义
 */

// 从统一的类型定义中重新导出
export { Album } from './models/music';

// 额外的专辑相关类型，后续也应该迁移到统一的地方
import type { Artist } from './models/music';

/**
 * 专辑详情
 */
export interface AlbumDetail {
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
  info?: {
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