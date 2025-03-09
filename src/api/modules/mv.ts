import request from '@/utils/request';
import type { MV, MVDetail, MVUrl, AllMVParams } from '@/types/mv';

/**
 * 获取MV详情
 * @param mvid MV ID
 */
export const getMVDetail = (mvid: number) => {
  return request.get<{
    data: MVDetail;
  }>('/mv/detail', { params: { mvid } });
};

/**
 * 获取MV播放地址
 * @param id MV ID
 * @param r 分辨率，默认1080，可选值: 1080,720,480,240
 */
export const getMVUrl = (id: number, r = 1080) => {
  return request.get<{
    data: MVUrl;
  }>('/mv/url', { params: { id, r } });
};

/**
 * 获取相似MV
 * @param mvid MV ID
 */
export const getSimiMV = (mvid: number) => {
  return request.get<{
    mvs: MV[];
  }>('/simi/mv', { params: { mvid } });
};

/**
 * 获取全部MV
 * @param params 筛选参数
 */
export const getAllMV = (params: AllMVParams) => {
  return request.get<{
    data: MV[];
    count: number;
    hasMore: boolean;
  }>('/mv/all', { params });
};

/**
 * 获取最新MV
 * @param area 地区，可选值：全部,内地,港台,欧美,日本,韩国
 * @param limit 返回数量，默认30
 */
export const getNewMV = (area = '全部', limit = 30) => {
  return request.get<{
    data: MV[];
  }>('/mv/first', { params: { area, limit } });
};

/**
 * 获取网易出品MV
 * @param limit 返回数量，默认30
 * @param offset 偏移数量，用于分页
 */
export const getExclusiveMV = (limit = 30, offset = 0) => {
  return request.get<{
    data: MV[];
    count: number;
    hasMore: boolean;
  }>('/mv/exclusive/rcmd', { params: { limit, offset } });
};

/**
 * 获取MV排行榜
 * @param area 地区，可选值：全部,内地,港台,欧美,日本,韩国
 * @param limit 返回数量，默认30
 * @param offset 偏移数量，用于分页
 */
export const getTopMV = (area = '全部', limit = 30, offset = 0) => {
  return request.get<{
    data: MV[];
    count: number;
    hasMore: boolean;
  }>('/top/mv', { params: { area, limit, offset } });
};

/**
 * 收藏/取消收藏MV
 * @param id MV ID
 * @param t 1:收藏 2:取消收藏
 */
export const subscribeMV = (id: number, t: 1 | 2) => {
  return request.get('/mv/sub', { params: { mvid: id, t } });
};