<template>
  <div class="toplist-page">
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
      <!-- 左侧榜单分类 -->
      <div class="md:col-span-1">
        <h3 class="text-lg font-medium mb-4">云音乐特色榜</h3>
        <div class="space-y-3">
          <div 
            v-for="item in officialLists" 
            :key="item.id" 
            class="flex items-center p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-800 cursor-pointer transition-colors"
            :class="{'bg-gray-100 dark:bg-dark-800': currentToplist?.id === item.id}"
            @click="selectToplist(item)"
          >
            <div v-if="loading" class="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded mr-3 flex-shrink-0 animate-pulse"></div>
            <img v-else :src="item.coverImgUrl + '?param=100y100'" class="w-16 h-16 rounded mr-3 flex-shrink-0" :alt="item.name" />
            <div>
              <div class="font-medium">{{ item.name }}</div>
              <div class="text-xs text-gray-500 mt-1">{{ item.updateFrequency }}</div>
            </div>
          </div>
        </div>
        
        <h3 class="text-lg font-medium mb-4 mt-6">全球媒体榜</h3>
        <div class="space-y-3">
          <div 
            v-for="item in globalLists" 
            :key="item.id" 
            class="flex items-center p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-800 cursor-pointer transition-colors"
            :class="{'bg-gray-100 dark:bg-dark-800': currentToplist?.id === item.id}"
            @click="selectToplist(item)"
          >
            <div v-if="loading" class="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded mr-3 flex-shrink-0 animate-pulse"></div>
            <img v-else :src="item.coverImgUrl + '?param=100y100'" class="w-16 h-16 rounded mr-3 flex-shrink-0" :alt="item.name" />
            <div>
              <div class="font-medium">{{ item.name }}</div>
              <div class="text-xs text-gray-500 mt-1">{{ item.updateFrequency }}</div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 右侧榜单详情 -->
      <div class="md:col-span-3">
        <div class="bg-white dark:bg-dark-900 rounded-lg p-6 shadow-sm">
          <!-- 榜单头部 -->
          <div class="flex flex-col md:flex-row md:items-center gap-6 mb-6">
            <div v-if="detailLoading" class="w-48 h-48 bg-gray-200 dark:bg-gray-700 rounded-lg flex-shrink-0 animate-pulse"></div>
            <img 
              v-else-if="currentToplist" 
              :src="currentToplist.coverImgUrl + '?param=300y300'" 
              class="w-48 h-48 rounded-lg flex-shrink-0 object-cover" 
              :alt="currentToplist.name" 
            />
            <div v-else class="w-48 h-48 bg-gray-200 dark:bg-gray-700 rounded-lg flex-shrink-0"></div>
            
            <div>
              <div v-if="detailLoading">
                <div class="h-8 w-64 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-4"></div>
                <div class="h-4 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-3"></div>
              </div>
              <template v-else-if="currentToplist">
                <h2 class="text-2xl font-bold mb-2">{{ currentToplist.name }}</h2>
                <div class="flex items-center text-sm text-gray-500 mb-4">
                  <div class="i-carbon-update mr-1"></div>
                  <span>最近更新：{{ formatDate(currentToplist.updateTime) }}</span>
                </div>
                <div class="flex items-center gap-3">
                  <button 
                    class="px-6 py-2 rounded-full bg-primary text-white flex items-center gap-1"
                    @click="playAll"
                  >
                    <div class="i-carbon-play-filled"></div>
                    <span>播放</span>
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
              <div v-else>
                <h2 class="text-2xl font-bold mb-2">请选择榜单</h2>
              </div>
            </div>
          </div>
          
          <!-- 榜单歌曲列表 -->
          <div class="overflow-x-auto">
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
                <template v-if="detailLoading">
                  <tr v-for="i in 20" :key="i" class="border-b border-gray-100 dark:border-gray-800">
                    <td class="py-3 px-2">
                      <div class="flex items-center justify-between">
                        <span :class="{'text-primary font-medium': i <= 3}">{{ i }}</span>
                      </div>
                    </td>
                    <td class="py-3">
                      <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-48"></div>
                    </td>
                    <td class="py-3">
                      <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-24"></div>
                    </td>
                    <td class="py-3">
                      <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-32"></div>
                    </td>
                    <td class="py-3">
                      <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-16"></div>
                    </td>
                  </tr>
                </template>
                <template v-else-if="tracks.length > 0">
                  <tr 
                    v-for="(track, index) in tracks" 
                    :key="track.id" 
                    class="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-dark-800 cursor-pointer"
                    @dblclick="playSong(index)"
                  >
                    <td class="py-3 px-2">
                      <div class="flex items-center justify-between">
                        <span :class="{'text-primary font-medium': index < 3}">{{ index + 1 }}</span>
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
                </template>
                <tr v-else class="border-b border-gray-100 dark:border-gray-800">
                  <td colspan="5" class="py-10 text-center text-gray-500">请选择榜单查看歌曲</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { usePlayerStore } from '@/stores/player'
import { getAllTopLists, getTopListDetail, getTopListTracks } from '@/api/toplist'

const playerStore = usePlayerStore()

// 加载状态
const loading = ref(true)
const detailLoading = ref(false)

// 榜单数据
const allTopLists = ref([])
const officialLists = ref([])
const globalLists = ref([])

// 当前选中的榜单
const currentToplist = ref(null)

// 当前榜单的歌曲
const tracks = ref([])

// 获取所有榜单
async function fetchAllTopLists() {
  try {
    loading.value = true
    const res = await getAllTopLists()
    if (res && res.list) {
      allTopLists.value = res.list
      
      // 分类榜单
      // 官方榜单通常更新频率较高且排名前列
      officialLists.value = res.list.filter(item => 
        item.name.includes('榜') && 
        (item.updateFrequency?.includes('每日') || item.updateFrequency?.includes('每周'))
      ).slice(0, 4)
      
      // 全球媒体榜
      globalLists.value = res.list.filter(item => 
        !officialLists.value.some(official => official.id === item.id)
      ).slice(0, 6)
      
      // 默认选中第一个榜单
      if (officialLists.value.length > 0) {
        selectToplist(officialLists.value[0])
      }
    }
    loading.value = false
  } catch (error) {
    console.error('获取榜单失败:', error)
    loading.value = false
  }
}

// 选择榜单
async function selectToplist(toplist) {
  currentToplist.value = toplist
  await fetchTopListDetail(toplist.id)
}

// 获取榜单详情和歌曲
async function fetchTopListDetail(id) {
  try {
    detailLoading.value = true
    tracks.value = []
    
    // 获取榜单详情
    const detailRes = await getTopListDetail(id)
    if (detailRes && detailRes.playlist) {
      currentToplist.value = {
        ...currentToplist.value,
        ...detailRes.playlist
      }
    }
    
    // 获取榜单歌曲
    const tracksRes = await getTopListTracks(id, 100)
    if (tracksRes && tracksRes.songs) {
      tracks.value = tracksRes.songs
    }
    
    detailLoading.value = false
  } catch (error) {
    console.error('获取榜单详情失败:', error)
    detailLoading.value = false
  }
}

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

onMounted(() => {
  fetchAllTopLists()
})
</script>