/**
 * 专辑API相关的类型定义
 * @description 包含专辑API请求参数和响应数据的类型定义
 */
import type { Album, Artist } from '../models/song';

/**
 * 专辑详情响应类型
 */
export interface AlbumDetailResponse {
  /** 专辑信息 */
  album: Album;
  /** 歌曲列表 */
  songs: {
    /** 歌曲ID */
    id: number;
    /** 歌曲名称 */
    name: string;
    /** 歌手信息 */
    ar: Artist[];
    /** 专辑信息 */
    al: Album;
    /** 歌曲时长 */
    dt: number;
  }[];
  /** 状态码 */
  code: number;
}

/**
 * 新碟上架参数类型
 */
export interface NewAlbumsParams {
  /** 地区类型 ALL:全部,ZH:华语,EA:欧美,KR:韩国,JP:日本 */
  area?: string;
  /** 取出数量 */
  limit?: number;
  /** 偏移数量，用于分页 */
  offset?: number;
}

/**
 * 新碟上架响应类型
 */
export interface NewAlbumsResponse {
  /** 专辑列表 */
  albums: Album[];
  /** 专辑总数 */
  total: number;
  /** 状态码 */
  code: number;
}

/**
 * 相关专辑响应类型
 */
export interface RelatedAlbumsResponse {
  /** 相关专辑列表 */
  albums: Album[];
  /** 状态码 */
  code: number;
}

/**
 * 专辑评论响应类型
 */
export interface AlbumCommentsResponse {
  /** 评论列表 */
  comments: {
    /** 评论ID */
    commentId: number;
    /** 用户信息 */
    user: {
      /** 用户ID */
      userId: number;
      /** 用户昵称 */
      nickname: string;
      /** 用户头像 */
      avatarUrl: string;
    };
    /** 评论内容 */
    content: string;
    /** 评论时间 */
    time: number;
    /** 点赞数 */
    likedCount: number;
    /** 回复数 */
    replyCount: number;
  }[];
  /** 热门评论列表 */
  hotComments?: {
    /** 评论ID */
    commentId: number;
    /** 用户信息 */
    user: {
      /** 用户ID */
      userId: number;
      /** 用户昵称 */
      nickname: string;
      /** 用户头像 */
      avatarUrl: string;
    };
    /** 评论内容 */
    content: string;
    /** 评论时间 */
    time: number;
    /** 点赞数 */
    likedCount: number;
    /** 回复数 */
    replyCount: number;
  }[];
  /** 评论总数 */
  total: number;
  /** 是否更多 */
  more: boolean;
  /** 状态码 */
  code: number;
}