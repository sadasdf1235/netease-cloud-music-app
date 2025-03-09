import type { Song } from './song';
import type { UserProfile } from './user';

// 歌单信息
export interface Playlist {
  id: number;
  name: string;
  coverImgUrl: string;
  description: string;
  tags: string[];
  playCount: number;
  trackCount: number;
  privacy: number; // 0: 公开, 10: 隐私
  userId: number;
  creator: {
    userId: number;
    nickname: string;
    avatarUrl: string;
    signature: string;
  };
  createTime: number;
  updateTime: number;
  subscribed: boolean;
  subscribedCount: number;
  shareCount: number;
  commentCount: number;
  tracks?: Song[];
}

// 歌单分类
export interface PlaylistCategory {
  name: string;
  hot: boolean;
  type: number;
  category: number;
}

// 创建歌单参数
export interface CreatePlaylistParams {
  name: string;
  privacy: 0 | 10;
  type: 'NORMAL' | 'VIDEO' | 'SHARED';
}

// 更新歌单参数
export interface UpdatePlaylistParams {
  id: number;
  name?: string;
  desc?: string;
  tags?: string[];
  privacy?: 0 | 10;
}

// 获取歌单列表参数
export interface GetPlaylistParams {
  cat?: string;
  limit?: number;
  offset?: number;
  order?: 'hot' | 'new';
}

// 获取精品歌单参数
export interface GetHighqualityPlaylistParams extends GetPlaylistParams {
  before?: number;
}