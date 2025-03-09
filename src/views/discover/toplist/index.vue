<template>
  <div class="toplist-page">
    <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <!-- 榜单导航 -->
      <div class="lg:col-span-1">
        <div class="bg-white dark:bg-dark-900 rounded-lg shadow-sm p-4">
          <!-- 加载状态 -->
          <template v-if="loading">
            <div v-for="i in 4" :key="i" class="animate-pulse">
              <div class="h-5 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
              <div class="space-y-3 mb-6">
                <div v-for="j in 3" :key="j" class="flex items-center space-x-3">
                  <div class="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  <div class="flex-1">
                    <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                    <div class="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
                  </div>
                </div>
              </div>
            </div>
          </template>

          <!-- 榜单列表 -->
          <template v-else>
            <div v-for="group in toplistGroups" :key="group.title" class="mb-6">
              <h3 class="text-lg font-medium mb-4">{{ group.title }}</h3>
              <div class="space-y-3">
                <div
                  v-for="list in group.lists"
                  :key="list.id"
                  class="flex items-center p-2 rounded-lg cursor-pointer transition-colors"
                  :class="currentId === list.id ? 'bg-primary/10 text-primary' : 'hover:bg-gray-100 dark:hover:bg-dark-800'"
                  @click="handleListClick(list.id)"
                >
                  <img
                    :src="list.coverImgUrl + '?param=100y100'"
                    class="w-12 h-12 rounded object-cover"
                    :alt="list.name"
                  />
                  <div class="ml-3 flex-1 min-w-0">
                    <h4 class="text-sm font-medium truncate">{{ list.name }}</h4>
                    <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {{ list.updateFrequency }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </div>
      </div>

      <!-- 榜单详情 -->
      <div class="lg:col-span-3">
        <div class="bg-white dark:bg-dark-900 rounded-lg shadow-sm">
          <!-- 加载状态 -->
          <template v-if="detailLoading">
            <div class="animate-pulse p-6">
              <div class="flex items-start space-x-6 mb-6">
                <div class="w-48 h-48 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                <div class="flex-1">
                  <div class="h-8 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
                  <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-2"></div>
                  <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
                </div>
              </div>
              <div class="space-y-4">
                <div v-for="i in 10" :key="i" class="h-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
              </div>
            </div>
          </template>

          <!-- 榜单内容 -->
          <template v-else-if="currentList">
            <!-- 榜单信息 -->
            <div class="p-6 border-b border-gray-200 dark:border-gray-700">
              <div class="flex items-start space-x-6">
                <img
                  :src="currentList.coverImgUrl + '?param=200y200'"
                  class="w-48 h-48 rounded-lg shadow-md"
                  :alt="currentList.name"
                />
                <div class="flex-1 min-w-0">
                  <h2 class="text-2xl font-bold mb-4">{{ currentList.name }}</h2>
                  <div class="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-4">
                    <div class="flex items-center mr-4">
                      <div class="i-carbon-time mr-1"></div>
                      <span>{{ currentList.updateFrequency }}</span>
                    </div>
                    <div class="flex items-center">
                      <div class="i-carbon-music mr-1"></div>
                      <span>{{ currentList.trackCount }}首歌曲</span>
                    </div>
                  </div>
                  <div class="flex items-center space-x-4">
                    <n-button type="primary" @click="playAll">
                      <template #icon>
                        <div class="i-carbon-play-filled"></div>
                      </template>
                      播放全部
                    </n-button>
                    <n-button @click="subscribeList">
                      <template #icon>
                        <div class="i-carbon-favorite"></div>
                      </template>
                      {{ currentList.subscribed ? '已收藏' : '收藏' }}
                    </n-button>
                  </div>
                </div>
              </div>
            </div>

            <!-- 歌曲列表 -->
            <div class="p-6">
              <MusicList
                :tracks="songs"
                :loading="songsLoading"
                show-rank
                :rank-type="'number'"
                @play="playSong"
                @add-to-playlist="addToPlaylist"
                @toggle-like="toggleLike"
              />
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useMessage } from 'naive-ui';
import { usePlayerStore } from '@/stores/player';
import { getAllToplist, getToplistDetail, getToplistSongs } from '@/api/modules/toplist';
import { subscribePlaylist } from '@/api/modules/playlist';
import type { ToplistInfo, ToplistSong, ToplistGroup } from '@/types/toplist';
import type { Song } from '@/types/song';
import MusicList from '@/components/common/MusicList.vue';

