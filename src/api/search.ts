import request from './request'

/**
 * 搜索
 * @param keywords 关键词
 * @param type 搜索类型：1-单曲，10-专辑，100-歌手，1000-歌单，1002-用户，1004-MV，1006-歌词，1009-电台，1014-视频
 * @param limit 返回数量，默认为30
 * @param offset 偏移数量，用于分页
 */
export function search(keywords: string, type = 1, limit = 30, offset = 0) {
  return request({
    url: '/search',
    method: 'get',
    params: {
      keywords,
      type,
      limit,
      offset
    }
  })
}

/**
 * 默认搜索关键词
 */
export function getDefaultSearchKeyword() {
  return request({
    url: '/search/default',
    method: 'get'
  })
}

/**
 * 热搜列表(详细)
 */
export function getHotSearchList() {
  return request({
    url: '/search/hot/detail',
    method: 'get'
  })
}

/**
 * 搜索建议
 * @param keywords 关键词
 * @param type 搜索类型：mobile-移动端，web-网页端
 */
export function getSearchSuggestions(keywords: string, type = 'mobile') {
  return request({
    url: '/search/suggest',
    method: 'get',
    params: {
      keywords,
      type
    }
  })
}

/**
 * 搜索多重匹配
 * @param keywords 关键词
 */
export function getSearchMultiMatch(keywords: string) {
  return request({
    url: '/search/multimatch',
    method: 'get',
    params: {
      keywords
    }
  })
}