<template>
  <div class="recommend-page">
    <!-- 轮播图 -->
    <div class="mb-8">
      <div v-if="bannersLoading" class="relative h-64 rounded-lg overflow-hidden shadow-md bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
      <div v-else class="relative h-64 rounded-lg overflow-hidden shadow-md">
        <n-carousel
          autoplay
          show-arrow
          dot-type="line"
          effect="fade"
          :interval="3000"
          class="h-full"
        >
          <n-carousel-item v-for="banner in banners" :key="banner.imageUrl" class="h-full">
            <div class="relative h-full">
              <img :src="banner.imageUrl" class="w-full h-full object-cover" :alt="banner.typeTitle" />
              <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                <h3 class="text-white text-lg font-medium">{{ banner.typeTitle }}</h3>
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
        <router-link to="/discover/playlist" class="text-sm text-gray-500 hover:text-primary">更多 &gt;</router-link>
      </div>
      
      <!-- 加载状态 -->
      <div v-if="playlistsLoading" class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        <div v-for="i in 10" :key="i" class="playlist-item">
          <div class="relative rounded-lg overflow-hidden aspect-square shadow-md mb-2 bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
          <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2"></div>
          <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-2/3"></div>
        </div>
      </div>
      
      <!-- 歌单列表 -->
      <div v-else class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        <div 
          v-for="playlist in recommendPlaylists" 
          :key="playlist.id" 
          class="playlist-item cursor-pointer"
          @click="navigateToPlaylist(playlist.id)"
        >
          <div class="relative rounded-lg overflow-hidden aspect-square shadow-md mb-2">
            <img :src="playlist.picUrl + '?param=200y200'" class="w-full h-full object-cover" :alt="playlist.name" />
            <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
              <div class="flex items-center text-white text-xs">
                <div class="i-carbon-play-filled mr-1"></div>
                <span>{{ formatPlayCount(playlist.playCount) }}</span>
              </div>
            </div>
          </div>
          <div class="text-sm line-clamp-2 h-10">{{ playlist.name }}</div>
        </div>
      </div>
    </div>

    <!-- 新歌新碟 -->
    <div class="mb-8">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-xl font-bold">新歌新碟</h2>
        <div>
          <router-link to="/discover/album" class="text-sm text-gray-500 hover:text-primary mr-4">更多新碟 &gt;</router-link>
        </div>
      </div>
      
      <!-- 加载状态 -->
      <div v-if="newSongsLoading || newAlbumsLoading" class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="bg-white dark:bg-dark-900 rounded-lg p-4 shadow-sm">
          <h3 class="text-lg font-medium mb-3">新歌推荐</h3>
          <div class="space-y-2">
            <div v-for="i in 5" :key="i" class="flex items-center p-2 rounded-md">
              <div class="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded mr-3 flex-shrink-0 animate-pulse"></div>
              <div class="flex-1 min-w-0">
                <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2"></div>
                <div class="h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-2/3"></div>
              </div>
            </div>
          </div>
        </div>
        <div class="bg-white dark:bg-dark-900 rounded-lg p-4 shadow-sm">
          <h3 class="text-lg font-medium mb-3">新碟上架</h3>
          <div class="space-y-2">
            <div v-for="i in 5" :key="i" class="flex items-center p-2 rounded-md">
              <div class="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded mr-3 flex-shrink-0 animate-pulse"></div>
              <div class="flex-1 min-w-0">
                <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2"></div>
                <div class="h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-2/3"></div>
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
          <div class="space-y-2">
            <div 
              v-for="song in newSongs.slice(0, 5)" 
              :key="song.id" 
              class="flex items-center p-2 hover:bg-gray-100 dark:hover:bg-dark-800 rounded-md transition-colors cursor-pointer"
              @click="playSong(song)"
            >
              <img :src="song.album.picUrl + '?param=60y60'" class="w-10 h-10 rounded mr-3 flex-shrink-0" :alt="song.name" />
              <div class="flex-1 min-w-0">
                <div class="text-sm font-medium truncate">{{ song.name }}</div>
                <div class="text-xs text-gray-500 truncate">{{ song.artists.map(a => a.name).join('/') }}</div>
              </div>
              <div class="flex items-center gap-2">
                <button class="icon-btn" @click.stop="playAlbum(song.album.id)">
                  <div class="i-carbon-play-filled text-gray-500 hover:text-primary"></div>
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 新碟上架 -->
        <div class="bg-white dark:bg-dark-900 rounded-lg p-4 shadow-sm">
          <h3 class="text-lg font-medium mb-3">新碟上架</h3>
          <div class="space-y-2">
            <div 
              v-for="album in newAlbums.slice(0, 5)" 
              :key="album.id" 
              class="flex items-center p-2 hover:bg-gray-100 dark:hover:bg-dark-800 rounded-md transition-colors cursor-pointer"
              @click="navigateToAlbum(album.id)"
            >
              <img :src="album.picUrl + '?param=60y60'" class="w-10 h-10 rounded mr-3 flex-shrink-0" :alt="album.name" />
              <div class="flex-1 min-w-0">
                <div class="text-sm font-medium truncate">{{ album.name }}</div>
                <div class="text-xs text-gray-500 truncate">{{ album.artist.name }}</div>
              </div>
              <div class="flex items-center gap-2">
                <button class="icon-btn" @click.stop="playAlbum(album.id)">
                  <div class="i-carbon-play-filled text-gray-500 hover:text-primary"></div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 热门歌手 -->
    <div class="mb-8">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-xl font-bold">热门歌手</h2>
        <router-link to="/discover/artist" class="text-sm text-gray-500 hover:text-primary">更多 &gt;</router-link>
      </div>
      
      <!-- 加载状态 -->
      <div v-if="artistsLoading" class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <div v-for="i in 6" :key="i" class="text-center">
          <div class="w-24 h-24 mx-auto bg-gray-200 dark:bg-gray-700 rounded-full mb-2 animate-pulse"></div>
          <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-20 mx-auto"></div>
        </div>
      </div>
      
      <!-- 歌手列表 -->
      <div v-else class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <router-link 
          v-for="artist in hotArtists" 
          :key="artist.id" 
          :to="`/discover/artist/${artist.id}`"
          class="text-center hover:opacity-90 transition-opacity"
        >
          <img 
            :src="artist.picUrl + '?param=120y120'" 
            class="w-24 h-24 mx-auto rounded-full mb-2 object-cover" 
            :alt="artist.name" 
          />
          <div class="text-sm font-medium">{{ artist.name }}</div>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { usePlayerStore } from '@/stores/player'
