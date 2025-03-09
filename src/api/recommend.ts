import request from '@/utils/request';
import type { Banner, PersonalizedPlaylist, NewSong, PersonalizedMV, PrivateContent } from '@/types/recommend';

/**
 * 获取轮播图
 */
export const getBanner = () => {
  return request.get<{ banners: Banner[] }>('/banner');
};

/**
 * 获取推荐歌单
 * @param limit 返回数量
 */
export const getPersonalized = (limit = 30) => {
  return request.get<{ result: PersonalizedPlaylist[] }>('/personalized', {
    params: { limit },
  });
};

/**
 * 获取最新音乐
 * @param limit 返回数量
 */
export const getNewSongs = (limit = 10) => {
  return request.get<{ result: NewSong[] }>('/personalized/newsong', {
    params: { limit },
  });
};

/**
 * 获取推荐MV
 * @param limit 返回数量
 */
export const getPersonalizedMV = (limit = 10) => {
  return request.get<{ result: PersonalizedMV[] }>('/personalized/mv', {
    params: { limit },
  });
};

/**
 * 获取独家放送
 * @param limit 返回数量
 */
export const getPrivateContent = (limit = 3) => {
  return request.get<{ result: PrivateContent[] }>('/personalized/privatecontent', {
    params: { limit },
  });
};