<template>
  <div class="music-list">
    <!-- 列表头部 -->
    <div class="flex items-center justify-between mb-4">
      <div class="flex items-center gap-2">
        <h3 v-if="title" class="text-lg font-medium">{{ title }} <span v-if="showCount" class="text-gray-500 text-sm">{{ tracks.length }}首歌</span></h3>
        <slot name="header-left"></slot>
      </div>
      <div class="flex items-center gap-2">
        <slot name="header-right">
          <input
            v-if="showSearch"
            v-model="searchKeyword"
            type="text"
            :placeholder="searchPlaceholder"
            class="px-3 py-1 text-sm rounded-full bg-gray-100 dark:bg-dark-800 focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </slot>
      </div>
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="space-y-2">
      <div v-for="i in 10" :key="i" class="flex items-center p-3 rounded-md">
        <div class="w-6 text-center text-gray-400 mr-4">{{ i }}</div>
        <div class="flex-1 min-w-0">
          <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2 w-48"></div>
          <div class="h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-32"></div>
        </div>
        <div class="w-32 h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
        <div class="w-16 h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse ml-4"></div>
      </div>
    </div>

    <!-- 歌曲列表内容 -->
    <div v-else-if="filteredTracks.length > 0" class="overflow-x-auto">
      <table class="w-full">
        <thead class="border-b border-gray-200 dark:border-gray-700">
          <tr>
            <th class="py-3 text-left w-16">#</th>
            <th class="py-3 text-left">歌曲</th>
            <th class="py-3 text-left">歌手</th>
            <th class="py-3 text-left hidden md:table-cell">专辑</th>
            <th class="py-3 text-left w-24">时长</th>
            <th v-if="showActions" class="py-3 text-left w-24">操作</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(track, index) in filteredTracks"
            :key="track.id"
            class="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-dark-800 cursor-pointer group"
            @dblclick="playSong(index)"
          >
            <td class="py-3 px-2">
              <div class="flex items-center justify-between">
                <span class="group-hover:hidden">{{ startIndex + index + 1 }}</span>
                <div
                  class="i-carbon-play text-gray-400 hover:text-primary cursor-pointer hidden group-hover:block"
                  @click="playSong(index)"
                ></div>
              </div>
            </td>
            <td class="py-3">
              <div class="flex items-center">
                <img
                  v-if="track.al?.picUrl"
                  :src="track.al.picUrl + '?param=40y40'"
                  class="w-10 h-10 rounded mr-3 hidden md:block"
                  :alt="track.name"
                />
                <div>
                  <div class="font-medium">{{ track.name }}</div>
                  <div v-if="track.alia && track.alia.length > 0" class="text-xs text-gray-500">{{ track.alia[0] }}</div>
                </div>
              </div>
            </td>
            <td class="py-3 text-gray-600 dark:text-gray-400">{{ formatArtists(track.ar) }}</td>
            <td class="py-3 text-gray-600 dark:text-gray-400 truncate max-w-40 hidden md:table-cell">{{ track.al?.name }}</td>
            <td class="py-3 text-gray-500">{{ formatDuration(track.dt) }}</td>
            <td v-if="showActions" class="py-3">
              <div class="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button class="icon-btn" @click.stop="addToPlaylist(track)">
                  <div class="i-carbon-add-alt text-gray-400 hover:text-primary"></div>
                </button>
                <button class="icon-btn" @click.stop="toggleLike(track)">
                  <div :class="[isLiked(track.id) ? 'i-carbon-favorite-filled text-red-500' : 'i-carbon-favorite text-gray-400 hover:text-red-500']"></div>
                </button>
                <button class="icon-btn" @click.stop="showMoreActions(track)">
                  <div class="i-carbon-overflow-menu-horizontal text-gray-400 hover:text-primary"></div>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 空状态 -->
    <div v-else class="py-16 text-center text-gray-500">
      <div class="i-carbon-music-note text-5xl mx-auto mb-4"></div>
      <p v-if="searchKeyword">没有找到匹配"{{ searchKeyword }}"的歌曲</p>
      <p v-else>{{ emptyText }}</p>
    </div>

    <!-- 分页 -->
    <div v-if="showPagination && !loading && totalCount > pageSize" class="mt-4 flex justify-center">
      <n-pagination
        v-model:page="currentPage"
        :page-count="Math.ceil(totalCount / pageSize)"
        :page-size="pageSize"
        :page-slot="5"
        :on-update:page="onPageChange"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * 音乐列表组件
 * @description 通用的音乐列表组件，用于显示歌曲列表
 */
