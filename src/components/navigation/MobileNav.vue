<template>
  <div class="mobile-nav md:hidden">
    <!-- 移动端导航按钮 -->
    <button class="menu-btn" @click="isOpen = !isOpen">
      <div v-if="isOpen" class="i-carbon-close text-xl"></div>
      <div v-else class="i-carbon-menu text-xl"></div>
    </button>

    <!-- 移动端导航菜单 -->
    <transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="transform -translate-x-full"
      enter-to-class="transform translate-x-0"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="transform translate-x-0"
      leave-to-class="transform -translate-x-full"
    >
      <div v-if="isOpen" class="nav-menu">
        <!-- 搜索框 -->
        <div class="px-4 py-2">
          <div class="relative">
            <input
              v-model="searchKeyword"
              type="text"
              placeholder="搜索音乐、歌手、歌词、用户"
              class="w-full py-2 px-4 pr-10 rounded-full bg-gray-100 dark:bg-dark-800 focus:outline-none focus:ring-1 focus:ring-primary"
              @keyup.enter="handleSearch"
            />
            <div
              class="i-carbon-search absolute right-3 top-2.5 text-gray-400 cursor-pointer hover:text-primary"
              @click="handleSearch"
            ></div>
          </div>
        </div>

        <!-- 导航链接 -->
        <nav class="py-4">
          <router-link
            v-for="nav in navItems"
            :key="nav.path"
            :to="nav.path"
            class="nav-item"
            active-class="text-primary font-medium bg-gray-100 dark:bg-dark-800"
            @click="isOpen = false"
          >
            <div :class="nav.icon"></div>
            <span>{{ nav.name }}</span>
          </router-link>
        </nav>

        <!-- 用户区域 -->
        <div class="px-4 py-2 border-t border-gray-200 dark:border-gray-800">
          <div v-if="userStore.isLoggedIn" class="flex items-center gap-3 p-2">
            <img :src="userStore.profile?.avatarUrl" class="w-8 h-8 rounded-full" />
            <span>{{ userStore.profile?.nickname }}</span>
          </div>
          <router-link
            v-else
            to="/login"
            class="block w-full text-center py-2 rounded-full border border-gray-300 dark:border-gray-700 hover:text-primary hover:border-primary transition-colors"
            @click="isOpen = false"
          >
            登录
          </router-link>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/user';

// 导航菜单状态
const isOpen = ref(false);

// 搜索关键词
const searchKeyword = ref('');

// 路由实例
const router = useRouter();

// 用户状态
const userStore = useUserStore();

// 导航项
const navItems = [
  { name: '发现音乐', path: '/discover', icon: 'i-carbon-music' },
  { name: '推荐歌单', path: '/discover/playlist', icon: 'i-carbon-playlist' },
  { name: '排行榜', path: '/discover/toplist', icon: 'i-carbon-chart-line' },
  { name: '歌手', path: '/discover/artist', icon: 'i-carbon-microphone' },
  { name: '新碟上架', path: '/discover/album', icon: 'i-carbon-album' }
];

// 处理搜索
const handleSearch = () => {
  if (searchKeyword.value.trim()) {
    router.push({
      path: '/search',
      query: { keywords: searchKeyword.value.trim() }
    });
    isOpen.value = false;
  }
};
</script>

<style scoped>
.mobile-nav {
  position: relative;
  z-index: 50;
}

.menu-btn {
  @apply p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-800 transition-colors;
}

.nav-menu {
  @apply fixed inset-0 w-64 h-screen bg-white dark:bg-dark-900 shadow-lg;
}

.nav-item {
  @apply flex items-center gap-3 px-4 py-2 hover:bg-gray-100 dark:hover:bg-dark-800 transition-colors;
}

.nav-item div {
  @apply text-xl;
}
</style>