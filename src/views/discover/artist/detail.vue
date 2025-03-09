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
      <MusicList
        :tracks="artistSongs.songs || []"
        :loading="loading"
        :show-search="false"
        :show-count="false"
        empty-text="暂无歌曲"
        @play="playSongFromList"
        @add-to-playlist="addToPlaylist"
        @toggle-like="toggleLike"
        @more-actions="showMoreActions"
      />
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

      <!-- 专辑列表 -->
      <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        <template v-if="loading">
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
        </template>
        <template v-else>
          <AlbumCard
            v-for="album in artistAlbums.hotAlbums"
            :key="album.id"
            :album="album"
            @play="playAlbum"
          />
        </template>
      </div>
    </div>

    <!-- 相似歌手 -->
    <div class="mb-8">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-xl font-bold">相似歌手</h2>
      </div>

      <!-- 歌手列表 -->
      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <template v-if="loading">
          <div v-for="i in 6" :key="i" class="text-center">
            <div
              class="w-24 h-24 mx-auto bg-gray-200 dark:bg-gray-700 rounded-full mb-2 animate-pulse"
            ></div>
            <div
              class="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-20 mx-auto"
            ></div>
          </div>
        </template>
        <template v-else>
          <ArtistCard
            v-for="artist in similarArtists.artists"
            :key="artist.id"
            :artist="artist"
            :show-tags="false"
            :show-follow-button="true"
            @play="playArtistHotSongs"
            @follow="followArtist"
            @unfollow="unfollowArtist"
          />
        </template>
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
import MusicList from '@/components/common/MusicList.vue';
import AlbumCard from '@/components/common/AlbumCard.vue';
import ArtistCard from '@/components/common/ArtistCard.vue';

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

/**
 * 从列表中播放歌曲
 * @param data 包含歌曲和索引的对象
 */
function playSongFromList(data: { track: any, index: number }) {
  if (artistSongs.value.songs && artistSongs.value.songs.length > 0) {
    playerStore.setPlaylist(artistSongs.value.songs);
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
    ElMessage.success('已添加到播放列表');
  } else {
    ElMessage.info('歌曲已在播放列表中');
  }
}

/**
 * 切换歌曲喜欢状态
 * @param track 歌曲对象
 */
function toggleLike(track: any) {
  // 这里应该调用API来喜欢/取消喜欢歌曲
  // 由于API未实现，这里只做提示
  ElMessage.success(`${track.name} 已添加到我喜欢的音乐`);
}

/**
 * 显示更多操作
 * @param track 歌曲对象
 */
function showMoreActions(track: any) {
  // 这里可以显示一个操作菜单，如下载、分享等
  ElMessage.info('更多操作功能开发中');
}

/**
 * 播放艺术家热门歌曲
 * @param artistId 艺术家ID
 */
function playArtistHotSongs(artistId: number) {
  // 获取艺术家热门歌曲并播放
  getArtistSongs(artistId).then(res => {
    if (res.songs && res.songs.length > 0) {
      playerStore.setPlaylist(res.songs);
      playerStore.play(0);
    }
  });
}

/**
 * 关注艺术家
 * @param artistId 艺术家ID
 */
function followArtist(artistId: number) {
  // 这里应该调用API来关注艺术家
  // 由于API未实现，这里只做提示
  ElMessage.success('关注成功');
}

/**
 * 取消关注艺术家
 * @param artistId 艺术家ID
 */
function unfollowArtist(artistId: number) {
  // 这里应该调用API来取消关注艺术家
  // 由于API未实现，这里只做提示
  ElMessage.success('已取消关注');
}
</script>
