import type { Song } from './song';
import type { Playlist } from './playlist';

// 排行榜概要信息
export interface ToplistInfo extends Omit<Playlist, 'tracks'> {
  updateFrequency: string; // 更新频率
  trackUpdateTime: number; // 歌曲更新时间
  tracks?: Song[]; // 完整歌曲列表
  previewSongs?: Array<{ // 预览歌曲列表
    first: string; // 歌曲名
    second: string; // 歌手名
  }>;
}

// 排行榜分组
export interface ToplistGroup {
  title: string;
  lists: ToplistInfo[];
}

// 排行榜歌曲
export interface ToplistSong extends Song {
  lastRank: number; // 上次排名
  rankValue: number; // 排名变化值
  rankType: number; // 排名变化类型：0-上升，1-持平，2-下降，3-新晋
}