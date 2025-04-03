<template>
  <div class="listening-preference bg-white dark:bg-dark-900 rounded-lg shadow-md p-6">
    <h2 class="text-xl font-bold mb-6">听歌偏好分析</h2>
    
    <!-- 音乐风格分析 -->
    <div class="mb-8">
      <h3 class="text-lg font-medium mb-4">音乐风格偏好</h3>
      <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div 
          v-for="(style, index) in musicStyles" 
          :key="index"
          class="style-card bg-gray-50 dark:bg-dark-800 p-4 rounded-lg"
        >
          <div class="flex items-center justify-between mb-2">
            <span class="text-sm font-medium">{{ style.name }}</span>
            <span class="text-sm text-gray-500">{{ style.percentage }}%</span>
          </div>
          <div class="w-full bg-gray-200 dark:bg-dark-700 rounded-full h-2">
            <div 
              class="bg-primary h-2 rounded-full transition-all duration-500"
              :style="{ width: style.percentage + '%' }"
            ></div>
          </div>
        </div>
      </div>
    </div>

    <!-- 听歌时间分布 -->
    <div class="mb-8">
      <h3 class="text-lg font-medium mb-4">听歌时间分布</h3>
      <div class="grid grid-cols-4 gap-4">
        <div 
          v-for="(time, index) in timeDistribution" 
          :key="index"
          class="time-card bg-gray-50 dark:bg-dark-800 p-4 rounded-lg text-center"
        >
          <div class="text-2xl font-bold mb-1">{{ time.value }}</div>
          <div class="text-sm text-gray-500">{{ time.label }}</div>
        </div>
      </div>
    </div>

    <!-- 常听歌手 -->
    <div>
      <h3 class="text-lg font-medium mb-4">常听歌手</h3>
      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        <div 
          v-for="(artist, index) in topArtists" 
          :key="index"
          class="artist-card text-center"
        >
          <div class="relative aspect-square overflow-hidden rounded-full mb-2">
            <img 
              :src="artist.avatarUrl + '?param=200y200'" 
              :alt="artist.name"
              class="w-full h-full object-cover"
            />
          </div>
          <div class="text-sm font-medium">{{ artist.name }}</div>
          <div class="text-xs text-gray-500">{{ artist.playCount }}次</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * 听歌偏好分析组件
 * @description 展示用户的音乐风格偏好、听歌时间分布和常听歌手
 */
import { ref, onMounted } from 'vue';
import { useUserStore } from '@/stores/user';
import { getUserListenRank } from '@/api/modules/user';
import type { MusicStyle, TimeDistribution, TopArtist, ListenRankResponse } from '@/types/models/user';

const userStore = useUserStore();

// 音乐风格数据（示例数据）
const musicStyles = ref<MusicStyle[]>([
  { name: '流行', percentage: 45 },
  { name: '民谣', percentage: 25 },
  { name: '摇滚', percentage: 15 },
  { name: '电子', percentage: 10 },
  { name: '古典', percentage: 5 }
]);

// 听歌时间分布（示例数据）
const timeDistribution = ref<TimeDistribution[]>([
  { label: '早晨', value: '2.5h' },
  { label: '中午', value: '1.8h' },
  { label: '下午', value: '3.2h' },
  { label: '晚上', value: '4.5h' }
]);

// 常听歌手
const topArtists = ref<TopArtist[]>([]);

/**
 * 加载用户听歌排行数据
 */
async function loadUserListenRank() {
  if (!userStore.isLoggedIn || !userStore.profile?.userId) return;
  
  try {
    // 获取最近一周的听歌排行
    const res = await getUserListenRank(userStore.profile.userId, 1) as ListenRankResponse;
    if (res && res.weekData) {
      // 统计歌手播放次数
      const artistMap = new Map<number, TopArtist>();
      res.weekData.forEach((item) => {
        const artist = item.song.ar[0];
        if (artistMap.has(artist.id)) {
          const existingArtist = artistMap.get(artist.id)!;
          existingArtist.playCount += 1;
        } else {
          artistMap.set(artist.id, {
            id: artist.id,
            name: artist.name,
            avatarUrl: artist.avatarUrl || '',
            playCount: 1
          });
        }
      });
      
      // 转换为数组并排序
      topArtists.value = Array.from(artistMap.values())
        .sort((a, b) => b.playCount - a.playCount)
        .slice(0, 10);
    }
  } catch (error) {
    console.error('获取听歌排行失败:', error);
  }
}

onMounted(() => {
  loadUserListenRank();
});
</script>

<style scoped>
.style-card:hover {
  transform: translateY(-2px);
  transition: transform 0.2s ease;
}

.time-card:hover {
  transform: translateY(-2px);
  transition: transform 0.2s ease;
}

.artist-card:hover {
  transform: translateY(-2px);
  transition: transform 0.2s ease;
}
</style>
