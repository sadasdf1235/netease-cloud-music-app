import request from './request'

/**
 * 手机号登录
 * @param phone 手机号
 * @param password 密码
 */
export function loginByPhone(phone: string, password: string) {
  return request({
    url: '/login/cellphone',
    method: 'post',
    data: {
      phone,
      password
    }
  })
}

/**
 * 邮箱登录
 * @param email 邮箱
 * @param password 密码
 */
export function loginByEmail(email: string, password: string) {
  return request({
    url: '/login',
    method: 'post',
    data: {
      email,
      password
    }
  })
}

/**
 * 二维码登录-获取key
 */
export function getQrKey() {
  return request({
    url: '/login/qr/key',
    method: 'get',
    params: {
      timestamp: Date.now()
    }
  })
}

/**
 * 二维码登录-获取二维码
 * @param key 二维码key
 */
export function getQrCode(key: string) {
  return request({
    url: '/login/qr/create',
    method: 'get',
    params: {
      key,
      qrimg: true,
      timestamp: Date.now()
    }
  })
}

/**
 * 二维码登录-检查扫码状态
 * @param key 二维码key
 */
export function checkQrStatus(key: string) {
  return request({
    url: '/login/qr/check',
    method: 'get',
    params: {
      key,
      timestamp: Date.now()
    }
  })
}

/**
 * 获取登录状态
 */
export function getLoginStatus() {
  return request({
    url: '/login/status',
    method: 'get',
    params: {
      timestamp: Date.now()
    }
  })
}

/**
 * 退出登录
 */
export function logout() {
  return request({
    url: '/logout',
    method: 'post'
  })
}

/**
 * 获取用户详情
 * @param uid 用户id
 */
export function getUserDetail(uid: number) {
  return request({
    url: '/user/detail',
    method: 'get',
    params: { uid }
  })
}

/**
 * 获取用户歌单
 * @param uid 用户id
 */
export function getUserPlaylists(uid: number) {
  return request({
    url: '/user/playlist',
    method: 'get',
    params: { uid }
  })
}

/**
 * 获取用户喜欢的音乐列表
 * @param uid 用户id
 */
export function getUserLikedSongs(uid: number) {
  return request({
    url: '/likelist',
    method: 'get',
    params: { uid, timestamp: Date.now() }
  })
}

/**
 * 喜欢音乐
 * @param id 歌曲id
 * @param like 是否喜欢
 */
export function likeSong(id: number, like: boolean) {
  return request({
    url: '/like',
    method: 'post',
    params: { id, like }
  })
}