import { getBanners, getRecommendPlaylists, getNewSongs, getNewAlbums, getHotArtists } from '@/api/music'
import { getAlbumDetail } from '@/api/album'

const router = useRouter()
const playerStore = usePlayerStore()

// 轮播图数据
const bannersLoading = ref(true)
const banners = ref([])

// 推荐歌单数据
const playlistsLoading = ref(true)
const recommendPlaylists = ref([])

// 新歌数据
const newSongsLoading = ref(true)
const newSongs = ref([])

// 新碟数据
const newAlbumsLoading = ref(true)
const newAlbums = ref([])

// 热门歌手数据
const artistsLoading = ref(true)
const hotArtists = ref([])

// 格式化播放次数
function formatPlayCount(count: number) {
  if (count > 100000000) {
    return Math.floor(count / 100000000) + '亿'
  } else if (count > 10000) {
    return Math.floor(count / 10000) + '万'
  }
  return count
}

// 跳转到歌单详情
function navigateToPlaylist(id: number) {
  router.push(`/discover/playlist/${id}`)
}

// 跳转到专辑详情
function navigateToAlbum(id: number) {
  router.push(`/discover/album/${id}`)
}

// 播放歌曲
async function playSong(song: any) {
  console.log('点击播放歌曲:', song.name, song.id);
  // 确保歌曲对象包含必要的信息
  if (!song || !song.id) {
    console.error('歌曲数据不完整:', song);
    return;
  }
  
  try {
    // 设置播放列表并播放
    playerStore.setPlaylist([song]);
    playerStore.play(0);
    
    // 确保播放状态设置为播放
    if (!playerStore.playing) {
      console.log('设置播放状态为true');
      playerStore.togglePlay();
    }
    
    console.log('播放列表已设置，当前歌曲:', playerStore.currentSong?.name);
    console.log('当前播放状态:', playerStore.playing ? '播放中' : '已暂停');
    
    // 延迟检查播放状态，确保播放成功
    setTimeout(() => {
      if (!playerStore.playing) {
        console.log('播放状态检查：仍为暂停状态，尝试再次切换');
        playerStore.togglePlay();
      }
    }, 300);
  } catch (error) {
    console.error('播放歌曲出错:', error);
  }
}

