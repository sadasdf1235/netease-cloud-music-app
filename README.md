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
├── src/                     # 源代码目录
│   ├── api/                # API 接口定义
│   │   ├── modules/        # 按功能模块划分的API
│   │   ├── index.ts        # API统一导出
│   │   └── request.ts      # 请求封装
│   ├── assets/             # 静态资源
│   │   ├── images/         # 图片资源
│   │   ├── styles/         # 全局样式
│   │   └── icons/          # 图标资源
│   ├── components/         # 公共组件
│   │   ├── common/         # 通用组件
│   │   ├── business/       # 业务组件
│   │   ├── layout/         # 布局组件
│   │   └── player/         # 播放器相关组件
│   ├── constants/          # 常量定义
│   ├── directives/         # 自定义指令
│   ├── hooks/              # 可复用的Hooks
│   ├── router/             # 路由配置
│   ├── stores/             # Pinia 状态管理
│   ├── types/              # TypeScript 类型定义
│   ├── utils/              # 工具函数
│   │   ├── format.ts       # 格式化工具
│   │   ├── storage.ts      # 存储相关
│   │   └── player.ts       # 播放器工具
│   ├── views/              # 页面视图
│   │   ├── discover/       # 发现音乐
│   │   ├── search/         # 搜索相关
│   │   ├── login/          # 登录注册
│   │   └── layouts/        # 布局模板
│   ├── App.vue             # 根组件
│   └── main.ts             # 入口文件
├── public/                 # 公共资源目录
├── index.html              # HTML 模板
├── package.json            # 项目配置
├── tsconfig.json           # TypeScript 配置
├── uno.config.ts           # UnoCSS 配置
└── vite.config.ts          # Vite 配置
```

## 开发规范

### 命名规范

- **文件夹命名**：使用小写字母，多个单词以连字符（-）连接
- **文件命名**：
  - Vue组件：使用PascalCase（如`HeaderNav.vue`）
  - 工具类：使用camelCase（如`formatTime.ts`）
  - 类型定义：使用PascalCase（如`UserInfo.ts`）
- **变量/函数命名**：使用camelCase
- **常量命名**：使用大写字母，多个单词以下划线连接
- **组件属性顺序**：props, emits, components, setup

### 代码规范

- 使用ESLint和Prettier进行代码格式化和检查
- 遵循Vue3官方风格指南
- 组件统一使用`<script setup>`语法
- 类型定义优先使用接口（interface）而非类型别名（type）
- 提交前运行lint检查，确保代码质量

### Git提交规范

提交信息遵循Angular规范：

```
<type>(<scope>): <subject>

<body>

<footer>
```

常用type:
- feat: 新功能
- fix: 修复bug
- docs: 文档修改
- style: 代码格式修改
- refactor: 代码重构
- perf: 性能优化
- test: 测试相关
- build: 构建相关
- ci: CI配置相关

## 开发团队

- 项目维护者: [维护者姓名]
- 贡献者: 欢迎提交PR

## 许可证

[MIT License](LICENSE)
