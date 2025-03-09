<template>
  <div class="album-page">
    <!-- 新碟分类 -->
    <div class="mb-6">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-xl font-bold">新碟上架</h2>
        <div class="flex items-center gap-3">
          <div class="flex rounded-full bg-gray-100 dark:bg-dark-800 p-1">
            <button
              v-for="(area, index) in areaTypes"
              :key="area.value"
              :class="[
                'px-4 py-1 rounded-full transition-colors',
                currentArea === area.value
                  ? 'bg-primary text-white'
                  : 'hover:bg-gray-200 dark:hover:bg-dark-700'
              ]"
              @click="changeArea(area.value)"
            >
              {{ area.name }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 新碟列表 -->
    <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
      <template v-if="loading">
        <div v-for="i in 20" :key="i" class="album-item">
          <div class="relative rounded-lg overflow-hidden aspect-square shadow-md mb-2 bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
          <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2"></div>
          <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-2/3"></div>
        </div>
      </template>
      <template v-else>
        <AlbumCard
          v-for="album in albums"
          :key="album.id"
          :album="album"
          @play="playAlbum"
        />
      </template>
    </div>

    <!-- 分页 -->
    <div class="flex justify-center mt-8">
      <n-pagination
        v-model:page="currentPage"
        :page-count="totalPages"
        :on-update:page="changePage"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { usePlayerStore } from '@/stores/player';
import { useMessage } from 'naive-ui';
import { getNewAlbums, getAlbumDetail } from '@/api/album';
import AlbumCard from '@/components/common/AlbumCard.vue';

const route = useRoute();
const router = useRouter();
const playerStore = usePlayerStore();
const message = useMessage();

// 加载状态
const loading = ref(true);

// 专辑列表
const albums = ref<any[]>([]);

// 分页相关
const currentPage = ref(1);
const pageSize = ref(20);
const totalPages = ref(1);
const total = ref(0);

// 地区类型
const areaTypes = [
  { name: '全部', value: 'ALL' },
  { name: '华语', value: 'ZH' },
  { name: '欧美', value: 'EA' },
  { name: '韩国', value: 'KR' },
  { name: '日本', value: 'JP' }
];
const currentArea = ref('ALL');

/**
 * 切换地区
 * @param area 地区代码
 */
function changeArea(area: string) {
  currentArea.value = area;
  currentPage.value = 1;
  fetchAlbums();
}

/**
 * 切换页码
 * @param page 页码
 */
function changePage(page: number) {
  currentPage.value = page;
  fetchAlbums();
}

/**
 * 播放专辑
 * @param id 专辑ID
 */
function playAlbum(id: number) {
  getAlbumDetail(id).then((res: any) => {
    if (res.songs && res.songs.length > 0) {
      playerStore.setPlaylist(res.songs);
      playerStore.play(0);
      message.success(`开始播放专辑《${res.album.name}》`);
    } else {
      message.warning('专辑中暂无歌曲');
    }
  }).catch((err: any) => {
    console.error('播放专辑失败:', err);
    message.error('播放失败，请稍后再试');
  });
}

/**
 * 获取专辑列表
 */
async function fetchAlbums() {
  try {
    loading.value = true;

    const offset = (currentPage.value - 1) * pageSize.value;
    const res = await getNewAlbums({
      area: currentArea.value,
      limit: pageSize.value,
      offset
    });

    albums.value = res.albums || [];
    total.value = res.total || 0;
    totalPages.value = Math.ceil(total.value / pageSize.value);

    loading.value = false;
  } catch (error) {
    console.error('获取专辑列表失败:', error);
    message.error('获取专辑列表失败');
    loading.value = false;
  }
}

// 监听路由参数变化
watch(
  () => route.query,
  (newQuery) => {
    if (newQuery.area) {
      currentArea.value = newQuery.area as string;
    }
    if (newQuery.page) {
      currentPage.value = Number(newQuery.page) || 1;
    }
    fetchAlbums();
  }
);

// 组件挂载时获取数据
onMounted(() => {
  // 从路由参数中获取初始值
  if (route.query.area) {
    currentArea.value = route.query.area as string;
  }
  if (route.query.page) {
    currentPage.value = Number(route.query.page) || 1;
  }

  fetchAlbums();
});
</script>