// 播放专辑
async function playAlbum(id: number) {
  console.log('点击播放专辑, ID:', id);
  try {
    // 调用获取专辑详情的API，获取专辑中的歌曲
    const albumInfo = await getAlbumDetail(id);
    console.log('获取到专辑信息:', albumInfo);
    
    if (albumInfo.songs && albumInfo.songs.length > 0) {
      console.log('设置播放列表, 歌曲数量:', albumInfo.songs.length);
      playerStore.setPlaylist(albumInfo.songs);
      playerStore.play(0);
      
      // 确保播放状态设置为播放
      if (!playerStore.playing) {
        console.log('设置播放状态为true');
        playerStore.togglePlay();
      }
      
      console.log('播放列表已设置，当前歌曲:', playerStore.currentSong);
      console.log('当前播放状态:', playerStore.playing ? '播放中' : '已暂停');
      
      // 强制刷新播放状态
      setTimeout(() => {
        if (!playerStore.playing) {
          console.log('播放状态仍为false，强制设置为true');
          playerStore.togglePlay();
        }
      }, 100);
    } else {
      console.error('专辑中没有歌曲');
    }
  } catch (error) {
    console.error('播放专辑失败:', error);
  }
}

// 获取数据
async function fetchData() {
  try {
    // 获取轮播图
    bannersLoading.value = true
    const bannersRes = await getBanners()
    banners.value = bannersRes.banners
    bannersLoading.value = false

    // 获取推荐歌单
    playlistsLoading.value = true
    const playlistsRes = await getRecommendPlaylists(10)
    recommendPlaylists.value = playlistsRes.result
    playlistsLoading.value = false

    // 获取新歌
    newSongsLoading.value = true
    console.log('开始获取新歌数据')
    const newSongsRes = await getNewSongs()
    console.log('获取到新歌数据:', newSongsRes)
    
    if (newSongsRes.data && newSongsRes.data.length > 0) {
      newSongs.value = newSongsRes.data
      console.log('设置新歌数据, 数量:', newSongs.value.length)
      console.log('第一首新歌:', newSongs.value[0])
      
      // 测试播放第一首新歌
      if (newSongs.value.length > 0 && !playerStore.currentSong) {
        console.log('尝试添加第一首新歌到播放列表')
        const firstSong = newSongs.value[0]
        // 确保歌曲数据完整
        if (firstSong && firstSong.id) {
          playerStore.setPlaylist([firstSong])
          console.log('已添加第一首新歌到播放列表')
        }
      }
    } else {
      console.error('新歌数据为空或格式不正确')
    }
    newSongsLoading.value = false

    // 获取新碟
    newAlbumsLoading.value = true
    const newAlbumsRes = await getNewAlbums(10)
    console.log('获取到新碟数据:', newAlbumsRes)
    newAlbums.value = newAlbumsRes.albums
    newAlbumsLoading.value = false

    // 获取热门歌手
    artistsLoading.value = true
    const artistsRes = await getHotArtists(6)
    hotArtists.value = artistsRes.artists
    artistsLoading.value = false
  } catch (error) {
    console.error('获取推荐页数据失败:', error)
  }
}

// 组件挂载时获取数据
onMounted(async () => {
  await fetchData();
  
  // 测试播放功能 - 使用固定的热门歌曲ID
  console.log('测试播放功能');
  const testSong = {
    id: 1901371647, // 周杰伦 - 晴天
    name: '晴天',
    artists: [{ id: 6452, name: '周杰伦' }],
    album: { 
      id: 34209,
      name: '叶惠美', 
      picUrl: 'https://p2.music.126.net/cUTk0ewrQtYGP2YpPZoUng==/3265549553028224.jpg'
    },
    duration: 269000 // 4:29
  };
  
  console.log('设置测试歌曲:', testSong);
  playerStore.setPlaylist([testSong]);
  playerStore.play(0);
  
  // 延迟一秒后再切换播放状态，确保歌曲URL已经获取
  setTimeout(() => {
    console.log('延迟后切换播放状态为播放');
    if (!playerStore.playing) {
      playerStore.togglePlay();
    }
  }, 1000);
});
</script>