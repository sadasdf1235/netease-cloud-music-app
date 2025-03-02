<template>
  <div
    class="player bg-white dark:bg-dark-800 border-t border-gray-200 dark:border-gray-700 p-4"
  >
    <!-- 音频元素 -->
    <audio
      ref="audioRef"
      :src="currentSongUrl"
      @timeupdate="onTimeUpdate"
      @ended="onEnded"
      @canplay="onCanPlay"
      @error="onError"
      @loadedmetadata="onLoadedMetadata"
    ></audio>

    <!-- 当前播放歌曲信息 -->
    <div v-if="playerStore.currentSong" class="flex items-center mb-4">
      <!-- 歌曲封面 -->
      <div class="w-16 h-16 rounded overflow-hidden mr-4 flex-shrink-0">
        <img
          :src="playerStore.currentSong.album.picUrl + '?param=64y64'"
          :alt="playerStore.currentSong.name"
          class="w-full h-full object-cover"
        />
      </div>

      <!-- 歌曲信息 -->
      <div class="flex-1 min-w-0">
        <div class="text-base font-medium truncate">
          {{ playerStore.currentSong.name }}
        </div>
        <div class="text-sm text-gray-500 truncate">
          {{ playerStore.currentSong.artists.map((a) => a.name).join(" / ") }}
        </div>
      </div>

      <!-- 喜欢按钮 -->
      <button class="icon-btn mr-2">
        <div class="i-carbon-favorite text-gray-400 hover:text-red-500"></div>
      </button>

      <!-- 播放列表按钮 -->
      <button class="icon-btn" @click="togglePlaylistPanel">
        <div class="i-carbon-list text-gray-400 hover:text-primary"></div>
      </button>
    </div>

    <!-- 进度条 -->
    <div class="mb-4">
      <div class="flex justify-between text-xs text-gray-500 mb-1">
        <span>{{ formatTime(playerStore.currentTime) }}</span>
        <span>{{ formatTime(playerStore.duration) }}</span>
      </div>
      <div
        class="h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden cursor-pointer"
        @click="onProgressBarClick"
        ref="progressBarRef"
      >
        <div
          class="h-full bg-primary"
          :style="{ width: `${playerStore.progress}%` }"
        ></div>
      </div>
    </div>

    <!-- 播放控制区域 -->
    <div class="flex items-center justify-center gap-4">
      <!-- 播放模式 -->
      <button class="icon-btn" @click="playerStore.changePlayMode()">
        <div
          v-if="playerStore.playMode === 0"
          class="i-carbon-repeat"
          title="顺序播放"
        ></div>
        <div
          v-else-if="playerStore.playMode === 1"
          class="i-carbon-repeat-one"
          title="单曲循环"
        ></div>
        <div v-else class="i-carbon-shuffle" title="随机播放"></div>
      </button>

      <!-- 上一首 -->
      <button class="icon-btn" @click="playerStore.prev()">
        <div class="i-carbon-previous-filled"></div>
      </button>

      <!-- 播放/暂停 -->
      <button
        class="w-12 h-12 rounded-full bg-primary flex-center text-white"
        @click="togglePlay"
      >
        <div
          v-if="playerStore.playing"
          class="i-carbon-pause-filled text-xl"
        ></div>
        <div v-else class="i-carbon-play-filled text-xl"></div>
      </button>

      <!-- 下一首 -->
      <button class="icon-btn" @click="playerStore.next()">
        <div class="i-carbon-next-filled"></div>
      </button>

      <!-- 音量控制 -->
      <div class="flex items-center gap-2">
        <button class="icon-btn" @click="toggleMute">
          <div
            v-if="isMuted || playerStore.volume === 0"
            class="i-carbon-volume-mute"
          ></div>
          <div
            v-else-if="playerStore.volume > 50"
            class="i-carbon-volume-up"
          ></div>
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
import { ref, computed, watch, onMounted } from "vue";
import { usePlayerStore } from "@/stores/player";
import { getSongUrl } from "@/api/music";

const playerStore = usePlayerStore();
const audioRef = ref<HTMLAudioElement | null>(null);
const progressBarRef = ref<HTMLDivElement | null>(null);
const isMuted = ref(false);
const showPlaylistPanel = ref(false);

// 获取当前歌曲URL
const currentSongUrl = ref("");

