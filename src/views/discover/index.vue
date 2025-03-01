<template>
  <div class="container mx-auto px-4 py-6">
    <!-- 二级导航 -->
    <div class="mb-6 border-b border-gray-200 dark:border-gray-700">
      <nav class="flex gap-8">
        <router-link 
          v-for="subNav in subNavItems" 
          :key="subNav.path" 
          :to="subNav.path"
          class="pb-3 px-2 text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors relative"
          active-class="text-primary font-medium after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-primary"
        >
          {{ subNav.name }}
        </router-link>
      </nav>
    </div>
    
    <!-- 子路由视图 -->
    <router-view />
  </div>
</template>

<script setup lang="ts">
// 二级导航项
const subNavItems = [
  { name: '个性推荐', path: '/discover/recommend' },
  { name: '歌单', path: '/discover/playlist' },
  { name: '排行榜', path: '/discover/toplist' },
  { name: '歌手', path: '/discover/artist' },
  { name: '新碟上架', path: '/discover/album' },
]
</script>