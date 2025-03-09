import request from '@/utils/request';
import type { Album, AlbumDetail, AlbumDynamic, NewAlbumParams } from '@/types/album';

/**
 * 获取专辑详情
 * @param id 专辑ID
 */
export const getAlbumDetail = (id: number) => {
  return request.get<{
    album: Album;
    songs: Album['songs'];
  }>('/album', { params: { id } });
};

/**
 * 获取专辑动态信息
 * @param id 专辑ID
 */
export const getAlbumDynamic = (id: number) => {
  return request.get<AlbumDynamic>('/album/detail/dynamic', { params: { id } });
};

/**
 * 收藏/取消收藏专辑
 * @param id 专辑ID
 * @param t 1:收藏 2:取消收藏
 */
export const subscribeAlbum = (id: number, t: 1 | 2) => {
  return request.get('/album/sub', { params: { id, t } });
};

/**
 * 获取新专辑
 * @param params 筛选参数
 */
export const getNewAlbums = (params?: NewAlbumParams) => {
  return request.get<{
    albums: Album[];
    total: number;
  }>('/album/new', { params });
};

/**
 * 获取全部新专辑
 * @param params 筛选参数
 */
export const getAllNewAlbums = (params?: NewAlbumParams) => {
  return request.get<{
    albums: Album[];
    total: number;
  }>('/album/newest', { params });
};

/**
 * 获取专辑评论
 * @param id 专辑ID
 * @param limit 返回数量
 * @param offset 偏移数量
 * @param before 分页参数,取上一页最后一项的 time 获取下一页数据
 */
export const getAlbumComments = (id: number, limit = 20, offset = 0, before?: number) => {
  return request.get('/comment/album', { params: { id, limit, offset, before } });
};

/**
 * 获取歌手专辑
 * @param id 歌手ID
 * @param limit 返回数量
 * @param offset 偏移数量
 */
export const getArtistAlbums = (id: number, limit = 30, offset = 0) => {
  return request.get<{
    hotAlbums: Album[];
    more: boolean;
  }>('/artist/album', { params: { id, limit, offset } });
};