import { createApp } from 'vue'
import App from './App.vue'

import '@unocss/reset/tailwind.css'
import 'uno.css'
import './style.css'

/**
 * 创建应用实例。
 * @description 产品发布路径使用纯 Vue 主应用，避免历史模块阻塞构建。
 */
const app = createApp(App)

/**
 * 捕获运行时错误。
 * @description 生产体验先保证错误不会静默吞掉，后续可接入监控服务。
 */
app.config.errorHandler = (error: unknown, _instance, info: string) => {
  console.error('应用运行错误:', error)
  console.error('错误来源:', info)
}

app.mount('#app')
