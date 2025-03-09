/**
 * 歌手相关API
 * @description 包含歌手列表、歌手详情、歌手歌曲等接口
 */
import request from '@/utils/request';
import { withCache } from '@/utils/apiCache';
import type { Artist, ArtistDetail, ArtistParams, ArtistSong, ArtistAlbum } from '@/types/artist';
import type { MV } from '@/types/mv';

interface BaseResponse {
  code: number;
}

interface ArtistListResponse extends BaseResponse {
  artists: Artist[];
  more: boolean;
}

interface ArtistDetailResponse extends BaseResponse {
  data: ArtistDetail;
}

interface ArtistSongsResponse extends BaseResponse {
  songs: ArtistSong[];
  more: boolean;
}

interface ArtistAlbumsResponse extends BaseResponse {
  hotAlbums: ArtistAlbum[];
  more: boolean;
}

interface ArtistMVsResponse extends BaseResponse {
  mvs: MV[];
  hasMore: boolean;
}

interface SimilarArtistsResponse extends BaseResponse {
  artists: Artist[];
}

/**
 * 获取歌手列表
 * @param params 筛选参数
 */
export const getArtists = (params: ArtistParams) => {
  return request.get<ArtistListResponse>('/artist/list', { params });
};

/**
 * 获取歌手详情
 * @param id 歌手ID
 */
export const getArtistDetail = (id: number) => {
  return request.get<ArtistDetailResponse>('/artist/detail', { params: { id } });
};

/**
 * 获取歌手热门歌曲
 * @param id 歌手ID
 */
export const getArtistHotSongs = (id: number) => {
  return request.get<ArtistSongsResponse>('/artist/top/song', { params: { id } });
};

/**
 * 获取歌手专辑
 * @param id 歌手ID
 * @param limit 返回数量
 * @param offset 偏移数量
 */
export const getArtistAlbums = (id: number, limit = 30, offset = 0) => {
  return request.get<ArtistAlbumsResponse>('/artist/album', { params: { id, limit, offset } });
};

/**
 * 获取歌手MV
 * @param id 歌手ID
 * @param limit 返回数量
 * @param offset 偏移数量
 */
export const getArtistMVs = (id: number, limit = 30, offset = 0) => {
  return request.get<ArtistMVsResponse>('/artist/mv', { params: { id, limit, offset } });
};

/**
 * 收藏/取消收藏歌手
 * @param id 歌手ID
 * @param t 1:收藏 2:取消收藏
 */
export const followArtist = (id: number, t: 1 | 2) => {
  return request.get<BaseResponse>('/artist/sub', { params: { id, t } });
};

/**
 * 获取相似歌手
 * @param id 歌手ID
 */
export const getSimilarArtists = (id: number) => {
  return request.get<SimilarArtistsResponse>('/simi/artist', { params: { id } });
};

/**
 * 获取歌手分类列表
 * @param type 类型: -1:全部, 1:男歌手, 2:女歌手, 3:乐队
 * @param area 地区: -1:全部, 7华语, 96欧美, 8:日本, 16韩国, 0:其他
 * @param initial 按首字母索引查找参数: 热门传-1, #传0, A-Z传对应字母
 * @param limit 取出数量，默认为30
 * @param offset 偏移数量，用于分页，默认为0
 * @returns Promise<ArtistListResponse> 歌手列表数据
 */
export function getArtistList(
  type = -1,
  area = -1,
  initial = -1,
  limit = 30,
  offset = 0
) {
  return request.get<ArtistListResponse>('/artist/list', {
    params: { type: String(type), area, initial, limit, offset }
  });
}

/**
 * 获取热门歌手
 * @param limit 取出数量，默认为30
 * @param offset 偏移数量，用于分页，默认为0
 * @returns Promise<ArtistListResponse> 热门歌手数据
 */
export function getTopArtists(limit = 30, offset = 0) {
  return request.get<ArtistListResponse>('/top/artists', { params: { limit, offset } });
}

/**
 * 获取歌手单曲
 * @param id 歌手id
 * @returns Promise<ArtistSongsResponse> 歌手单曲数据
 */
export function getArtistSongs(id: number) {
  return request.get<ArtistSongsResponse>('/artist/songs', { params: { id } });
}