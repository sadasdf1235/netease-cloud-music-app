/**
 * 搜索API相关的类型定义
 * @description 包含搜索API请求参数和响应数据的类型定义
 */
import type { Song, Album, Artist } from '../models/song';
import type { Playlist } from '../models/playlist';

/**
 * 搜索类型枚举
 */
export enum SearchType {
  /** 单曲 */
  SONG = 1,
  /** 专辑 */
  ALBUM = 10,
  /** 歌手 */
  ARTIST = 100,
  /** 歌单 */
  PLAYLIST = 1000,
  /** 用户 */
  USER = 1002,
  /** MV */
  MV = 1004,
  /** 歌词 */
  LYRIC = 1006,
  /** 电台 */
  RADIO = 1009,
  /** 视频 */
  VIDEO = 1014,
  /** 综合 */
  COMPREHENSIVE = 1018
}

/**
 * 搜索参数类型
 */
export interface SearchParams {
  /** 搜索关键词 */
  keywords: string;
  /** 搜索类型 */
  type?: SearchType;
  /** 取出数量 */
  limit?: number;
  /** 偏移数量，用于分页 */
  offset?: number;
}

/**
 * 搜索结果类型
 */
export interface SearchResponse {
  /** 结果列表 */
  result: {
    /** 歌曲列表 */
    songs?: Song[];
    /** 歌曲计数 */
    songCount?: number;
    /** 专辑列表 */
    albums?: Album[];
    /** 专辑计数 */
    albumCount?: number;
    /** 艺术家列表 */
    artists?: Artist[];
    /** 艺术家计数 */
    artistCount?: number;
    /** 歌单列表 */
    playlists?: Playlist[];
    /** 歌单计数 */
    playlistCount?: number;
  };
  /** 状态码 */
  code: number;
}

/**
 * 热门搜索响应类型
 */
export interface SearchHotResponse {
  /** 热门搜索列表 */
  result: {
    /** 热搜列表 */
    hots: {
      /** 热搜词 */
      first: string;
      /** 热搜词对应数据 */
      second: number;
    }[];
  };
  /** 状态码 */
  code: number;
}

/**
 * 搜索建议响应类型
 */
export interface SearchSuggestResponse {
  /** 搜索建议结果 */
  result: {
    /** 歌曲建议 */
    songs?: {
      /** 歌曲ID */
      id: number;
      /** 歌曲名称 */
      name: string;
      /** 艺术家 */
      artists: Artist[];
      /** 专辑 */
      album: Album;
    }[];
    /** 艺术家建议 */
    artists?: {
      /** 艺术家ID */
      id: number;
      /** 艺术家名称 */
      name: string;
      /** 艺术家图片 */
      picUrl: string;
    }[];
    /** 专辑建议 */
    albums?: {
      /** 专辑ID */
      id: number;
      /** 专辑名称 */
      name: string;
      /** 专辑艺术家 */
      artist: Artist;
    }[];
    /** 歌单建议 */
    playlists?: {
      /** 歌单ID */
      id: number;
      /** 歌单名称 */
      name: string;
      /** 歌单封面 */
      coverImgUrl: string;
    }[];
  };
  /** 状态码 */
  code: number;
}