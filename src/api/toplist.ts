import request from './request'

/**
 * 获取所有榜单
 */
export function getAllTopLists() {
  return request({
    url: '/toplist',
    method: 'get'
  })
}

/**
 * 获取榜单详情
 * @param id 榜单id
 */
export function getTopListDetail(id: number) {
  return request({
    url: '/playlist/detail',
    method: 'get',
    params: { id }
  })
}

/**
 * 获取榜单歌曲
 * @param id 榜单id
 * @param limit 取出歌曲数量
 * @param offset 偏移数量，用于分页
 */
export function getTopListTracks(id: number, limit = 30, offset = 0) {
  return request({
    url: '/playlist/track/all',
    method: 'get',
    params: { id, limit, offset }
  })
}