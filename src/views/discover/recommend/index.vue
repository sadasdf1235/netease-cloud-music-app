<template>
  <div class="recommend-page">
    <!-- 轮播图 -->
    <div class="mb-8">
      <div
        v-if="bannersLoading"
        class="relative h-64 rounded-lg overflow-hidden shadow-md bg-gray-200 dark:bg-gray-700 animate-pulse"
      ></div>
      <div v-else class="relative h-64 rounded-lg overflow-hidden shadow-md">
        <n-carousel
          autoplay
          show-arrow
          dot-type="line"
          effect="fade"
          :interval="3000"
          class="h-full"
        >
          <n-carousel-item
            v-for="banner in banners"
            :key="banner.imageUrl"
            class="h-full"
          >
            <div class="relative h-full">
              <img
                :src="banner.imageUrl"
                class="w-full h-full object-cover"
                :alt="banner.typeTitle"
              />
              <div
                class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4"
              >
                <h3 class="text-white text-lg font-medium">
                  {{ banner.typeTitle }}
                </h3>
              </div>
            </div>
          </n-carousel-item>
        </n-carousel>
      </div>
    </div>

    <!-- 推荐歌单 -->
    <div class="mb-8">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-xl font-bold">推荐歌单</h2>
        <router-link
          to="/discover/playlist"
          class="text-sm text-gray-500 hover:text-primary"
          >更多 &gt;</router-link
        >
      </div>

      <!-- 加载状态 -->
      <div
        v-if="playlistsLoading"
        class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4"
      >
        <div v-for="i in 10" :key="i" class="playlist-item">
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

      <!-- 歌单列表 -->
      <div v-else class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        <RecommendCard
          v-for="playlist in recommendPlaylists"
          :key="playlist.id"
          :id="playlist.id"
          :cover-url="playlist.picUrl + '?param=200y200'"
          :title="playlist.name"
          :count="playlist.playCount"
          type="playlist"
          @click="navigateToPlaylist(playlist.id)"
          @play="playPlaylist(playlist.id)"
        />
      </div>
    </div>

    <!-- 新歌新碟 -->
    <div class="mb-8">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-xl font-bold">新歌新碟</h2>
        <div>
          <router-link
            to="/discover/album"
            class="text-sm text-gray-500 hover:text-primary mr-4"
            >更多新碟 &gt;</router-link
          >
        </div>
      </div>

      <!-- 加载状态 -->
      <div
        v-if="newSongsLoading || newAlbumsLoading"
        class="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        <div class="bg-white dark:bg-dark-900 rounded-lg p-4 shadow-sm">
          <h3 class="text-lg font-medium mb-3">新歌推荐</h3>
          <div class="space-y-2">
            <div
              v-for="i in 5"
              :key="i"
              class="flex items-center p-2 rounded-md"
            >
              <div
                class="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded mr-3 flex-shrink-0 animate-pulse"
              ></div>
              <div class="flex-1 min-w-0">
                <div
                  class="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2"
                ></div>
                <div
                  class="h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-2/3"
                ></div>
              </div>
            </div>
          </div>
        </div>
        <div class="bg-white dark:bg-dark-900 rounded-lg p-4 shadow-sm">
          <h3 class="text-lg font-medium mb-3">新碟上架</h3>
          <div class="space-y-2">
            <div
              v-for="i in 5"
              :key="i"
              class="flex items-center p-2 rounded-md"
            >
              <div
                class="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded mr-3 flex-shrink-0 animate-pulse"
              ></div>
              <div class="flex-1 min-w-0">
                <div
                  class="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2"
                ></div>
                <div
                  class="h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-2/3"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 内容展示 -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <!-- 新歌推荐 -->
        <div class="bg-white dark:bg-dark-900 rounded-lg p-4 shadow-sm">
          <h3 class="text-lg font-medium mb-3">新歌推荐</h3>
          <MusicList
            :tracks="newSongs.slice(0, 5)"
            :loading="newSongsLoading"
            :show-search="false"
            :show-count="false"
            empty-text="暂无新歌推荐"
            @play="playSongFromList"
            @add-to-playlist="addToPlaylist"
            @toggle-like="toggleLike"
          />
        </div>

        <!-- 新碟上架 -->
        <div class="bg-white dark:bg-dark-900 rounded-lg p-4 shadow-sm">
          <h3 class="text-lg font-medium mb-3">新碟上架</h3>
          <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            <AlbumCard
              v-for="album in newAlbums.slice(0, 5)"
              :key="album.id"
              :album="album"
              @play="playAlbum"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- 热门歌手 -->
    <div class="mb-8">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-xl font-bold">热门歌手</h2>
        <router-link
          to="/discover/artist"
          class="text-sm text-gray-500 hover:text-primary"
          >更多 &gt;</router-link
        >
      </div>

      <!-- 加载状态 -->
      <div
        v-if="artistsLoading"
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
      <div v-else class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <ArtistCard
          v-for="artist in hotArtists.slice(0, 6)"
          :key="artist.id"
          :artist="artist"
          :show-tags="false"
          @play="playArtistHotSongs"
          @follow="followArtist"
          @unfollow="unfollowArtist"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { usePlayerStore } from "@/stores/player";
