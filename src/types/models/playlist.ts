 /**
 * 歌单相关模型的类型定义
 * @description 包含歌单、歌单分类等类型定义
 */
import { Song } from './song';

/**
 * 歌单创建者信息类型
 */
export interface PlaylistCreator {
  /** 用户ID */
  userId: number;
  /** 用户昵称 */
  nickname: string;
  /** 用户头像URL */
  avatarUrl?: string;
  /** 用户签名 */
  signature?: string;
  /** 背景图URL */
  backgroundUrl?: string;
}

/**
 * 歌单信息类型
 */
export interface Playlist {
  /** 歌单ID */
  id: number;
  /** 歌单名称 */
  name: string;
  /** 歌单封面URL */
  coverImgUrl: string;
  /** 歌单创建者 */
  creator: PlaylistCreator;
  /** 歌单描述 */
  description: string;
  /** 歌单标签 */
  tags: string[];
  /** 歌曲数量 */
  trackCount: number;
  /** 播放次数 */
  playCount: number;
  /** 订阅数 */
  subscribedCount?: number;
  /** 分享数 */
  shareCount?: number;
  /** 评论数 */
  commentCount?: number;
  /** 创建时间 */
  createTime: number;
  /** 更新时间 */
  updateTime?: number;
}

/**
 * 推荐歌单信息类型（简化版）
 */
export interface RecommendPlaylist {
  /** 歌单ID */
  id: number;
  /** 歌单名称 */
  name: string;
  /** 歌单封面URL */
  picUrl: string;
  /** 播放次数 */
  playCount: number;
}

/**
 * 歌单分类类型
 */
export interface PlaylistCategory {
  /** 分类名称 */
  name: string;
  /** 分类ID */
  id: number;
  /** 热门标签 */
  hot: boolean;
}