/**
 * 播放器状态管理相关的类型定义
 * @description 包含播放器状态、播放模式等类型定义
 */
import type { Song } from '../song';

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
 * 播放器状态
 */
export interface PlayerState {
  playing: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  playMode: string;
  playlist: Song[];
  currentIndex: number;
  currentSong: Song | null;
}

/**
 * 播放器操作方法
 */
export interface PlayerActions {
  play: (index: number) => void;
  pause: () => void;
  togglePlay: () => void;
  prev: () => void;
  next: () => void;
  seek: (time: number) => void;
  setVolume: (volume: number) => void;
  setPlayMode: (mode: string) => void;
  setPlaylist: (list: Song[]) => void;
  addToPlaylist: (song: Song) => void;
  removeSong: (song: Song) => void;
  clearPlaylist: () => void;
}

/**
 * 播放器 Store 类型
 */
export type PlayerStore = PlayerState & PlayerActions;