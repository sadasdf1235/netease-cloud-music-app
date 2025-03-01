import axios from 'axios'

// 创建axios实例
const request = axios.create({
  // 这里配置为网易云API代理服务器地址
  // 可以使用Vercel部署的网易云API或本地运行的API
  baseURL: 'https://netease-cloud-music-api.vercel.app',
  timeout: 10000,
  withCredentials: true // 允许跨域携带cookie
})

// 请求拦截器
request.interceptors.request.use(
  config => {
    // 从localStorage获取cookie并添加到请求头
    const cookie = localStorage.getItem('user_cookie')
    if (cookie) {
      // 将cookie添加到请求参数中
      if (config.method === 'get') {
        config.params = { ...config.params, cookie }
      } else if (config.method === 'post') {
        config.data = { ...config.data, cookie }
      }
    }
    return config
  },
  error => {
    console.error('请求错误:', error)
    return Promise.reject(error)
  }
)

// 响应拦截器
request.interceptors.response.use(
  response => {
    const res = response.data
    // 统一处理错误状态码
    if (res.code !== 200 && res.code !== undefined) {
      console.error('API错误:', res.msg || res.message || '未知错误')
      return Promise.reject(new Error(res.msg || res.message || '未知错误'))
    }
    return res
  },
  error => {
    console.error('网络错误:', error)
    return Promise.reject(error)
  }
)

export default request