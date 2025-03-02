<template>
  <div class="flex flex-col h-screen bg-light dark:bg-secondary">
    <!-- 顶部导航栏 -->
    <header class="h-16 bg-white dark:bg-dark-900 shadow-sm border-b border-gray-200 dark:border-gray-800">
      <div class="flex items-center justify-between h-full px-4">
        <div class="flex items-center gap-4">
          <!-- Logo -->
          <div class="text-xl font-bold text-primary">网易云音乐</div>
          
          <!-- 主导航 -->
          <nav class="hidden md:flex items-center gap-6">
            <router-link 
              v-for="nav in navItems" 
              :key="nav.path" 
              :to="nav.path"
              class="px-2 py-1 text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors"
              active-class="text-primary font-medium"
            >
              {{ nav.name }}
            </router-link>
          </nav>
        </div>
        
        <!-- 搜索框 -->
        <div class="flex-1 max-w-md mx-4 hidden md:block">
          <div class="relative">
            <input 
              type="text" 
              placeholder="搜索音乐、歌手、歌词、用户" 
              class="w-full py-2 px-4 pr-10 rounded-full bg-gray-100 dark:bg-dark-800 focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <div class="i-carbon-search absolute right-3 top-2.5 text-gray-400"></div>
          </div>
        </div>
        
        <!-- 用户区域 -->
        <div class="flex items-center gap-4">
          <ThemeToggle />
          
          <div v-if="userStore.isLoggedIn" class="flex items-center gap-2">
            <img :src="userStore.profile?.avatarUrl" class="w-8 h-8 rounded-full" />
            <span class="hidden md:inline text-sm">{{ userStore.profile?.nickname }}</span>
          </div>
          <router-link to="/login" v-else>
            <button class="text-sm px-4 py-1 rounded-full border border-gray-300 dark:border-gray-700 hover:text-primary hover:border-primary transition-colors">
              登录
            </button>
          </router-link>
        </div>
      </div>
    </header>
    
    <!-- 主内容区域 -->
    <main class="flex-1 overflow-auto">
      <router-view />
    </main>
    
    <!-- 播放器栏 -->
    <footer class="h-20 bg-white dark:bg-dark-900 border-t border-gray-200 dark:border-gray-800 shadow-lg">
      <div class="flex items-center justify-between h-full px-4">
        <!-- 当前播放歌曲信息 -->
        <div class="flex items-center gap-3">
          <img 
            v-if="playerStore.currentSong" 
            :src="playerStore.currentSong?.album.picUrl + '?param=60y60'" 
            class="w-12 h-12 rounded" 
            alt="album cover"
          />
          <div v-if="playerStore.currentSong" class="flex flex-col">
            <span class="text-sm font-medium">{{ playerStore.currentSong?.name }}</span>
            <span class="text-xs text-gray-500">
              {{ playerStore.currentSong?.artists.map(a => a.name).join('/') }}
            </span>
          </div>
          <div v-else class="text-sm text-gray-500">未播放</div>
        </div>
        
        <!-- 播放控制 -->
        <div class="flex flex-col items-center">
          <div class="flex items-center gap-4">
            <button class="icon-btn" @click="playerStore.prev()">
              <div class="i-carbon-previous-filled"></div>
            </button>
            <button 
              class="w-10 h-10 rounded-full bg-primary flex-center text-white"
              @click="playerStore.togglePlay()"
            >
              <div v-if="playerStore.playing" class="i-carbon-pause-filled"></div>
              <div v-else class="i-carbon-play-filled"></div>
            </button>
            <button class="icon-btn" @click="playerStore.next()">
              <div class="i-carbon-next-filled"></div>
            </button>
          </div>
          
          <!-- 进度条 -->
          <div class="hidden md:flex items-center gap-2 w-96 mt-1">
            <span class="text-xs">{{ formatTime(currentTime) }}</span>
            <div 
              class="flex-1 h-1 bg-gray-200 dark:bg-gray-700 rounded-full relative cursor-pointer"
              @click="handleProgressClick"
              ref="progressBarRef"
            >
              <div 
                class="h-full bg-primary rounded-full absolute top-0 left-0"
                :style="{ width: progress + '%' }"
              ></div>
            </div>
            <span class="text-xs">{{ formatTime(playerStore.currentSong?.duration || 0) }}</span>
          </div>
        </div>
        
        <!-- 音量控制 -->
        <div class="hidden md:flex items-center gap-4">
          <div class="flex items-center gap-2">
            <button class="icon-btn" @click="toggleMute">
              <div v-if="isMuted" class="i-carbon-volume-mute"></div>
              <div v-else-if="playerStore.volume > 50" class="i-carbon-volume-up"></div>
              <div v-else-if="playerStore.volume > 0" class="i-carbon-volume-down"></div>
              <div v-else class="i-carbon-volume-mute"></div>
            </button>
            <div 
              class="w-20 h-1 bg-gray-200 dark:bg-gray-700 rounded-full relative cursor-pointer"
              @click="handleVolumeClick"
              ref="volumeBarRef"
            >
              <div 
                class="h-full bg-primary rounded-full absolute top-0 left-0"
                :style="{ width: playerStore.volume + '%' }"
              ></div>
            </div>
          </div>
          <button class="icon-btn" @click="togglePlayMode">
            <div v-if="playerStore.playMode === 0" class="i-carbon-repeat" title="顺序播放"></div>
            <div v-else-if="playerStore.playMode === 1" class="i-carbon-repeat-one" title="单曲循环"></div>
            <div v-else class="i-carbon-shuffle" title="随机播放"></div>
          </button>
          <button class="icon-btn" @click="togglePlaylistPanel">
            <div class="i-carbon-playlist"></div>
          </button>
        </div>
      </div>
    </footer>
    
    <!-- 播放列表面板 -->
    <PlaylistPanel :is-visible="showPlaylistPanel" @close="showPlaylistPanel = false" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useUserStore } from '@/stores/user'
