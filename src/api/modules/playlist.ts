/**
 * 歌单相关API
 * @description 包含歌单详情、歌单歌曲、推荐歌单等接口
 */
import { get } from '@/utils/request';
import { withSimpleCache } from '@/utils/apiCache';
import type { Playlist, RecommendPlaylist } from '@/types/models/playlist';
import type { ApiResponse } from '@/types/api';

// 自定义响应类型
interface RecommendPlaylistResponse extends ApiResponse<any> {
  result: RecommendPlaylist[];
}

interface PlaylistDetailResponse extends ApiResponse<any> {
  playlist: Playlist;
}

interface PlaylistTracksResponse extends ApiResponse<any> {
  songs: any[];
}

/**
 * 获取推荐歌单
 * @param limit 取出数量，默认为30
 * @param useCache 是否使用缓存，默认为true
 * @returns Promise<RecommendPlaylistResponse> 推荐歌单数据
 */
export function getRecommendPlaylists(limit = 30, useCache = true) {
  const apiCall = () => get<RecommendPlaylistResponse>('/personalized', { limit });
  return useCache
    ? withSimpleCache(apiCall, `recommend_playlists_${limit}`, 60 * 60 * 1000) // 缓存1小时
    : apiCall();
}

/**
 * 获取歌单详情
 * @param id 歌单ID
 * @param useCache 是否使用缓存，默认为true
 * @returns Promise<PlaylistDetailResponse> 歌单详情数据
 */
export function getPlaylistDetail(id: number, useCache = true) {
  const apiCall = () => get<PlaylistDetailResponse>('/playlist/detail', { id });
  return useCache
    ? withSimpleCache(apiCall, `playlist_detail_${id}`, 10 * 60 * 1000) // 缓存10分钟
    : apiCall();
}

/**
 * 获取歌单全部歌曲
 * @param id 歌单ID
 * @param limit 取出数量，默认为100
 * @param offset 偏移数量，用于分页
 * @param useCache 是否使用缓存，默认为true
 * @returns Promise<PlaylistTracksResponse> 歌单歌曲数据
 */
export function getPlaylistTracks(id: number, limit = 100, offset = 0, useCache = true) {
  const apiCall = () => get<PlaylistTracksResponse>('/playlist/track/all', { id, limit, offset });
  return useCache
    ? withSimpleCache(apiCall, `playlist_tracks_${id}_${limit}_${offset}`, 10 * 60 * 1000) // 缓存10分钟
    : apiCall();
}

/**
 * 获取热门歌单分类
 * @param useCache 是否使用缓存，默认为true
 * @returns Promise<any> 热门歌单分类数据
 */
export function getHotPlaylistCategories(useCache = true) {
  const apiCall = () => get('/playlist/hot');
  return useCache
    ? withSimpleCache(apiCall, 'hot_playlist_categories', 24 * 60 * 60 * 1000) // 缓存24小时
    : apiCall();
}

/**
 * 获取所有歌单分类
 * @param useCache 是否使用缓存，默认为true
 * @returns Promise<any> 歌单分类数据
 */
export function getPlaylistCategories(useCache = true) {
  const apiCall = () => get('/playlist/catlist');
  return useCache
    ? withSimpleCache(apiCall, 'playlist_categories', 24 * 60 * 60 * 1000) // 缓存24小时
    : apiCall();
}

/**
 * 获取歌单（网友精选碟）
 * @param cat 歌单分类，默认为'全部'
 * @param limit 取出数量，默认为30
 * @param offset 偏移数量，用于分页
 * @param useCache 是否使用缓存，默认为true
 * @returns Promise<any> 歌单列表数据
 */
export function getTopPlaylists(cat = '全部', limit = 30, offset = 0, useCache = true) {
  const apiCall = () => get('/top/playlist', { cat, limit, offset });
  return useCache
    ? withSimpleCache(apiCall, `top_playlists_${cat}_${limit}_${offset}`, 30 * 60 * 1000) // 缓存30分钟
    : apiCall();
}

/**
 * 收藏/取消收藏歌单
 * @param id 歌单ID
 * @param t 类型,1:收藏,2:取消收藏
 * @returns Promise<any> 操作结果
 */
export function subscribePlaylist(id: number, t: 1 | 2) {
  return get('/playlist/subscribe', { id, t });
}

/**
 * 获取用户歌单
 * @param uid 用户ID
 * @param limit 取出数量，默认为30
 * @param offset 偏移数量，用于分页
 * @returns Promise<any> 用户歌单数据
 */
export function getUserPlaylists(uid: number, limit = 30, offset = 0) {
  return get('/user/playlist', { uid, limit, offset });
}

/**
 * 获取歌单评论
 * @param id 歌单ID
 * @param limit 取出数量，默认为20
 * @param offset 偏移数量，用于分页
 * @param before 分页参数,取上一页最后一项的time获取下一页数据
 * @returns Promise<any> 歌单评论数据
 */
export function getPlaylistComments(id: number, limit = 20, offset = 0, before?: number) {
  return get('/comment/playlist', { id, limit, offset, before });
}