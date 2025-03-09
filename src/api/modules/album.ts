/**
 * 专辑相关API
 * @description 包含专辑详情、新专辑等接口
 */
import { get } from '../request';
import { withCache } from '@/utils/apiCache';

/**
 * 获取专辑详情
 * @param id 专辑id
 * @param useCache 是否使用缓存，默认为true
 * @returns Promise<any> 专辑详情数据
 */
export function getAlbumDetail(id: number, useCache = true) {
  const apiCall = () => get('/album', { id });
  return useCache
    ? withCache(apiCall, `album_detail_${id}`, 24 * 60 * 60 * 1000) // 缓存24小时
    : apiCall();
}

/**
 * 获取新碟上架
 * @param limit 取出数量，默认为30
 * @param offset 偏移数量，用于分页，默认为0
 * @param area 地区类型 ALL:全部,ZH:华语,EA:欧美,KR:韩国,JP:日本
 * @param useCache 是否使用缓存，默认为true
 * @returns Promise<any> 新碟上架数据
 */
export function getNewAlbums(limit = 30, offset = 0, area = 'ALL', useCache = true) {
  const apiCall = () => get('/album/new', { limit, offset, area });
  return useCache
    ? withCache(apiCall, `new_albums_${area}_${limit}_${offset}`, 12 * 60 * 60 * 1000) // 缓存12小时
    : apiCall();
}

/**
 * 获取专辑动态信息
 * @param id 专辑id
 * @returns Promise<any> 专辑动态信息
 */
export function getAlbumDynamic(id: number) {
  return get('/album/detail/dynamic', { id });
}

/**
 * 收藏/取消收藏专辑
 * @param id 专辑id
 * @param t 操作类型，1为收藏，其他为取消收藏
 * @returns Promise<any> 操作结果
 */
export function subscribeAlbum(id: number, t: 1 | 0) {
  return get('/album/sub', { id, t });
}

/**
 * 获取专辑评论
 * @param id 专辑id
 * @param limit 取出数量，默认为20
 * @param offset 偏移数量，用于分页，默认为0
 * @param before 分页参数，上一页最后一项的time
 * @returns Promise<any> 专辑评论数据
 */
export function getAlbumComments(id: number, limit = 20, offset = 0, before?: number) {
  return get('/comment/album', { id, limit, offset, before });
}