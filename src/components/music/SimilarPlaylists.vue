<template>
  <div class="similar-playlists">
    <div class="section-header flex items-center justify-between mb-4">
      <h3 class="text-lg font-bold">相似歌单</h3>
      <div class="text-sm text-primary cursor-pointer" @click="handleMoreClick">
        更多
        <div class="i-carbon-arrow-right inline-block align-middle"></div>
      </div>
    </div>
    
    <div v-if="loading" class="flex justify-center py-8">
      <n-spin size="medium" />
    </div>
    
    <div v-else-if="playlists.length === 0" class="text-center py-8 text-gray-500">
      <div class="i-carbon-playlist text-5xl mx-auto mb-3"></div>
      <p>暂无相似歌单</p>
    </div>
    
    <div v-else class="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
      <div 
        v-for="playlist in playlists" 
        :key="playlist.id" 
        class="playlist-item"
        @click="handlePlaylistClick(playlist)"
      >
        <div class="relative rounded-lg overflow-hidden mb-2 aspect-square">
          <!-- 封面图片 -->
          <img 
            :src="playlist.coverImgUrl + '?param=200y200'" 
            class="w-full h-full object-cover transition-transform hover:scale-110" 
            :alt="playlist.name" 
            loading="lazy"
          />
          <!-- 播放数据 -->
          <div class="absolute top-1 right-1 flex items-center px-1 py-0.5 rounded text-xs text-white bg-black/50">
            <div class="i-carbon-play-filled mr-0.5"></div>
            <span>{{ formatCount(playlist.playCount) }}</span>
          </div>
        </div>
        <div class="name text-sm line-clamp-2 break-words hover:text-primary" :title="playlist.name">
          {{ playlist.name }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * 相似歌单组件
 * @description 显示相似歌单列表，支持点击查看详情
 */
import { useRouter } from 'vue-router';
import type { Playlist } from '@/types/models/playlist';

// 定义props
const props = defineProps({
  /** 歌单列表 */
  playlists: {
    type: Array as () => Playlist[],
    default: () => []
  },
  /** 是否正在加载 */
  loading: {
    type: Boolean,
    default: false
  }
});

// 定义事件
const emit = defineEmits(['more']);

// 路由
const router = useRouter();

/**
 * 格式化播放次数
 * @param count 播放次数
 * @returns 格式化后的播放次数
 */
function formatCount(count: number): string {
  if (count > 100000000) {
    return (count / 100000000).toFixed(1) + '亿';
  } else if (count > 10000) {
    return (count / 10000).toFixed(1) + '万';
  } else {
    return count.toString();
  }
}

/**
 * 处理点击查看更多
 */
function handleMoreClick(): void {
  emit('more');
}

/**
 * 处理点击歌单
 * @param playlist 歌单对象
 */
function handlePlaylistClick(playlist: Playlist): void {
  router.push({
    name: 'playlist-detail',
    params: { id: playlist.id }
  });
}
</script>

<style scoped>
.playlist-item {
  cursor: pointer;
  transition: all 0.3s;
}

.playlist-item:hover .name {
  color: var(--primary-color);
}
</style> 