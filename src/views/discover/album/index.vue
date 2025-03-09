<template>
  <div class="album-list-page">
    <!-- 搜索框 -->
    <div class="mb-6 relative">
      <n-input-group>
        <n-input
          v-model:value="searchKeyword"
          placeholder="搜索专辑名称或歌手"
          clearable
          @keyup.enter="handleSearch"
          @focus="showSearchHistory = true"
        >
          <template #prefix>
            <div class="i-carbon-search text-lg"></div>
          </template>
        </n-input>
        <n-button type="primary" @click="handleSearch">
          搜索
        </n-button>
      </n-input-group>

      <!-- 搜索历史 -->
      <div
        v-if="showSearchHistory"
        class="absolute left-0 right-0 top-full mt-2 z-10 shadow-lg"
        ref="searchHistoryWrapper"
      >
        <SearchHistory
          ref="searchHistoryRef"
          storage-key="album-search-history"
          :max-length="10"
          @select="handleHistorySelect"
        />
      </div>
    </div>

    <!-- 筛选条件 -->
    <div class="mb-6 bg-white dark:bg-dark-900 rounded-lg p-4 shadow-sm">
      <!-- 地区 -->
      <div class="flex items-center mb-4">
        <div class="text-sm text-gray-500 mr-4">地区：</div>
        <n-radio-group v-model:value="filterParams.area" size="small" class="flex flex-wrap gap-2">
          <n-radio-button
            v-for="area in areaOptions"
            :key="area.value"
            :value="area.value"
          >
            {{ area.label }}
          </n-radio-button>
        </n-radio-group>
      </div>

      <!-- 排序 -->
      <div class="flex items-center">
        <div class="text-sm text-gray-500 mr-4">排序：</div>
        <n-radio-group v-model:value="filterParams.order" size="small" class="flex flex-wrap gap-2">
          <n-radio-button
            v-for="order in orderOptions"
            :key="order.value"
            :value="order.value"
          >
            {{ order.label }}
          </n-radio-button>
        </n-radio-group>
      </div>
    </div>

    <!-- 专辑列表 -->
    <div class="relative" ref="listWrapper" style="height: calc(100vh - 250px);">
      <template v-if="loading">
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          <div v-for="i in 10" :key="i" class="album-item">
            <div class="relative rounded-lg overflow-hidden aspect-square shadow-md mb-2 bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
            <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2"></div>
            <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-2/3"></div>
          </div>
        </div>
      </template>
      <template v-else>
        <n-scrollbar ref="scrollbarRef" @scroll="handleScroll">
          <TransitionGroup
            tag="div"
            class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
            name="album-list"
            appear
          >
            <AlbumCard
              v-for="album in displayAlbums"
              :key="album.id"
              :album="album"
              @click="goToDetail(album.id)"
              @play="playAlbum"
            />
          </TransitionGroup>
          <!-- 加载更多 -->
          <div v-if="hasMore" class="py-4 text-center text-gray-500">
            <n-spin size="small" /> 加载更多...
          </div>
        </n-scrollbar>
      </template>
    </div>

    <!-- 无数据提示 -->
    <div v-if="!loading && albums.length === 0" class="text-center py-16 text-gray-500">
      暂无专辑数据
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch, computed, onMounted, nextTick } from 'vue';
import { useRouter } from 'vue-router';
import { useMessage } from 'naive-ui';
import { getNewAlbums, getAlbumDetail } from '@/api/modules/album';
import type { Album } from '@/types/album';
import { usePlayerStore } from '@/stores/player';
import { useThrottleFn, onClickOutside } from '@vueuse/core';
import AlbumCard from '@/components/common/AlbumCard.vue';
import SearchHistory from '@/components/common/SearchHistory.vue';

const router = useRouter();
const message = useMessage();
const playerStore = usePlayerStore();

// 搜索相关
const searchKeyword = ref('');
const showSearchHistory = ref(false);
const searchHistoryRef = ref();
const searchHistoryWrapper = ref();

// 点击外部关闭搜索历史
onClickOutside(searchHistoryWrapper, () => {
  showSearchHistory.value = false;
});

