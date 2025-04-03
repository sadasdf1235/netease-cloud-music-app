<template>
  <div class="user-listening-stats bg-white dark:bg-dark-900 rounded-lg shadow-sm p-6">
    <!-- 标题 -->
    <div class="flex items-center justify-between mb-6">
      <h3 class="text-lg font-bold">听歌偏好分析</h3>
      <n-tooltip trigger="hover" placement="top">
        <template #trigger>
          <div class="i-carbon-information text-gray-400 cursor-help"></div>
        </template>
        数据基于您最近的听歌记录
      </n-tooltip>
    </div>
    
    <!-- 加载状态 -->
    <div v-if="loading" class="flex justify-center py-10">
      <n-spin size="medium" />
    </div>
    
    <!-- 主要内容 -->
    <template v-else>
      <!-- 听歌数量统计 -->
      <div class="mb-8">
        <div class="stats-header flex items-center mb-3">
          <div class="i-carbon-music-note mr-2 text-primary"></div>
          <span class="text-base font-medium">听歌总览</span>
        </div>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div class="stat-card p-4 bg-gray-50 dark:bg-dark-800 rounded-lg text-center">
            <div class="text-2xl font-bold text-primary">{{ formatNumber(stats.weekCount) }}</div>
            <div class="text-xs text-gray-500 mt-1">本周听歌</div>
          </div>
          <div class="stat-card p-4 bg-gray-50 dark:bg-dark-800 rounded-lg text-center">
            <div class="text-2xl font-bold text-blue-500">{{ formatNumber(stats.monthCount) }}</div>
            <div class="text-xs text-gray-500 mt-1">本月听歌</div>
          </div>
          <div class="stat-card p-4 bg-gray-50 dark:bg-dark-800 rounded-lg text-center">
            <div class="text-2xl font-bold text-indigo-500">{{ formatNumber(stats.totalCount) }}</div>
            <div class="text-xs text-gray-500 mt-1">累计听歌</div>
          </div>
          <div class="stat-card p-4 bg-gray-50 dark:bg-dark-800 rounded-lg text-center">
            <div class="text-2xl font-bold text-purple-500">{{ formatNumber(stats.dailyAverage) }}</div>
            <div class="text-xs text-gray-500 mt-1">日均听歌</div>
          </div>
        </div>
      </div>
      
      <!-- 风格偏好 -->
      <div class="mb-8">
        <div class="stats-header flex items-center mb-3">
          <div class="i-carbon-chart-pie mr-2 text-primary"></div>
          <span class="text-base font-medium">风格偏好</span>
        </div>
        <div class="style-tags flex flex-wrap gap-2">
          <div 
            v-for="(tag, index) in stats.styleTags" 
            :key="index"
            :style="{fontSize: `${Math.max(0.75 + (tag.weight * 0.5), 0.75)}rem`}"
            class="px-3 py-1.5 rounded-full"
            :class="tagColors[index % tagColors.length]"
          >
            {{ tag.name }}
          </div>
          <div v-if="!stats.styleTags.length" class="text-gray-500 text-sm py-4">
            暂无足够数据生成风格偏好
          </div>
        </div>
      </div>
      
      <!-- 常听时段 -->
      <div class="mb-8">
        <div class="stats-header flex items-center mb-3">
          <div class="i-carbon-time mr-2 text-primary"></div>
          <span class="text-base font-medium">常听时段</span>
        </div>
        <div class="time-periods grid grid-cols-4 gap-2">
          <div 
            v-for="(period, index) in stats.timePeriods" 
            :key="index"
            class="p-2 rounded-lg bg-gray-50 dark:bg-dark-800 text-center relative"
          >
            <div class="text-sm">{{ period.name }}</div>
            <div 
              class="activity-bar mt-2 h-16 rounded bg-primary/10 relative overflow-hidden"
              :class="period.isTopPeriod ? 'border border-primary' : ''"
            >
              <div 
                class="absolute bottom-0 left-0 right-0 bg-primary transition-all"
                :style="{height: `${period.percentage}%`}"
              ></div>
            </div>
            <div class="text-xs mt-1 text-gray-500">{{ period.percentage }}%</div>
          </div>
        </div>
      </div>
      
      <!-- 最常听的歌手 -->
      <div>
        <div class="stats-header flex items-center mb-3">
          <div class="i-carbon-microphone mr-2 text-primary"></div>
          <span class="text-base font-medium">最常听的歌手</span>
        </div>
        <div class="top-artists grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          <div 
            v-for="(artist, index) in stats.topArtists" 
            :key="artist.id"
            class="artist-item text-center"
          >
            <div class="relative">
              <img 
                :src="artist.picUrl + '?param=120y120'" 
                class="w-full aspect-square object-cover rounded-full mx-auto mb-2"
                :alt="artist.name"
              />
              <div class="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold">
                {{ index + 1 }}
              </div>
            </div>
            <div class="text-sm font-medium line-clamp-1">{{ artist.name }}</div>
            <div class="text-xs text-gray-500">{{ artist.playCount }}次播放</div>
          </div>
          <div v-if="!stats.topArtists.length" class="text-gray-500 text-sm py-4 col-span-full">
            暂无足够数据生成歌手偏好
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
/**
 * 用户听歌统计与偏好分析组件
 * @description 展示用户的听歌习惯、风格偏好、常听时段和最常听的歌手
 */
import { defineProps, defineEmits } from 'vue';

// 标签颜色列表
const tagColors = [
  'bg-primary/10 text-primary',
  'bg-blue-500/10 text-blue-500',
  'bg-green-500/10 text-green-500',
  'bg-yellow-500/10 text-yellow-500',
  'bg-red-500/10 text-red-500',
  'bg-purple-500/10 text-purple-500',
  'bg-pink-500/10 text-pink-500',
  'bg-indigo-500/10 text-indigo-500'
];

// 定义组件属性
const props = defineProps({
  /** 是否正在加载 */
  loading: {
    type: Boolean,
    default: false
  },
  /** 听歌统计数据 */
  stats: {
    type: Object,
    required: true,
    default: () => ({
      // 听歌数量
      weekCount: 0,
      monthCount: 0,
      totalCount: 0,
      dailyAverage: 0,
      
      // 风格标签
      styleTags: [] as Array<{ name: string, weight: number }>,
      
      // 常听时段
      timePeriods: [] as Array<{ 
        name: string, 
        percentage: number,
        isTopPeriod: boolean
      }>,
      
      // 最常听的歌手
      topArtists: [] as Array<{
        id: number,
        name: string,
        picUrl: string,
        playCount: number
      }>
    })
  }
});

// 定义事件
defineEmits(['refresh']);

/**
 * 格式化数字
 * @param num 要格式化的数字
 * @returns 格式化后的字符串
 */
function formatNumber(num: number): string {
  if (num >= 10000) {
    return (num / 10000).toFixed(1) + '万';
  }
  return num.toString();
}
</script>

<style scoped>
.stats-header {
  position: relative;
}

.stats-header::after {
  content: '';
  position: absolute;
  bottom: -8px;
  left: 0;
  width: 40px;
  height: 2px;
  background-color: var(--primary-color);
  border-radius: 2px;
}

.style-tags > div {
  transition: all 0.3s ease;
}

.style-tags > div:hover {
  transform: translateY(-2px);
}
</style> 