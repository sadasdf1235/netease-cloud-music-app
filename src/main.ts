import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import directivesPlugin from './directives'
import type { App as AppType } from 'vue'

// 为调试扩展window对象类型
declare global {
  interface Window {
    __APP__?: AppType;
  }
}

// 引入样式
import '@unocss/reset/tailwind.css'
import 'uno.css'
import './style.css'

// 创建应用实例
const app = createApp(App)

// 注册Pinia
app.use(createPinia())

// 注册路由
app.use(router)

// 注册全局指令
app.use(directivesPlugin)

// 全局错误处理
app.config.errorHandler = (err, instance, info) => {
  console.error('全局错误捕获:', err, info)
  // 可以在这里添加错误上报逻辑
}

// 挂载应用
app.mount('#app')

// 暴露应用实例（用于调试）
if (import.meta.env.DEV) {
  window.__APP__ = app
}
