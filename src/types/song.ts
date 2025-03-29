/**
 * 歌曲类型定义
 * @description 导出统一的歌曲相关类型，保持向后兼容
 * @deprecated 这个文件已经被弃用，请直接使用 './models/music' 中的类型定义
 */

// 从统一的类型定义中重新导出
export {
  Song,
  SimpleSong,
  SongUrl,
  SongDetail,
  MusicQuality,
  Lyric,
  LyricLine,
  SimiSong
} from './models/music';