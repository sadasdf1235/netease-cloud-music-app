/**
 * 评论相关API
 * @description 包含获取、发送、点赞评论等接口
 */
import type { CommentParams, CommentResponse } from '@/types/comment';
import { get, post } from '@/utils/request';

/**
 * 资源类型枚举
 */
export enum CommentType {
  /** 歌曲 */
  SONG = 0,
  /** 专辑 */
  ALBUM = 1,
  /** 歌单 */
  PLAYLIST = 2,
  /** MV */
  MV = 3,
  /** 电台 */
  DJ = 4,
  /** 视频 */
  VIDEO = 5
}

/**
 * 获取评论列表
 * @param params 评论参数
 */
export function getComments(params: CommentParams): Promise<CommentResponse> {
  return get('/comment/new', params);
}

/**
 * 发送评论
 * @param id 资源id
 * @param type 资源类型
 * @param content 评论内容
 * @param commentId 回复的评论id
 */
export function sendComment(id: number, type: number, content: string, commentId?: number): Promise<any> {
  return post('/comment', {
    t: 1, // 1: 发送, 2: 回复
    type,
    id,
    content,
    commentId
  });
}

/**
 * 点赞评论
 * @param id 资源id
 * @param type 资源类型
 * @param cid 评论id
 * @param like 是否点赞
 */
export function likeComment(id: number, type: number, cid: number, like: boolean): Promise<any> {
  return post('/comment/like', {
    id,
    type,
    cid,
    t: like ? 1 : 0
  });
}

/**
 * 删除评论
 * @param id 资源id
 * @param type 资源类型
 * @param commentId 评论id
 */
export function deleteComment(id: number, type: number, commentId: number): Promise<any> {
  return post('/comment', {
    t: 0,
    type,
    id,
    commentId
  });
}

/**
 * 获取热门评论
 * @param id 资源id
 * @param type 资源类型，0歌曲，1专辑，2歌单，3MV，4电台，5视频
 * @param limit 取出数量，默认为20
 * @param offset 偏移数量，用于分页，默认为0
 * @param before 分页参数，上一页最后一项的time
 * @returns Promise<any> 热门评论数据
 */
export function getHotComments(id: number, type: CommentType, limit = 20, offset = 0, before?: number) {
  const typeMap = [
    '/comment/music', // 歌曲
    '/comment/album', // 专辑
    '/comment/playlist', // 歌单
    '/comment/mv', // MV
    '/comment/dj', // 电台
    '/comment/video' // 视频
  ];

  return get(`${typeMap[type]}/hot`, { id, limit, offset, before });
}