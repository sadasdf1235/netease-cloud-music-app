import { get } from '@/utils/request';
import type { MV, MVDetail, MVUrl } from '@/types/mv';

interface BaseResponse {
  code: number;
}

interface MVListResponse extends BaseResponse {
  data: MV[];
  hasMore: boolean;
  count: number;
}

interface MVDetailResponse extends BaseResponse {
  data: MVDetail;
}

interface MVUrlResponse extends BaseResponse {
  data: MVUrl;
}

/**
 * 获取最新MV列表
 * @param limit 返回数量，默认30
 * @param offset 偏移数量，用于分页
 * @param area 地区，可选值：全部,内地,港台,欧美,日本,韩国
 */
export function getNewMVs(limit = 30, offset = 0, area = '全部'): Promise<MVListResponse> {
  return get<MVListResponse>('/mv/first', { limit, offset, area });
}

/**
 * 获取MV排行榜
 * @param limit 返回数量，默认30
 * @param offset 偏移数量，用于分页
 * @param area 地区，可选值：全部,内地,港台,欧美,日本,韩国
 */
export function getTopMVs(limit = 30, offset = 0, area = '全部'): Promise<MVListResponse> {
  return get<MVListResponse>('/top/mv', { limit, offset, area });
}

/**
 * 获取MV详情
 * @param mvid MV ID
 */
export function getMVDetail(mvid: number): Promise<MVDetailResponse> {
  return get<MVDetailResponse>('/mv/detail', { mvid });
}

/**
 * 获取MV播放地址
 * @param id MV ID
 * @param r 分辨率，默认1080，可选：1080,720,480,240
 */
export function getMVUrl(id: number, r = 1080): Promise<MVUrlResponse> {
  return get<MVUrlResponse>('/mv/url', { id, r });
}

/**
 * 获取相似MV
 * @param mvid MV ID
 */
export function getRelatedMVs(mvid: number): Promise<MVListResponse> {
  return get<MVListResponse>('/simi/mv', { mvid });
}

/**
 * 获取全部MV
 * @param area 地区，可选值：全部,内地,港台,欧美,日本,韩国
 * @param type 类型，可选值：全部,官方版,原生,现场版,网易出品
 * @param order 排序，可选值：上升最快,最热,最新
 * @param limit 返回数量，默认30
 * @param offset 偏移数量，用于分页
 */
export function getAllMVs(
  area = '全部',
  type = '全部',
  order = '上升最快',
  limit = 30,
  offset = 0
): Promise<MVListResponse> {
  return get<MVListResponse>('/mv/all', { area, type, order, limit, offset });
}

/**
 * 获取网易出品MV
 * @param limit 返回数量，默认30
 * @param offset 偏移数量，用于分页
 */
export function getExclusiveMVs(limit = 30, offset = 0): Promise<MVListResponse> {
  return get<MVListResponse>('/mv/exclusive/rcmd', { limit, offset });
}

/**
 * 收藏/取消收藏MV
 * @param id MV ID
 * @param t 1:收藏, 2:取消收藏
 */
export function subscribeMV(id: number, t: 1 | 2): Promise<BaseResponse> {
  return get<BaseResponse>('/mv/sub', { id, t });
}