// 监听当前歌曲变化
watch(
  () => playerStore.currentSong,
  async (newSong) => {
    if (newSong) {
      try {
        console.log('当前歌曲:', newSong)
        const res = await getSongUrl(newSong.id);
        if (res.data && res.data[0]) {
          currentSongUrl.value = res.data[0].url;
          console.log('获取到歌曲URL:', currentSongUrl.value)
        } else {
          console.error('歌曲URL数据为空:', res)
        }
      } catch (error) {
        console.error("获取歌曲URL失败:", error);
      }
    } else {
      console.log('当前没有选中的歌曲')
    }
  },
  { immediate: true }
);

// 监听播放状态
watch(
  () => playerStore.playing,
  (isPlaying) => {
    if (audioRef.value) {
      if (isPlaying) {
        console.log('尝试播放音频')
        audioRef.value.play().catch((err) => {
          console.error("播放失败:", err);
          playerStore.togglePlay(); // 切换回暂停状态
        });
      } else {
        console.log('暂停音频')
        audioRef.value.pause();
      }
    } else {
      console.error('音频元素未初始化')
    }
  }
);

// 监听当前时间变化
watch(
  () => playerStore.currentTime,
  (newTime) => {
    if (audioRef.value && Math.abs(audioRef.value.currentTime - newTime) > 1) {
      audioRef.value.currentTime = newTime;
    }
  }
);

// 播放/暂停切换
function togglePlay() {
  playerStore.togglePlay();
}

// 音量控制
function onVolumeChange(e: Event) {
  const value = Number((e.target as HTMLInputElement).value);
  playerStore.setVolume(value);
  if (audioRef.value) {
    audioRef.value.volume = value / 100;
  }
}

// 静音切换
function toggleMute() {
  if (audioRef.value) {
    isMuted.value = !isMuted.value;
    audioRef.value.muted = isMuted.value;
  }
}

// 时间更新事件
function onTimeUpdate() {
  if (audioRef.value) {
    // 更新当前播放时间
    playerStore.updateCurrentTime(audioRef.value.currentTime);
  }
}

// 播放结束事件
function onEnded() {
  // 根据播放模式决定下一步操作
  if (playerStore.playMode === 1) {
    // 单曲循环
    if (audioRef.value) {
      audioRef.value.currentTime = 0;
      audioRef.value.play();
    }
  } else {
    // 播放下一首
    playerStore.next();
  }
}

// 可以播放事件
function onCanPlay() {
  if (playerStore.playing && audioRef.value) {
    audioRef.value.play().catch((err) => {
      console.error("播放失败:", err);
    });
  }
}

// 元数据加载完成事件
function onLoadedMetadata() {
  if (audioRef.value) {
    // 更新总时长
    playerStore.updateDuration(audioRef.value.duration);
  }
}

// 播放错误事件
function onError() {
  console.error("音频播放失败");
  playerStore.next(); // 播放下一首
}

// 点击进度条事件
function onProgressBarClick(e: MouseEvent) {
  if (progressBarRef.value && playerStore.duration > 0) {
    const rect = progressBarRef.value.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    // 设置进度
    playerStore.setProgress(percent * 100);
    // 同步到音频元素
    if (audioRef.value) {
      audioRef.value.currentTime = percent * playerStore.duration;
    }
  }
}

// 切换播放列表面板
function togglePlaylistPanel() {
  showPlaylistPanel.value = !showPlaylistPanel.value;
  // 这里可以发送事件或调用其他方法来显示/隐藏播放列表面板
}

// 格式化时间 (秒 -> mm:ss)
function formatTime(time: number): string {
  if (isNaN(time) || time <= 0) return "00:00";
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`;
}

// 组件挂载时初始化音量
onMounted(() => {
  if (audioRef.value) {
    audioRef.value.volume = playerStore.volume / 100;
  }
  
  // 添加测试歌曲（周杰伦的《爱错》）
  if (playerStore.playlist.length === 0) {
    console.log('添加测试歌曲到播放列表');
    const testSong = {
      id: 1824045033, // 周杰伦的《爱错》ID
      name: '爱错',
      artists: [{ id: 6452, name: '周杰伦' }],
      album: { 
        id: 125696292, 
        name: '最伟大的作品', 
        picUrl: 'https://p1.music.126.net/hX5VSJXr7keNAZ4xX9uJGQ==/109951166152095883.jpg'
      },
      duration: 228000 // 3:48
    };
    playerStore.setPlaylist([testSong]);
    // 不自动播放，等用户点击播放按钮
  }
});
</script>
