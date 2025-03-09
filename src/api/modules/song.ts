/**
 * 歌曲相关API
 * @description 包含歌曲URL、详情、歌词等接口
 */
import { get } from '@/utils/request';
import { withSimpleCache } from '@/utils/apiCache';
import type { SongUrlResponse } from '@/types/api/music';

/**
 * 获取歌曲URL
 * @param id 歌曲id，支持多个id，用逗号分隔
 * @param br 码率，默认为320000 (320k)
 * @returns Promise<SongUrlResponse> 歌曲URL数据
 */
export function getSongUrl(id: number | number[], br = 320000) {
  // 将数组转换为逗号分隔的字符串
  const idStr = Array.isArray(id) ? id.join(',') : id;
  return get<SongUrlResponse>('/song/url', { id: idStr, br });
}

/**
 * 获取歌曲详情
 * @param ids 歌曲id，支持多个id，用逗号分隔
 * @param useCache 是否使用缓存，默认为true
 * @returns Promise<any> 歌曲详情数据
 */
export function getSongDetail(ids: number | number[], useCache = true) {
  // 将数组转换为逗号分隔的字符串
  const idsStr = Array.isArray(ids) ? ids.join(',') : ids;
  const apiCall = () => get('/song/detail', { ids: idsStr });
  return useCache
    ? withSimpleCache(apiCall, `song_detail_${idsStr}`, 24 * 60 * 60 * 1000) // 缓存24小时
    : apiCall();
}

/**
 * 获取歌词
 * @param id 歌曲id
 * @param useCache 是否使用缓存，默认为true
 * @returns Promise<any> 歌词数据
 */
export function getLyric(id: number, useCache = true) {
  const apiCall = () => get('/lyric', { id });
  return useCache
    ? withSimpleCache(apiCall, `lyric_${id}`, 7 * 24 * 60 * 60 * 1000) // 缓存7天
    : apiCall();
}

/**
 * 获取相似歌曲
 * @param id 歌曲id
 * @param useCache 是否使用缓存，默认为true
 * @returns Promise<any> 相似歌曲数据
 */
export function getSimiSongs(id: number, useCache = true) {
  const apiCall = () => get('/simi/song', { id });
  return useCache
    ? withSimpleCache(apiCall, `simi_songs_${id}`, 24 * 60 * 60 * 1000) // 缓存24小时
    : apiCall();
}

/**
 * 获取歌曲评论
 * @param id 歌曲id
 * @param limit 取出数量，默认为20
 * @param offset 偏移数量，用于分页，默认为0
 * @param before 分页参数，上一页最后一项的time
 * @returns Promise<any> 歌曲评论数据
 */
export function getSongComments(id: number, limit = 20, offset = 0, before?: number) {
  return get('/comment/music', { id, limit, offset, before });
}

/**
 * 给歌曲点赞
 * @param id 歌曲id
 * @param like 是否点赞，默认为true
 * @returns Promise<any> 点赞结果
 */
export function likeSong(id: number, like = true) {
  return get('/like', { id, like });
}