import { usePlayerStore } from '@/stores/player'
import { getSongUrl } from '@/api/music'
import ThemeToggle from '@/components/common/ThemeToggle.vue'
import PlaylistPanel from '@/components/common/PlaylistPanel.vue'

const userStore = useUserStore()
const playerStore = usePlayerStore()

// 播放列表面板
const showPlaylistPanel = ref(false)

// 切换播放列表面板显示状态
function togglePlaylistPanel() {
  showPlaylistPanel.value = !showPlaylistPanel.value
}

// 导航项
const navItems = [
  { name: '发现音乐', path: '/discover' },
  { name: '我的音乐', path: '/my' },
  { name: '关注', path: '/follow' },
  { name: '商城', path: '/store' },
  { name: '音乐人', path: '/musician' },
  { name: '下载客户端', path: '/download' },
]

// 音频播放相关
const audioRef = ref<HTMLAudioElement | null>(null)
const currentTime = ref(0)
const progress = computed(() => {
  if (!playerStore.currentSong) return 0
  return (currentTime.value / playerStore.currentSong.duration) * 100
})
const progressBarRef = ref<HTMLDivElement | null>(null)
const volumeBarRef = ref<HTMLDivElement | null>(null)
const previousVolume = ref(60) // 存储静音前的音量
const isMuted = ref(false)

// 格式化时间
function formatTime(time: number) {
  time = Math.floor(time / 1000) // 转换为秒
  const minutes = Math.floor(time / 60)
  const seconds = time % 60
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
}

// 点击进度条
function handleProgressClick(e: MouseEvent) {
  if (!progressBarRef.value || !playerStore.currentSong) return
  
  const rect = progressBarRef.value.getBoundingClientRect()
  const offsetX = e.clientX - rect.left
  const percentage = offsetX / rect.width
  
  // 设置当前播放时间
  if (audioRef.value) {
    const newTime = percentage * playerStore.currentSong.duration / 1000
    audioRef.value.currentTime = newTime
  }
}

// 点击音量条
function handleVolumeClick(e: MouseEvent) {
  if (!volumeBarRef.value) return
  
  const rect = volumeBarRef.value.getBoundingClientRect()
  const offsetX = e.clientX - rect.left
  const percentage = Math.max(0, Math.min(100, (offsetX / rect.width) * 100))
  
  playerStore.setVolume(Math.round(percentage))
  if (percentage > 0 && isMuted.value) {
    isMuted.value = false
  }
}

// 切换静音
function toggleMute() {
  if (isMuted.value) {
    // 取消静音，恢复之前的音量
    playerStore.setVolume(previousVolume.value)
    isMuted.value = false
  } else {
    // 静音，保存当前音量
    previousVolume.value = playerStore.volume
    playerStore.setVolume(0)
    isMuted.value = true
  }
}

// 切换播放模式
function togglePlayMode() {
  playerStore.changePlayMode()
}

// 监听播放器状态变化
function setupAudioEvents() {
  if (!audioRef.value) return
  
  // 时间更新
  audioRef.value.addEventListener('timeupdate', () => {
    if (audioRef.value) {
      currentTime.value = audioRef.value.currentTime * 1000
    }
  })
  
  // 播放结束
  audioRef.value.addEventListener('ended', () => {
    playerStore.next()
  })
}

// 监听播放状态变化
watch(() => playerStore.playing, (newPlaying) => {
  if (!audioRef.value) return
  
  if (newPlaying) {
    audioRef.value.play().catch(err => {
      console.error('播放失败:', err)
      playerStore.togglePlay()
    })
  } else {
    audioRef.value.pause()
  }
})

// 监听当前歌曲变化
watch(() => playerStore.currentSong, async (newSong) => {
  if (!newSong || !audioRef.value) return
  
  try {
    // 获取歌曲URL
    const res = await getSongUrl(newSong.id)
    const url = res.data[0]?.url
    
    if (url) {
      audioRef.value.src = url
      if (playerStore.playing) {
        audioRef.value.play().catch(err => {
          console.error('播放失败:', err)
          playerStore.togglePlay()
        })
      }
    } else {
      console.error('获取歌曲URL失败')
    }
  } catch (error) {
    console.error('获取歌曲URL失败:', error)
  }
})

// 监听音量变化
watch(() => playerStore.volume, (newVolume) => {
  if (audioRef.value) {
    audioRef.value.volume = newVolume / 100
  }
})

onMounted(() => {
  // 创建音频元素
  audioRef.value = new Audio()
  audioRef.value.volume = playerStore.volume / 100
  setupAudioEvents()
})

onUnmounted(() => {
  // 清理音频元素
  if (audioRef.value) {
    audioRef.value.pause()
    audioRef.value.src = ''
  }
})
</script>