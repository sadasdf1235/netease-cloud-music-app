import request from './request'

/**
 * 获取专辑详情
 * @param id 专辑id
 */
export function getAlbumDetail(id: number) {
  return request({
    url: '/album',
    method: 'get',
    params: { id }
  })
}

/**
 * 获取专辑动态信息
 * @param id 专辑id
 */
export function getAlbumDynamicInfo(id: number) {
  return request({
    url: '/album/detail/dynamic',
    method: 'get',
    params: { id }
  })
}

/**
 * 获取最新专辑
 */
export function getNewestAlbums() {
  return request({
    url: '/album/newest',
    method: 'get'
  })
}

/**
 * 获取专辑评论
 * @param id 专辑id
 * @param limit 取出评论数量，默认为20
 * @param offset 偏移数量，用于分页
 * @param before 分页参数，上一页最后一项的time
 */
export function getAlbumComments(id: number, limit = 20, offset = 0, before?: number) {
  return request({
    url: '/comment/album',
    method: 'get',
    params: {
      id,
      limit,
      offset,
      before
    }
  })
}

/**
 * 收藏/取消收藏专辑
 * @param id 专辑id
 * @param t 操作类型：1 收藏，2 取消收藏
 */
export function followAlbum(id: number, t: 1 | 2) {
  return request({
    url: '/album/sub',
    method: 'post',
    params: {
      id,
      t
    }
  })
}

/**
 * 获取已收藏专辑列表
 * @param limit 取出数量，默认为25
 * @param offset 偏移数量，用于分页
 */
export function getFollowedAlbums(limit = 25, offset = 0) {
  return request({
    url: '/album/sublist',
    method: 'get',
    params: {
      limit,
      offset
    }
  })
}