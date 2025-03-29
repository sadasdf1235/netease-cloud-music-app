/**
 * 音乐与歌曲相关API
 * @description 整合了music.ts和song.ts中的API，消除重复代码
 */
import { get } from '@/utils/request';
import { withSimpleCache } from '@/utils/apiCache';
import { BannerResponse, SongUrlResponse } from '@/types/api/music';

/**
 * 获取首页轮播图
 * @param type 资源类型: 0-PC, 1-Android, 2-iPhone, 3-iPad
 * @param useCache 是否使用缓存，默认为true
 * @returns 轮播图数据
 */
export function getBanners(type = 0, useCache = true) {
  const apiCall = () => get<BannerResponse>('/banner', { type });
  return useCache
    ? withSimpleCache(apiCall, `banners_${type}`, 60 * 60 * 1000) // 缓存1小时
    : apiCall();
}

/**
 * 获取推荐歌单
 * @param limit 取出数量，默认为30
 * @param useCache 是否使用缓存，默认为true
 * @returns 推荐歌单数据
 */
export function getRecommendPlaylists(limit = 30, useCache = true) {
  const apiCall = () => get('/personalized', { limit });
  return useCache
    ? withSimpleCache(apiCall, `recommend_playlists_${limit}`, 60 * 60 * 1000) // 缓存1小时
    : apiCall();
}

/**
 * 获取新歌推荐
 * @param limit 取出数量，默认为10
 * @param useCache 是否使用缓存，默认为true
 * @returns 新歌推荐数据
 */
export function getNewSongs(limit = 10, useCache = true) {
  const apiCall = () => get('/personalized/newsong', { limit });
  return useCache
    ? withSimpleCache(apiCall, `new_songs_${limit}`, 60 * 60 * 1000) // 缓存1小时
    : apiCall();
}

/**
 * 获取歌曲URL
 * @param id 歌曲id，支持多个id，用逗号分隔或数组
 * @param br 码率，默认为320000 (320k)
 * @param useCache 是否使用缓存，默认为true
 * @returns 歌曲URL数据
 */
export function getSongUrl(id: number | number[] | string, br = 320000, useCache = true) {
  // 将id转换为字符串
  const idStr = Array.isArray(id) ? id.join(',') : String(id);
  const apiCall = () => get<SongUrlResponse>('/song/url', { id: idStr, br });
  return useCache
    ? withSimpleCache(apiCall, `song_url_${idStr}_${br}`, 24 * 60 * 60 * 1000) // 缓存24小时
    : apiCall();
}

/**
 * 获取歌曲详情
 * @param ids 歌曲id，支持多个id，用逗号分隔或数组
 * @param useCache 是否使用缓存，默认为true
 * @returns 歌曲详情数据
 */
export function getSongDetail(ids: number | number[] | string, useCache = true) {
  // 如果传入的是数组，则转为逗号分隔的字符串
  const idsStr = Array.isArray(ids) ? ids.join(',') : String(ids);
  const apiCall = () => get('/song/detail', { ids: idsStr });
  return useCache
    ? withSimpleCache(apiCall, `song_detail_${idsStr}`, 24 * 60 * 60 * 1000) // 缓存24小时
    : apiCall();
}

/**
 * 获取歌词
 * @param id 歌曲id
 * @param useCache 是否使用缓存，默认为true
 * @returns 歌词数据
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
 * @returns 相似歌曲数据
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
 * @returns 歌曲评论数据
 */
export function getSongComments(id: number, limit = 20, offset = 0, before?: number) {
  return get('/comment/music', { id, limit, offset, before });
}

/**
 * 给歌曲点赞
 * @param id 歌曲id
 * @param like 是否点赞，默认为true
 * @returns 点赞结果
 */
export function likeSong(id: number, like = true) {
  return get('/like', { id, like });
}

/**
 * 获取热门搜索
 * @param useCache 是否使用缓存，默认为true
 * @returns 热门搜索数据
 */
export function getSearchHot(useCache = true) {
  const apiCall = () => get('/search/hot');
  return useCache
    ? withSimpleCache(apiCall, 'search_hot', 30 * 60 * 1000) // 缓存30分钟
    : apiCall();
} 