import { useMessage } from "naive-ui";
import {
  getBanners,
  getRecommendPlaylists,
  getNewSongs,
  getNewAlbums,
  getHotArtists,
  getPlaylistDetail,
  getPlaylistTracks,
  getArtistHotSongs
} from "@/api/music";
import type {
  Banner,
  RecommendPlaylistItem,
  RecommendSong,
  RecommendAlbum,
  RecommendArtist
} from "@/types/models/recommend";
import RecommendCard from '@/components/common/RecommendCard.vue';
import MusicList from '@/components/common/MusicList.vue';
import AlbumCard from '@/components/common/AlbumCard.vue';
import ArtistCard from '@/components/common/ArtistCard.vue';

const router = useRouter();
const playerStore = usePlayerStore();
const message = useMessage();

// 轮播图数据
const banners = ref<Banner[]>([]);
const bannersLoading = ref(true);

// 推荐歌单数据
const recommendPlaylists = ref<RecommendPlaylistItem[]>([]);
const playlistsLoading = ref(true);

// 新歌数据
const newSongs = ref<RecommendSong[]>([]);
const newSongsLoading = ref(true);

// 新碟数据
const newAlbums = ref<RecommendAlbum[]>([]);
const newAlbumsLoading = ref(true);

// 热门歌手数据
const hotArtists = ref<RecommendArtist[]>([]);
const artistsLoading = ref(true);

// 格式化播放次数
function formatPlayCount(count: number) {
  if (count > 100000000) {
    return Math.floor(count / 100000000) + "亿";
  } else if (count > 10000) {
    return Math.floor(count / 10000) + "万";
  }
  return count;
}

// 跳转到歌单详情
function navigateToPlaylist(id: number) {
  router.push(`/discover/playlist/${id}`);
}

// 跳转到专辑详情
function navigateToAlbum(id: number) {
  router.push(`/discover/album/${id}`);
}

// 播放歌曲
async function playSong(song: any) {
  console.log("点击播放歌曲:", song.name, song.id);
  // 确保歌曲对象包含必要的信息
  if (!song || !song.id) {
    console.error("歌曲数据不完整:", song);
    return;
  }

  try {
    // 设置播放列表并播放
    playerStore.setPlaylist([song]);
    playerStore.play(0);

    // 确保播放状态设置为播放
    if (!playerStore.playing) {
      console.log("设置播放状态为true");
      playerStore.togglePlay();
    }

    console.log("播放列表已设置，当前歌曲:", playerStore.currentSong?.name);
    console.log("当前播放状态:", playerStore.playing ? "播放中" : "已暂停");

    // 强制刷新播放状态，确保UI和实际状态一致
    setTimeout(() => {
      if (!playerStore.playing) {
        console.log("播放状态检查：仍为暂停状态，尝试再次切换");
        playerStore.togglePlay();
      }
    }, 500);
  } catch (error) {
    console.error("播放歌曲出错:", error);
  }
}

// 播放专辑
async function playAlbum(id: number) {
  console.log("点击播放专辑, ID:", id);
  try {
    // 调用获取专辑详情的API，获取专辑中的歌曲
    const albumInfo = await getAlbumDetail(id);
    console.log("获取到专辑信息:", albumInfo);

    if (albumInfo.songs && albumInfo.songs.length > 0) {
      console.log("设置播放列表, 歌曲数量:", albumInfo.songs.length);
      playerStore.setPlaylist(albumInfo.songs);
      playerStore.play(0);

      // 确保播放状态设置为播放
      if (!playerStore.playing) {
        console.log("设置播放状态为true");
        playerStore.togglePlay();
      }

      console.log("播放列表已设置，当前歌曲:", playerStore.currentSong?.name);
      console.log("当前播放状态:", playerStore.playing ? "播放中" : "已暂停");

      // 强制刷新播放状态
      setTimeout(() => {
        if (!playerStore.playing) {
          console.log("播放状态仍为false，强制设置为true");
          playerStore.togglePlay();
        }
      }, 300);
    } else {
      console.error("专辑中没有歌曲");
    }
  } catch (error) {
    console.error("播放专辑失败:", error);
  }
}

