<template>
  <div class="artist-detail-page">
    <!-- 歌手信息头部 -->
    <div class="flex flex-col md:flex-row gap-6 mb-6">
      <div
        class="relative w-64 h-64 flex-shrink-0 rounded-lg overflow-hidden shadow-md"
      >
        <div
          v-if="loading"
          class="w-full h-full bg-gray-200 dark:bg-gray-700 animate-pulse"
        ></div>
        <template v-else>
          <img
            :src="artistDetail.artist?.picUrl + '?param=512y512'"
            class="w-full h-full object-cover"
            :alt="artistDetail.artist?.name"
          />
        </template>
      </div>

      <div class="flex-1">
        <div v-if="loading">
          <div
            class="h-8 w-64 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-4"
          ></div>
          <div
            class="h-4 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-3"
          ></div>
          <div
            class="h-4 w-96 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2"
          ></div>
          <div
            class="h-4 w-80 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-4"
          ></div>
        </div>
        <template v-else>
          <h1 class="text-2xl font-bold mb-2">
            {{ artistDetail.artist?.name }}
          </h1>
          <div class="flex items-center text-sm text-gray-500 mb-4">
            <span
              v-if="
                artistDetail.artist?.alias &&
                artistDetail.artist.alias.length > 0
              "
              class="mr-4"
              >别名：{{ artistDetail.artist.alias.join("/") }}</span
            >
            <span>单曲数：{{ artistSongs.songs?.length || 0 }}</span>
            <span class="mx-2">|</span>
            <span>专辑数：{{ artistAlbums.hotAlbums?.length || 0 }}</span>
          </div>
          <div
            v-if="artistDetail.artist?.briefDesc"
            class="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-3"
          >
            {{ artistDetail.artist.briefDesc }}
          </div>
          <div class="flex gap-3">
            <button
              class="px-4 py-2 bg-primary text-white rounded-full flex items-center"
              @click="playAllHotSongs()"
            >
              <div class="i-carbon-play-filled mr-1"></div>
              <span>播放热门歌曲</span>
            </button>
            <button
              class="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-full flex items-center hover:bg-gray-100 dark:hover:bg-dark-800"
            >
              <div class="i-carbon-favorite mr-1"></div>
              <span>收藏</span>
            </button>
          </div>
        </template>
      </div>
    </div>

    <!-- 热门歌曲 -->
    <div class="mb-8">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-xl font-bold">热门歌曲</h2>
      </div>

      <!-- 歌曲列表 -->
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="border-b border-gray-200 dark:border-gray-700">
            <tr>
              <th class="py-3 text-left w-16">#</th>
              <th class="py-3 text-left">歌曲</th>
              <th class="py-3 text-left">专辑</th>
              <th class="py-3 text-left w-24">时长</th>
            </tr>
          </thead>
          <tbody>
            <template v-if="loading">
              <tr
                v-for="i in 10"
                :key="i"
                class="border-b border-gray-100 dark:border-gray-800"
              >
                <td class="py-3 px-2">
                  <div class="flex items-center justify-between">
                    <span :class="{ 'text-primary font-medium': i <= 3 }">{{
                      i
                    }}</span>
                  </div>
                </td>
                <td class="py-3">
                  <div
                    class="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-48"
                  ></div>
                </td>
                <td class="py-3">
                  <div
                    class="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-32"
                  ></div>
                </td>
                <td class="py-3">
                  <div
                    class="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-16"
                  ></div>
                </td>
              </tr>
            </template>
            <template
              v-else-if="artistSongs.songs && artistSongs.songs.length > 0"
            >
              <tr
                v-for="(song, index) in artistSongs.songs"
                :key="song.id"
                class="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-dark-800 cursor-pointer"
                @dblclick="playSong(index)"
              >
                <td class="py-3 px-2">
                  <div class="flex items-center justify-between">
                    <span :class="{ 'text-primary font-medium': index < 3 }">{{
                      index + 1
                    }}</span>
                    <div
                      class="i-carbon-play text-gray-400 hover:text-primary cursor-pointer"
                      @click="playSong(index)"
                    ></div>
                  </div>
                </td>
                <td class="py-3">
                  <div class="flex items-center">
                    <img
                      v-if="song.al?.picUrl"
                      :src="song.al.picUrl + '?param=40y40'"
                      class="w-10 h-10 rounded mr-3 flex-shrink-0"
                      :alt="song.name"
                    />
                    <div>
                      <div class="font-medium">{{ song.name }}</div>
                      <div
                        v-if="song.alia && song.alia.length > 0"
                        class="text-xs text-gray-500"
                      >
                        {{ song.alia.join("/") }}
                      </div>
                    </div>
                  </div>
                </td>
                <td class="py-3">
                  <router-link
                    v-if="song.al"
                    :to="`/discover/album/${song.al.id}`"
                    class="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary"
                  >
                    {{ song.al.name }}
                  </router-link>
                </td>
                <td class="py-3 text-gray-500">
                  {{ formatDuration(song.dt) }}
                </td>
              </tr>
            </template>
            <template v-else>
              <tr>
                <td colspan="4" class="py-8 text-center text-gray-500">
                  暂无歌曲
                </td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>
    </div>

    <!-- 专辑 -->
    <div class="mb-8">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-xl font-bold">专辑</h2>
        <router-link
          :to="`/discover/album?artist=${$route.params.id}`"
          class="text-sm text-gray-500 hover:text-primary"
          >更多 &gt;</router-link
        >
      </div>

      <!-- 加载状态 -->
      <div
        v-if="loading"
        class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4"
      >
        <div v-for="i in 5" :key="i" class="album-item">
          <div
            class="relative rounded-lg overflow-hidden aspect-square shadow-md mb-2 bg-gray-200 dark:bg-gray-700 animate-pulse"
          ></div>
          <div
            class="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2"
          ></div>
          <div
            class="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-2/3"
          ></div>
        </div>
      </div>

      <!-- 专辑列表 -->
      <div v-else class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        <div
          v-for="album in artistAlbums.hotAlbums"
          :key="album.id"
          class="album-item cursor-pointer"
          @click="navigateToAlbum(album.id)"
        >
          <div
            class="relative rounded-lg overflow-hidden aspect-square shadow-md mb-2"
          >
            <img
              :src="album.picUrl + '?param=200y200'"
              class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              :alt="album.name"
            />
            <div
              class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2"
            >
              <div class="flex items-center justify-between">
                <button
                  class="flex items-center text-white text-xs hover:text-primary-light transition-colors"
                  @click.stop="playAlbum(album.id)"
                >
                  <div class="i-carbon-play-filled mr-1"></div>
                  <span>播放</span>
                </button>
                <button
                  class="flex items-center text-white text-xs hover:text-primary-light transition-colors"
                  @click.stop="addAlbumToPlaylist(album.id)"
                >
                  <div class="i-carbon-add mr-1"></div>
                  <span>添加</span>
                </button>
              </div>
            </div>
          </div>
          <div class="text-sm font-medium truncate">{{ album.name }}</div>
          <div class="text-xs text-gray-500">
            {{ formatDate(album.publishTime) }}
          </div>
        </div>
      </div>
    </div>

    <!-- 相似歌手 -->
    <div class="mb-8">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-xl font-bold">相似歌手</h2>
      </div>

      <!-- 加载状态 -->
      <div
        v-if="loading"
        class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4"
      >
        <div v-for="i in 6" :key="i" class="text-center">
          <div
            class="w-24 h-24 mx-auto bg-gray-200 dark:bg-gray-700 rounded-full mb-2 animate-pulse"
          ></div>
          <div
            class="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-20 mx-auto"
          ></div>
        </div>
      </div>

      <!-- 歌手列表 -->
      <div
        v-else
        class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4"
      >
        <router-link
          v-for="artist in similarArtists.artists"
          :key="artist.id"
          :to="`/discover/artist/${artist.id}`"
          class="text-center hover:opacity-90 transition-opacity group"
        >
          <div
            class="relative overflow-hidden rounded-full mb-2 mx-auto w-24 h-24"
          >
            <img
              :src="artist.picUrl + '?param=120y120'"
              class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              :alt="artist.name"
            />
          </div>
          <div class="text-sm font-medium truncate">{{ artist.name }}</div>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { usePlayerStore } from "@/stores/player";
