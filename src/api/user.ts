import request from '@/utils/request';
import type { LoginParams, LoginResponse, UserProfile } from '@/types/user';

/**
 * 手机号登录
 * @param params 登录参数
 */
export const login = (phone: string, password: string) => {
  return request.post<LoginResponse>('/login/cellphone', {
    phone,
    password,
  });
};

/**
 * 退出登录
 */
export const logout = () => {
  return request.post('/logout');
};

/**
 * 获取用户详情
 */
export const getUserProfile = () => {
  return request.get<UserProfile>('/user/detail');
};

/**
 * 获取用户歌单
 * @param uid 用户ID
 */
export const getUserPlaylists = (uid: number) => {
  return request.get('/user/playlist', {
    params: { uid },
  });
};

/**
 * 获取用户喜欢的音乐列表
 * @param uid 用户ID
 */
export const getUserLikedSongs = (uid: number) => {
  return request.get('/likelist', {
    params: { uid },
  });
};

/**
 * 获取用户关注列表
 * @param uid 用户ID
 */
export const getUserFollows = (uid: number) => {
  return request.get('/user/follows', {
    params: { uid },
  });
};

/**
 * 获取用户粉丝列表
 * @param uid 用户ID
 */
export const getUserFolloweds = (uid: number) => {
  return request.get('/user/followeds', {
    params: { uid },
  });
};

/**
 * 关注/取消关注用户
 * @param id 用户ID
 * @param t 1: 关注, 0: 取消关注
 */
export const followUser = (id: number, t: 0 | 1) => {
  return request.post('/follow', {
    id,
    t,
  });
};

/**
 * 更新用户信息
 * @param params 用户信息
 */
export const updateUserProfile = (params: Partial<UserProfile>) => {
  return request.post('/user/update', params);
};

/**
 * 更新用户头像
 * @param file 图片文件
 */
export const updateUserAvatar = (file: File) => {
  const formData = new FormData();
  formData.append('imgFile', file);
  return request.post('/avatar/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};