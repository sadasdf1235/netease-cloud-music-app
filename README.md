# 网易云音乐 Vue3 应用

基于 Vue3、TypeScript、Naive UI 开发的网易云音乐 Web 应用，提供流畅的音乐播放和探索体验。

## 技术栈

- **核心框架：** Vue 3 + TypeScript + Vite
- **状态管理：** Pinia
- **路由管理：** Vue Router
- **UI 组件：** Naive UI
- **工具库：** VueUse
- **样式解决方案：** UnoCSS
- **HTTP 请求：** Axios
- **图标：** @iconify/vue + @iconify-json/carbon

## 功能特性

- 🎵 音乐播放器
  - 支持播放控制（播放/暂停/上一首/下一首）
  - 播放列表管理
  - 播放进度控制

- 🏠 个性化推荐
  - 个性化轮播图展示
  - 推荐歌单
  - 新歌新碟
  - 热门歌手

- 🎯 音乐发现
  - 歌单广场
  - 排行榜
  - 歌手分类
  - 新碟上架

- 🌓 深色模式
  - 支持浅色/深色主题切换
  - 自动适应系统主题

## 快速开始

### 环境要求

- Node.js >= 16
- pnpm >= 8

### 安装依赖

```bash
pnpm install
```

### 开发调试

```bash
pnpm dev
```

### 构建部署

```bash
pnpm build
```

## 项目结构

```
├── src/                    # 源代码目录
│   ├── api/               # API 接口定义
│   ├── assets/            # 静态资源
│   ├── components/        # 公共组件
│   ├── router/            # 路由配置
│   ├── stores/            # Pinia 状态管理
│   ├── views/             # 页面视图
│   ├── App.vue            # 根组件
│   └── main.ts            # 入口文件
├── public/                # 公共资源目录
├── index.html             # HTML 模板
├── package.json           # 项目配置
├── tsconfig.json          # TypeScript 配置
├── uno.config.ts          # UnoCSS 配置
└── vite.config.ts         # Vite 配置
```

## 开发团队

- 项目维护者：[Your Name]
- 贡献者：欢迎提交 PR

## 许可证

[MIT License](LICENSE)
