/**
 * 排行榜相关API
 * @description 包含榜单详情、榜单歌曲等接口
 */
import { get } from '@/utils/request';
import { withSimpleCache } from '@/utils/apiCache';
import type { ToplistInfo, ToplistSong } from '@/types/toplist';

/**
 * 获取所有榜单
 * @param useCache 是否使用缓存，默认为true
 * @returns 榜单列表数据
 */
export function getAllToplist(useCache = true) {
  const apiCall = () => get<{ list: ToplistInfo[] }>('/toplist');
  return useCache
    ? withSimpleCache(apiCall, 'all_toplist', 24 * 60 * 60 * 1000) // 缓存24小时
    : apiCall();
}

/**
 * 获取榜单详情
 * @param id 榜单ID
 * @param useCache 是否使用缓存，默认为true
 * @returns 榜单详情数据
 */
export function getToplistById(id: number, useCache = true) {
  const apiCall = () => get<{ playlist: ToplistInfo; songs: ToplistSong[] }>('/playlist/detail', { id });
  return useCache
    ? withSimpleCache(apiCall, `toplist_detail_${id}`, 60 * 60 * 1000) // 缓存1小时
    : apiCall();
}

/**
 * 获取榜单歌曲
 * @param id 榜单ID
 * @param useCache 是否使用缓存，默认为true
 * @returns 榜单歌曲数据
 */
export function getToplistSongs(id: number, useCache = true) {
  const apiCall = () => get<{ songs: ToplistSong[] }>('/playlist/track/all', { id });
  return useCache
    ? withSimpleCache(apiCall, `toplist_songs_${id}`, 60 * 60 * 1000) // 缓存1小时
    : apiCall();
}

/**
 * 获取所有榜单内容摘要
 * @param useCache 是否使用缓存，默认为true
 * @returns 所有榜单内容摘要
 */
export function getToplistDetail(useCache = true) {
  const apiCall = () => get('/toplist/detail');
  return useCache
    ? withSimpleCache(apiCall, 'toplist_detail', 24 * 60 * 60 * 1000) // 缓存24小时
    : apiCall();
} 