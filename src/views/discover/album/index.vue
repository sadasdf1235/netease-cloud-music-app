<template>
  <div class="album-page">
    <!-- 页面标题 -->
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold">新碟上架</h1>
      <div class="flex items-center gap-4">
        <n-select
          v-model:value="filterParams.order"
          :options="orderOptions"
          placeholder="选择排序方式"
          class="w-32"
        />
      </div>
    </div>

    <!-- 筛选条件 -->
    <div class="filter-section mb-6 bg-white dark:bg-dark-800 rounded-lg p-4 shadow-sm">
      <div class="flex flex-col gap-4">
        <!-- 地区筛选 -->
        <div class="flex items-center gap-4">
          <span class="text-gray-500 w-16">地区：</span>
          <n-radio-group v-model:value="filterParams.area" class="flex flex-wrap gap-4">
            <n-radio-button
              v-for="item in areaOptions"
              :key="item.value"
              :value="item.value"
            >
              {{ item.label }}
            </n-radio-button>
          </n-radio-group>
        </div>

        <!-- 类型筛选 -->
        <div class="flex items-center gap-4">
          <span class="text-gray-500 w-16">类型：</span>
          <n-radio-group v-model:value="filterParams.type" class="flex flex-wrap gap-4">
            <n-radio-button
              v-for="item in typeOptions"
              :key="item.value"
              :value="item.value"
            >
              {{ item.label }}
            </n-radio-button>
          </n-radio-group>
        </div>

        <!-- 时间筛选 -->
        <div class="flex items-center gap-4">
          <span class="text-gray-500 w-16">时间：</span>
          <div class="flex items-center gap-4">
            <n-select
              v-model:value="filterParams.year"
              :options="yearOptions"
              placeholder="选择年份"
              class="w-32"
            />
            <n-select
              v-model:value="filterParams.month"
              :options="monthOptions"
              placeholder="选择月份"
              class="w-32"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- 专辑列表 -->
    <div class="album-list">
      <div v-if="loading" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        <div v-for="i in pageSize" :key="i" class="album-item-skeleton">
          <div class="aspect-square bg-gray-200 dark:bg-gray-700 rounded-lg mb-3 animate-pulse"></div>
          <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2 animate-pulse"></div>
          <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 animate-pulse"></div>
        </div>
      </div>
      <template v-else>
        <div v-if="albums.length > 0" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          <AlbumCard
            v-for="album in albums"
            :key="album.id"
            :album="album"
            :show-subscribe="true"
            @play="playAlbum"
            @click="navigateToDetail(album.id)"
            @subscribe="handleSubscribe"
          />
        </div>
        <div v-else class="flex flex-col items-center justify-center py-20">
          <div class="i-carbon-music-add text-6xl text-gray-300 dark:text-gray-600 mb-4"></div>
          <p class="text-gray-500">暂无专辑</p>
        </div>
      </template>
    </div>

    <!-- 分页 -->
    <div class="flex justify-center mt-8" v-if="total > 0">
      <n-pagination
        v-model:page="currentPage"
        v-model:page-size="pageSize"
        :item-count="total"
        :page-sizes="[30, 60, 90]"
        show-size-picker
        show-quick-jumper
        @update:page="handlePageChange"
        @update:page-size="handlePageSizeChange"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useMessage } from 'naive-ui';
import { albumApi } from '@/api';
import type { Album } from '@/types/album';
import { usePlayerStore } from '@/stores/player';
import AlbumCard from '@/components/common/AlbumCard.vue';
import { useLoadingBar } from 'naive-ui';

const router = useRouter();
const message = useMessage();
const loadingBar = useLoadingBar();
const playerStore = usePlayerStore();

// 加载状态
const loading = ref(true);

// 专辑列表数据
const albums = ref<Album[]>([]);
const total = ref(0);

// 分页参数
const currentPage = ref(1);
const pageSize = ref(30);

// 筛选参数
const filterParams = ref({
  area: 'ALL',
  type: 'ALL',
  order: 'NEW',
  year: new Date().getFullYear(),
  month: new Date().getMonth() + 1
});