import { ref, computed, defineProps, defineEmits } from 'vue';
import { usePlayerStore } from '@/stores/player';

// 播放器状态管理
const playerStore = usePlayerStore();

// 组件属性
const props = defineProps({
  /** 列表标题 */
  title: {
    type: String,
    default: ''
  },
  /** 是否显示数量 */
  showCount: {
    type: Boolean,
    default: true
  },
  /** 是否显示搜索框 */
  showSearch: {
    type: Boolean,
    default: true
  },
  /** 搜索框占位符 */
  searchPlaceholder: {
    type: String,
    default: '搜索歌曲'
  },
  /** 是否显示操作按钮 */
  showActions: {
    type: Boolean,
    default: true
  },
  /** 是否显示分页 */
  showPagination: {
    type: Boolean,
    default: false
  },
  /** 歌曲列表 */
  tracks: {
    type: Array,
    default: () => []
  },
  /** 是否加载中 */
  loading: {
    type: Boolean,
    default: false
  },
  /** 空列表提示文本 */
  emptyText: {
    type: String,
    default: '暂无歌曲'
  },
  /** 起始索引 */
  startIndex: {
    type: Number,
    default: 0
  },
  /** 总数量（用于分页） */
  totalCount: {
    type: Number,
    default: 0
  },
  /** 每页数量 */
  pageSize: {
    type: Number,
    default: 20
  },
  /** 当前页码 */
  initialPage: {
    type: Number,
    default: 1
  },
  /** 喜欢的歌曲ID列表 */
  likedSongIds: {
    type: Array,
    default: () => []
  }
});

// 组件事件
const emit = defineEmits([
  'play',
  'add-to-playlist',
  'toggle-like',
  'more-actions',
  'page-change'
]);

// 搜索关键词
const searchKeyword = ref('');
// 当前页码
const currentPage = ref(props.initialPage);

/**
 * 过滤后的歌曲列表
 */
const filteredTracks = computed(() => {
  if (!searchKeyword.value) return props.tracks;

  const keyword = searchKeyword.value.toLowerCase();
  return props.tracks.filter(track =>
    track.name.toLowerCase().includes(keyword) ||
    formatArtists(track.ar).toLowerCase().includes(keyword) ||
    (track.al?.name && track.al.name.toLowerCase().includes(keyword))
  );
});

/**
 * 播放歌曲
 * @param index 歌曲索引
 */
function playSong(index: number) {
  emit('play', { track: filteredTracks.value[index], index });
}

/**
 * 添加到播放列表
 * @param track 歌曲对象
 */
function addToPlaylist(track: any) {
  emit('add-to-playlist', track);
}

/**
 * 切换喜欢状态
 * @param track 歌曲对象
 */
function toggleLike(track: any) {
  emit('toggle-like', track);
}

/**
 * 显示更多操作
 * @param track 歌曲对象
 */
function showMoreActions(track: any) {
  emit('more-actions', track);
}

/**
 * 页码变化处理
 * @param page 新页码
 */
function onPageChange(page: number) {
  currentPage.value = page;
  emit('page-change', page);
}

/**
 * 检查歌曲是否被喜欢
 * @param id 歌曲ID
 * @returns 是否喜欢
 */
function isLiked(id: number): boolean {
  return props.likedSongIds.includes(id);
}

/**
 * 格式化歌手名称
 * @param artists 歌手数组
 * @returns 格式化后的歌手名称
 */
function formatArtists(artists: any[]): string {
  if (!artists || artists.length === 0) return '';
  return artists.map(artist => artist.name).join(' / ');
}

/**
 * 格式化时长
 * @param duration 时长（毫秒）
 * @returns 格式化后的时长
 */
function formatDuration(duration: number): string {
  if (!duration) return '00:00';

  const minutes = Math.floor(duration / 60000);
  const seconds = Math.floor((duration % 60000) / 1000);

  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}
</script>