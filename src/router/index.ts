import { createRouter, createWebHistory } from "vue-router";
import type { RouteRecordRaw } from "vue-router";

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    redirect: "/discover",
  },
  {
    path: "/login",
    name: "login",
    component: () => import("@/views/login/index.vue"),
    meta: { title: "登录" },
  },
  {
    path: "/discover",
    name: "discover",
    component: () => import("@/views/discover/index.vue"),
    redirect: "/discover/recommend",
    children: [
      {
        path: "recommend",
        name: "recommend",
        component: () => import("@/views/discover/recommend/index.vue"),
        meta: { title: "推荐" },
      },
      {
        path: "playlist",
        name: "playlist",
        component: () => import("@/views/discover/playlist/index.vue"),
        meta: { title: "歌单" },
      },
      {
        path: "playlist/:id",
        name: "playlist-detail",
        component: () => import("@/views/discover/playlist/detail.vue"),
        meta: { title: "歌单详情" },
      },
      {
        path: "toplist",
        name: "toplist",
        component: () => import("@/views/discover/toplist/index.vue"),
        meta: { title: "排行榜" },
      },
      {
        path: "artist",
        name: "artist",
        component: () => import("@/views/discover/artist/index.vue"),
        meta: { title: "歌手" },
      },
      {
        path: "artist/:id",
        name: "artist-detail",
        component: () => import("@/views/discover/artist/detail.vue"),
        meta: { title: "歌手详情" },
      },
      {
        path: "album",
        name: "album",
        component: () => import("@/views/discover/album/index.vue"),
        meta: { title: "专辑" },
      },
      {
        path: "album/:id",
        name: "album-detail",
        component: () => import("@/views/discover/album/detail.vue"),
        meta: { title: "专辑详情" },
      },
    ],
  },
  // 搜索页面路由
  {
    path: "/search",
    name: "search",
    component: () => import("@/views/search/index.vue"),
    meta: { title: "搜索" },
    children: [
      {
        path: "songs",
        name: "search-songs",
        component: () => import("@/views/search/SearchCategoryResults.vue"),
        meta: { title: "搜索歌曲", type: "songs" },
      },
      {
        path: "albums",
        name: "search-albums",
        component: () => import("@/views/search/SearchCategoryResults.vue"),
        meta: { title: "搜索专辑", type: "albums" },
      },
      {
        path: "artists",
        name: "search-artists",
        component: () => import("@/views/search/SearchCategoryResults.vue"),
        meta: { title: "搜索歌手", type: "artists" },
      },
      {
        path: "playlists",
        name: "search-playlists",
        component: () => import("@/views/search/SearchCategoryResults.vue"),
        meta: { title: "搜索歌单", type: "playlists" },
      },
    ],
  },
  // 添加测试页面路由
  {
    path: "/test/music",
    name: "music-test",
    component: () => import("@/views/test/MusicTest.vue"),
    meta: { title: "音乐测试" },
  },
  // 以下路由暂时注释，等待实现对应组件
  /*
  {
    path: '/song/:id',
    name: 'songDetail',
    component: () => import('@/views/song/detail.vue'),
    meta: { title: '歌曲详情' }
  },
  {
    path: '/my',
    name: 'my',
    component: () => import('@/views/my/index.vue'),
    meta: { title: '我的音乐' }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'notFound',
    component: () => import('@/views/not-found.vue'),
    meta: { title: '404' }
  }
  */
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  // 设置页面标题
  document.title = `${to.meta.title ? to.meta.title + " - " : ""}网易云音乐`;
  next();
});

export default router;
