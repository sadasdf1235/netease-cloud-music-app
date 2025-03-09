import request from '@/utils/request';
import type { Song, Lyric } from '@/types/song';

/**
 * 获取歌曲URL
 * @param id 歌曲ID
 */
export const getSongUrl = (id: number) => {
  return request.get('/song/url', {
    params: { id },
  });
};

/**
 * 获取歌曲详情
 * @param ids 歌曲ID数组
 */
export const getSongDetail = (ids: number[]) => {
  return request.get<{ songs: Song[] }>('/song/detail', {
    params: { ids: ids.join(',') },
  });
};

/**
 * 获取歌词
 * @param id 歌曲ID
 */
export const getLyric = (id: number) => {
  return request.get<Lyric>('/lyric', {
    params: { id },
  });
};

/**
 * 喜欢音乐
 * @param id 歌曲ID
 * @param like 是否喜欢
 */
export const likeSong = (id: number, like: boolean) => {
  return request.post('/like', {
    id,
    like,
  });
};

/**
 * 获取相似歌曲
 * @param id 歌曲ID
 */
export const getSimilarSongs = (id: number) => {
  return request.get('/simi/song', {
    params: { id },
  });
};

/**
 * 获取包含这首歌的歌单
 * @param id 歌曲ID
 */
export const getSongPlaylists = (id: number) => {
  return request.get('/simi/playlist', {
    params: { id },
  });
};