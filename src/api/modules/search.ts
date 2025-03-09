/**
 * 搜索相关API
 * @description 包含搜索功能的各种接口
 */
import { get } from '@/utils/request';
import { withSimpleCache } from '@/utils/apiCache';
import { SearchType } from '@/types/api/search';
import type { SearchParams } from '@/types/api/search';

/**
 * 搜索
 * @param params 搜索参数
 * @param useCache 是否使用缓存，默认为true
 * @returns Promise<any> 搜索结果
 */
export function search(params: SearchParams, useCache = true) {
  const { keywords, type = SearchType.COMPREHENSIVE, limit = 30, offset = 0 } = params;
  const apiCall = () => get('/search', { keywords, type, limit, offset });

  return useCache
    ? withSimpleCache(
        apiCall,
        `search_${keywords}_${type}_${limit}_${offset}`,
        10 * 60 * 1000 // 缓存10分钟
      )
    : apiCall();
}

/**
 * 获取热门搜索
 * @param useCache 是否使用缓存，默认为true
 * @returns Promise<any> 热门搜索结果
 */
export function getSearchHot(useCache = true) {
  const apiCall = () => get('/search/hot');

  return useCache
    ? withSimpleCache(apiCall, 'search_hot', 30 * 60 * 1000) // 缓存30分钟
    : apiCall();
}

/**
 * 获取热门搜索详情
 * @param useCache 是否使用缓存，默认为true
 * @returns Promise<any> 热门搜索详情结果
 */
export function getSearchHotDetail(useCache = true) {
  const apiCall = () => get('/search/hot/detail');

  return useCache
    ? withSimpleCache(apiCall, 'search_hot_detail', 30 * 60 * 1000) // 缓存30分钟
    : apiCall();
}

/**
 * 获取搜索建议
 * @param keywords 搜索关键词
 * @param type 搜索类型，默认为 'mobile'
 * @returns Promise<any> 搜索建议结果
 */
export function getSearchSuggest(keywords: string, type = 'mobile') {
  return get('/search/suggest', { keywords, type });
}

/**
 * 多类型搜索
 * @param keywords 搜索关键词
 * @param types 搜索类型数组
 * @returns Promise<any> 多类型搜索结果
 */
export async function multiSearch(keywords: string, types: SearchType[]) {
  // 并行发起多个搜索请求
  const promises = types.map(type =>
    search({ keywords, type, limit: 5 })
  );

  const results = await Promise.all(promises);

  // 合并搜索结果
  return results.reduce((merged, result, index) => {
    if (result && result.result) {
      // 根据不同的搜索类型，将结果合并到相应的字段
      switch (types[index]) {
        case SearchType.SONG:
          merged.songs = result.result.songs;
          merged.songCount = result.result.songCount;
          break;
        case SearchType.ALBUM:
          merged.albums = result.result.albums;
          merged.albumCount = result.result.albumCount;
          break;
        case SearchType.ARTIST:
          merged.artists = result.result.artists;
          merged.artistCount = result.result.artistCount;
          break;
        case SearchType.PLAYLIST:
          merged.playlists = result.result.playlists;
          merged.playlistCount = result.result.playlistCount;
          break;
      }
    }
    return merged;
  }, {});
}