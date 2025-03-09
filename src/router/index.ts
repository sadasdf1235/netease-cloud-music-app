import { createRouter, createWebHistory } from "vue-router";
import type { RouteRecordRaw } from "vue-router";
import { useUserStore } from "@/stores/user";
import NProgress from "nprogress";
import "nprogress/nprogress.css";

// 配置NProgress
NProgress.configure({
  showSpinner: false,
  minimum: 0.1,
  trickleSpeed: 200
});

// 定义需要登录的路由
const authRoutes = [
  '/my',
  '/follow',
  '/user'
];

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    redirect: "/discover",
  },
  {
    path: "/login",
    name: "login",
    component: () => import("@/views/login/index.vue"),
    meta: {
      title: "登录",
      keepAlive: false
    },
  },
  {
    path: "/discover",
    name: "discover",
    component: () => import("@/views/discover/index.vue"),
    redirect: "/discover/recommend",
    meta: {
      keepAlive: true
    },
    children: [
      {
        path: "recommend",
        name: "recommend",
        component: () => import("@/views/discover/recommend/index.vue"),
        meta: {
          title: "推荐",
          keepAlive: true
        },
      },
      {
        path: "playlist",
        name: "playlist",
        component: () => import("@/views/discover/playlist/index.vue"),
        meta: {
          title: "歌单",
          keepAlive: true
        },
      },
      {
        path: "playlist/:id",
        name: "playlist-detail",
        component: () => import("@/views/discover/playlist/detail.vue"),
        meta: {
          title: "歌单详情",
          keepAlive: false
        },
      },
      {
        path: "toplist",
        name: "toplist",
        component: () => import("@/views/discover/toplist/index.vue"),
        meta: {
          title: "排行榜",
          keepAlive: true
        },
      },
      {
        path: "artist",
        name: "artist",
        component: () => import("@/views/discover/artist/index.vue"),
        meta: {
          title: "歌手",
          keepAlive: true
        },
      },
      {
        path: "artist/:id",
        name: "artist-detail",
        component: () => import("@/views/discover/artist/detail.vue"),
        meta: {
          title: "歌手详情",
          keepAlive: false
        },
      },
      {
        path: "album",
        name: "album",
        component: () => import("@/views/discover/album/index.vue"),
        meta: {
          title: "专辑",
          keepAlive: true
        },
      },
      {
        path: "album/:id",
        name: "album-detail",
        component: () => import("@/views/discover/album/detail.vue"),
        meta: {
          title: "专辑详情",
          keepAlive: false
        },
      },
    ],
  },
  // 搜索页面路由
  {
    path: "/search",
    name: "search",
    component: () => import("@/views/search/index.vue"),
    meta: {
      title: "搜索",
      keepAlive: false
    },
    children: [
      {
        path: "songs",
        name: "search-songs",
        component: () => import("@/views/search/SearchCategoryResults.vue"),
        meta: {
          title: "搜索歌曲",
          type: "songs",
          keepAlive: false
        },
      },
      {
        path: "albums",
        name: "search-albums",
        component: () => import("@/views/search/SearchCategoryResults.vue"),
        meta: {
          title: "搜索专辑",
          type: "albums",
          keepAlive: false
        },
      },
      {
        path: "artists",
        name: "search-artists",
        component: () => import("@/views/search/SearchCategoryResults.vue"),
        meta: {
          title: "搜索歌手",
          type: "artists",
          keepAlive: false
        },
      },
      {
        path: "playlists",
        name: "search-playlists",
        component: () => import("@/views/search/SearchCategoryResults.vue"),
        meta: {
          title: "搜索歌单",
          type: "playlists",
          keepAlive: false
        },
      },
    ],
  },
  // 用户相关路由
  {
    path: "/my",
    name: "my",
    component: () => import("@/views/my/index.vue"),
    meta: {
      title: "我的音乐",
      requiresAuth: true,
      keepAlive: true
    },
  },
  // 404页面
  {
    path: "/:pathMatch(.*)*",
    name: "notFound",
    component: () => import("@/views/not-found.vue"),
    meta: {
      title: "404",
      keepAlive: false
    },
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0 };
    }
  },
});

// 全局前置守卫
router.beforeEach(async (to, from, next) => {
  // 开始加载进度条
  NProgress.start();

  // 获取用户状态
  const userStore = useUserStore();

  // 检查是否需要登录
  if (to.meta.requiresAuth && !userStore.isLoggedIn) {
    // 保存目标路由，登录后跳转
    next({
      path: '/login',
      query: { redirect: to.fullPath }
    });
    return;
  }

  // 如果已登录且访问登录页，重定向到首页
  if (to.path === '/login' && userStore.isLoggedIn) {
    next('/');
    return;
  }

  // 设置页面标题
  document.title = `${to.meta.title ? to.meta.title + " - " : ""}网易云音乐`;

  next();
});

// 全局后置钩子
router.afterEach(() => {
  // 结束加载进度条
  NProgress.done();
});

// 路由错误处理
router.onError((error) => {
  console.error('路由错误:', error);
  NProgress.done();
});

export default router;
