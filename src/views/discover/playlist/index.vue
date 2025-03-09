<template>
  <div class="playlist-page">
    <!-- 歌单分类 -->
    <div class="mb-6 bg-white dark:bg-dark-900 rounded-lg p-4 shadow-sm">
      <div class="flex items-center justify-between mb-4">
        <div class="flex items-center space-x-4">
          <n-dropdown
            trigger="click"
            :options="categoryOptions"
            @select="handleCategorySelect"
          >
            <n-button>
              {{ currentCategory }}
              <div class="i-carbon-chevron-down ml-1"></div>
            </n-button>
          </n-dropdown>
          <div class="text-sm text-gray-500">
            <span>热门标签：</span>
            <n-space>
              <n-tag
                v-for="tag in hotTags"
                :key="tag"
                :bordered="false"
                round
                size="small"
                class="cursor-pointer hover:text-primary"
                @click="handleTagClick(tag)"
              >
                {{ tag }}
              </n-tag>
            </n-space>
          </div>
        </div>
        <n-switch v-model:value="showHighQuality" size="small">
          <template #checked>精品歌单</template>
          <template #unchecked>全部歌单</template>
        </n-switch>
      </div>
    </div>

    <!-- 歌单列表 -->
    <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
      <!-- 加载状态 -->
      <template v-if="loading">
        <div
          v-for="i in 20"
          :key="i"
          class="playlist-item animate-pulse"
        >
          <div class="relative rounded-lg overflow-hidden aspect-square shadow-md mb-2 bg-gray-200 dark:bg-gray-700"></div>
          <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
          <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
        </div>
      </template>

      <!-- 歌单卡片 -->
      <template v-else>
        <PlaylistCard
          v-for="playlist in playlists"
          :key="playlist.id"
          :playlist="playlist"
          @click="navigateToDetail(playlist.id)"
          @play="playPlaylist(playlist.id)"
        />
      </template>
    </div>

    <!-- 分页 -->
    <div class="mt-6 flex justify-center">
      <n-pagination
        v-model:page="currentPage"
        v-model:page-size="pageSize"
        :item-count="total"
        :page-sizes="[30, 60, 90]"
        show-size-picker
        @update:page="handlePageChange"
        @update:page-size="handlePageSizeChange"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useMessage } from 'naive-ui';
import { usePlayerStore } from '@/stores/player';
import {
  getPlaylistCategories,
  getHotPlaylistCategories,
  getPlaylistsByCategory,
  getHighqualityPlaylists,
  getPlaylistDetail,
  getPlaylistTracks
} from '@/api/playlist';
import type { PlaylistCategory, Playlist } from '@/types/playlist';
import PlaylistCard from '@/components/playlist/PlaylistCard.vue';

const router = useRouter();
const message = useMessage();
const playerStore = usePlayerStore();

// 分类相关
const currentCategory = ref('全部');
const categoryOptions = ref<any[]>([]);
const hotTags = ref<string[]>([]);

// 列表相关
const loading = ref(true);
const playlists = ref<Playlist[]>([]);
const showHighQuality = ref(false);
const currentPage = ref(1);
const pageSize = ref(30);
const total = ref(0);

// 获取分类列表
async function fetchCategories() {
  try {
    const [categoriesRes, hotTagsRes] = await Promise.all([
      getPlaylistCategories(),
      getHotPlaylistCategories()
    ]);

    // 处理分类选项
    const categories = categoriesRes.categories;
    const subs = categoriesRes.sub;
    categoryOptions.value = Object.entries(categories).map(([id, name]) => ({
      label: name,
      key: id,
      children: subs
        .filter(item => item.category === Number(id))
        .map(item => ({
          label: item.name,
          key: item.name
        }))
    }));

    // 处理热门标签
    hotTags.value = hotTagsRes.tags.slice(0, 5).map(tag => tag.name);
  } catch (error) {
    console.error('获取分类失败:', error);
    message.error('获取分类失败');
  }
}

// 获取歌单列表
async function fetchPlaylists() {
  try {
    loading.value = true;

    const params = {
      cat: currentCategory.value === '全部' ? undefined : currentCategory.value,
      limit: pageSize.value,
      offset: (currentPage.value - 1) * pageSize.value,
      order: 'hot'
    };

    let res;
    if (showHighQuality.value) {
      res = await getHighqualityPlaylists(params);
      playlists.value = res.playlists;
      total.value = res.total;
    } else {
      res = await getPlaylistsByCategory(params);
      playlists.value = res.playlists;
      total.value = res.total;
    }
  } catch (error) {
    console.error('获取歌单列表失败:', error);
    message.error('获取歌单列表失败');
  } finally {
    loading.value = false;
  }
}

// 处理分类选择
function handleCategorySelect(key: string) {
  currentCategory.value = key;
  currentPage.value = 1;
  fetchPlaylists();
}

// 处理标签点击
function handleTagClick(tag: string) {
  currentCategory.value = tag;
  currentPage.value = 1;
  fetchPlaylists();
}

// 处理分页变化
function handlePageChange(page: number) {
  currentPage.value = page;
  fetchPlaylists();
}

// 处理每页数量变化
function handlePageSizeChange(size: number) {
  pageSize.value = size;
  currentPage.value = 1;
  fetchPlaylists();
}

// 跳转到歌单详情
function navigateToDetail(id: number) {
  router.push(`/playlist/${id}`);
}

// 播放歌单
async function playPlaylist(id: number) {
  try {
    // 获取歌单详情
    const detailRes = await getPlaylistDetail(id);
    if (!detailRes.playlist?.trackIds?.length) {
      message.warning('歌单暂无歌曲');
      return;
    }

    // 获取歌单歌曲
    const trackIds = detailRes.playlist.trackIds.map(t => t.id);
    const tracksRes = await getPlaylistTracks(id, trackIds);
    if (!tracksRes.songs?.length) {
      message.warning('获取歌曲失败');
      return;
    }

    // 设置播放列表并播放
    playerStore.setPlaylist(tracksRes.songs);
    playerStore.play(0);
    message.success('开始播放');
  } catch (error) {
    console.error('播放歌单失败:', error);
    message.error('播放失败');
  }
}

// 监听高质量开关变化
watch(showHighQuality, () => {
  currentPage.value = 1;
  fetchPlaylists();
});

// 组件挂载时获取数据
onMounted(async () => {
  await fetchCategories();
  await fetchPlaylists();
});
</script>