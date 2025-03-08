 /**
 * 播放器相关常量
 * @description 播放器功能相关的常量定义
 */

/**
 * 播放模式枚举
 */
export enum PlayMode {
    /** 顺序播放 */
    SEQUENCE = 'sequence',
    /** 单曲循环 */
    LOOP = 'loop',
    /** 随机播放 */
    RANDOM = 'random'
  }
  
  /**
   * 默认音量
   */
  export const DEFAULT_VOLUME = 60;
  
  /**
   * 音量调整步长
   */
  export const VOLUME_STEP = 5;
  
  /**
   * 播放器本地存储键名
   */
  export const PLAYER_STORAGE_KEY = 'NETEASE_PLAYER_STATE';
  
  /**
   * 默认歌曲封面
   */
  export const DEFAULT_ALBUM_COVER = 'https://p2.music.126.net/UeTuwE7pvjBpypWLudqukA==/3132508627578625.jpg';