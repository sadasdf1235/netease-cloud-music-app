/**
 * API模块导出索引文件
 * @description 统一导出所有API模块，方便在项目中引用
 */

// 导出请求工具
export { default as request, get, post } from './request';

// 导出API模块
import * as albumApi from './modules/album';
import * as artistApi from './modules/artist';
import * as commentApi from './modules/comment';
import * as playlistApi from './modules/playlist';
import * as searchApi from './modules/search';
import * as songApi from './modules/song';
import * as userApi from './modules/user';

export {
  albumApi,
  artistApi,
  commentApi,
  playlistApi,
  searchApi,
  songApi,
  userApi
};

/**
 * 获取首页轮播图
 * @param type 资源类型: 0-PC, 1-Android, 2-iPhone, 3-iPad
 * @returns 轮播图数据
 */
export function getBanners(type = 0) {
  return get('/banner', { type });
}

/**
 * 获取排行榜数据
 * @returns 所有榜单数据
 */
export function getToplist() {
  return get('/toplist');
}

/**
 * 获取所有榜单内容摘要
 * @returns 所有榜单内容摘要
 */
export function getToplistDetail() {
  return get('/toplist/detail');
}