// 筛选选项
const areaOptions = [
  { label: '全部', value: 'ALL' },
  { label: '华语', value: 'ZH' },
  { label: '欧美', value: 'EA' },
  { label: '韩国', value: 'KR' },
  { label: '日本', value: 'JP' }
] as const;

const orderOptions = [
  { label: '最新', value: 'new' },
  { label: '热门', value: 'hot' }
] as const;

type AreaType = typeof areaOptions[number]['value'];
type OrderType = typeof orderOptions[number]['value'];

// 筛选参数
const filterParams = reactive({
  area: 'ALL' as AreaType,
  order: 'new' as OrderType
});

// 列表相关
const pageSize = 30;
const loading = ref(true);
const hasMore = ref(true);
const albums = ref<Album[]>([]);
const offset = ref(0);

// 滚动相关
const listWrapper = ref<HTMLElement>();
const scrollbarRef = ref();
const isLoadingMore = ref(false);

// 计算显示的专辑列表
const displayAlbums = computed(() => {
  if (!searchKeyword.value) return albums.value;

  const keyword = searchKeyword.value.toLowerCase();
  return albums.value.filter(album =>
    album.name.toLowerCase().includes(keyword) ||
    album.artist.name.toLowerCase().includes(keyword)
  );
});

/**
 * 获取专辑列表
 */
async function fetchAlbums(isLoadMore = false) {
  if (isLoadMore && (!hasMore.value || isLoadingMore.value)) return;

  try {
    if (!isLoadMore) {
      loading.value = true;
      offset.value = 0;
      albums.value = [];
    } else {
      isLoadingMore.value = true;
    }

    const res = await getNewAlbums(pageSize, offset.value, filterParams.area);

    if (isLoadMore) {
      albums.value.push(...res.albums);
    } else {
      albums.value = res.albums;
    }

    offset.value += pageSize;
    hasMore.value = res.albums.length === pageSize;
  } catch (error) {
    console.error('获取专辑列表失败:', error);
    message.error('获取专辑列表失败');
  } finally {
    loading.value = false;
    isLoadingMore.value = false;
  }
}

/**
 * 处理搜索
 */
function handleSearch() {
  if (!searchKeyword.value.trim()) {
    fetchAlbums();
    return;
  }

  // 添加到搜索历史
  searchHistoryRef.value?.addHistory(searchKeyword.value);
  showSearchHistory.value = false;
}

/**
 * 处理搜索历史选择
 */
function handleHistorySelect(keyword: string) {
  searchKeyword.value = keyword;
  handleSearch();
}

/**
 * 处理滚动加载更多
 */
const handleScroll = useThrottleFn((e: Event) => {
  if (!scrollbarRef.value) return;

  const { scrollTop, scrollHeight, clientHeight } = scrollbarRef.value.$el;
  if (scrollHeight - scrollTop - clientHeight < 100) {
    fetchAlbums(true);
  }
}, 200);

/**
 * 跳转到专辑详情
 */
function goToDetail(id: number) {
  router.push(`/discover/album/${id}`);
}

/**
 * 播放专辑
 */
async function playAlbum(id: number) {
  try {
    const res = await getAlbumDetail(id);
    if (res.songs && res.songs.length > 0) {
      playerStore.setPlaylist(res.songs);
      playerStore.play(0);
      message.success(`开始播放专辑《${res.album.name}》`);
    } else {
      message.warning('专辑中暂无歌曲');
    }
  } catch (error) {
    console.error('播放专辑失败:', error);
    message.error('播放失败，请稍后再试');
  }
}

// 监听筛选参数变化
watch(filterParams, () => {
  fetchAlbums();
});

// 组件挂载时获取数据
onMounted(() => {
  fetchAlbums();
});
</script>

<style scoped>
.album-list-page {
  min-height: calc(100vh - 64px);
  padding: 24px;
}

:deep(.n-scrollbar-rail) {
  z-index: 10;
}

/* 列表动画 */
.album-list-enter-active,
.album-list-leave-active {
  transition: all 0.3s ease;
}

.album-list-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.album-list-leave-to {
  opacity: 0;
  transform: scale(0.9);
}

/* 错列显示动画 */
.album-list-move {
  transition: transform 0.3s ease;
}
</style>