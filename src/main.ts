/**
 * 应用入口文件
 * @description 初始化Vue应用、注册插件和全局配置
 */

//===================================================
// 核心库导入
//===================================================
import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import { createPinia } from 'pinia'
import type { App as AppType, ComponentPublicInstance, ErrorHandler } from 'vue'
import App from './App.vue'
import router from './router'

//===================================================
// 样式导入
//===================================================
import '@unocss/reset/tailwind.css'
import 'uno.css'
import './style.css'
import './styles/global.less'

//===================================================
// UI组件库
//===================================================
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/antd.less'

//===================================================
// 自定义指令和插件
//===================================================
import directivesPlugin from './directives'

/**
 * 为调试扩展window对象类型
 */
declare global {
  interface Window {
    __APP__?: AppType;
  }
}

/**
 * 创建并配置应用实例
 */
const app = createApp(App)

// 注册状态管理
app.use(createPinia())

// 注册路由
app.use(router)

// 注册UI组件库
app.use(Antd)

// 注册全局指令
app.use(directivesPlugin)

/**
 * 全局错误处理
 */
app.config.errorHandler = ((err: unknown, instance: ComponentPublicInstance | null, info: string) => {
  console.error('全局错误捕获:', err)
  console.error('错误信息:', info)
  console.error('发生错误的组件:', instance)

  // TODO: 添加错误上报或用户提示逻辑
  // 可以接入错误监控服务如Sentry等
}) as ErrorHandler

// 挂载应用
app.mount('#app')

// 开发环境下暴露应用实例（用于调试）
if (import.meta.env.DEV) {
  window.__APP__ = app
  console.log('开发模式: 应用实例已挂载到 window.__APP__')
}
