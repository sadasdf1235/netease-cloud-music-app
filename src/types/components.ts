/**
 * 组件相关的类型定义
 * @description 用于定义组件Props和事件的类型
 */
import type { Song } from './models/song';
import type { ToplistSong } from './toplist';

/**
 * 音乐列表项类型
 * @description 用于MusicList组件中的列表项
 */
export interface MusicListItem extends Song {
  // 扩展基本歌曲类型，添加特定于列表的属性
  liked?: boolean;
  isPlaying?: boolean;
  rankIndex?: number;
}

/**
 * 音乐列表组件Props类型
 * @description MusicList组件的Props类型定义
 */
export interface MusicListProps {
  /** 歌曲列表 */
  tracks: Song[] | ToplistSong[];
  /** 加载状态 */
  loading?: boolean;
  /** 是否显示搜索框 */
  showSearch?: boolean;
  /** 是否显示序号 */
  showCount?: boolean;
  /** 是否显示排名 */
  showRank?: boolean;
  /** 排名类型：'number'数字排名, 'trend'趋势排名 */
  rankType?: 'number' | 'trend';
  /** 分页大小 */
  pageSize?: number;
  /** 搜索框占位符 */
  searchPlaceholder?: string;
  /** 空列表提示文本 */
  emptyText?: string;
}

/**
 * 音乐列表组件事件类型
 * @description MusicList组件的事件类型定义
 */
export interface MusicListEvents {
  /** 播放歌曲事件 */
  play: (data: { track: Song | ToplistSong, index: number }) => void;
  /** 添加到播放列表事件 */
  addToPlaylist: (track: Song | ToplistSong) => void;
  /** 切换喜欢状态事件 */
  toggleLike: (track: Song | ToplistSong) => void;
  /** 更多操作事件 */
  moreActions?: (track: Song | ToplistSong) => void;
}

/**
 * 播放器Hooks返回类型
 * @description usePlayer Hook的返回值类型
 */
export interface PlayerHookResult {
  /** 当前歌曲 */
  currentSong: Song | null;
  /** 当前播放状态 */
  playing: boolean;
  /** 当前播放进度(0-100) */
  progress: number;
  /** 当前播放时间(秒) */
  currentTime: number;
  /** 歌曲总时长(秒) */
  duration: number;
  /** 音量(0-100) */
  volume: number;
  /** 是否随机播放 */
  random: boolean;
  /** 循环模式(0:列表循环,1:单曲循环,2:随机播放) */
  loopMode: number;
  /** 当前歌词 */
  lyric: string;
  /** 加载状态 */
  loading: boolean;
  /** 错误状态 */
  error: boolean;
  /** 错误信息 */
  errorMessage: string;
  /** 播放列表 */
  playlist: Song[];
  /** 播放函数 */
  play: () => void;
  /** 暂停函数 */
  pause: () => void;
  /** 切换播放状态 */
  togglePlay: () => void;
  /** 上一曲 */
  prevSong: () => void;
  /** 下一曲 */
  nextSong: () => void;
  /** 设置音量 */
  setVolume: (val: number) => void;
  /** 设置进度 */
  setProgress: (val: number) => void;
  /** 切换循环模式 */
  toggleLoop: () => void;
  /** 切换随机播放 */
  toggleRandom: () => void;
} 