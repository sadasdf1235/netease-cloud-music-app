/**
 * 专辑相关API
 * @description 包含专辑详情、新专辑等接口
 */
import request from '@/utils/request';
import type { Album, AlbumDetail, AlbumDynamic, NewAlbumParams } from '@/types/album';
import type { Song } from '@/types/song';
import { get } from '@/utils/request';

interface BaseResponse {
  code: number;
}

interface AlbumDetailResponse extends BaseResponse {
  code: number;
  album: Album;
  songs: Song[];
}

interface AlbumDynamicResponse extends BaseResponse {
  code: number;
  data: AlbumDynamic;
}

interface NewAlbumsResponse extends BaseResponse {
  code: number;
  albums: Album[];
  total: number;
}

interface ArtistAlbumsResponse extends BaseResponse {
  code: number;
  hotAlbums: Album[];
  more: boolean;
}

/**
 * 获取专辑详情
 * @param id 专辑ID
 */
export const getAlbumDetail = (id: number): Promise<AlbumDetailResponse> => {
  return request.get<AlbumDetailResponse>('/album', { params: { id } });
};

/**
 * 获取专辑动态信息
 * @param id 专辑ID
 */
export const getAlbumDynamic = (id: number): Promise<AlbumDynamicResponse> => {
  return request.get<AlbumDynamicResponse>('/album/detail/dynamic', { params: { id } });
};

/**
 * 收藏/取消收藏专辑
 * @param id 专辑ID
 * @param t 1:收藏 2:取消收藏
 */
export const subscribeAlbum = (id: number, t: 1 | 2): Promise<BaseResponse> => {
  return request.get<BaseResponse>('/album/sub', { params: { id, t } });
};

/**
 * 获取新专辑
 * @param params 筛选参数
 */
export const getNewAlbums = (params?: NewAlbumParams): Promise<NewAlbumsResponse> => {
  return request.get<NewAlbumsResponse>('/album/new', { params });
};

/**
 * 获取全部新专辑
 * @param params 筛选参数
 */
export const getAllNewAlbums = (params?: NewAlbumParams): Promise<NewAlbumsResponse> => {
  return request.get<NewAlbumsResponse>('/album/newest', { params });
};

/**
 * 获取专辑评论
 * @param id 专辑ID
 * @param limit 返回数量
 * @param offset 偏移数量
 * @param before 分页参数,取上一页最后一项的 time 获取下一页数据
 */
export const getAlbumComments = (id: number, limit = 20, offset = 0, before?: number): Promise<BaseResponse> => {
  return request.get<BaseResponse>('/comment/album', { params: { id, limit, offset, before } });
};

/**
 * 获取歌手专辑
 * @param id 歌手ID
 * @param limit 返回数量
 * @param offset 偏移数量
 */
export const getArtistAlbums = (id: number, limit = 30, offset = 0): Promise<ArtistAlbumsResponse> => {
  return request.get<ArtistAlbumsResponse>('/artist/album', { params: { id, limit, offset } });
};

/**
 * 获取相关专辑
 * @param id 专辑id
 */
export function getRelatedAlbums(id: number) {
  return get('/album/related', { id });
}