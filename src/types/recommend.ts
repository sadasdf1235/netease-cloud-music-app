import type { Song } from './song';

// 轮播图
export interface Banner {
  imageUrl: string;
  targetId: number;
  targetType: number;
  titleColor: string;
  typeTitle: string;
  url: string;
}

// 推荐歌单
export interface PersonalizedPlaylist {
  id: number;
  name: string;
  picUrl: string;
  playCount: number;
  trackCount: number;
  copywriter: string;
  creator: {
    userId: number;
    nickname: string;
  };
}

// 最新音乐
export interface NewSong extends Song {
  album: {
    id: number;
    name: string;
    picUrl: string;
  };
  artists: {
    id: number;
    name: string;
  }[];
}

// 推荐MV
export interface PersonalizedMV {
  id: number;
  name: string;
  picUrl: string;
  playCount: number;
  artistName: string;
  artistId: number;
  duration: number;
  copywriter: string;
}

// 独家放送
export interface PrivateContent {
  id: number;
  name: string;
  picUrl: string;
  copywriter: string;
  url: string;
}