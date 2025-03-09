/**
 * 专辑相关API
 * @description 包含专辑详情、新专辑等接口
 */
import { get } from '@/utils/request';
import type { Album, AlbumDetail, AlbumDynamic } from '@/types/album';
import type { Song } from '@/types/song';

interface BaseResponse {
  code: number;
}

interface AlbumDetailResponse extends BaseResponse {
  album: Album;
  songs: Song[];
}

interface AlbumDynamicResponse extends BaseResponse {
  data: AlbumDynamic;
}

interface NewAlbumsResponse extends BaseResponse {
  albums: Album[];
  total: number;
}

interface ArtistAlbumsResponse extends BaseResponse {
  hotAlbums: Album[];
  more: boolean;
}

interface RelatedAlbumsResponse extends BaseResponse {
  albums: Album[];
}

/**
 * 获取专辑详情
 * @param id 专辑ID
 */
export function getAlbumDetail(id: number): Promise<AlbumDetailResponse> {
  return get<AlbumDetailResponse>('/album', { id });
}

/**
 * 获取专辑动态信息
 * @param id 专辑ID
 */
export function getAlbumDynamic(id: number): Promise<AlbumDynamicResponse> {
  return get<AlbumDynamicResponse>('/album/detail/dynamic', { id });
}

/**
 * 收藏/取消收藏专辑
 * @param id 专辑ID
 * @param t 1:收藏 2:取消收藏
 */
export function subscribeAlbum(id: number, t: 1 | 2): Promise<BaseResponse> {
  return get<BaseResponse>('/album/sub', { id, t });
}

/**
 * 获取相关专辑
 * @param id 专辑id
 */
export function getRelatedAlbums(id: number): Promise<RelatedAlbumsResponse> {
  return get<RelatedAlbumsResponse>('/album/related', { id });
}

/**
 * 获取新专辑
 * @param limit 返回数量，默认为30
 * @param offset 偏移数量，用于分页，默认为0
 * @param area ALL:全部,ZH:华语,EA:欧美,KR:韩国,JP:日本
 */
export function getNewAlbums(limit = 30, offset = 0, area: 'ALL' | 'ZH' | 'EA' | 'KR' | 'JP' = 'ALL'): Promise<NewAlbumsResponse> {
  return get<NewAlbumsResponse>('/album/new', { limit, offset, area });
}

/**
 * 获取全部新专辑
 */
export function getAllNewAlbums(): Promise<NewAlbumsResponse> {
  return get<NewAlbumsResponse>('/album/newest');
}

/**
 * 获取专辑评论
 * @param id 专辑ID
 * @param limit 返回数量，默认为20
 * @param offset 偏移数量，用于分页，默认为0
 * @param before 分页参数,取上一页最后一项的 time 获取下一页数据
 */
export function getAlbumComments(id: number, limit = 20, offset = 0, before?: number): Promise<BaseResponse> {
  return get<BaseResponse>('/comment/album', { id, limit, offset, before });
}