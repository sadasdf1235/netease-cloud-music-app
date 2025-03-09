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
            :src="artistDetail.picUrl + '?param=512y512'"
            class="w-full h-full object-cover"
            :alt="artistDetail.name"
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
            {{ artistDetail.name }}
          </h1>
          <div class="flex items-center text-sm text-gray-500 mb-4">
            <span
              v-if="artistDetail.alias && artistDetail.alias.length > 0"
              class="mr-4"
              >别名：{{ artistDetail.alias.join("/") }}</span
            >
            <span>单曲数：{{ artistSongs.length || 0 }}</span>
            <span class="mx-2">|</span>
            <span>专辑数：{{ artistAlbums.length || 0 }}</span>
          </div>
          <div
            v-if="artistDetail.briefDesc"
            class="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-3"
          >
            {{ artistDetail.briefDesc }}
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
              @click="handleFollow(artistDetail.id, artistDetail.followed)"
            >
              <div class="i-carbon-favorite mr-1"></div>
              <span>{{ artistDetail.followed ? '已收藏' : '收藏' }}</span>
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
        :tracks="artistSongs"
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
            v-for="album in artistAlbums"
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
            v-for="artist in similarArtists"
            :key="artist.id"
            :artist="artist"
            :show-tags="false"
            :show-follow-button="true"
            @play="playArtistHotSongs"
            @follow="handleFollow"
            @unfollow="handleFollow"
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
import { artistApi, albumApi } from "@/api";
import type { Artist, ArtistDetail, ArtistSong, ArtistAlbum } from "@/types/artist";
import type { Album } from "@/types/album";
import type { Song } from "@/types/song";
import { useMessage } from "naive-ui";
import MusicList from '@/components/common/MusicList.vue';
import AlbumCard from '@/components/common/AlbumCard.vue';
import ArtistCard from '@/components/common/ArtistCard.vue';

const route = useRoute();
const router = useRouter();
const playerStore = usePlayerStore();
const message = useMessage();

// 加载状态
const loading = ref(true);

// 歌手详情数据
const artistDetail = ref<ArtistDetail>({} as ArtistDetail);
const artistSongs = ref<ArtistSong[]>([]);
const artistAlbums = ref<ArtistAlbum[]>([]);
const similarArtists = ref<Artist[]>([]);

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
  if (artistSongs.value.length > 0) {
    playerStore.setPlaylist(artistSongs.value);
    playerStore.play(index);
  }
}

// 播放全部热门歌曲
function playAllHotSongs() {
  if (artistSongs.value.length > 0) {
    playerStore.setPlaylist(artistSongs.value);
    playerStore.play(0);
  }
}

// 播放专辑
async function playAlbum(id: number) {
  try {
    const response = await albumApi.getAlbumDetail(id);
    const { songs } = response;
    if (songs && songs.length > 0) {
      playerStore.setPlaylist(songs);
      playerStore.play(0);
    }
  } catch (error) {
    console.error("播放专辑失败:", error);
    message.error("播放专辑失败");
  }
}

// 获取歌手详情数据
async function fetchArtistData(id: number) {
  try {
    loading.value = true;

    // 获取歌手详情
    const detailResponse = await artistApi.getArtistDetail(id);
    artistDetail.value = detailResponse.data;

    // 获取歌手热门歌曲
    const songsResponse = await artistApi.getArtistHotSongs(id);
    artistSongs.value = songsResponse.songs || [];

    // 获取歌手专辑
    const albumsResponse = await artistApi.getArtistAlbums(id, 5);
    artistAlbums.value = albumsResponse.hotAlbums || [];

    // 获取相似歌手
    const similarResponse = await artistApi.getSimilarArtists(id);
    similarArtists.value = similarResponse.artists || [];

    loading.value = false;
  } catch (error) {
    console.error("获取歌手详情失败:", error);
    message.error("获取歌手详情失败");
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
 */
function playSongFromList(data: { track: ArtistSong; index: number }) {
  if (artistSongs.value.length > 0) {
    playerStore.setPlaylist(artistSongs.value);
    playerStore.play(data.index);
  }
}

/**
 * 添加歌曲到播放列表
 */
function addToPlaylist(track: ArtistSong) {
  const existingIndex = playerStore.playlist.findIndex((item: Song) => item.id === track.id);

  if (existingIndex === -1) {
    playerStore.addToPlaylist(track);
    message.success('已添加到播放列表');
  } else {
    message.info('歌曲已在播放列表中');
  }
}

/**
 * 切换歌曲喜欢状态
 */
function toggleLike(track: ArtistSong) {
  // TODO: 实现喜欢歌曲功能
  message.success(`${track.name} 已添加到我喜欢的音乐`);
}

/**
 * 显示更多操作
 */
function showMoreActions(track: ArtistSong) {
  // TODO: 实现更多操作功能
  message.info('更多操作功能开发中');
}

/**
 * 播放艺术家热门歌曲
 */
async function playArtistHotSongs(artistId: number) {
  try {
    const response = await artistApi.getArtistHotSongs(artistId);
    const { songs } = response;
    if (songs && songs.length > 0) {
      playerStore.setPlaylist(songs);
      playerStore.play(0);
    }
  } catch (error) {
    console.error("播放歌手热门歌曲失败:", error);
    message.error("播放歌手热门歌曲失败");
  }
}

/**
 * 关注/取消关注艺术家
 */
async function handleFollow(artistId: number, isFollowed: boolean) {
  try {
    await artistApi.followArtist(artistId, isFollowed ? 2 : 1);
    message.success(isFollowed ? '已取消关注' : '关注成功');
    // 重新获取歌手详情，更新关注状态
    fetchArtistData(artistId);
  } catch (error) {
    console.error("关注/取消关注歌手失败:", error);
    message.error("操作失败，请稍后重试");
  }
}
</script>
