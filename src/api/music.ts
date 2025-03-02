import request from './request'

/**
 * 获取首页轮播图
 * @param type 资源类型: 0-PC, 1-Android, 2-iPhone, 3-iPad
 */
export function getBanners(type = 0) {
  return request({
    url: '/banner',
    method: 'get',
    params: { type }
  })
}

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
 * 获取新歌速递
 * @param type 地区类型 全部:0 华语:7 欧美:96 日本:8 韩国:16
 */
export function getNewSongs(type = 0) {
  return request({
    url: '/top/song',
    method: 'get',
    params: { type }
  })
}

/**
 * 获取新碟上架
 * @param limit 取出数量，默认为30
 * @param offset 偏移数量，用于分页
 */
export function getNewAlbums(limit = 30, offset = 0) {
  return request({
    url: '/album/new',
    method: 'get',
    params: { limit, offset }
  })
}

/**
 * 获取热门歌手
 * @param limit 取出数量，默认为30
 * @param offset 偏移数量，用于分页
 */
export function getHotArtists(limit = 30, offset = 0) {
  return request({
    url: '/top/artists',
    method: 'get',
    params: { limit, offset }
  })
}

/**
 * 获取歌曲详情
 * @param ids 歌曲id，支持多个id，用逗号分隔
 */
export function getSongDetail(ids: string) {
  return request({
    url: '/song/detail',
    method: 'get',
    params: { ids }
  })
}

/**
 * 获取歌曲URL
 * @param id 歌曲ID
 * @param level 音质等级
 * @returns Promise
 */
export function getSongUrl(id: number, br: number = 320000) {
  console.log('调用 getSongUrl API, 歌曲ID:', id, '比特率:', br);
  
  // 新版API改用了level参数代替br参数
  // exhigh: 极高 (320kbps) 
  // lossless: 无损
  // hires: Hi-Res
  // standard: 标准 (128kbps)
  // higher: 较高 (192kbps)
  const level = br >= 320000 ? 'exhigh' : (br >= 192000 ? 'higher' : 'standard');
  
  // 添加时间戳避免缓存问题
  const timestamp = Date.now();
  
  return request({
    url: '/song/url/v1',  // 使用新版API
    method: 'get',
    params: { 
      id, 
      level,
      timestamp
    }
  });
}

/**
 * 获取歌曲详情，可传入多首
 * @param ids 
 * @returns 
 */
export function getSongsDetail(ids: string) {
  return request({
    url: '/song/detail',
    method: 'get',
    params: {
      ids,
      timestamp: Date.now()
    }
  });
}

/**
 * 获取歌词
 * @param id 歌曲id
 */
export function getLyric(id: number) {
  return request({
    url: '/lyric',
    method: 'get',
    params: { id }
  })
}

/**
 * 获取排行榜列表
 */
export function getTopLists() {
  return request({
    url: '/toplist',
    method: 'get'
  })
}