const route = useRoute();
const router = useRouter();
const message = useMessage();
const playerStore = usePlayerStore();

// 加载状态
const loading = ref(true);
const detailLoading = ref(true);
const songsLoading = ref(true);

// 数据
const toplists = ref<ToplistInfo[]>([]);
const currentId = ref<number>(0);
const currentList = ref<ToplistInfo | null>(null);
const songs = ref<ToplistSong[]>([]);

// 计算榜单分组
const toplistGroups = computed<ToplistGroup[]>(() => {
  const groups: ToplistGroup[] = [
    { title: '云音乐特色榜', lists: [] },
    { title: '全球媒体榜', lists: [] }
  ];

  toplists.value.forEach((list: ToplistInfo) => {
    if (list.trackUpdateTime) {
      groups[0].lists.push(list);
    } else {
      groups[1].lists.push(list);
    }
  });

  return groups;
});

// 获取所有榜单
async function fetchToplists() {
  try {
    loading.value = true;
    const { data: res } = await getAllToplist();
    toplists.value = res.list;

    // 如果URL中有ID，则使用URL中的ID，否则使用第一个榜单的ID
    const id = Number(route.params.id) || toplists.value[0]?.id;
    if (id) {
      currentId.value = id;
      await fetchToplistDetail(id);
    }
  } catch (error) {
    console.error('获取榜单列表失败:', error);
    message.error('获取榜单列表失败');
  } finally {
    loading.value = false;
  }
}

// 获取榜单详情
async function fetchToplistDetail(id: number) {
  try {
    detailLoading.value = true;
    songsLoading.value = true;

    const [{ data: detailRes }, { data: songsRes }] = await Promise.all([
      getToplistDetail(id),
      getToplistSongs(id)
    ]);

    currentList.value = detailRes.playlist;
    songs.value = songsRes.songs;

    // 更新URL
    if (route.params.id !== String(id)) {
      router.replace(`/discover/toplist/${id}`);
    }
  } catch (error) {
    console.error('获取榜单详情失败:', error);
    message.error('获取榜单详情失败');
  } finally {
    detailLoading.value = false;
    songsLoading.value = false;
  }
}

// 处理榜单点击
function handleListClick(id: number) {
  if (currentId.value === id) return;
  currentId.value = id;
  fetchToplistDetail(id);
}

// 播放全部
function playAll() {
  if (songs.value.length === 0) {
    message.warning('暂无可播放歌曲');
    return;
  }
  playerStore.setPlaylist(songs.value);
  playerStore.play(0);
  message.success('开始播放');
}

// 播放歌曲
function playSong(data: { track: ToplistSong; index: number }) {
  playerStore.setPlaylist(songs.value);
  playerStore.play(data.index);
}

// 添加到播放列表
function addToPlaylist(track: ToplistSong) {
  const existingIndex = playerStore.playlist.findIndex((item: Song) => item.id === track.id);
  if (existingIndex === -1) {
    playerStore.addToPlaylist(track);
    message.success('已添加到播放列表');
  } else {
    message.info('歌曲已在播放列表中');
  }
}

// 收藏榜单
async function subscribeList() {
  if (!currentList.value) return;
  try {
    await subscribePlaylist(currentList.value.id, currentList.value.subscribed ? 2 : 1);
    currentList.value.subscribed = !currentList.value.subscribed;
    message.success(currentList.value.subscribed ? '收藏成功' : '取消收藏成功');
  } catch (error) {
    console.error('收藏失败:', error);
    message.error('操作失败');
  }
}

// 喜欢歌曲
function toggleLike(track: ToplistSong) {
  // TODO: 实现喜欢歌曲功能
  message.success(`${track.name} 已添加到我喜欢的音乐`);
}

// 监听路由参数变化
watch(
  () => route.params.id,
  (newId) => {
    if (newId && Number(newId) !== currentId.value) {
      currentId.value = Number(newId);
      fetchToplistDetail(Number(newId));
    }
  }
);

// 组件挂载时获取数据
onMounted(() => {
  fetchToplists();
});
</script>