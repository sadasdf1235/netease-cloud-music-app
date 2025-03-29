/**
 * API类型定义文件
 * @description 定义API返回结果的基本类型结构
 */

// API返回基础结构
export interface ApiResponse<T = any> {
  code: number;
  message?: string;
  msg?: string;
  data?: T;
  [key: string]: any;
}

// 歌曲URL响应
export interface SongUrlResponse {
  code: number;
  data: Array<{
    id: number;
    url: string;
    br: number;
    size: number;
    md5: string;
    type: string;
    level: string;
    encodeType: string;
    time: number;
    [key: string]: any;
  }>;
}

// 歌曲详情响应
export interface SongDetailResponse {
  code: number;
  songs: Array<{
    id: number;
    name: string;
    ar: Array<{ id: number; name: string; [key: string]: any }>;
    al: { id: number; name: string; picUrl: string; [key: string]: any };
    dt: number; // 时长
    [key: string]: any;
  }>;
  privileges: any[];
}

// 歌词响应
export interface LyricResponse {
  code: number;
  lrc?: {
    version: number;
    lyric: string;
  };
  tlyric?: {
    version: number;
    lyric: string;
  };
  klyric?: {
    version: number;
    lyric: string;
  };
}

// 搜索结果响应
export interface SearchResponse {
  code: number;
  result: {
    songs?: any[];
    songCount?: number;
    albums?: any[];
    albumCount?: number;
    artists?: any[];
    artistCount?: number;
    playlists?: any[];
    playlistCount?: number;
    [key: string]: any;
  };
} 