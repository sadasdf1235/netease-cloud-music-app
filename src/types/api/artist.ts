/**
 * 艺术家API相关的类型定义
 * @description 包含艺术家API请求参数和响应数据的类型定义
 */
import type { Artist, Album, Song } from '../models/song';

/**
 * 艺术家详情响应类型
 */
export interface ArtistDetailResponse {
  /** 艺术家信息 */
  artist: Artist & {
    /** 艺术家简介 */
    briefDesc: string;
    /** 艺术家头像 */
    cover: string;
    /** 单曲数 */
    musicSize: number;
    /** 专辑数 */
    albumSize: number;
    /** MV数 */
    mvSize: number;
  };
  /** 是否关注 */
  followed: boolean;
  /** 相似艺术家 */
  similarities?: Artist[];
  /** 热门歌曲 */
  hotSongs?: Song[];
  /** 状态码 */
  code: number;
}

/**
 * 艺术家歌曲响应类型
 */
export interface ArtistSongsResponse {
  /** 艺术家信息 */
  artist: Artist;
  /** 热门歌曲 */
  songs: Song[];
  /** 状态码 */
  code: number;
}

/**
 * 艺术家专辑响应类型
 */
export interface ArtistAlbumsResponse {
  /** 艺术家信息 */
  artist: Artist;
  /** 专辑列表 */
  hotAlbums: Album[];
  /** 更多专辑 */
  more: boolean;
  /** 状态码 */
  code: number;
}

/**
 * 艺术家MV响应类型
 */
export interface ArtistMVResponse {
  /** MV列表 */
  mvs: {
    /** MV ID */
    id: number;
    /** MV名称 */
    name: string;
    /** 艺术家名称 */
    artistName: string;
    /** 艺术家ID */
    artistId: number;
    /** 封面图片 */
    imgurl: string;
    /** 发布时间 */
    publishTime: string;
    /** 播放次数 */
    playCount: number;
    /** 时长 */
    duration: number;
  }[];
  /** 是否有更多 */
  hasMore: boolean;
  /** 状态码 */
  code: number;
}

/**
 * 相似艺术家响应类型
 */
export interface SimilarArtistsResponse {
  /** 艺术家列表 */
  artists: Artist[];
  /** 状态码 */
  code: number;
}

/**
 * 艺术家分类列表参数类型
 */
export interface ArtistListParams {
  /** 类型: -1:全部, 1:男歌手, 2:女歌手, 3:乐队 */
  type?: number;
  /** 地区: -1:全部, 7华语, 96欧美, 8:日本, 16韩国, 0:其他 */
  area?: number;
  /** 按首字母索引查找参数: 热门传-1, #传0, A-Z传对应字母 */
  initial?: number | string;
  /** 取出数量 */
  limit?: number;
  /** 偏移数量，用于分页 */
  offset?: number;
}

/**
 * 艺术家分类列表响应类型
 */
export interface ArtistListResponse {
  /** 艺术家列表 */
  artists: Artist[];
  /** 更多艺术家 */
  more: boolean;
  /** 状态码 */
  code: number;
}

/**
 * 热门艺术家响应类型
 */
export interface TopArtistsResponse {
  /** 艺术家列表 */
  artists: Artist[];
  /** 更多艺术家 */
  more: boolean;
  /** 状态码 */
  code: number;
}