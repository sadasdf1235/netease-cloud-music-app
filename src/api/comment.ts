import request from './request'

/**
 * 获取歌曲评论
 * @param id 歌曲id
 * @param limit 取出评论数量，默认为20
 * @param offset 偏移数量，用于分页
 * @param before 分页参数，上一页最后一项的time
 */
export function getSongComments(id: number, limit = 20, offset = 0, before?: number) {
  return request({
    url: '/comment/music',
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
 * 获取歌单评论
 * @param id 歌单id
 * @param limit 取出评论数量，默认为20
 * @param offset 偏移数量，用于分页
 * @param before 分页参数，上一页最后一项的time
 */
export function getPlaylistComments(id: number, limit = 20, offset = 0, before?: number) {
  return request({
    url: '/comment/playlist',
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
 * 获取MV评论
 * @param id MV id
 * @param limit 取出评论数量，默认为20
 * @param offset 偏移数量，用于分页
 * @param before 分页参数，上一页最后一项的time
 */
export function getMvComments(id: number, limit = 20, offset = 0, before?: number) {
  return request({
    url: '/comment/mv',
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
 * 获取电台节目评论
 * @param id 电台节目id
 * @param limit 取出评论数量，默认为20
 * @param offset 偏移数量，用于分页
 * @param before 分页参数，上一页最后一项的time
 */
export function getDjComments(id: number, limit = 20, offset = 0, before?: number) {
  return request({
    url: '/comment/dj',
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
 * 获取视频评论
 * @param id 视频id
 * @param limit 取出评论数量，默认为20
 * @param offset 偏移数量，用于分页
 * @param before 分页参数，上一页最后一项的time
 */
export function getVideoComments(id: number, limit = 20, offset = 0, before?: number) {
  return request({
    url: '/comment/video',
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
 * 获取热门评论
 * @param id 资源id
 * @param type 资源类型，0: 歌曲, 1: mv, 2: 歌单, 3: 专辑, 4: 电台, 5: 视频
 * @param limit 取出评论数量，默认为20
 * @param offset 偏移数量，用于分页
 * @param before 分页参数，上一页最后一项的time
 */
export function getHotComments(id: number, type: 0 | 1 | 2 | 3 | 4 | 5, limit = 20, offset = 0, before?: number) {
  return request({
    url: '/comment/hot',
    method: 'get',
    params: {
      id,
      type,
      limit,
      offset,
      before
    }
  })
}

/**
 * 发送评论
 * @param id 资源id
 * @param content 评论内容
 * @param type 资源类型，0: 歌曲, 1: mv, 2: 歌单, 3: 专辑, 4: 电台, 5: 视频, 6: 动态
 * @param commentId 回复的评论id (回复评论时必填)
 */
export function sendComment(id: number, content: string, type: 0 | 1 | 2 | 3 | 4 | 5 | 6, commentId?: number) {
  return request({
    url: '/comment',
    method: 'post',
    params: {
      t: 1, // 1: 发送, 2: 回复
      id,
      type,
      content,
      commentId
    }
  })
}

/**
 * 给评论点赞
 * @param id 资源id
 * @param cid 评论id
 * @param type 资源类型，0: 歌曲, 1: mv, 2: 歌单, 3: 专辑, 4: 电台, 5: 视频, 6: 动态
 * @param t 是否点赞，1: 点赞, 0: 取消点赞
 */
export function likeComment(id: number, cid: number, type: 0 | 1 | 2 | 3 | 4 | 5 | 6, t: 0 | 1) {
  return request({
    url: '/comment/like',
    method: 'post',
    params: {
      id,
      cid,
      type,
      t
    }
  })
}

/**
 * 删除评论
 * @param id 资源id
 * @param commentId 评论id
 * @param type 资源类型，0: 歌曲, 1: mv, 2: 歌单, 3: 专辑, 4: 电台, 5: 视频, 6: 动态
 */
export function deleteComment(id: number, commentId: number, type: 0 | 1 | 2 | 3 | 4 | 5 | 6) {
  return request({
    url: '/comment',
    method: 'post',
    params: {
      t: 0, // 0: 删除
      id,
      commentId,
      type
    }
  })
}