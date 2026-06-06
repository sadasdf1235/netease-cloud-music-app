<!--
  我的音乐页面
  @description 显示用户的音乐库、收藏内容等
-->
<template>
  <div class="my-music-page">
    <h1 class="text-2xl font-bold mb-6">我的音乐</h1>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- 我喜欢的音乐 -->
      <div class="bg-white dark:bg-dark-900 rounded-lg p-6 shadow-sm">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-bold">我喜欢的音乐</h2>
          <button class="text-primary text-sm">查看全部</button>
        </div>

        <div v-if="loading" class="py-12 text-center">
          <div class="inline-block animate-spin text-xl">
            <div class="i-carbon-progress-bar-round"></div>
          </div>
          <p class="mt-2 text-gray-500">加载中...</p>
        </div>

        <div v-else-if="likedSongs.length > 0" class="space-y-2">
          <div
            v-for="(song, index) in likedSongs"
            :key="song.id"
            class="flex items-center p-2 hover:bg-gray-50 dark:hover:bg-dark-800 rounded"
          >
            <div class="w-6 text-gray-400 text-sm">{{ index + 1 }}</div>
            <div class="flex-1 ml-2 truncate">{{ song.name }}</div>
            <div class="text-gray-500 text-sm truncate w-24">{{ formatArtists(song.ar) }}</div>
            <div class="flex space-x-2 text-gray-400">
              <button class="hover:text-primary" title="播放">
                <div class="i-carbon-play"></div>
              </button>
              <button class="hover:text-primary" title="添加到播放列表">
                <div class="i-carbon-add-alt"></div>
              </button>
            </div>
          </div>
        </div>

        <div v-else class="py-12 text-center text-gray-500">
          <div class="i-carbon-favorite text-4xl mx-auto mb-2"></div>
          <p>你还没有收藏歌曲</p>
        </div>
      </div>

      <!-- 最近播放 -->
      <div class="bg-white dark:bg-dark-900 rounded-lg p-6 shadow-sm">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-bold">最近播放</h2>
          <button class="text-primary text-sm">查看全部</button>
        </div>

        <div v-if="loading" class="py-12 text-center">
          <div class="inline-block animate-spin text-xl">
            <div class="i-carbon-progress-bar-round"></div>
          </div>
          <p class="mt-2 text-gray-500">加载中...</p>
        </div>

        <div v-else-if="recentSongs.length > 0" class="space-y-2">
          <div
            v-for="(song, index) in recentSongs"
            :key="song.id"
            class="flex items-center p-2 hover:bg-gray-50 dark:hover:bg-dark-800 rounded"
          >
            <div class="w-6 text-gray-400 text-sm">{{ index + 1 }}</div>
            <div class="flex-1 ml-2 truncate">{{ song.name }}</div>
            <div class="text-gray-500 text-sm truncate w-24">{{ formatArtists(song.ar) }}</div>
            <div class="flex space-x-2 text-gray-400">
              <button class="hover:text-primary" title="播放">
                <div class="i-carbon-play"></div>
              </button>
              <button class="hover:text-primary" title="添加到播放列表">
                <div class="i-carbon-add-alt"></div>
              </button>
            </div>
          </div>
        </div>

        <div v-else class="py-12 text-center text-gray-500">
          <div class="i-carbon-recently-viewed text-4xl mx-auto mb-2"></div>
          <p>暂无播放记录</p>
        </div>
      </div>
    </div>

    <!-- 我的歌单 -->
    <div class="mt-8 bg-white dark:bg-dark-900 rounded-lg p-6 shadow-sm">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-lg font-bold">我的歌单</h2>
        <button class="text-primary text-sm">管理歌单</button>
      </div>

      <div v-if="loading" class="py-12 text-center">
        <div class="inline-block animate-spin text-xl">
          <div class="i-carbon-progress-bar-round"></div>
        </div>
        <p class="mt-2 text-gray-500">加载中...</p>
      </div>

      <div v-else-if="playlists.length > 0" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        <div
          v-for="playlist in playlists"
          :key="playlist.id"
          class="playlist-card group"
        >
          <div class="relative aspect-square rounded-lg overflow-hidden mb-2">
            <img
              :src="playlist.coverImgUrl + '?param=200y200'"
              :alt="playlist.name"
              class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            />
            <div class="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <button class="w-10 h-10 rounded-full bg-white/90 text-primary flex items-center justify-center">
                <div class="i-carbon-play-filled text-xl"></div>
              </button>
            </div>
          </div>
          <div class="text-sm font-medium line-clamp-2">{{ playlist.name }}</div>
          <div class="text-xs text-gray-500 mt-1">{{ playlist.trackCount }}首</div>
        </div>
      </div>

      <div v-else class="py-12 text-center text-gray-500">
        <div class="i-carbon-music-add text-4xl mx-auto mb-2"></div>
        <p>你还没有创建歌单</p>
        <button class="mt-4 px-4 py-2 bg-primary text-white rounded-full text-sm">创建歌单</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useUserStore } from '@/stores/user';
import { usePlayerStore } from '@/stores/player';
import { useMessage } from 'naive-ui';
import { getUserLikelist, getUserRecentlyPlayed, getUserPlaylists } from '@/api/modules/user';

// 状态管理
const userStore = useUserStore();
const playerStore = usePlayerStore();
const message = useMessage();

// 页面数据
const loading = ref(true);
const likedSongs = ref([]);
const recentSongs = ref([]);
const playlists = ref([]);

/**
 * 格式化歌手名称
 * @param artists 歌手数组
 * @returns 格式化后的歌手名称
 */
function formatArtists(artists = []) {
  if (!artists || !artists.length) return '';
  return artists.map(artist => artist.name).join('/');
}

/**
 * 加载用户数据
 */
async function loadUserData() {
  if (!userStore.isLoggedIn) {
    loading.value = false;
    return;
  }

  loading.value = true;
  try {
    // 并行请求数据
    const [likelistRes, recentlyPlayedRes, playlistsRes] = await Promise.all([
      getUserLikelist(userStore.profile?.userId).catch(() => ({ ids: [] })),
      getUserRecentlyPlayed().catch(() => ({ list: [] })),
      getUserPlaylists(userStore.profile?.userId).catch(() => ({ playlist: [] }))
    ]);

    // 处理喜欢的音乐
    if (likelistRes && likelistRes.ids) {
      // TODO: 获取歌曲详情
      likedSongs.value = likelistRes.ids.slice(0, 10).map(id => ({
        id,
        name: `歌曲 ${id}`,
        ar: [{ name: '未知歌手' }]
      }));
    }

    // 处理最近播放
    if (recentlyPlayedRes && recentlyPlayedRes.list) {
      recentSongs.value = recentlyPlayedRes.list.slice(0, 10).map(item => ({
        id: item.data.id,
        name: item.data.name,
        ar: item.data.ar || []
      }));
    }

    // 处理歌单
    if (playlistsRes && playlistsRes.playlist) {
      playlists.value = playlistsRes.playlist;
    }
  } catch (error) {
    console.error('加载用户数据失败:', error);
    message.error('加载数据失败，请稍后重试');
  } finally {
    loading.value = false;
  }
}

// 页面初始化
onMounted(async () => {
  await loadUserData();
});
</script>

<style scoped>
.my-music-page {
  padding: 20px;
}

.playlist-card {
  cursor: pointer;
  transition: transform 0.3s ease;
}

.playlist-card:hover {
  transform: translateY(-4px);
}
</style>