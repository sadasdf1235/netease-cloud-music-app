<template>
  <div class="music-preference bg-white dark:bg-dark-900 rounded-lg shadow-md p-6">
    <h2 class="text-xl font-bold mb-6">音乐偏好分析</h2>
    
    <!-- 音乐风格偏好 -->
    <div class="mb-8">
      <h3 class="text-lg font-medium mb-4">音乐风格偏好</h3>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div 
          v-for="(style, index) in musicStyles" 
          :key="index"
          class="style-card bg-gray-50 dark:bg-dark-800 p-4 rounded-lg"
        >
          <div class="flex items-center justify-between mb-2">
            <span class="text-sm text-gray-500">{{ style.name }}</span>
            <span class="text-sm font-medium">{{ style.percentage }}%</span>
          </div>
          <div class="w-full h-2 bg-gray-200 dark:bg-dark-700 rounded-full overflow-hidden">
            <div 
              class="h-full bg-primary transition-all duration-500"
              :style="{ width: style.percentage + '%' }"
            ></div>
          </div>
        </div>
      </div>
    </div>

    <!-- 歌手偏好 -->
    <div class="mb-8">
      <h3 class="text-lg font-medium mb-4">常听歌手</h3>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div 
          v-for="(artist, index) in topArtists" 
          :key="index"
          class="artist-card bg-gray-50 dark:bg-dark-800 p-4 rounded-lg text-center"
        >
          <div class="w-16 h-16 mx-auto mb-2 rounded-full overflow-hidden">
            <img 
              :src="artist.avatar" 
              :alt="artist.name"
              class="w-full h-full object-cover"
            >
          </div>
          <div class="text-sm font-medium">{{ artist.name }}</div>
          <div class="text-xs text-gray-500">{{ artist.songs }}首歌曲</div>
        </div>
      </div>
    </div>

    <!-- 语言偏好 -->
    <div>
      <h3 class="text-lg font-medium mb-4">语言偏好</h3>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div 
          v-for="(lang, index) in languagePreference" 
          :key="index"
          class="lang-card bg-gray-50 dark:bg-dark-800 p-4 rounded-lg text-center"
        >
          <div class="text-2xl mb-1">{{ lang.icon }}</div>
          <div class="text-sm font-medium">{{ lang.name }}</div>
          <div class="text-xs text-gray-500">{{ lang.percentage }}%</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * 音乐偏好分析组件
 * @description 展示用户的音乐风格、歌手和语言偏好
 */
import { ref, onMounted } from 'vue';
import { useUserStore } from '@/stores/user';
import { getUserListenRank } from '@/api/modules/user';
import type { ListenRankResponse } from '@/types/models/user';

const userStore = useUserStore();

// 音乐风格偏好（示例数据）
const musicStyles = ref([
  { name: '流行', percentage: 45 },
  { name: '摇滚', percentage: 20 },
  { name: '民谣', percentage: 15 },
  { name: '电子', percentage: 10 },
  { name: '古典', percentage: 5 },
  { name: '爵士', percentage: 5 }
]);

// 常听歌手（示例数据）
const topArtists = ref([
  { name: '周杰伦', songs: 50, avatar: 'https://p1.music.126.net/Esjm32LD05PQPQXyMq8mQw==/109951165793869641.jpg' },
  { name: '林俊杰', songs: 45, avatar: 'https://p1.music.126.net/1GIlkxJiHh3hG0a8qHHkZw==/109951165793869641.jpg' },
  { name: '陈奕迅', songs: 40, avatar: 'https://p1.music.126.net/1GIlkxJiHh3hG0a8qHHkZw==/109951165793869641.jpg' },
  { name: '薛之谦', songs: 35, avatar: 'https://p1.music.126.net/1GIlkxJiHh3hG0a8qHHkZw==/109951165793869641.jpg' }
]);

// 语言偏好（示例数据）
const languagePreference = ref([
  { name: '华语', percentage: 60, icon: '🇨🇳' },
  { name: '欧美', percentage: 20, icon: '🌎' },
  { name: '日语', percentage: 10, icon: '🇯🇵' },
  { name: '韩语', percentage: 10, icon: '🇰🇷' }
]);

/**
 * 加载用户音乐偏好数据
 */
async function loadMusicPreference() {
  if (!userStore.isLoggedIn || !userStore.profile?.userId) return;
  
  try {
    // 获取最近一周的听歌排行
    const res = await getUserListenRank(userStore.profile.userId, 1) as ListenRankResponse;
    if (res && res.weekData) {
      // TODO: 根据实际数据计算音乐偏好
      // 这里需要后端提供更详细的听歌数据
    }
  } catch (error) {
    console.error('获取音乐偏好数据失败:', error);
  }
}

onMounted(() => {
  loadMusicPreference();
});
</script>

<style scoped>
.style-card, .artist-card, .lang-card {
  transition: all 0.3s ease;
}

.style-card:hover, .artist-card:hover, .lang-card:hover {
  transform: translateY(-2px);
}
</style> 