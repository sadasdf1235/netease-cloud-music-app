<template>
  <div class="playlist-detail-page">
    <!-- 歌单信息头部 -->
    <div class="flex flex-col md:flex-row gap-6 mb-6">
      <div class="relative w-64 h-64 flex-shrink-0 rounded-lg overflow-hidden shadow-md">
        <div v-if="loading" class="w-full h-full bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
        <template v-else>
          <img :src="playlistInfo.coverImgUrl + '?param=512y512'" class="w-full h-full object-cover" :alt="playlistInfo.name" />
          <div class="absolute top-2 right-2 text-white text-xs px-2 py-1 rounded bg-black/50">
            <div class="flex items-center">
              <div class="i-carbon-music mr-1"></div>
              <span>{{ playlistInfo.trackCount }}首</span>
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
          <h1 class="text-2xl font-bold mb-2">{{ playlistInfo.name }}</h1>
          <div class="flex items-center text-sm text-gray-500 mb-4">
            <img 
              v-if="playlistInfo.creator" 
              :src="playlistInfo.creator.avatarUrl + '?param=30y30'" 
              class="w-6 h-6 rounded-full mr-2" 
              :alt="playlistInfo.creator.nickname" 
            />
            <span v-if="playlistInfo.creator" class="mr-4">{{ playlistInfo.creator.nickname }}</span>
            <div class="flex items-center">
              <div class="i-carbon-time mr-1"></div>
              <span>创建于 {{ formatDate(playlistInfo.createTime) }}</span>
            </div>
          </div>
          
          <div class="flex flex-wrap items-center gap-2 mb-3">
            <span v-for="tag in playlistInfo.tags" :key="tag" class="px-2 py-0.5 text-xs rounded-full bg-gray-100 dark:bg-dark-800">
              {{ tag }}
            </span>
          </div>
          
          <div class="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
            {{ playlistInfo.description || '暂无简介' }}
          </div>
          
          <div class="flex items-center gap-3">
            <button 
              class="px-6 py-2 rounded-full bg-primary text-white flex items-center gap-1"
              @click="playAll"
            >
              <div class="i-carbon-play-filled"></div>
              <span>播放全部</span>
            </button>
            <button class="icon-btn">
              <div class="i-carbon-favorite"></div>
            </button>
            <button class="icon-btn">
              <div class="i-carbon-share"></div>
            </button>
            <button class="icon-btn">
              <div class="i-carbon-download"></div>
            </button>
          </div>
        </template>
      </div>
    </div>
    
    <!-- 歌曲列表 -->
    <div class="bg-white dark:bg-dark-900 rounded-lg p-4 shadow-sm">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-lg font-medium">歌曲列表 <span class="text-gray-500 text-sm">{{ playlistInfo.trackCount || 0 }}首歌</span></h2>
        <div class="flex items-center gap-2">
          <input 
            v-model="searchKeyword" 
            type="text" 
            placeholder="搜索歌单音乐" 
            class="px-3 py-1 text-sm rounded-full bg-gray-100 dark:bg-dark-800 focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
      </div>
      
      <!-- 加载状态 -->
      <div v-if="loading" class="space-y-2">
        <div v-for="i in 10" :key="i" class="flex items-center p-3 rounded-md">
          <div class="w-6 text-center text-gray-400 mr-4">{{ i }}</div>
          <div class="flex-1 min-w-0">
            <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2 w-48"></div>
            <div class="h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-32"></div>
          </div>
          <div class="w-32 h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          <div class="w-16 h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse ml-4"></div>
        </div>
      </div>
      
      <!-- 歌曲列表内容 -->
      <div v-else class="overflow-x-auto">
        <table class="w-full">
          <thead class="border-b border-gray-200 dark:border-gray-700">
            <tr>
              <th class="py-3 text-left w-16">#</th>
              <th class="py-3 text-left">歌曲</th>
              <th class="py-3 text-left">歌手</th>
              <th class="py-3 text-left">专辑</th>
              <th class="py-3 text-left w-24">时长</th>
            </tr>
          </thead>
          <tbody>
            <tr 
              v-for="(track, index) in filteredTracks" 
              :key="track.id" 
              class="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-dark-800 cursor-pointer"
              @dblclick="playSong(index)"
            >
              <td class="py-3 px-2">
                <div class="flex items-center justify-between">
                  <span>{{ index + 1 }}</span>
                  <div 
                    class="i-carbon-play text-gray-400 hover:text-primary cursor-pointer"
                    @click="playSong(index)"
                  ></div>
                </div>
              </td>
              <td class="py-3">
                <div class="flex items-center">
                  <img 
                    v-if="track.al?.picUrl" 
                    :src="track.al.picUrl + '?param=40y40'" 
                    class="w-10 h-10 rounded mr-3 hidden md:block" 
                    :alt="track.name" 
                  />
                  <div>
                    <div class="font-medium">{{ track.name }}</div>
                    <div v-if="track.alia && track.alia.length > 0" class="text-xs text-gray-500">{{ track.alia[0] }}</div>
                  </div>
                </div>
              </td>
              <td class="py-3 text-gray-600 dark:text-gray-400">{{ formatArtists(track.ar) }}</td>
              <td class="py-3 text-gray-600 dark:text-gray-400 truncate max-w-40">{{ track.al?.name }}</td>
              <td class="py-3 text-gray-500">{{ formatDuration(track.dt) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { usePlayerStore } from '@/stores/player'
import { getPlaylistDetail, getPlaylistTracks } from '@/api/music'

const route = useRoute()
const router = useRouter()
const playerStore = usePlayerStore()

// 歌单ID
const playlistId = computed(() => Number(route.params.id))

// 加载状态
const loading = ref(true)

// 歌单信息
const playlistInfo = ref({
  id: 0,
  name: '',
  coverImgUrl: '',
  description: '',
  tags: [],
  trackCount: 0,
  playCount: 0,
  createTime: 0,
  creator: null
})

// 歌曲列表
const tracks = ref([])

// 搜索关键词
const searchKeyword = ref('')

// 过滤后的歌曲列表
const filteredTracks = computed(() => {
  if (!searchKeyword.value) return tracks.value
  
  const keyword = searchKeyword.value.toLowerCase()
  return tracks.value.filter(track => {
    return track.name.toLowerCase().includes(keyword) || 
           formatArtists(track.ar).toLowerCase().includes(keyword) ||
           (track.al?.name && track.al.name.toLowerCase().includes(keyword))
  })
})

// 格式化时间
function formatDate(timestamp) {
  if (!timestamp) return ''
  const date = new Date(timestamp)
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

// 格式化歌手名称
function formatArtists(artists) {
  if (!artists || !artists.length) return ''
  return artists.map(artist => artist.name).join('/')
}

// 格式化时长
function formatDuration(duration) {
  if (!duration) return '00:00'
  const minutes = Math.floor(duration / 1000 / 60)
  const seconds = Math.floor((duration / 1000) % 60)
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}

// 播放全部
function playAll() {
  if (tracks.value.length === 0) return
  
  // 将歌曲列表转换为播放器需要的格式
  const songList = tracks.value.map(track => ({
    id: track.id,
    name: track.name,
    artists: track.ar,
    album: {
      id: track.al?.id,
      name: track.al?.name,
      picUrl: track.al?.picUrl
    },
    duration: track.dt
  }))
  
  playerStore.setPlaylist(songList)
  playerStore.play(0)
}

// 播放单曲
function playSong(index) {
  if (index < 0 || index >= tracks.value.length) return
  
  // 将歌曲列表转换为播放器需要的格式
  const songList = tracks.value.map(track => ({
    id: track.id,
    name: track.name,
    artists: track.ar,
    album: {
      id: track.al?.id,
      name: track.al?.name,
      picUrl: track.al?.picUrl
    },
    duration: track.dt
  }))
  
  playerStore.setPlaylist(songList)
  playerStore.play(index)
}

// 获取歌单详情
async function fetchPlaylistDetail() {
  try {
    loading.value = true
    
    // 获取歌单基本信息
    const detailRes = await getPlaylistDetail(playlistId.value)
    if (detailRes.playlist) {
      playlistInfo.value = detailRes.playlist
    }
    
    // 获取歌单歌曲
    const tracksRes = await getPlaylistTracks(playlistId.value)
    if (tracksRes.songs) {
      tracks.value = tracksRes.songs
    }
    
    loading.value = false
  } catch (error) {
    console.error('获取歌单详情失败:', error)
    loading.value = false
  }
}

// 监听路由参数变化，重新获取数据
watch(() => route.params.id, (newId) => {
  if (newId) {
    fetchPlaylistDetail()
  }
})

onMounted(() => {
  if (playlistId.value) {
    fetchPlaylistDetail()
  }
})
</script>