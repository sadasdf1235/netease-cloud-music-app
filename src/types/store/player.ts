 /**
 * 播放器状态管理相关的类型定义
 * @description 包含播放器状态、播放模式等类型定义
 */
import { SimpleSong } from '../models/song';

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
 * 播放器状态类型
 */
export interface PlayerState {
  /** 播放列表 */
  playlist: SimpleSong[];
  /** 当前播放索引 */
  currentIndex: number;
  /** 是否正在播放 */
  playing: boolean;
  /** 音量（0-100） */
  volume: number;
  /** 当前播放时间（秒） */
  currentTime: number;
  /** 总时长（秒） */
  duration: number;
  /** 播放进度（百分比） */
  progress: number;
  /** 是否单曲循环 */
  loop: boolean;
  /** 是否随机播放 */
  random: boolean;
  /** 当前播放模式 */
  playMode: PlayMode;
}

/**
 * 播放器操作类型
 */
export interface PlayerActions {
  /** 设置播放列表 */
  setPlaylist: (list: SimpleSong[]) => void;
  /** 播放指定索引的歌曲 */
  play: (index: number) => void;
  /** 切换播放状态 */
  togglePlay: () => void;
  /** 上一首 */
  prev: () => void;
  /** 下一首 */
  next: () => void;
  /** 设置音量 */
  setVolume: (val: number) => void;
  /** 更新当前播放时间 */
  updateCurrentTime: (time: number) => void;
  /** 更新总时长 */
  updateDuration: (value: number) => void;
  /** 设置进度 */
  setProgress: (value: number) => void;
  /** 切换循环播放 */
  toggleLoop: () => void;
  /** 切换随机播放 */
  toggleRandom: () => void;
  /** 设置播放模式 */
  setPlayMode: (mode: PlayMode) => void;
}