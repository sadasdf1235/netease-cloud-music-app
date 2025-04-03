# 网易云音乐 Web 版

基于 Vue 3 + TypeScript + Vite 开发的网易云音乐 Web 版，使用 Tailwind CSS 构建界面。

## 功能特性

### 1. 用户中心
- **听歌统计**
  - 展示总听歌时长和数量
  - 展示本周听歌时长和数量
  - 听歌趋势图表（支持周/月切换）
  - 听歌时段分布图
  - 数据导出功能

- **音乐偏好分析**
  - 音乐风格偏好展示（流行、摇滚、民谣等）
  - 常听歌手展示
  - 语言偏好分布
  - 可视化数据展示

- **听歌排行**
  - 展示最近一周/一月的听歌排行
  - 支持播放和添加到播放列表
  - 展示歌曲详细信息

### 2. 歌单详情页
- 歌单基本信息展示
- 歌曲列表展示
- 评论系统
- 相似歌单推荐

### 3. 音乐播放器
- 支持播放/暂停/上一首/下一首
- 进度条控制
- 音量控制
- 播放模式切换
- 歌词显示

## 技术栈

- Vue 3
- TypeScript
- Vite
- Tailwind CSS
- ECharts
- Naive UI

## 项目结构

```
src/
├── api/                # API 接口
├── assets/            # 静态资源
├── components/        # 公共组件
├── composables/       # 组合式函数
├── layouts/           # 布局组件
├── router/            # 路由配置
├── stores/            # 状态管理
├── styles/            # 全局样式
├── types/             # TypeScript 类型定义
└── views/             # 页面组件
    ├── home/          # 首页
    ├── playlist/      # 歌单页
    ├── search/        # 搜索页
    └── user/          # 用户中心
```

## 开发规范

1. **代码规范**
   - 使用 TypeScript 进行类型检查
   - 组件使用 Composition API
   - 使用 ESLint 和 Prettier 进行代码格式化

2. **样式规范**
   - 使用 Tailwind CSS 进行样式开发
   - 遵循响应式设计原则
   - 使用 CSS Grid 和 Flexbox 进行布局

3. **Git 提交规范**
   - feat: 新功能
   - fix: 修复问题
   - docs: 文档修改
   - style: 代码格式修改
   - refactor: 代码重构
   - perf: 性能优化
   - test: 测试相关
   - chore: 其他修改

## 待优化项目

1. **性能优化**
   - 图片懒加载
   - 组件按需加载
   - 数据缓存策略

2. **功能完善**
   - 完善音乐偏好数据计算
   - 添加更多数据可视化图表
   - 优化数据加载性能
   - 添加数据导出格式选择

3. **用户体验**
   - 添加加载动画
   - 优化页面过渡效果
   - 完善错误提示
   - 添加操作引导

## 本地开发

```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev

# 构建生产版本
pnpm build
```

## 浏览器支持

- Chrome >= 87
- Firefox >= 78
- Safari >= 14
- Edge >= 88
