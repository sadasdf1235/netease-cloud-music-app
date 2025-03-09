/**
 * 用户相关API
 * @description 包含登录、用户信息、关注等接口
 */
import { get, post } from '@/utils/request';
import { withSimpleCache } from '@/utils/apiCache';

/**
 * 手机号登录
 * @param phone 手机号码
 * @param password 密码
 * @param countrycode 国家区号，默认86（中国）
 * @returns Promise<any> 登录结果
 */
export function loginByPhone(phone: string, password: string, countrycode = '86') {
  return post('/login/cellphone', { phone, password, countrycode });
}

/**
 * 邮箱登录
 * @param email 邮箱地址
 * @param password 密码
 * @returns Promise<any> 登录结果
 */
export function loginByEmail(email: string, password: string) {
  return post('/login', { email, password });
}

/**
 * 退出登录
 * @returns Promise<any> 退出结果
 */
export function logout() {
  return post('/logout');
}

/**
 * 获取登录状态
 * @returns Promise<any> 登录状态
 */
export function getLoginStatus() {
  return get('/login/status');
}

/**
 * 获取用户详情
 * @param uid 用户id
 * @param useCache 是否使用缓存，默认为true
 * @returns Promise<any> 用户详情
 */
export function getUserDetail(uid: number, useCache = true) {
  const apiCall = () => get('/user/detail', { uid });
  return useCache
    ? withSimpleCache(apiCall, `user_detail_${uid}`, 60 * 60 * 1000) // 缓存1小时
    : apiCall();
}

/**
 * 获取用户信息，登录后调用
 * @returns Promise<any> 用户信息
 */
export function getUserAccount() {
  return get('/user/account');
}

/**
 * 获取用户歌单
 * @param uid 用户id
 * @param limit 取出数量，默认为30
 * @param offset 偏移数量，用于分页，默认为0
 * @returns Promise<any> 用户歌单
 */
export function getUserPlaylists(uid: number, limit = 30, offset = 0) {
  return get('/user/playlist', { uid, limit, offset });
}

/**
 * 关注/取消关注用户
 * @param id 用户id
 * @param t 操作类型，1为关注，其他为取消关注
 * @returns Promise<any> 操作结果
 */
export function followUser(id: number, t: 1 | 0) {
  return get('/follow', { id, t });
}

/**
 * 获取用户关注列表
 * @param uid 用户id
 * @param limit 取出数量，默认为30
 * @param offset 偏移数量，用于分页，默认为0
 * @returns Promise<any> 用户关注列表
 */
export function getUserFollows(uid: number, limit = 30, offset = 0) {
  return get('/user/follows', { uid, limit, offset });
}

/**
 * 获取用户粉丝列表
 * @param uid 用户id
 * @param limit 取出数量，默认为30
 * @param offset 偏移数量，用于分页，默认为0
 * @returns Promise<any> 用户粉丝列表
 */
export function getUserFolloweds(uid: number, limit = 30, offset = 0) {
  return get('/user/followeds', { uid, limit, offset });
}

/**
 * 获取用户播放记录
 * @param uid 用户id
 * @param type 类型，1为weekData，0为allData
 * @returns Promise<any> 用户播放记录
 */
export function getUserRecord(uid: number, type = 1) {
  return get('/user/record', { uid, type });
}