import {
  getArtistDetail,
  getArtistSongs,
  getArtistAlbums,
  getSimilarArtists,
} from "@/api/artist";
import { getAlbumDetail } from "@/api/album";
import { ElMessage } from "element-plus";

const route = useRoute();
const router = useRouter();
const playerStore = usePlayerStore();

// 加载状态
const loading = ref(true);

// 歌手详情数据
const artistDetail = ref<any>({});
const artistSongs = ref<any>({});
const artistAlbums = ref<any>({});
const similarArtists = ref<any>({});

// 格式化时间
function formatDuration(duration: number) {
  const minutes = Math.floor(duration / 1000 / 60);
  const seconds = Math.floor((duration / 1000) % 60);
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

// 格式化日期
function formatDate(timestamp: number) {
  const date = new Date(timestamp);
  return `${date.getFullYear()}-${(date.getMonth() + 1)
    .toString()
    .padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;
}

// 跳转到专辑详情
function navigateToAlbum(id: number) {
  router.push(`/discover/album/${id}`);
}

// 播放歌曲
function playSong(index: number) {
  if (artistSongs.value.songs && artistSongs.value.songs.length > 0) {
    playerStore.setPlaylist(artistSongs.value.songs);
    playerStore.play(index);
  }
}

// 播放全部热门歌曲
function playAllHotSongs() {
  if (artistSongs.value.songs && artistSongs.value.songs.length > 0) {
    playerStore.setPlaylist(artistSongs.value.songs);
    playerStore.play(0);
  }
}

// 播放专辑
async function playAlbum(id: number) {
  try {
    const albumDetail = await getAlbumDetail(id);
    if (albumDetail && albumDetail.songs && albumDetail.songs.length > 0) {
      playerStore.setPlaylist(albumDetail.songs);
      playerStore.play(0);
    }
  } catch (error) {
    console.error("播放专辑失败:", error);
  }
}

// 添加专辑到播放列表
async function addAlbumToPlaylist(id: number) {
  try {
    const albumDetail = await getAlbumDetail(id);
    if (albumDetail && albumDetail.songs && albumDetail.songs.length > 0) {
      // 将专辑中的所有歌曲添加到播放列表，但不立即播放
      albumDetail.songs.forEach(song => {
        playerStore.addToPlaylist(song);
      });
      // 显示提示信息
      ElMessage({
        message: `已将专辑《${albumDetail.album.name}》添加到播放列表`,
        type: 'success',
      });
    }
  } catch (error) {
    console.error('添加专辑到播放列表失败:', error);
    ElMessage.error('添加到播放列表失败');
  }
}

// 获取歌手详情数据
async function fetchArtistData(id: number) {
  try {
    loading.value = true;

    // 获取歌手详情
    const detailRes = await getArtistDetail(id);
    artistDetail.value = detailRes;

    // 获取歌手热门歌曲
    const songsRes = await getArtistSongs(id);
    artistSongs.value = songsRes;

    // 获取歌手专辑
    const albumsRes = await getArtistAlbums(id, 5);
    artistAlbums.value = albumsRes;

    // 获取相似歌手
    const similarRes = await getSimilarArtists(id);
    similarArtists.value = similarRes;

    loading.value = false;
  } catch (error) {
    console.error("获取歌手详情失败:", error);
    loading.value = false;
  }
}

// 监听路由参数变化，重新获取数据
watch(
  () => route.params.id,
  (newId) => {
    if (newId) {
      fetchArtistData(Number(newId));
    }
  }
);

// 组件挂载时获取数据
onMounted(() => {
  const artistId = route.params.id;
  if (artistId) {
    fetchArtistData(Number(artistId));
  }
});
</script>
