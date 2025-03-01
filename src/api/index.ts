import axios from 'axios'

// 创建axios实例
const request = axios.create({
  // 这里可以配置为你的网易云API代理服务器地址
  // 例如使用Vercel部署的网易云API: https://netease-cloud-music-api-tau.vercel.app
  // 或者本地运行的API: http://localhost:3000
  baseURL: 'https://netease-cloud-music-api-tau.vercel.app',
  timeout: 10000,
  withCredentials: true // 允许跨域携带cookie
})

// 请求拦截器
request.interceptors.request.use(
  config => {
    // 可以在这里添加token等认证信息
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// 响应拦截器
request.interceptors.response.use(
  response => {
    const res = response.data
    // 这里可以统一处理错误状态码
    if (res.code !== 200) {
      console.error('API错误:', res.message || '未知错误')
      return Promise.reject(new Error(res.message || '未知错误'))
    }
    return res
  },
  error => {
    console.error('网络错误:', error)
    return Promise.reject(error)
  }
)

export default request