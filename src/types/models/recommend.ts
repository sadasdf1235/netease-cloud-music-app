/**
 * 推荐页面相关的类型定义
 */

/**
 * 轮播图类型
 */
export interface Banner {
  /** 轮播图ID */
  id: number;
  /** 轮播图图片URL */
  imageUrl: string;
  /** 轮播图标题 */
  typeTitle: string;
  /** 轮播图链接 */
  url: string;
  /** 轮播图类型 */
  type: number;
}

/**
 * 推荐歌单类型
 */
export interface RecommendPlaylistItem {
  /** 歌单ID */
  id: number;
  /** 歌单名称 */
  name: string;
  /** 歌单封面URL */
  picUrl: string;
  /** 播放次数 */
  playCount: number;
  /** 歌单创建者 */
  creator?: {
    /** 创建者ID */
    userId: number;
    /** 创建者昵称 */
    nickname: string;
  };
  /** 歌单描述 */
  description?: string;
  /** 歌曲数量 */
  trackCount?: number;
}

/**
 * 推荐艺术家类型
 */
export interface RecommendArtist {
  /** 艺术家ID */
  id: number;
  /** 艺术家名称 */
  name: string;
  /** 艺术家头像URL */
  picUrl: string;
  /** 艺术家别名 */
  alias?: string[];
  /** 单曲数量 */
  musicSize?: number;
  /** 专辑数量 */
  albumSize?: number;
  /** MV数量 */
  mvSize?: number;
}

/**
 * 推荐专辑类型
 */
export interface RecommendAlbum {
  /** 专辑ID */
  id: number;
  /** 专辑名称 */
  name: string;
  /** 专辑封面URL */
  picUrl: string;
  /** 专辑艺术家 */
  artist: {
    /** 艺术家ID */
    id: number;
    /** 艺术家名称 */
    name: string;
  };
  /** 专辑艺术家列表 */
  artists?: RecommendArtist[];
  /** 发行时间 */
  publishTime?: number;
  /** 专辑类型 */
  type?: string;
  /** 专辑描述 */
  description?: string;
}

/**
 * 推荐歌曲类型
 */
export interface RecommendSong {
  /** 歌曲ID */
  id: number;
  /** 歌曲名称 */
  name: string;
  /** 歌曲别名 */
  alia?: string[];
  /** 歌曲时长(毫秒) */
  dt?: number;
  /** 歌手信息 */
  ar?: RecommendArtist[];
  /** 专辑信息 */
  al?: RecommendAlbum;
  /** 歌手 */
  artists: RecommendArtist[];
  /** 专辑 */
  album: RecommendAlbum;
}