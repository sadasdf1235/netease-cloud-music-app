/**
 * API模块导出索引文件
 * @description 统一导出所有API模块，方便在项目中引用
 */

// 导出请求工具
export { default as request, get, post } from '@/utils/request';

// 导出模块化API
import * as albumApi from './modules/album';
import * as artistApi from './modules/artist';
import * as commentApi from './modules/comment';
import * as musicSongApi from './modules/music-song'; // 合并后的主要模块
import * as mvApi from './modules/mv';
import * as playlistApi from './modules/playlist';
import * as searchApi from './modules/search';
import * as toplistApi from './modules/toplist';
import * as userApi from './modules/user';

// 导出所有API模块
export {
  albumApi,
  artistApi,
  commentApi,
  mvApi,
  musicSongApi, // 音乐和歌曲API的统一模块
  playlistApi,
  searchApi,
  toplistApi,
  userApi
};

// 直接导出常用函数，方便使用
export const getBanners = musicSongApi.getBanners;
export const getToplist = toplistApi.getAllToplist;
export const getToplistDetail = toplistApi.getToplistDetail;
export const getSongUrl = musicSongApi.getSongUrl;
export const getSongDetail = musicSongApi.getSongDetail;
export const getLyric = musicSongApi.getLyric;
export const getRecommendPlaylists = musicSongApi.getRecommendPlaylists;
export const getNewSongs = musicSongApi.getNewSongs;