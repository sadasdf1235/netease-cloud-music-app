<template>
  <div class="player">
    <!-- 音频元素 -->
    <audio
      ref="audioRef"
      :src="currentSongUrl"
      @timeupdate="onTimeUpdate"
      @ended="onEnded"
      @canplay="onCanPlay"
      @error="onError"
    ></audio>

    <!-- 播放控制区域 -->
    <div class="flex items-center gap-4">
      <!-- 播放模式 -->
      <button class="icon-btn" @click="playerStore.changePlayMode()">
        <div v-if="playerStore.playMode === 0" class="i-carbon-repeat" title="顺序播放"></div>
        <div v-else-if="playerStore.playMode === 1" class="i-carbon-repeat-one" title="单曲循环"></div>
        <div v-else class="i-carbon-shuffle" title="随机播放"></div>
      </button>

      <!-- 上一首 -->
      <button class="icon-btn" @click="playerStore.prev()">
        <div class="i-carbon-previous-filled"></div>
      </button>

      <!-- 播放/暂停 -->
      <button 
        class="w-10 h-10 rounded-full bg-primary flex-center text-white"
        @click="togglePlay"
      >
        <div v-if="playerStore.playing" class="i-carbon-pause-filled"></div>
        <div v-else class="i-carbon-play-filled"></div>
      </button>

      <!-- 下一首 -->
      <button class="icon-btn" @click="playerStore.next()">
        <div class="i-carbon-next-filled"></div>
      </button>

      <!-- 音量控制 -->
      <div class="flex items-center gap-2">
        <button class="icon-btn" @click="toggleMute">
          <div v-if="isMuted || playerStore.volume === 0" class="i-carbon-volume-mute"></div>
          <div v-else-if="playerStore.volume > 50" class="i-carbon-volume-up"></div>
          <div v-else class="i-carbon-volume-down"></div>
        </button>
        <input
          type="range"
          min="0"
          max="100"
          step="1"
          :value="playerStore.volume"
          @input="onVolumeChange"
          class="w-20"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { usePlayerStore } from '@/stores/player'
import { getSongUrl } from '@/api/music'

const playerStore = usePlayerStore()
const audioRef = ref<HTMLAudioElement | null>(null)
const isMuted = ref(false)

// 获取当前歌曲URL
const currentSongUrl = ref('')

// 监听当前歌曲变化
watch(() => playerStore.currentSong, async (newSong) => {
  if (newSong) {
    try {
      const res = await getSongUrl(newSong.id)
      if (res.data && res.data[0]) {
        currentSongUrl.value = res.data[0].url
      }
    } catch (error) {
      console.error('获取歌曲URL失败:', error)
    }
  }
}, { immediate: true })

// 监听播放状态
watch(() => playerStore.playing, (isPlaying) => {
  if (audioRef.value) {
    if (isPlaying) {
      audioRef.value.play()
    } else {
      audioRef.value.pause()
    }
  }
})

// 播放/暂停切换
function togglePlay() {
  playerStore.togglePlay()
}

// 音量控制
function onVolumeChange(e: Event) {
  const value = Number((e.target as HTMLInputElement).value)
  playerStore.setVolume(value)
  if (audioRef.value) {
    audioRef.value.volume = value / 100
  }
}

// 静音切换
function toggleMute() {
  if (audioRef.value) {
    isMuted.value = !isMuted.value
    audioRef.value.muted = isMuted.value
  }
}

// 时间更新事件
function onTimeUpdate() {
  if (audioRef.value) {
    // 更新进度
    const currentTime = audioRef.value.currentTime
    const duration = audioRef.value.duration
    // 这里可以发送事件或更新状态来更新进度条
  }
}

// 播放结束事件
function onEnded() {
  // 根据播放模式决定下一步操作
  if (playerStore.playMode === 1) {
    // 单曲循环
    if (audioRef.value) {
      audioRef.value.currentTime = 0
      audioRef.value.play()
    }
  } else {
    // 播放下一首
    playerStore.next()
  }
}

// 可以播放事件
function onCanPlay() {
  if (playerStore.playing && audioRef.value) {
    audioRef.value.play()
  }
}

// 播放错误事件
function onError() {
  console.error('音频播放失败')
  playerStore.next() // 播放下一首
}

// 组件挂载时初始化音量
onMounted(() => {
  if (audioRef.value) {
    audioRef.value.volume = playerStore.volume / 100
  }
})
</script>