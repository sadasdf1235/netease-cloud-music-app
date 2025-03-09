import request from '@/utils/request';
import type {
  Playlist,
  PlaylistCategory,
  CreatePlaylistParams,
  UpdatePlaylistParams,
  GetPlaylistParams,
  GetHighqualityPlaylistParams
} from '@/types/playlist';
import type { Song } from '@/types/song';

/**
 * 获取用户歌单
 * @param uid 用户ID
 */
export const getUserPlaylists = (uid: number) => {
  return request.get<{ playlist: Playlist[] }>('/user/playlist', {
    params: { uid },
  });
};

/**
 * 获取歌单详情
 * @param id 歌单ID
 */
export const getPlaylistDetail = (id: number) => {
  return request.get<{
    playlist: Playlist;
  }>('/playlist/detail', {
    params: { id }
  });
};

/**
 * 获取歌单分类
 */
export const getPlaylistCategories = () => {
  return request.get<{
    categories: Record<number, string>;
    sub: PlaylistCategory[];
  }>('/playlist/catlist');
};

/**
 * 获取热门歌单分类
 */
export const getHotPlaylistCategories = () => {
  return request.get<{
    tags: PlaylistCategory[];
  }>('/playlist/hot');
};

/**
 * 获取歌单列表
 */
export const getPlaylistsByCategory = (params: GetPlaylistParams) => {
  return request.get<{
    playlists: Playlist[];
    total: number;
  }>('/top/playlist', { params });
};

/**
 * 获取精品歌单
 */
export const getHighqualityPlaylists = (params: GetHighqualityPlaylistParams) => {
  return request.get<{
    playlists: Playlist[];
    total: number;
    more: boolean;
    lasttime: number;
  }>('/top/playlist/highquality', { params });
};

/**
 * 获取歌单所有歌曲
 */
export const getPlaylistTracks = (id: number, trackIds: number[]) => {
  return request.get<{
    songs: Song[];
  }>('/song/detail', {
    params: {
      ids: trackIds.join(',')
    }
  });
};

/**
 * 创建歌单
 */
export const createPlaylist = (params: CreatePlaylistParams) => {
  return request.post<{
    id: number;
    playlist: Playlist;
  }>('/playlist/create', params);
};

/**
 * 删除歌单
 */
export const deletePlaylist = (id: number) => {
  return request.post('/playlist/delete', {
    id
  });
};

/**
 * 更新歌单信息
 */
export const updatePlaylist = (params: UpdatePlaylistParams) => {
  return request.post('/playlist/update', params);
};

/**
 * 收藏/取消收藏歌单
 * @param id 歌单id
 * @param t 1:收藏,2:取消收藏
 */
export const subscribePlaylist = (id: number, t: 1 | 2) => {
  return request.post('/playlist/subscribe', {
    id,
    t
  });
};

/**
 * 歌单添加/删除歌曲
 * @param pid 歌单id
 * @param trackIds 歌曲id列表
 * @param op add: 添加, del: 删除
 */
export const updatePlaylistTracks = (pid: number, trackIds: number[], op: 'add' | 'del') => {
  return request.post('/playlist/tracks', {
    pid,
    tracks: trackIds.join(','),
    op
  });
};