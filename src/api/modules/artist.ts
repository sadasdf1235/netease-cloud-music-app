 /**
 * 歌手相关API
 * @description 包含歌手列表、歌手详情、歌手歌曲等接口
 */
import { get } from '../request';
import { withCache } from '@/utils/apiCache';

/**
 * 获取歌手分类列表
 * @param type 类型: -1:全部, 1:男歌手, 2:女歌手, 3:乐队
 * @param area 地区: -1:全部, 7华语, 96欧美, 8:日本, 16韩国, 0:其他
 * @param initial 按首字母索引查找参数: 热门传-1, #传0, A-Z传对应字母
 * @param limit 取出数量，默认为30
 * @param offset 偏移数量，用于分页，默认为0
 * @param useCache 是否使用缓存，默认为true
 * @returns Promise<any> 歌手列表数据
 */
export function getArtistList(
  type = -1,
  area = -1,
  initial = -1,
  limit = 30,
  offset = 0,
  useCache = true
) {
  const apiCall = () => get('/artist/list', { type, area, initial, limit, offset });
  return useCache
    ? withCache(
        apiCall,
        `artist_list_${type}_${area}_${initial}_${limit}_${offset}`,
        60 * 60 * 1000 // 缓存1小时
      )
    : apiCall();
}

/**
 * 获取热门歌手
 * @param limit 取出数量，默认为30
 * @param offset 偏移数量，用于分页，默认为0
 * @param useCache 是否使用缓存，默认为true
 * @returns Promise<any> 热门歌手数据
 */
export function getTopArtists(limit = 30, offset = 0, useCache = true) {
  const apiCall = () => get('/top/artists', { limit, offset });
  return useCache
    ? withCache(apiCall, `top_artists_${limit}_${offset}`, 12 * 60 * 60 * 1000) // 缓存12小时
    : apiCall();
}

/**
 * 获取歌手详情
 * @param id 歌手id
 * @param useCache 是否使用缓存，默认为true
 * @returns Promise<any> 歌手详情数据
 */
export function getArtistDetail(id: number, useCache = true) {
  const apiCall = () => get('/artist/detail', { id });
  return useCache
    ? withCache(apiCall, `artist_detail_${id}`, 24 * 60 * 60 * 1000) // 缓存24小时
    : apiCall();
}

/**
 * 获取歌手单曲
 * @param id 歌手id
 * @param useCache 是否使用缓存，默认为true
 * @returns Promise<any> 歌手单曲数据
 */
export function getArtistSongs(id: number, useCache = true) {
  const apiCall = () => get('/artists', { id });
  return useCache
    ? withCache(apiCall, `artist_songs_${id}`, 12 * 60 * 60 * 1000) // 缓存12小时
    : apiCall();
}

/**
 * 获取歌手专辑
 * @param id 歌手id
 * @param limit 取出数量，默认为30
 * @param offset 偏移数量，用于分页，默认为0
 * @param useCache 是否使用缓存，默认为true
 * @returns Promise<any> 歌手专辑数据
 */
export function getArtistAlbums(id: number, limit = 30, offset = 0, useCache = true) {
  const apiCall = () => get('/artist/album', { id, limit, offset });
  return useCache
    ? withCache(apiCall, `artist_albums_${id}_${limit}_${offset}`, 24 * 60 * 60 * 1000) // 缓存24小时
    : apiCall();
}

/**
 * 获取歌手MV
 * @param id 歌手id
 * @param useCache 是否使用缓存，默认为true
 * @returns Promise<any> 歌手MV数据
 */
export function getArtistMV(id: number, useCache = true) {
  const apiCall = () => get('/artist/mv', { id });
  return useCache
    ? withCache(apiCall, `artist_mv_${id}`, 24 * 60 * 60 * 1000) // 缓存24小时
    : apiCall();
}

/**
 * 获取相似歌手
 * @param id 歌手id
 * @param useCache 是否使用缓存，默认为true
 * @returns Promise<any> 相似歌手数据
 */
export function getSimiArtists(id: number, useCache = true) {
  const apiCall = () => get('/simi/artist', { id });
  return useCache
    ? withCache(apiCall, `simi_artists_${id}`, 24 * 60 * 60 * 1000) // 缓存24小时
    : apiCall();
}

/**
 * 收藏/取消收藏歌手
 * @param id 歌手id
 * @param t 操作类型，1为收藏，其他为取消收藏
 * @returns Promise<any> 操作结果
 */
export function followArtist(id: number, t: 1 | 0) {
  return get('/artist/sub', { id, t });
}