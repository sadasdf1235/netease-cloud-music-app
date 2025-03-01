import request from './request'

/**
 * 获取歌手列表
 * @param type 歌手类型: -1:全部 1:男歌手 2:女歌手 3:乐队
 * @param area 歌手区域: -1:全部 7华语 96欧美 8:日本 16韩国 0:其他
 * @param initial 按首字母索引查找参数: a-z/A-Z
 * @param limit 返回数量，默认为30
 * @param offset 偏移数量，用于分页
 */
export function getArtistList(type = -1, area = -1, initial = -1, limit = 30, offset = 0) {
  return request({
    url: '/artist/list',
    method: 'get',
    params: {
      type,
      area,
      initial,
      limit,
      offset
    }
  })
}

/**
 * 获取歌手详情
 * @param id 歌手id
 */
export function getArtistDetail(id: number) {
  return request({
    url: '/artist/detail',
    method: 'get',
    params: { id }
  })
}

/**
 * 获取歌手单曲
 * @param id 歌手id
 */
export function getArtistSongs(id: number) {
  return request({
    url: '/artists',
    method: 'get',
    params: { id }
  })
}

/**
 * 获取歌手专辑
 * @param id 歌手id
 * @param limit 返回数量，默认为30
 * @param offset 偏移数量，用于分页
 */
export function getArtistAlbums(id: number, limit = 30, offset = 0) {
  return request({
    url: '/artist/album',
    method: 'get',
    params: {
      id,
      limit,
      offset
    }
  })
}

/**
 * 获取歌手MV
 * @param id 歌手id
 */
export function getArtistMvs(id: number) {
  return request({
    url: '/artist/mv',
    method: 'get',
    params: { id }
  })
}

/**
 * 获取相似歌手
 * @param id 歌手id
 */
export function getSimilarArtists(id: number) {
  return request({
    url: '/simi/artist',
    method: 'get',
    params: { id }
  })
}

/**
 * 歌手榜
 * @param type 地区：1: 华语, 2: 欧美, 3: 韩国, 4: 日本
 */
export function getTopArtists(type = 1) {
  return request({
    url: '/toplist/artist',
    method: 'get',
    params: { type }
  })
}

/**
 * 收藏/取消收藏歌手
 * @param id 歌手id
 * @param t 操作类型：1 收藏，2 取消收藏
 */
export function followArtist(id: number, t: 1 | 2) {
  return request({
    url: '/artist/sub',
    method: 'post',
    params: {
      id,
      t
    }
  })
}

/**
 * 获取收藏的歌手列表
 */
export function getFollowedArtists() {
  return request({
    url: '/artist/sublist',
    method: 'get'
  })
}