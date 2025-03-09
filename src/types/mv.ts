import type { Artist } from './artist';

/**
 * MV类型
 */
export interface MV {
  id: number;
  name: string;
  artistId: number;
  artistName: string;
  briefDesc: string;
  desc: string;
  cover: string;
  coverId: number;
  playCount: number;
  subCount: number;
  shareCount: number;
  commentCount: number;
  duration: number;
  artists: Artist[];
  publishTime: string;
  price: number | null;
  brs: {
    size: number;
    br: number;
    point: number;
  }[];
}

/**
 * MV URL类型
 */
export interface MVUrl {
  id: number;
  url: string;
  r: number;
  size: number;
  md5: string;
  code: number;
  expi: number;
  fee: number;
  mvFee: number;
  st: number;
  promotionVo: any | null;
  msg: string;
}

/**
 * MV详情类型
 */
export interface MVDetail extends MV {
  likedCount: number;
  liked: boolean;
  commentThreadId: string;
  videoGroup: Array<{
    id: number;
    name: string;
    type: number;
  }>;
}

/**
 * 全部MV参数
 */
export interface AllMVParams {
  area?: string; // 地区,可选值为全部,内地,港台,欧美,日本,韩国,不填则为全部
  type?: string; // 类型,可选值为全部,官方版,原生,现场版,网易出品,不填则为全部
  order?: string; // 排序,可选值为上升最快,最热,最新,不填则为上升最快
  limit?: number;
  offset?: number;
}