<template>
  <div class="user-play-record">
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
        </button>
      </div>
    </div>
    
    <!-- 加载状态 -->
    <div v-if="loading" class="flex justify-center py-12">
      <n-spin size="medium" />
    </div>
    
    <!-- 空状态 -->
    <div v-else-if="displaySongs.length === 0" class="py-12 text-center text-gray-500">
      <div class="i-carbon-music text-6xl mx-auto mb-4"></div>
      <p>暂无播放记录</p>
    </div>
    
    <!-- 歌曲列表 -->
    <div v-else>
      <div 
        v-for="(song, index) in displaySongs" 
        :key="song.id" 
        class="song-item flex items-center p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-dark-800 cursor-pointer"
        @click="handleSongClick(song)"
      >
        <!-- 序号/排名 -->
        <div class="w-8 text-center">
          <div 
            :class="[
              index < 3 ? 'text-primary font-bold' : 'text-gray-400',
              activeTab === 0 ? 'text-lg' : 'text-base'
            ]"
          >
            {{ index + 1 }}
          </div>
        </div>
        
        <!-- 歌曲信息 -->
        <div class="flex flex-1 items-center overflow-hidden">
          <!-- 歌曲封面 -->
          <div class="w-10 h-10 rounded overflow-hidden flex-shrink-0 mr-3">
            <img 
              :src="song.al.picUrl + '?param=40y40'" 
              class="w-full h-full object-cover" 
              :alt="song.name" 
              loading="lazy"
            />
          </div>
          
          <!-- 歌曲名称和歌手 -->
          <div class="overflow-hidden">
            <div class="text-sm font-medium truncate">{{ song.name }}</div>
            <div class="text-xs text-gray-500 truncate">{{ formatArtists(song.ar) }}</div>
          </div>
        </div>
        
        <!-- 播放次数/最近播放时间 -->
        <div class="ml-3 text-xs text-gray-500">
          <template v-if="activeTab === 0">
            {{ song.playCount || 0 }}次
          </template>
          <template v-else>
            {{ formatDate(song.playTime) }}
          </template>
        </div>
        
        <!-- 操作按钮 -->
        <div class="ml-3 flex items-center">
          <button class="icon-btn opacity-0 group-hover:opacity-100" @click.stop="handlePlay(song)">
            <div class="i-carbon-play-filled"></div>
          </button>
          <button class="icon-btn opacity-0 group-hover:opacity-100" @click.stop="handleAddToPlaylist(song)">
            <div class="i-carbon-add-alt"></div>
          </button>
        </div>
      </div>
      
      <!-- 查看更多按钮 -->
      <div v-if="hasMore && !loading" class="text-center mt-4">
        <n-button 
          size="small" 
          @click="loadMore"
          :loading="loadingMore"
        >
          加载更多
        </n-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * 用户听歌排行组件
 * @description 展示用户最常听的歌曲和最近听的歌曲
 */
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { usePlayerStore } from '@/stores/player';

// 路由实例
const router = useRouter();
// 播放器状态
const playerStore = usePlayerStore();

// 定义组件属性
const props = defineProps({
  /** 用户最常听的歌曲 */
  weekData: {
    type: Array,
    default: () => []
  },
  /** 用户最近听的歌曲 */
  allData: {
    type: Array,
    default: () => []
  },
  /** 是否正在加载 */
  loading: {
    type: Boolean,
    default: false
  },
  /** 是否正在加载更多 */
  loadingMore: {
    type: Boolean,
    default: false
  },
  /** 是否有更多数据 */
  hasMore: {
    type: Boolean,
    default: false
  }
});

// 定义事件
const emit = defineEmits(['load-more']);

// 当前活动标签索引：0-最常听的歌曲, 1-最近听的歌曲
const activeTab = ref(0);

/**
 * 标签列表
 */
const tabs = [
  { name: '最常听的歌曲' },
  { name: '最近听的歌曲' }
];

/**
 * 当前展示的歌曲列表
 */
const displaySongs = computed(() => {
  return activeTab.value === 0 ? props.weekData : props.allData;
});

/**
 * 格式化歌手名称
 * @param artists 歌手数组
 * @returns 格式化后的歌手名称
 */
function formatArtists(artists: any[]): string {
  if (!artists || !artists.length) return '未知歌手';
  return artists.map(artist => artist.name).join('/');
}

/**
 * 格式化日期
 * @param timestamp 时间戳
 * @returns 格式化后的日期
 */
function formatDate(timestamp: number): string {
  if (!timestamp) return '';
  
  const now = new Date();
  const date = new Date(timestamp);
  
  // 今天
  if (
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear()
  ) {
    return `今天 ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  }
  
  // 昨天
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  if (
    date.getDate() === yesterday.getDate() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getFullYear() === yesterday.getFullYear()
  ) {
    return `昨天 ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  }
  
  // 一周内
  const weekAgo = new Date(now);
  weekAgo.setDate(weekAgo.getDate() - 7);
  if (date > weekAgo) {
    const days = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    return `${days[date.getDay()]} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  }
  
  // 更早
  return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
}

/**
 * 处理歌曲点击
 * @param song 歌曲对象
 */
function handleSongClick(song: any): void {
  router.push({
    name: 'song-detail',
    params: { id: song.id }
  });
}

/**
 * 播放歌曲
 * @param song 歌曲对象
 */
function handlePlay(song: any): void {
  playerStore.playSong({
    id: song.id,
    name: song.name,
    artists: song.ar,
    album: song.al,
    duration: song.dt
  });
}

/**
 * 添加歌曲到播放列表
 * @param song 歌曲对象
 */
function handleAddToPlaylist(song: any): void {
  playerStore.addToPlaylist({
    id: song.id,
    name: song.name,
    artists: song.ar,
    album: song.al,
    duration: song.dt
  });
}

/**
 * 加载更多
 */
function loadMore(): void {
  emit('load-more', activeTab.value);
}
</script>

<style scoped>
.song-item {
  transition: all 0.2s ease;
}

.song-item:hover .icon-btn {
  opacity: 1;
}

.icon-btn {
  @apply w-8 h-8 flex items-center justify-center rounded-full text-gray-500 hover:text-primary hover:bg-gray-100 dark:hover:bg-dark-700 transition-all;
}
</style> 