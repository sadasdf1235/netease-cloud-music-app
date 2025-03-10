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

## 页面说明

### MV 页面

#### MV 列表页 `/discover/mv`

MV 列表页面展示了网站的所有 MV 内容，支持按地区、类型和排序方式进行筛选。页面采用响应式设计，在不同设备上都能良好显示。

**功能特点：**

- 筛选功能
  - 地区：全部、内地、港台、欧美、日本、韩国
  - 类型：全部、官方版、原生、现场版、网易出品
  - 排序：上升最快、最热、最新

- 列表展示
  - 响应式网格布局，自适应不同屏幕尺寸
  - 无限滚动加载更多内容
  - 优雅的加载动画和过渡效果
  - 显示 MV 封面、标题、歌手、播放量和时长

- 交互功能
  - 点击 MV 卡片进入详情页
  - 悬停效果展示播放按钮
  - 支持直接播放 MV

**技术实现：**

- 使用 Grid 布局实现响应式列表
- 虚拟滚动优化大量数据的加载性能
- 使用 Transition 和 TransitionGroup 实现流畅的动画效果
- 图片懒加载优化首屏加载速度

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
│   │   ├── modules/        # 按功能模块划分的API（主要API目录）
│   │   │   ├── album.ts    # 专辑相关API
│   │   │   ├── artist.ts   # 艺术家相关API 
│   │   │   ├── comment.ts  # 评论相关API
│   │   │   ├── mv.ts       # MV相关API
│   │   │   ├── playlist.ts # 歌单相关API
│   │   │   ├── search.ts   # 搜索相关API
│   │   │   ├── song.ts     # 歌曲相关API
│   │   │   └── user.ts     # 用户相关API
│   │   ├── music.ts        # 音乐相关API
│   │   ├── toplist.ts      # 排行榜相关API
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

## 代码整理记录

### API模块整理

- 移除了重复的API文件，将API模块集中在`src/api/modules`目录下管理
- 保留了`src/api/music.ts`和`src/api/toplist.ts`，因其被多个组件直接引用
- 优化了API导出结构，确保所有API调用一致性
- 删除了未使用的`src/api/recommend.ts`文件

### 请求工具统一

- 移除了`src/api/request.ts`，统一使用`src/utils/request.ts`作为HTTP请求工具
- 统一了所有API模块的导入路径，使用`@/utils/request`替代相对路径导入
- 添加`withSimpleCache`函数，统一API缓存调用方式
- 修改了所有使用缓存的API函数，确保接口一致

### API类型优化

- 创建了`src/types/api/common.ts`，提供统一的API响应类型定义
- 完善了`src/types/api/playlist.ts`，为所有歌单相关API提供明确的类型
- 修复了`src/types/api/music.ts`中的类型定义，减少any类型的使用
- 统一了API类型导出方式，避免循环引用问题

### API模块化完善

- 将`src/api/music.ts`和`src/api/toplist.ts`迁移到modules目录
- 统一了所有API模块的实现方式，包括缓存机制和类型定义
- 更新了组件中的API导入路径，确保使用新的模块化文件
- 保留了兼容性导出，减少对现有代码的影响

### TypeScript类型系统完善

- 创建了`src/types/components.ts`，为组件提供明确的Props和事件类型定义
- 创建了`src/types/global.d.ts`，解决Vue和Pinia等模块的类型声明问题
- 创建了`src/types/shims-vue.d.ts`和`src/types/shims-pinia.d.ts`，提供模块类型声明
- 更新了`tsconfig.json`，优化TypeScript配置，提高类型检查的准确性

### 组件优化

- 重构了`usePlayer` Hook，添加了完整的类型注解，提高代码可读性和类型安全性
- 优化了音频播放逻辑，添加了更完善的错误处理和状态管理
- 统一了组件中的事件处理函数命名和实现方式
- 添加了详细的代码注释，提高代码可维护性

### 优化方向

- 完善API响应类型定义，进一步减少any类型的使用
- 增强错误处理机制，提供更友好的错误提示
- 添加请求重试和超时处理，提高API调用的可靠性
- 考虑引入API请求状态管理，统一处理加载状态和错误状态
