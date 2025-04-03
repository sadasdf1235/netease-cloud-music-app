<template>
  <div class="user-listening-rank">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-lg font-bold flex items-center">
        <div class="i-carbon-chart-line-smooth mr-2 text-primary"></div>
        听歌排行
      </h3>
      <div class="flex">
        <button 
          class="px-3 py-1 text-sm rounded-l-full" 
          :class="[timeRange === 'week' ? 'bg-primary text-white' : 'bg-gray-100 dark:bg-dark-800']"
          @click="timeRange = 'week'"
        >
          最近一周
        </button>
        <button 
          class="px-3 py-1 text-sm rounded-r-full" 
          :class="[timeRange === 'all' ? 'bg-primary text-white' : 'bg-gray-100 dark:bg-dark-800']"
          @click="timeRange = 'all'"
        >
          所有时间
        </button>
      </div>
    </div>

    <div v-if="loading" class="py-8 flex justify-center">
      <n-spin size="medium" />
    </div>

    <div v-else-if="tracks.length > 0" class="space-y-3">
      <div 
        v-for="(track, index) in tracks" 
        :key="track.id" 
        class="flex items-center p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-dark-800 cursor-pointer"
        @click="handlePlay(track)"
      >
        <!-- 排名 -->
        <div class="w-8 text-center">
          <span 
            class="font-bold"
            :class="{
              'text-red-500': index === 0,
              'text-orange-500': index === 1,
              'text-yellow-500': index === 2,
              'text-gray-500': index > 2
            }"
          >
            {{ index + 1 }}
          </span>
        </div>

        <!-- 歌曲封面 -->
        <div class="w-12 h-12 mr-3 relative rounded overflow-hidden flex-shrink-0">
          <img 
            :src="track.al?.picUrl + '?param=50y50'" 
            :alt="track.name" 
            class="w-full h-full object-cover"
          />
          <div class="absolute inset-0 bg-black/30 opacity-0 hover:opacity-100 flex items-center justify-center text-white transition-opacity">
            <div class="i-carbon-play-filled text-xl"></div>
          </div>
        </div>

        <!-- 歌曲信息 -->
        <div class="flex-1 min-w-0 mr-4">
          <div class="text-sm font-medium truncate">{{ track.name }}</div>
          <div class="text-xs text-gray-500 truncate">{{ formatArtists(track.ar) }}</div>
        </div>

        <!-- 播放次数 -->
        <div class="text-xs text-gray-500 flex items-center">
          <div class="i-carbon-play-filled mr-1"></div>
          <span>{{ track.playCount || 0 }}次</span>
        </div>
      </div>
    </div>

    <div v-else class="py-8 text-center text-gray-500">
      <div class="i-carbon-music-note text-5xl mx-auto mb-3"></div>
      <p>暂无听歌记录</p>
      <p class="mt-2 text-sm">快去播放一些好听的音乐吧~</p>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * 用户听歌排行组件
 * @description 显示用户一段时间内的听歌排行榜
 */
import { ref, watch } from 'vue';
import { NSpin } from 'naive-ui';
import { getUserRecord } from '@/api/modules/user';
import type { Track } from '@/types/models/track';

// 定义属性
const props = defineProps({
  /** 用户ID */
  userId: {
    type: Number,
    required: true
  },
  /** 显示数量 */
  limit: {
    type: Number,
    default: 10
  }
});

// 定义事件
const emit = defineEmits(['play']);

// 加载状态
const loading = ref(false);
// 时间范围：week-最近一周，all-所有时间
const timeRange = ref<'week' | 'all'>('week');
// 曲目列表
const tracks = ref<Track[]>([]);

/**
 * 格式化歌手名称
 * @param artists 歌手数组
 * @returns 歌手名称字符串
 */
function formatArtists(artists: any[]): string {
  if (!artists || !artists.length) return '';
  return artists.map(artist => artist.name).join(' / ');
}

/**
 * 加载用户听歌记录
 */
async function loadUserRecord() {
  if (!props.userId) return;
  
  try {
    loading.value = true;
    const type = timeRange.value === 'week' ? 1 : 0;
    const result = await getUserRecord(props.userId, type);
    
    if (result.code === 200) {
      // 根据时间范围选择相应的数据
      const data = timeRange.value === 'week' ? result.weekData : result.allData;
      
      // 处理数据，提取歌曲信息和播放次数
      tracks.value = data.slice(0, props.limit).map((item: any) => {
        const track = item.song;
        // 添加播放次数
        track.playCount = item.playCount;
        return track;
      });
    }
  } catch (error) {
    console.error('加载用户听歌记录失败:', error);
  } finally {
    loading.value = false;
  }
}

/**
 * 处理播放歌曲
 * @param track 歌曲对象
 */
function handlePlay(track: Track) {
  emit('play', track);
}

// 监听时间范围变化，重新加载数据
watch(timeRange, () => {
  loadUserRecord();
});

// 监听用户ID变化，重新加载数据
watch(() => props.userId, (newValue) => {
  if (newValue) {
    loadUserRecord();
  }
});

// 组件挂载时加载数据
loadUserRecord();
</script>

<style scoped>
/* 播放按钮悬停效果 */
.user-listening-rank .track-item:hover .play-icon {
  opacity: 1;
}
</style> 