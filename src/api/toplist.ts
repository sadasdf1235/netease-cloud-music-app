import request from '@/utils/request';
import type { ToplistInfo, ToplistSong } from '@/types/toplist';

/**
 * 获取所有榜单
 */
export const getAllToplist = () => {
  return request.get<{
    list: ToplistInfo[];
  }>('/toplist');
};

/**
 * 获取榜单详情
 * @param id 榜单ID
 */
export const getToplistDetail = (id: number) => {
  return request.get<{
    playlist: ToplistInfo;
    songs: ToplistSong[];
  }>('/playlist/detail', {
    params: { id }
  });
};

/**
 * 获取榜单歌曲
 * @param id 榜单ID
 */
export const getToplistSongs = (id: number) => {
  return request.get<{
    songs: ToplistSong[];
  }>('/playlist/track/all', {
    params: { id }
  });
};