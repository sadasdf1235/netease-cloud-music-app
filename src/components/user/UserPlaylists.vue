<template>
  <div class="user-playlists">
    <!-- 标签切换 -->
    <div class="mb-4 border-b border-gray-200 dark:border-gray-700">
      <div class="flex">
        <button 
          v-for="(tab, index) in tabs" 
          :key="index"
          class="py-2 px-4 text-sm font-medium border-b-2 -mb-px"
          :class="activeTab === index 
            ? 'border-primary text-primary' 
            : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'"
          @click="activeTab = index"
        >
          {{ tab.name }}
          <span class="ml-1 text-xs text-gray-400">({{ tab.count }})</span>
        </button>
      </div>
    </div>
    
    <!-- 内容区域 -->
    <div v-if="loading" class="flex justify-center py-12">
      <n-spin size="medium" />
    </div>
    
    <div v-else-if="displayPlaylists.length === 0" class="py-12 text-center text-gray-500">
      <div class="i-carbon-playlist text-6xl mx-auto mb-4"></div>
      <p>暂无歌单</p>
    </div>
    
    <div v-else class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      <div 
        v-for="playlist in displayPlaylists" 
        :key="playlist.id" 
        class="playlist-item"
        @click="handlePlaylistClick(playlist)"
      >
        <div class="relative rounded-lg overflow-hidden aspect-square mb-2 group">
          <!-- 歌单封面 -->
          <img 
            :src="playlist.coverImgUrl + '?param=200y200'" 
            class="w-full h-full object-cover group-hover:scale-105 transition-transform"
            :alt="playlist.name"
            loading="lazy"
          />
          <!-- 播放量 -->
          <div class="absolute top-1 right-1 flex items-center bg-black/50 text-white text-xs px-1 py-0.5 rounded">
            <div class="i-carbon-play-filled mr-0.5"></div>
            <span>{{ formatCount(playlist.playCount) }}</span>
          </div>
          <!-- 播放按钮 -->
          <div class="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity">
            <div class="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center text-primary cursor-pointer hover:scale-110 transition-transform">
              <div class="i-carbon-play-filled text-2xl"></div>
            </div>
          </div>
        </div>
        
        <!-- 歌单名称 -->
        <div class="line-clamp-2 text-sm break-words hover:text-primary transition-colors">
          {{ playlist.name }}
        </div>
        
        <!-- 歌单信息 -->
        <div class="mt-1 text-xs text-gray-500">
          {{ playlist.trackCount }}首 | {{ playlist.creator?.nickname || '未知创建者' }}
        </div>
      </div>
    </div>
    
    <!-- 分页 -->
    <div v-if="showPagination && Math.ceil(totalCount / pageSize) > 1" class="flex justify-center mt-6">
      <n-pagination
        v-model:page="currentPage"
        :page-count="Math.ceil(totalCount / pageSize)"
        :page-size="pageSize"
        :page-slot="5"
        @update:page="handlePageChange"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * 用户歌单展示组件
 * @description 展示用户创建和收藏的歌单，支持分页和切换
 */
import { ref, computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import type { Playlist } from '@/types/models/playlist';

// 路由实例
const router = useRouter();

// 定义组件属性
const props = defineProps({
  /** 用户创建的歌单 */
  createdPlaylists: {
    type: Array as () => Playlist[],
    default: () => []
  },
  /** 用户收藏的歌单 */
  collectedPlaylists: {
    type: Array as () => Playlist[],
    default: () => []
  },
  /** 是否加载中 */
  loading: {
    type: Boolean,
    default: false
  },
  /** 是否显示分页 */
  showPagination: {
    type: Boolean,
    default: true
  },
  /** 每页显示数量 */
  pageSize: {
    type: Number,
    default: 30
  }
});

// 定义事件
const emit = defineEmits(['page-change']);

// 当前活动标签索引
const activeTab = ref(0);
// 当前页码
const currentPage = ref(1);

/**
 * 标签列表
 */
const tabs = computed(() => [
  { name: '创建的歌单', count: props.createdPlaylists.length },
  { name: '收藏的歌单', count: props.collectedPlaylists.length }
]);

/**
 * 当前展示的歌单列表
 */
const displayPlaylists = computed(() => {
  // 根据活动标签选择对应的歌单列表
  const selectedPlaylists = activeTab.value === 0 
    ? props.createdPlaylists 
    : props.collectedPlaylists;
    
  // 如果不需要分页，直接返回所有歌单
  if (!props.showPagination) {
    return selectedPlaylists;
  }
  
  // 计算分页范围
  const start = (currentPage.value - 1) * props.pageSize;
  const end = start + props.pageSize;
  return selectedPlaylists.slice(start, end);
});

/**
 * 歌单总数
 */
const totalCount = computed(() => {
  return activeTab.value === 0 
    ? props.createdPlaylists.length 
    : props.collectedPlaylists.length;
});

/**
 * 格式化数字
 * @param count 数量
 * @returns 格式化后的数字
 */
function formatCount(count: number): string {
  if (!count && count !== 0) return '0';
  
  if (count >= 100000000) {
    return (count / 100000000).toFixed(1) + '亿';
  } else if (count >= 10000) {
    return (count / 10000).toFixed(1) + '万';
  } else {
    return count.toString();
  }
}

/**
 * 处理歌单点击
 * @param playlist 歌单对象
 */
function handlePlaylistClick(playlist: Playlist): void {
  router.push({
    name: 'playlist-detail',
    params: { id: playlist.id }
  });
}

/**
 * 处理页码变化
 * @param page 新的页码
 */
function handlePageChange(page: number): void {
  currentPage.value = page;
  emit('page-change', page);
}

// 监听标签变化，重置页码
watch(activeTab, () => {
  currentPage.value = 1;
});
</script>

<style scoped>
.playlist-item {
  cursor: pointer;
}
</style> 