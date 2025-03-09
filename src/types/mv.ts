import type { Artist } from './artist';

/**
 * MV相关类型定义
 */

/**
 * MV 基础信息
 */
export interface MV {
  id: number;
  name: string;
  artistId: number;
  artistName: string;
  briefDesc: string;
  desc: string;
  cover: string;
  playCount: number;
  duration: number;
  publishTime: string;
  subed: boolean;
}

/**
 * MV URL 信息
 */
export interface MVUrl {
  id: number;
  url: string;
  r: number;
  size: number;
  md5: string;
}

/**
 * MV 详情
 */
export interface MVDetail extends MV {
  commentCount: number;
  shareCount: number;
  likeCount: number;
  subCount: number;
  artists: Array<{
    id: number;
    name: string;
    img1v1Url: string;
  }>;
  videoGroup: Array<{
    id: number;
    name: string;
  }>;
}

/**
 * 相似 MV
 */
export interface RelatedMV {
  id: number;
  name: string;
  cover: string;
  playCount: number;
  duration: number;
  artistId: number;
  artistName: string;
}

/**
 * MV筛选参数
 */
export interface MVParams {
  area?: string;
  type?: string;
  order?: string;
  limit?: number;
  offset?: number;
}