// 获取数据
async function fetchData() {
  try {
    // 获取轮播图
    bannersLoading.value = true;
    const bannersRes = await getBanners();
    banners.value = bannersRes.banners;
    bannersLoading.value = false;

    // 获取推荐歌单
    playlistsLoading.value = true;
    const playlistsRes = await getRecommendPlaylists(10);
    recommendPlaylists.value = playlistsRes.result;
    playlistsLoading.value = false;

    // 获取新歌
    newSongsLoading.value = true;
    console.log("开始获取新歌数据");
    const newSongsRes = await getNewSongs();
    console.log("获取到新歌数据:", newSongsRes);

    if (newSongsRes.data && newSongsRes.data.length > 0) {
      newSongs.value = newSongsRes.data;
      console.log("设置新歌数据, 数量:", newSongs.value.length);
      console.log("第一首新歌:", newSongs.value[0]);

      // 测试播放第一首新歌
      if (newSongs.value.length > 0 && !playerStore.currentSong) {
        console.log("尝试添加第一首新歌到播放列表");
        const firstSong = newSongs.value[0];
        // 确保歌曲数据完整
        if (firstSong && firstSong.id) {
          playerStore.setPlaylist([firstSong]);
          console.log("已添加第一首新歌到播放列表");
        }
      }
    } else {
      console.error("新歌数据为空或格式不正确");
    }
    newSongsLoading.value = false;

    // 获取新碟
    newAlbumsLoading.value = true;
    const newAlbumsRes = await getNewAlbums(10);
    console.log("获取到新碟数据:", newAlbumsRes);
    newAlbums.value = newAlbumsRes.albums;
    newAlbumsLoading.value = false;

    // 获取热门歌手
    artistsLoading.value = true;
    const artistsRes = await getHotArtists(6);
    hotArtists.value = artistsRes.artists;
    artistsLoading.value = false;
  } catch (error) {
    console.error("获取推荐页数据失败:", error);
  }
}

// 组件挂载时获取数据
onMounted(async () => {
  await fetchData();

  // 测试播放功能 - 使用固定的热门歌曲ID
  console.log("测试播放功能");
  const testSong = {
    id: 1901371647, // 周杰伦 - 晴天
    name: "晴天",
    artists: [{ id: 6452, name: "周杰伦" }],
    album: {
      id: 34209,
      name: "叶惠美",
      picUrl:
        "https://p2.music.126.net/cUTk0ewrQtYGP2YpPZoUng==/3265549553028224.jpg",
    },
    duration: 269000, // 4:29
  };

  console.log("设置测试歌曲:", testSong);
  playerStore.setPlaylist([testSong]);
  playerStore.play(0);

  // 延迟一秒后再切换播放状态，确保歌曲URL已经获取
  setTimeout(() => {
    console.log("延迟后切换播放状态为播放");
    if (!playerStore.playing) {
      playerStore.togglePlay();
    }
  }, 1000);
});

/**
 * 播放歌单
 * @param id 歌单ID
 */
function playPlaylist(id: number) {
  // 获取歌单详情并播放
  getPlaylistDetail(id).then((res: any) => {
    if (res.playlist && res.playlist.trackIds) {
      // 获取歌单中的歌曲
      getPlaylistTracks(id, res.playlist.trackIds.map((t: any) => t.id)).then((tracksRes: any) => {
        if (tracksRes.songs && tracksRes.songs.length > 0) {
          // 设置播放列表并播放第一首
          playerStore.setPlaylist(tracksRes.songs);
          playerStore.play(0);
        }
      });
    }
  });
}

/**
 * 从列表中播放歌曲
 * @param data 包含歌曲和索引的对象
 */
function playSongFromList(data: { track: any, index: number }) {
  // 设置播放列表为当前显示的新歌列表
  playerStore.setPlaylist(newSongs.value);
  // 播放选中的歌曲
  playerStore.play(data.index);
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
 * 播放艺术家热门歌曲
 * @param artistId 艺术家ID
 */
function playArtistHotSongs(artistId: number) {
  // 获取艺术家热门歌曲并播放
  getArtistHotSongs(artistId).then(res => {
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
  message.success('关注成功');
}

/**
 * 取消关注艺术家
 * @param artistId 艺术家ID
 */
function unfollowArtist(artistId: number) {
  // 这里应该调用API来取消关注艺术家
  // 由于API未实现，这里只做提示
  message.success('已取消关注');
}
</script>
