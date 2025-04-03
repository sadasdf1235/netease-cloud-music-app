<template>
  <div 
    class="mini-player fixed bottom-0 left-0 right-0 z-40 bg-white/90 dark:bg-dark-800/90 backdrop-blur-md border-t border-gray-200 dark:border-gray-700 shadow-up"
    :class="{ 'hidden': !currentSong || isFullPlayer }"
  >
    <div class="container mx-auto px-4 py-2 flex items-center justify-between">
      <!-- 歌曲信息 -->
      <div class="flex items-center flex-1 min-w-0 cursor-pointer" @click="openFullPlayer">
        <div class="w-10 h-10 rounded-md overflow-hidden mr-3 flex-shrink-0">
          <img
            v-if="currentSong?.album?.picUrl"
            :src="currentSong.album.picUrl + '?param=40y40'"
            :alt="currentSong?.name"
            class="w-full h-full object-cover transition-transform hover:scale-110"
          />
          <div v-else class="w-full h-full bg-gray-200 dark:bg-dark-700 flex items-center justify-center">
            <div class="i-carbon-music text-gray-400 text-xl"></div>
          </div>
        </div>
        
        <div class="flex-1 min-w-0">
          <div class="text-sm font-medium truncate">
            {{ currentSong?.name || '暂无播放内容' }}
          </div>
          <div class="text-xs text-gray-500 truncate">
            {{ formatArtists(currentSong?.artists) }}
          </div>
        </div>
      </div>
      
      <!-- 播放控制 -->
      <div class="flex items-center">
        <button 
          class="icon-btn mx-1" 
          @click="playerStore.prev()"
          :title="'上一首'"
        >
          <div class="i-carbon-skip-back-filled text-lg"></div>
        </button>
        
        <button 
          class="icon-btn mx-1 w-8 h-8 flex items-center justify-center bg-primary text-white rounded-full"
          @click="playerStore.togglePlay()"
          :title="isPlaying ? '暂停' : '播放'"
        >
          <div :class="[isPlaying ? 'i-carbon-pause-filled' : 'i-carbon-play-filled', 'text-lg']"></div>
        </button>
        
        <button 
          class="icon-btn mx-1" 
          @click="playerStore.next()"
          :title="'下一首'"
        >
          <div class="i-carbon-skip-forward-filled text-lg"></div>
        </button>
        
        <button 
          class="icon-btn ml-2" 
          @click="togglePlaylist"
          :title="'播放列表'"
        >
          <div class="i-carbon-list text-lg"></div>
        </button>
      </div>
    </div>
    
    <!-- 进度条 -->
    <div class="h-1 bg-gray-200 dark:bg-dark-700 overflow-hidden">
      <div 
        class="h-full bg-primary transition-all duration-300 ease-out"
        :style="{ width: `${progress}%` }"
      ></div>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * 迷你播放器组件
 * @description 显示在应用底部的精简播放器，提供基本控制和切换到全屏播放器的入口
 */
import { computed } from 'vue';
import { usePlayerStore } from '@/stores/player';
import type { Song } from '@/types/song';

// 定义props
const props = defineProps({
  /** 是否显示全屏播放器 */
  isFullPlayer: {
    type: Boolean,
    default: false
  }
});

// 定义事件
const emit = defineEmits([
  'toggle-full-player',
  'toggle-playlist'
]);

// 播放器状态
const playerStore = usePlayerStore();

// 计算属性
const currentSong = computed(() => playerStore.currentSong);
const isPlaying = computed(() => playerStore.playing);
const progress = computed(() => playerStore.progress || 0);

/**
 * 格式化歌手名称
 * @param artists 歌手数组
 * @returns 以 / 分隔的歌手名称
 */
function formatArtists(artists: any[] | undefined): string {
  if (!artists || artists.length === 0) return '';
  return artists.map(artist => artist.name).join(' / ');
}

/**
 * 打开全屏播放器
 */
function openFullPlayer(): void {
  emit('toggle-full-player', true);
}

/**
 * 切换播放列表显示
 */
function togglePlaylist(): void {
  emit('toggle-playlist');
}
</script>

<style scoped>
.shadow-up {
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.05);
}

.mini-player {
  height: 52px;
}

/* 在全屏播放器打开时添加底部边距，避免内容被迷你播放器遮挡 */
:deep(.app-main) {
  padding-bottom: 52px;
}
</style> 