// 地区选项
const areaOptions = [
  { label: '全部', value: 'ALL' },
  { label: '华语', value: 'ZH' },
  { label: '欧美', value: 'EA' },
  { label: '韩国', value: 'KR' },
  { label: '日本', value: 'JP' }
];

// 类型选项
const typeOptions = [
  { label: '全部', value: 'ALL' },
  { label: '专辑', value: 'ALBUM' },
  { label: 'EP/单曲', value: 'SINGLE' },
  { label: '合集', value: 'COMPILATION' }
];

// 排序选项
const orderOptions = [
  { label: '最新', value: 'NEW' },
  { label: '最热', value: 'HOT' },
  { label: '评分', value: 'SCORE' }
];

// 年份选项
const currentYear = new Date().getFullYear();
const yearOptions = computed(() => {
  const years = [];
  for (let i = 0; i < 5; i++) {
    const year = currentYear - i;
    years.push({ label: String(year), value: year });
  }
  return years;
});

// 月份选项
const monthOptions = computed(() => {
  return Array.from({ length: 12 }, (_, i) => ({
    label: String(i + 1).padStart(2, '0'),
    value: i + 1
  }));
});

// 获取专辑列表
async function fetchAlbums() {
  try {
    loading.value = true;
    loadingBar.start();

    const params = {
      ...filterParams.value,
      limit: pageSize.value,
      offset: (currentPage.value - 1) * pageSize.value
    };
    const { albums: albumList, total: totalCount } = await albumApi.getNewAlbums(params);
    albums.value = albumList || [];
    total.value = totalCount || 0;
  } catch (error) {
    console.error('获取专辑列表失败:', error);
    message.error('获取专辑列表失败，请稍后重试');
  } finally {
    loading.value = false;
    loadingBar.finish();
  }
}

// 播放专辑
async function playAlbum(id: number) {
  try {
    loadingBar.start();
    const { songs, album } = await albumApi.getAlbumDetail(id);
    if (songs && songs.length > 0) {
      playerStore.setPlaylist(songs);
      playerStore.play(0);
      message.success(`开始播放专辑《${album.name}》`);
    } else {
      message.warning('专辑中暂无歌曲');
    }
  } catch (error) {
    console.error('播放专辑失败:', error);
    message.error('播放失败，请稍后重试');
  } finally {
    loadingBar.finish();
  }
}

// 收藏/取消收藏专辑
async function handleSubscribe(id: number, subscribed: boolean) {
  try {
    await albumApi.subscribeAlbum(id, subscribed ? 2 : 1);
    message.success(subscribed ? '已取消收藏' : '收藏成功');
    // 重新获取专辑列表，更新收藏状态
    fetchAlbums();
  } catch (error) {
    console.error('收藏/取消收藏专辑失败:', error);
    message.error('操作失败，请稍后重试');
  }
}

// 跳转到专辑详情页
function navigateToDetail(id: number) {
  router.push(`/discover/album/${id}`);
}

// 处理页码变化
function handlePageChange(page: number) {
  currentPage.value = page;
  fetchAlbums();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// 处理每页数量变化
function handlePageSizeChange(size: number) {
  pageSize.value = size;
  currentPage.value = 1;
  fetchAlbums();
}

// 监听筛选参数变化
watch(filterParams, () => {
  currentPage.value = 1;
  fetchAlbums();
}, { deep: true });

// 组件挂载时获取数据
onMounted(() => {
  fetchAlbums();
});
</script>

<style scoped>
.album-page {
  padding: 24px;
}

.album-item-skeleton {
  cursor: pointer;
  transition: transform 0.2s;
}

.album-item-skeleton:hover {
  transform: translateY(-5px);
}

.filter-section {
  border: 1px solid var(--border-color);
}

:deep(.n-radio-button) {
  border-radius: 16px !important;
}

:deep(.n-radio-button.n-radio-button--checked) {
  background-color: var(--primary-color) !important;
  border-color: var(--primary-color) !important;
  color: white !important;
}

:deep(.n-select) {
  width: 120px;
}

@media (max-width: 640px) {
  .filter-section {
    padding: 16px;
  }

  :deep(.n-radio-group) {
    flex-wrap: wrap;
  }

  :deep(.n-radio-button) {
    margin-bottom: 8px;
  }
}
</style>