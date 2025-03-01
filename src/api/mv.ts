import request from './request'

/**
 * 获取MV详情
 * @param mvid MV的id
 */
export function getMvDetail(mvid: number) {
  return request({
    url: '/mv/detail',
    method: 'get',
    params: { mvid }
  })
}

/**
 * 获取MV播放地址
 * @param id MV的id
 * @param r 分辨率，默认1080，可选值：1080, 720, 480, 240
 */
export function getMvUrl(id: number, r = 1080) {
  return request({
    url: '/mv/url',
    method: 'get',
    params: { id, r }
  })
}

/**
 * 获取相似MV
 * @param mvid MV的id
 */
export function getSimiMv(mvid: number) {
  return request({
    url: '/simi/mv',
    method: 'get',
    params: { mvid }
  })
}

/**
 * 获取最新MV
 * @param area 地区，可选值：全部、内地、港台、欧美、日本、韩国，默认全部
 * @param limit 取出数量，默认30
 */
export function getNewMv(area = '全部', limit = 30) {
  return request({
    url: '/mv/first',
    method: 'get',
    params: { area, limit }
  })
}

/**
 * 获取网易出品MV
 * @param limit 取出数量，默认30
 * @param offset 偏移数量，用于分页
 */
export function getExclusiveMv(limit = 30, offset = 0) {
  return request({
    url: '/mv/exclusive/rcmd',
    method: 'get',
    params: { limit, offset }
  })
}

/**
 * 获取MV排行榜
 * @param area 地区，可选值：全部、内地、港台、欧美、日本、韩国，默认全部
 * @param limit 取出数量，默认30
 * @param offset 偏移数量，用于分页
 */
export function getTopMv(area = '全部', limit = 30, offset = 0) {
  return request({
    url: '/top/mv',
    method: 'get',
    params: { area, limit, offset }
  })
}

/**
 * 收藏/取消收藏MV
 * @param id MV的id
 * @param t 操作类型，1为收藏，2为取消收藏
 */
export function subMv(id: number, t: 1 | 2) {
  return request({
    url: '/mv/sub',
    method: 'post',
    params: { id, t }
  })
}

/**
 * 获取已收藏MV列表
 */
export function getSubMvList() {
  return request({
    url: '/mv/sublist',
    method: 'get'
  })
}