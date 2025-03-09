<template>
  <div class="album-detail-page">
    <!-- 专辑信息头部 -->
    <div class="flex flex-col md:flex-row gap-6 mb-6">
      <div class="relative w-64 h-64 flex-shrink-0 rounded-lg overflow-hidden shadow-md mx-auto md:mx-0">
        <div v-if="loading" class="w-full h-full bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
        <template v-else>
          <img :src="albumDetail.album?.picUrl + '?param=512y512'" class="w-full h-full object-cover" :alt="albumDetail.album?.name" />
          <div class="absolute top-2 right-2 text-white text-xs px-2 py-1 rounded bg-black/50">
            <div class="flex items-center">
              <div class="i-carbon-music mr-1"></div>
              <span>{{ albumDetail.songs?.length || 0 }}首</span>
            </div>
          </div>
        </template>
      </div>

      <div class="flex-1">
        <div v-if="loading">
          <div class="h-8 w-64 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-4"></div>
          <div class="h-4 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-3"></div>
          <div class="h-4 w-96 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2"></div>
          <div class="h-4 w-80 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-4"></div>
        </div>
        <template v-else>
          <h1 class="text-2xl font-bold mb-2">{{ albumDetail.album?.name }}</h1>
          <div class="flex items-center text-sm text-gray-500 mb-4">
            <router-link
              v-if="albumDetail.album?.artist"
              :to="`/discover/artist/${albumDetail.album.artist.id}`"
              class="hover:text-primary mr-4"
            >
              {{ albumDetail.album.artist.name }}
            </router-link>
            <div class="flex items-center">
              <div class="i-carbon-time mr-1"></div>
              <span>发行于 {{ formatDate(albumDetail.album?.publishTime) }}</span>
            </div>
          </div>

          <div v-if="albumDetail.album?.description" class="text-sm text-gray-600 dark:text-gray-400 mb-4" :class="{'line-clamp-3': !showFullDesc}">
            {{ albumDetail.album.description }}
          </div>
          <div v-if="albumDetail.album?.description && albumDetail.album.description.length > 100" class="text-xs text-primary cursor-pointer mb-4" @click="showFullDesc = !showFullDesc">
            {{ showFullDesc ? '收起' : '显示全部' }}
          </div>

          <div class="flex flex-wrap items-center gap-3">
            <button
              class="px-6 py-2 rounded-full bg-primary text-white flex items-center gap-1"
              @click="playAll"
            >
              <div class="i-carbon-play-filled"></div>
              <span>播放全部</span>
            </button>
            <button
              class="icon-btn"
              :class="{'text-red-500': isCollected}"
              @click="toggleCollect"
            >
              <div :class="isCollected ? 'i-carbon-favorite-filled' : 'i-carbon-favorite'"></div>
            </button>
            <button class="icon-btn" @click="shareAlbum">
              <div class="i-carbon-share"></div>
            </button>
            <button class="icon-btn" @click="downloadAlbum">
              <div class="i-carbon-download"></div>
            </button>
          </div>
        </template>
      </div>
    </div>

    <!-- 歌曲列表 -->
    <div class="bg-white dark:bg-dark-900 rounded-lg p-4 shadow-sm">
      <MusicList
        :tracks="albumDetail.songs || []"
        :loading="loading"
        :show-search="false"
        :show-count="true"
        :empty-text="'专辑中暂无歌曲'"
        @play="playSongFromList"
        @add-to-playlist="addToPlaylist"
        @toggle-like="toggleLike"
        @more-actions="showMoreActions"
      />
    </div>

    <!-- 相关推荐 -->
    <div class="mt-8">
      <h2 class="text-xl font-bold mb-4">相关推荐</h2>
      <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        <template v-if="loading">
          <div v-for="i in 5" :key="i" class="album-item">
            <div class="relative rounded-lg overflow-hidden aspect-square shadow-md mb-2 bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
            <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2"></div>
            <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-2/3"></div>
          </div>
        </template>
        <template v-else>
          <AlbumCard
            v-for="album in relatedAlbums"
            :key="album.id"
            :album="album"
            @play="playAlbum"
          />
        </template>
      </div>
    </div>

    <!-- 评论区 -->
    <div class="mt-8">
      <CommentSection
        :resource-id="albumId"
        :resource-type="3"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { usePlayerStore } from '@/stores/player';
