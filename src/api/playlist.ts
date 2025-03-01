import request from './request'

/**
 * 获取推荐歌单
 * @param limit 取出数量，默认为30
 */
export function getRecommendPlaylists(limit = 30) {
  return request({
    url: '/personalized',
    method: 'get',
    params: { limit }
  })
}

/**
 * 获取歌单详情
 * @param id 歌单id
 */
export function getPlaylistDetail(id: number) {
  return request({
    url: '/playlist/detail',
    method: 'get',
    params: { id }
  })
}

/**
 * 获取歌单所有歌曲
 * @param id 歌单id
 * @param limit 限制获取歌曲的数量
 * @param offset 偏移数量，用于分页
 */
export function getPlaylistTracks(id: number, limit = 30, offset = 0) {
  return request({
    url: '/playlist/track/all',
    method: 'get',
    params: { id, limit, offset }
  })
}

/**
 * 获取歌单分类
 */
export function getPlaylistCategories() {
  return request({
    url: '/playlist/catlist',
    method: 'get'
  })
}

/**
 * 获取热门歌单分类
 */
export function getHotPlaylistCategories() {
  return request({
    url: '/playlist/hot',
    method: 'get'
  })
}

/**
 * 获取网友精选歌单
 * @param cat 歌单分类
 * @param limit 取出歌单数量，默认为50
 * @param offset 偏移数量，用于分页
 * @param order 可选值为 'new' 和 'hot'，分别对应最新和最热，默认为 'hot'
 */
export function getTopPlaylists(cat = '全部', limit = 50, offset = 0, order = 'hot') {
  return request({
    url: '/top/playlist',
    method: 'get',
    params: {
      cat,
      limit,
      offset,
      order
    }
  })
}

/**
 * 获取精品歌单
 * @param cat 歌单分类
 * @param limit 取出歌单数量，默认为20
 * @param before 分页参数，取上一页最后一个歌单的updateTime
 */
export function getHighqualityPlaylists(cat = '全部', limit = 20, before?: number) {
  return request({
    url: '/top/playlist/highquality',
    method: 'get',
    params: {
      cat,
      limit,
      before
    }
  })
}

/**
 * 收藏/取消收藏歌单
 * @param id 歌单id
 * @param t 类型,1:收藏,2:取消收藏
 */
export function subscribePlaylist(id: number, t: 1 | 2) {
  return request({
    url: '/playlist/subscribe',
    method: 'post',
    params: {
      id,
      t
    }
  })
}

/**
 * 获取用户歌单
 * @param uid 用户id
 * @param limit 取出数量，默认为30
 * @param offset 偏移数量，用于分页
 */
export function getUserPlaylists(uid: number, limit = 30, offset = 0) {
  return request({
    url: '/user/playlist',
    method: 'get',
    params: {
      uid,
      limit,
      offset
    }
  })
}

/**
 * 创建歌单
 * @param name 歌单名称
 * @param privacy 是否设置为隐私歌单，默认否，传'10'则设置成隐私歌单
 * @param type 歌单类型，默认'NORMAL'，传'VIDEO'则为视频歌单
 */
export function createPlaylist(name: string, privacy = false, type = 'NORMAL') {
  return request({
    url: '/playlist/create',
    method: 'post',
    params: {
      name,
      privacy: privacy ? 10 : 0,
      type
    }
  })
}

/**
 * 删除歌单
 * @param id 歌单id
 */
export function deletePlaylist(id: number) {
  return request({
    url: '/playlist/delete',
    method: 'post',
    params: { id }
  })
}

/**
 * 对歌单添加或删除歌曲
 * @param op 操作类型，'add'添加，'del'删除
 * @param pid 歌单id
 * @param tracks 歌曲id，可多个，用逗号分隔
 */
export function manipulatePlaylistTracks(op: 'add' | 'del', pid: number, tracks: string) {
  return request({
    url: '/playlist/tracks',
    method: 'post',
    params: {
      op,
      pid,
      tracks
    }
  })
}