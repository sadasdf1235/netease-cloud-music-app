<template>
  <div class="flex flex-col h-screen bg-light dark:bg-secondary">
    <!-- 顶部导航栏 -->
    <header class="h-16 bg-white dark:bg-dark-900 shadow-sm border-b border-gray-200 dark:border-gray-800">
      <div class="flex items-center justify-between h-full px-4">
        <div class="flex items-center gap-4">
          <!-- 移动端导航 -->
          <MobileNav class="md:hidden" />

          <!-- Logo -->
          <div class="text-xl font-bold text-primary">网易云音乐</div>

          <!-- 主导航 -->
          <nav class="hidden md:flex items-center gap-6">
            <router-link
              v-for="nav in navItems"
              :key="nav.path"
              :to="nav.path"
              class="px-2 py-1 text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors"
              active-class="text-primary font-medium"
            >
              {{ nav.name }}
            </router-link>
          </nav>
        </div>

        <!-- 搜索框 -->
        <div class="flex-1 max-w-md mx-4 hidden md:block">
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

        <!-- 用户区域 -->
        <div class="flex items-center gap-4">
          <ThemeToggle />

          <div v-if="userStore.isLoggedIn" class="flex items-center gap-2">
            <img :src="userStore.profile?.avatarUrl" class="w-8 h-8 rounded-full" />
            <span class="hidden md:inline text-sm">{{ userStore.profile?.nickname }}</span>
          </div>
          <router-link to="/login" v-else>
            <button class="text-sm px-4 py-1 rounded-full border border-gray-300 dark:border-gray-700 hover:text-primary hover:border-primary transition-colors">
              登录
            </button>
          </router-link>
        </div>
      </div>
    </header>

    <!-- 主要内容区域 -->
    <main class="flex-1 overflow-auto">
      <router-view v-slot="{ Component }">
        <transition
          enter-active-class="transition-opacity duration-200"
          enter-from-class="opacity-0"
          enter-to-class="opacity-100"
          leave-active-class="transition-opacity duration-200"
          leave-from-class="opacity-100"
          leave-to-class="opacity-0"
        >
          <component :is="Component" />
        </transition>
      </router-view>
    </main>

    <!-- 播放器栏 -->
    <footer class="h-auto bg-white dark:bg-dark-900 border-t border-gray-200 dark:border-gray-800 shadow-lg">
      <!-- 使用新的MusicPlayer组件 -->
      <MusicPlayer />
    </footer>

    <!-- 播放列表面板 -->
    <PlaylistPanel :is-visible="showPlaylistPanel" @close="showPlaylistPanel = false" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { useUserStore } from '@/stores/user'
import { usePlayerStore } from '@/stores/player'
import ThemeToggle from '@/components/ui/ThemeToggle.vue'
import PlaylistPanel from '@/components/music/PlaylistPanel.vue'
import MusicPlayer from '@/components/player/index.vue'
import { useRouter } from 'vue-router'
import MobileNav from '@/components/common/MobileNav.vue'

const userStore = useUserStore()
const playerStore = usePlayerStore()
const router = useRouter()

// 播放列表面板
const showPlaylistPanel = ref(false)

// 搜索关键词
const searchKeyword = ref('')

// 切换播放列表面板显示状态
function togglePlaylistPanel() {
  showPlaylistPanel.value = !showPlaylistPanel.value
}

// 导航项
const navItems = [
  { name: '发现音乐', path: '/discover' },
  { name: '推荐歌单', path: '/discover/playlist' },
  { name: '排行榜', path: '/discover/toplist' },
  { name: '歌手', path: '/discover/artist' },
  { name: '新碟上架', path: '/discover/album' }
]

// 切换播放模式
function togglePlayMode() {
  // 修复方法调用，使用正确的方法
  if (!playerStore.loop && !playerStore.random) {
    playerStore.toggleLoop();
  } else if (playerStore.loop) {
    playerStore.toggleLoop();
    playerStore.toggleRandom();
  } else {
    playerStore.toggleRandom();
  }
}

/**
 * 处理搜索
 */
function handleSearch() {
  if (searchKeyword.value.trim()) {
    router.push({
      path: '/search',
      query: { keywords: searchKeyword.value.trim() }
    });
  }
}

// 由于我们使用了新的MusicPlayer组件，下面的播放器相关代码可以移除
// 这些功能已经在MusicPlayer组件中实现
</script>

<style scoped>
/* 自定义滚动条样式 */
main::-webkit-scrollbar {
  width: 6px;
}

main::-webkit-scrollbar-track {
  background: transparent;
}

main::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 3px;
}

.dark main::-webkit-scrollbar-thumb {
  background-color: rgba(255, 255, 255, 0.2);
}
</style>