import { useMessage } from 'naive-ui';
import { getAlbumDetail, getRelatedAlbums } from '@/api/album';
import MusicList from '@/components/common/MusicList.vue';
import AlbumCard from '@/components/common/AlbumCard.vue';
import CommentSection from '@/components/common/CommentSection.vue';

const route = useRoute();
const router = useRouter();
const playerStore = usePlayerStore();
const message = useMessage();

// 专辑ID - 从路由参数中获取
const albumId = computed(() => Number(route.params.id));

// 加载状态
const loading = ref(true);
// 收藏状态
const isCollected = ref(false);
// 显示完整描述
const showFullDesc = ref(false);

// 专辑详情数据
const albumDetail = ref<any>({});
// 相关专辑
const relatedAlbums = ref<any[]>([]);

/**
 * 格式化日期
 * @param timestamp 时间戳
 * @returns 格式化后的日期
 */
function formatDate(timestamp: number) {
  if (!timestamp) return '';
  const date = new Date(timestamp);
  return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
}

/**
 * 播放全部歌曲
 */
function playAll() {
  if (albumDetail.value.songs && albumDetail.value.songs.length > 0) {
    playerStore.setPlaylist(albumDetail.value.songs);
    playerStore.play(0);
    message.success('开始播放专辑');
  } else {
    message.warning('专辑中暂无歌曲');
  }
}

/**
 * 切换收藏状态
 */
function toggleCollect() {
  isCollected.value = !isCollected.value;
  message.success(isCollected.value ? '收藏成功' : '已取消收藏');
}

/**
 * 分享专辑
 */
function shareAlbum() {
  message.info('分享功能开发中');
}

/**
 * 下载专辑
 */
function downloadAlbum() {
  message.info('下载功能开发中');
}

/**
 * 从列表中播放歌曲
 * @param data 包含歌曲和索引的对象
 */
function playSongFromList(data: { track: any, index: number }) {
  if (albumDetail.value.songs && albumDetail.value.songs.length > 0) {
    playerStore.setPlaylist(albumDetail.value.songs);
    playerStore.play(data.index);
  }
}

/**
 * 添加歌曲到播放列表
 * @param track 歌曲对象
 */
function addToPlaylist(track: any) {
  // 检查歌曲是否已在播放列表中
  const existingIndex = playerStore.playlist.findIndex((item: any) => item.id === track.id);

  if (existingIndex === -1) {
    // 添加到播放列表
    const newPlaylist = [...playerStore.playlist, track];
    playerStore.setPlaylist(newPlaylist);
    message.success('已添加到播放列表');
  } else {
    message.info('歌曲已在播放列表中');
  }
}

/**
 * 切换歌曲喜欢状态
 * @param track 歌曲对象
 */
function toggleLike(track: any) {
  // 这里应该调用API来喜欢/取消喜欢歌曲
  // 由于API未实现，这里只做提示
  message.success(`${track.name} 已添加到我喜欢的音乐`);
}

/**
 * 显示更多操作
 * @param track 歌曲对象
 */
function showMoreActions(track: any) {
  // 这里可以显示一个操作菜单，如下载、分享等
  message.info('更多操作功能开发中');
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
 * 获取专辑详情数据
 * @param id 专辑ID
 */
async function fetchAlbumData(id: number) {
  try {
    loading.value = true;

    // 获取专辑详情
    const res = await getAlbumDetail(id);
    albumDetail.value = res;

    // 获取相关专辑
    const relatedRes = await getRelatedAlbums(id);
    relatedAlbums.value = relatedRes.albums || [];

    loading.value = false;
  } catch (error) {
    console.error('获取专辑详情失败:', error);
    message.error('获取专辑详情失败');
    loading.value = false;
  }
}

// 监听路由参数变化，重新获取数据
watch(
  () => route.params.id,
  (newId) => {
    if (newId) {
      fetchAlbumData(Number(newId));
    }
  }
);

// 组件挂载时获取数据
onMounted(() => {
  if (albumId.value) {
    fetchAlbumData(albumId.value);
  }
});
</script>