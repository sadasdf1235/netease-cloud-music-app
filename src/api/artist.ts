import request from '@/utils/request';
import type { Artist, ArtistDetail, ArtistParams, ArtistSong, ArtistAlbum } from '@/types/artist';
import type { MV } from '@/types/mv';

/**
 * 获取歌手列表
 * @param params 筛选参数
 */
export const getArtists = (params: ArtistParams) => {
  return request.get<{
    artists: Artist[];
    more: boolean;
  }>('/artist/list', { params });
};

/**
 * 获取歌手详情
 * @param id 歌手ID
 */
export const getArtistDetail = (id: number) => {
  return request.get<{
    data: ArtistDetail;
  }>('/artist/detail', { params: { id } });
};

/**
 * 获取歌手热门歌曲
 * @param id 歌手ID
 */
export const getArtistHotSongs = (id: number) => {
  return request.get<{
    songs: ArtistSong[];
  }>('/artist/top/song', { params: { id } });
};

/**
 * 获取歌手专辑
 * @param id 歌手ID
 * @param limit 返回数量
 * @param offset 偏移数量
 */
export const getArtistAlbums = (id: number, limit = 30, offset = 0) => {
  return request.get<{
    hotAlbums: ArtistAlbum[];
    more: boolean;
  }>('/artist/album', { params: { id, limit, offset } });
};

/**
 * 获取歌手MV
 * @param id 歌手ID
 * @param limit 返回数量
 * @param offset 偏移数量
 */
export const getArtistMVs = (id: number, limit = 30, offset = 0) => {
  return request.get<{
    mvs: MV[];
    hasMore: boolean;
  }>('/artist/mv', { params: { id, limit, offset } });
};

/**
 * 收藏/取消收藏歌手
 * @param id 歌手ID
 * @param t 1:收藏 2:取消收藏
 */
export const followArtist = (id: number, t: 1 | 2) => {
  return request.get('/artist/sub', { params: { id, t } });
};

/**
 * 获取相似歌手
 * @param id 歌手ID
 */
export const getSimilarArtists = (id: number) => {
  return request.get<{
    artists: Artist[];
  }>('/simi/artist', { params: { id } });
};