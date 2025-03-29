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
import * as musicApi from './modules/music';
import * as mvApi from './modules/mv';
import * as musicSongApi from './modules/music-song'; // 新的合并模块
import * as playlistApi from './modules/playlist';
import * as searchApi from './modules/search';
import * as songApi from './modules/song';
import * as toplistApi from './modules/toplist';
import * as userApi from './modules/user';

// 注意: music.ts和song.ts中存在重复的API函数
// 这些重复函数已合并到music-song.ts中
// TODO: 后续应该完全迁移到musicSongApi，移除musicApi和songApi

export {
  albumApi,
  artistApi,
  commentApi,
  musicApi,
  mvApi,
  musicSongApi, // 导出新的合并模块
  playlistApi,
  searchApi,
  songApi,
  toplistApi,
  userApi
};

// 为了兼容性，直接导出一些常用函数
// 现在从合并后的模块导出
export const getBanners = musicSongApi.getBanners;
export const getToplist = toplistApi.getAllToplist;
export const getToplistDetail = toplistApi.getToplistDetail;