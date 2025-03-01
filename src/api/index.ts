// 导出所有API
import * as userApi from './user'
import * as musicApi from './music'
import * as searchApi from './search'
import * as artistApi from './artist'
import * as albumApi from './album'
import * as commentApi from './comment'
import * as playlistApi from './playlist'
import * as mvApi from './mv'

export {
  userApi,
  musicApi,
  searchApi,
  artistApi,
  albumApi,
  commentApi,
  playlistApi,
  mvApi
}

// 导出请求实例，用于自定义请求
import request from './request'
export { request }