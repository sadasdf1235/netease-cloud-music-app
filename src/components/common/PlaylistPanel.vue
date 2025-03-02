<template>
  <div 
    v-if="isVisible"
    class="fixed bottom-20 right-4 w-80 max-h-96 bg-white dark:bg-dark-900 shadow-lg rounded-t-lg overflow-hidden z-50 border border-gray-200 dark:border-gray-800 flex flex-col"
  >
    <!-- 播放列表头部 -->
    <div class="flex items-center justify-between p-3 border-b border-gray-200 dark:border-gray-800">
      <div class="flex items-center gap-2">
        <div class="i-carbon-playlist text-lg"></div>
        <span class="font-medium">当前播放</span>
        <span class="text-xs text-gray-500">({{ playerStore.playlist.length }}首)</span>
      </div>
      <div class="flex items-center gap-2">
        <button 
          class="text-xs text-gray-500 hover:text-primary transition-colors flex items-center"
          @click="clearPlaylist"
        >
          <div class="i-carbon-trash-can mr-1"></div>
          <span>清空</span>
        </button>
        <button 
          class="text-gray-500 hover:text-primary transition-colors"
          @click="close"
        >
          <div class="i-carbon-close"></div>
        </button>
      </div>
    </div>
    
    <!-- 播放列表内容 -->
    <div class="flex-1 overflow-y-auto">
      <div 
        v-for="(song, index) in playerStore.playlist" 
        :key="song.id"
        :class="[
          'flex items-center p-2 hover:bg-gray-100 dark:hover:bg-dark-800 transition-colors cursor-pointer',
          { 'bg-gray-100 dark:bg-dark-800': index === playerStore.currentIndex }
        ]"
        @dblclick="playSong(index)"
      >
        <div 
          class="w-6 h-6 flex-center mr-2 text-xs"
          :class="{ 'text-primary': index === playerStore.currentIndex }"
        >
          <div v-if="index === playerStore.currentIndex && playerStore.playing" class="i-carbon-play-filled"></div>
          <span v-else>{{ index + 1 }}</span>
        </div>
        <div class="flex-1 min-w-0">
          <div 
            class="text-sm truncate"
            :class="{ 'text-primary': index === playerStore.currentIndex }"
          >
            {{ song.name }}
          </div>
          <div class="text-xs text-gray-500 truncate">
            {{ song.artists.map(a => a.name).join('/') }}
          </div>
        </div>
        <div class="text-xs text-gray-500 mr-2">
          {{ formatTime(song.duration) }}
        </div>
        <button 
          class="icon-btn opacity-0 group-hover:opacity-100 transition-opacity"
          @click.stop="removeSong(index)"
        >
          <div class="i-carbon-close"></div>
        </button>
      </div>
      
      <div v-if="playerStore.playlist.length === 0" class="py-10 text-center text-gray-500">
        <div class="i-carbon-music-note text-3xl mx-auto mb-2"></div>
        <p>播放列表为空</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { usePlayerStore } from '@/stores/player'

const props = defineProps<{
  isVisible: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const playerStore = usePlayerStore()

// 格式化时间
function formatTime(time: number) {
  time = Math.floor(time / 1000) // 转换为秒
  const minutes = Math.floor(time / 60)
  const seconds = time % 60
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
}

// 播放指定歌曲
function playSong(index: number) {
  playerStore.play(index)
}

// 从播放列表中移除歌曲
function removeSong(index: number) {
  // 如果正在播放的歌曲被移除，需要特殊处理
  const isCurrentSong = index === playerStore.currentIndex
  const isPlaying = playerStore.playing
  
  // 创建新的播放列表（移除指定歌曲）
  const newPlaylist = [...playerStore.playlist]
  newPlaylist.splice(index, 1)
  
  // 更新播放列表
  playerStore.setPlaylist(newPlaylist)
  
  // 处理当前播放索引
  if (newPlaylist.length === 0) {
    // 列表为空，重置播放状态
    playerStore.currentIndex = -1
    playerStore.playing = false
  } else if (isCurrentSong) {
    // 如果删除的是当前播放歌曲，播放下一首
    // 索引不变（因为后面的歌曲会前移）
    if (index >= newPlaylist.length) {
      // 如果删除的是最后一首，播放第一首
      playerStore.play(0)
    } else {
      // 否则播放同一索引（实际上是下一首）
      playerStore.play(index)
    }
    // 保持原来的播放状态
    playerStore.playing = isPlaying
  } else if (index < playerStore.currentIndex) {
    // 如果删除的歌曲在当前播放歌曲之前，需要调整当前索引
    playerStore.currentIndex--
  }
}

// 清空播放列表
function clearPlaylist() {
  playerStore.setPlaylist([])
  playerStore.currentIndex = -1
  playerStore.playing = false
}

// 关闭面板
function close() {
  emit('close')
}
</script>