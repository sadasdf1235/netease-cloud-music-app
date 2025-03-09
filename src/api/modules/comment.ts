 /**
 * 评论相关API
 * @description 包含获取、发送、点赞评论等接口
 */
import { get, post } from '../request';

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
 * 获取评论
 * @param id 资源id
 * @param type 资源类型
 * @param limit 取出数量，默认为20
 * @param offset 偏移数量，用于分页，默认为0
 * @param before 分页参数，上一页最后一项的time
 * @returns Promise<any> 评论数据
 */
export function getComments(id: number, type: CommentType, limit = 20, offset = 0, before?: number) {
  const typeMap = [
    '/comment/music', // 歌曲
    '/comment/album', // 专辑
    '/comment/playlist', // 歌单
    '/comment/mv', // MV
    '/comment/dj', // 电台
    '/comment/video' // 视频
  ];

  return get(typeMap[type], { id, limit, offset, before });
}

/**
 * 发送评论
 * @param id 资源id
 * @param type 资源类型，0歌曲，1专辑，2歌单，3MV，4电台，5视频，6动态
 * @param content 评论内容
 * @param commentId 回复的评论id，如果是回复评论则必填
 * @returns Promise<any> 评论结果
 */
export function sendComment(id: number, type: CommentType, content: string, commentId?: number) {
  const params: any = { id, type, content };
  if (commentId) {
    params.commentId = commentId;
    return post('/comment/reply', params);
  }
  return post('/comment', params);
}

/**
 * 点赞评论
 * @param id 资源id
 * @param type 资源类型，0歌曲，1专辑，2歌单，3MV，4电台，5视频，6动态
 * @param commentId 评论id
 * @param t 是否点赞，1为点赞，0为取消点赞
 * @returns Promise<any> 点赞结果
 */
export function likeComment(id: number, type: CommentType, commentId: number, t: 1 | 0) {
  return post('/comment/like', { id, type, cid: commentId, t });
}

/**
 * 删除评论
 * @param id 资源id
 * @param type 资源类型，0歌曲，1专辑，2歌单，3MV，4电台，5视频，6动态
 * @param commentId 评论id
 * @returns Promise<any> 删除结果
 */
export function deleteComment(id: number, type: CommentType, commentId: number) {
  return post('/comment', { id, type, commentId, t: 0 });
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