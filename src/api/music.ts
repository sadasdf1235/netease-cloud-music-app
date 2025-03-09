/**
 * 音乐相关API
 * @description 包含各种音乐相关功能的接口
 */
import { get } from './request';
import { withCache } from '@/utils/apiCache';

// 导入其他API模块
import * as SongAPI from './modules/song';
import * as PlaylistAPI from './modules/playlist';
import * as AlbumAPI from './modules/album';
import * as ArtistAPI from './modules/artist';

// 重新导出模块API
export * from './modules/song';
export * from './modules/playlist';
export * from './modules/album';
export * from './modules/artist';

/**
 * 获取首页轮播图
 * @param type 资源类型: 0-PC, 1-Android, 2-iPhone, 3-iPad
 * @returns 轮播图数据
 */
export function getBanners(type = 0) {
  return get('/banner', { type });
}

/**
 * 获取推荐歌单
 * @param limit 取出数量，默认为30
 * @returns Promise<any> 推荐歌单数据
 */
export function getRecommendPlaylists(limit = 30) {
  return get('/personalized', { limit });
}

/**
 * 获取新歌推荐
 * @param limit 取出数量，默认为10
 * @returns Promise<any> 新歌推荐数据
 */
export function getNewSongs(limit = 10) {
  return get('/personalized/newsong', { limit });
}

/**
 * 获取新碟上架
 * @param area 地区类型 ALL:全部,ZH:华语,EA:欧美,KR:韩国,JP:日本
 * @param limit 取出数量，默认为10
 * @returns Promise<any> 新碟上架数据
 */
export function getNewAlbums(limit = 10, area = 'ALL') {
  return AlbumAPI.getNewAlbums(limit, 0, area);
}

/**
 * 获取热门歌手
 * @param limit 取出数量，默认为6
 * @returns Promise<any> 热门歌手数据
 */
export function getHotArtists(limit = 6) {
  return ArtistAPI.getTopArtists(limit);
}

/**
 * 获取歌曲URL
 * @param id 歌曲id，支持多个id，用逗号分隔
 * @returns Promise<any> 歌曲URL数据
 */
export function getSongUrl(id: number | string) {
  return get('/song/url', { id });
}

/**
 * 获取歌曲详情
 * @param ids 歌曲id，支持多个id，用逗号分隔
 * @returns Promise<any> 歌曲详情数据
 */
export function getSongDetail(ids: number | number[] | string) {
  // 如果传入的是数组，则转为逗号分隔的字符串
  const idsStr = Array.isArray(ids) ? ids.join(',') : ids.toString();
  return get('/song/detail', { ids: idsStr });
}

/**
 * 获取歌词
 * @param id 歌曲id
 * @returns Promise<any> 歌词数据
 */
export function getLyric(id: number) {
  return get('/lyric', { id });
}

/**
 * 获取相似歌曲
 * @param id 歌曲id
 * @returns Promise<any> 相似歌曲数据
 */
export function getSimiSongs(id: number) {
  return get('/simi/song', { id });
}

/**
 * 获取热门搜索
 * @returns Promise<any> 热门搜索数据
 */
export function getSearchHot() {
  return get('/search/hot');
}