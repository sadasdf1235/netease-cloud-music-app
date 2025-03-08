 /**
 * 音乐相关模型的类型定义
 * @description 包含歌曲、歌手、专辑等音乐相关的类型定义
 */

/**
 * 歌手信息类型
 */
export interface Artist {
    /** 歌手ID */
    id: number;
    /** 歌手姓名 */
    name: string;
    /** 歌手头像URL */
    picUrl?: string;
    /** 歌手别名 */
    alias?: string[];
    /** 歌手描述 */
    briefDesc?: string;
    /** 歌手热门歌曲IDs */
    musicSize?: number;
  }
  
  /**
   * 专辑信息类型
   */
  export interface Album {
    /** 专辑ID */
    id: number;
    /** 专辑名称 */
    name: string;
    /** 专辑封面URL */
    picUrl?: string;
    /** 专辑描述 */
    description?: string;
    /** 发行时间 */
    publishTime?: number;
    /** 专辑包含的歌曲数 */
    size?: number;
    /** 专辑艺术家 */
    artists?: Artist[];
  }
  
  /**
   * 歌曲信息类型
   */
  export interface Song {
    /** 歌曲ID */
    id: number;
    /** 歌曲名称 */
    name: string;
    /** 歌曲别名 */
    alia?: string[];
    /** 歌曲时长(毫秒) */
    dt?: number;
    /** 歌手信息 */
    ar?: Artist[];
    /** 专辑信息 */
    al?: Album;
    /** 发布时间 */
    publishTime?: number;
  }
  
  /**
   * 简化歌曲信息类型（用于播放器展示）
   */
  export interface SimpleSong {
    /** 歌曲ID */
    id: number;
    /** 歌曲名称 */
    name: string;
    /** 歌手信息 */
    artists: Artist[];
    /** 专辑信息 */
    album: {
      id?: number;
      name?: string;
      picUrl?: string;
    };
    /** 歌曲时长(毫秒) */
    duration?: number;
  }