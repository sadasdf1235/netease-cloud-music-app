<template>
    <div class="music-player bg-white dark:bg-dark-800 border-t border-gray-200 dark:border-gray-700 p-4">
      <!-- 音频元素 -->
      <audio
        ref="audioRef"
        :src="currentSongUrl"
        @timeupdate="onTimeUpdate"
        @ended="onEnded"
        @canplay="onCanPlay"
        @error="onError"
        @play="onPlay"
        @pause="onPause"
        @loadedmetadata="onLoadedMetadata"
        preload="auto"
        crossorigin="anonymous"
      ></audio>

      <!-- 播放信息 -->
      <PlayerInfo
        :song="playerStore.currentSong"
        :isLiked="isLiked"
        @like="toggleLike"
        @show-playlist="showPlaylist = !showPlaylist"
      />

      <!-- 进度条 -->
      <PlayerProgress
        :currentTime="playerStore.currentTime"
        :duration="playerStore.duration"
        :progress="playerStore.progress"
        @seek="onSeek"
      />

      <!-- 控制区域 -->
      <div class="flex items-center justify-between">
        <!-- 播放控制 -->
        <PlayerControls
          :isPlaying="playerStore.playing"
          :playMode="{ loop: playerStore.loop, random: playerStore.random }"
          @toggle-play="playerStore.togglePlay()"
          @prev="playerStore.prev()"
          @next="playerStore.next()"
          @toggle-play-mode="togglePlayMode"
        />

        <!-- 歌词按钮 -->
        <PlayerLyric
          :current-song="playerStore.currentSong"
          :lyric-text="lyrics"
          :current-time="playerStore.currentTime"
          :duration="playerStore.duration"
          :is-playing="playerStore.playing"
          :play-mode="{ loop: playerStore.loop, random: playerStore.random }"
          :loading="lyricsLoading"
          @toggle-play="playerStore.togglePlay()"
          @prev="playerStore.prev()"
          @next="playerStore.next()"
          @toggle-play-mode="togglePlayMode"
        />

        <!-- 音量控制 -->
        <PlayerVolume
          :volume="playerStore.volume"
          :isMuted="isMuted"
          @volume-change="onVolumeChange"
          @toggle-mute="toggleMute"
        />
      </div>

      <!-- 播放列表抽屉 -->
      <div v-if="showPlaylist" class="playlist-drawer fixed inset-0 bg-black/50 z-50 flex justify-end" @click.self="showPlaylist = false">
        <div class="w-80 bg-white dark:bg-dark-800 h-full overflow-auto p-4 animate-slide-in-right">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-bold">播放列表 ({{ playerStore.playlist.length }})</h3>
            <button class="icon-btn" @click="showPlaylist = false">
              <div class="i-carbon-close"></div>
            </button>
          </div>

          <div v-if="playerStore.playlist.length === 0" class="text-center text-gray-500 py-8">
            播放列表为空
          </div>

          <ul v-else class="overflow-auto">
            <li
              v-for="(song, index) in playerStore.playlist"
              :key="song.id"
              :class="['flex items-center p-2 rounded-md cursor-pointer hover:bg-gray-100 dark:hover:bg-dark-700',
                      song.id === playerStore.currentSong?.id ? 'bg-gray-100 dark:bg-dark-700' : '']"
              @click="playSongFromPlaylist(index)"
            >
              <span class="w-6 text-center text-gray-400">{{ index + 1 }}</span>
              <div class="ml-2 flex-1 min-w-0">
                <div class="text-sm font-medium truncate" :class="{'text-primary': song.id === playerStore.currentSong?.id}">
                  {{ song.name }}
                </div>
                <div class="text-xs text-gray-500 truncate">
                  {{ formatArtists(song.artists) }}
                </div>
              </div>
              <button class="icon-btn opacity-0 group-hover:opacity-100" @click.stop="removeFromPlaylist(index)">
                <div class="i-carbon-trash-can text-gray-400 hover:text-red-500"></div>
              </button>
            </li>
          </ul>

          <div class="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button class="w-full py-2 text-center text-gray-500 hover:text-primary" @click="clearPlaylist">
              清空播放列表
            </button>
          </div>
        </div>
      </div>
    </div>
  </template>

  <script setup lang="ts">
  /**
   * 音乐播放器组件
   * @description 整合所有播放器子组件，实现完整的音乐播放功能
   */
  import { ref, watch, onMounted } from 'vue';
  import { usePlayerStore } from '@/stores/player';
  import type { SimpleSong } from '@/types/models/song';
  import PlayerInfo from './PlayerInfo.vue';
  import PlayerControls from './PlayerControls.vue';
  import PlayerProgress from './PlayerProgress.vue';
  import PlayerVolume from './PlayerVolume.vue';
  import PlayerLyric from './PlayerLyric.vue';
  import { getLyric } from '@/api/modules/music-song';

  // 定义组件名称（避免与其他组件冲突）
  defineOptions({
    name: 'MusicPlayer'
  });

  // 播放器状态
  const audioRef = ref<HTMLAudioElement | null>(null);
  const playerStore = usePlayerStore();
  const currentSongUrl = ref<string>('');
  const isMuted = ref(false);
  const isLiked = ref(false);
  const showPlaylist = ref(false);
  const audioError = ref<string | null>(null);

  // 歌词相关
  const lyrics = ref<string>('');
  const lyricsLoading = ref(false);

  /**
   * 加载歌词
   * @param id 歌曲ID
   */
  async function loadLyrics(id: number) {
    if (!id) return;
    
    lyricsLoading.value = true;
    try {
      const res = await getLyric(id);
      if (res.lrc && res.lrc.lyric) {
        lyrics.value = res.lrc.lyric;
      } else {
        lyrics.value = '';
      }
    } catch (error: any) {
      console.error('获取歌词失败:', error);
      lyrics.value = '';
    } finally {
      lyricsLoading.value = false;
    }
  }

  /**
   * 切换播放模式
   */
  function togglePlayMode() {
    // 播放模式循环：顺序播放 -> 单曲循环 -> 随机播放
    if (!playerStore.loop && !playerStore.random) {
      // 当前是顺序播放，切换到单曲循环
      playerStore.toggleLoop();
    } else if (playerStore.loop) {
      // 当前是单曲循环，切换到随机播放
      playerStore.toggleLoop();
      playerStore.toggleRandom();
    } else {
      // 当前是随机播放，切换到顺序播放
      playerStore.toggleRandom();
    }
  }

  /**
   * 切换静音状态
   */
  function toggleMute() {
    if (audioRef.value) {
      audioRef.value.muted = !audioRef.value.muted;
      isMuted.value = audioRef.value.muted;
    }
  }

  /**
   * 处理音量变化
   * @param volume 音量值 (0-100)
   */
  function onVolumeChange(volume: number) {
    playerStore.setVolume(volume);
    if (audioRef.value) {
      audioRef.value.volume = volume / 100;

      // 如果音量大于0且处于静音状态，取消静音
      if (volume > 0 && audioRef.value.muted) {
        audioRef.value.muted = false;
        isMuted.value = false;
      }
    }
  }

  /**
   * 处理播放进度改变
   * @param time 新的播放时间（秒）
   */
  function onSeek(time: number) {
    if (audioRef.value) {
      audioRef.value.currentTime = time;
      playerStore.updateCurrentTime(time);
    }
  }

  /**
   * 更新播放时间
   */
  function onTimeUpdate() {
    if (audioRef.value) {
      const currentTime = audioRef.value.currentTime;
      playerStore.updateCurrentTime(currentTime);

      // 计算播放进度百分比
      if (playerStore.duration > 0) {
        const progress = (currentTime / playerStore.duration) * 100;
        playerStore.setProgress(progress);
      }
    }
  }

  /**
   * 播放结束处理
   */
  function onEnded() {
    // 根据播放模式决定下一步操作
    if (playerStore.loop) {
      // 单曲循环，重新播放当前歌曲
      if (audioRef.value) {
        audioRef.value.currentTime = 0;
        audioRef.value.play().catch(error => {
          console.error('重新播放失败:', error);
        });
      }
    } else {
      // 播放下一首
      playerStore.next();
    }
  }

  /**
   * 音频可以播放时的处理
   */
  function onCanPlay() {
    // 重置错误状态
    audioError.value = null;

    // 如果状态为播放中，尝试开始播放
    if (playerStore.playing && audioRef.value) {
      audioRef.value.play().catch(error => {
        console.error('自动播放失败:', error);
        playerStore.togglePlay(); // 切换到暂停状态
      });
    }
  }

  /**
   * 音频错误处理
   */
  function onError() {
    console.error('音频加载错误');
    audioError.value = '音频加载失败';
    if (playerStore.playing) {
      playerStore.togglePlay(); // 切换到暂停状态
    }
  }

  /**
   * 音频播放开始处理
   */
  function onPlay() {
    if (!playerStore.playing) {
      playerStore.togglePlay(); // 确保状态与实际播放一致
    }
  }

  /**
   * 音频暂停处理
   */
  function onPause() {
    if (playerStore.playing) {
      playerStore.togglePlay(); // 确保状态与实际暂停一致
    }
  }

  /**
   * 音频元数据加载完成处理
   */
  function onLoadedMetadata() {
    if (audioRef.value) {
      const duration = audioRef.value.duration;
      playerStore.updateDuration(duration);

      // 设置音量
      audioRef.value.volume = playerStore.volume / 100;
    }
  }

  /**
   * 切换喜欢状态
   */
  function toggleLike() {
    if (!playerStore.currentSong) return;

    // 简单的状态切换，在实际应用中应调用API
    isLiked.value = !isLiked.value;
    console.log(`歌曲 ${playerStore.currentSong.name} ${isLiked.value ? '已添加到' : '已从'}我喜欢列表${isLiked.value ? '中' : '移除'}`);
  }

  /**
   * 格式化歌手名称
   * @param artists 歌手数组
   * @returns 以 / 分隔的歌手名称
   */
  function formatArtists(artists: any[]) {
    if (!artists || artists.length === 0) return '';
    return artists.map(artist => artist.name).join(' / ');
  }

  /**
   * 从播放列表中播放歌曲
   * @param index 歌曲在播放列表中的索引
   */
  function playSongFromPlaylist(index: number) {
    playerStore.play(index);
  }

  /**
   * 从播放列表中移除歌曲
   * @param index 要移除的歌曲索引
   */
  function removeFromPlaylist(index: number) {
    // 创建新的播放列表，排除要移除的歌曲
    const newPlaylist = [...playerStore.playlist];
    newPlaylist.splice(index, 1);

    // 更新播放列表
    playerStore.setPlaylist(newPlaylist);

    // 如果移除的是当前播放的歌曲，自动播放下一首
    if (index === playerStore.currentIndex) {
      if (newPlaylist.length > 0) {
        // 调整当前索引，确保不超出边界
        const newIndex = Math.min(index, newPlaylist.length - 1);
        playerStore.play(newIndex);
      }
    } else if (index < playerStore.currentIndex) {
      // 如果移除的歌曲在当前歌曲之前，需要调整当前索引
      // 这里只需要设置索引，不需要重新播放
      const newIndex = playerStore.currentIndex - 1;
      // 这里需要直接修改currentIndex，不触发播放
      // 由于我们没有直接访问currentIndex的方法，暂时没有实现
    }
  }

  /**
   * 清空播放列表
   */
  function clearPlaylist() {
    // 停止当前播放
    if (audioRef.value) {
      audioRef.value.pause();
    }

    // 重置播放列表
    playerStore.setPlaylist([]);

    // 重置URL
    currentSongUrl.value = '';
  }

  /**
   * 获取歌曲URL
   * @param id 歌曲ID
   */
  function getSongUrl(id: number): string {
    // 这里简单返回网易云音乐的外链地址
    // 实际应用中应该调用API获取真实地址
    return `https://music.163.com/song/media/outer/url?id=${id}.mp3`;
  }

  // 监听当前歌曲变化
  watch(
    () => playerStore.currentSong,
    (newSong) => {
      if (newSong && newSong.id) {
        // 获取并设置歌曲URL
        currentSongUrl.value = getSongUrl(newSong.id);

        // 加载歌词
        loadLyrics(newSong.id);

        // 检查歌曲是否在喜欢列表中
        // 这里简化处理，实际应用中应该检查真实数据
        isLiked.value = false;
      } else {
        currentSongUrl.value = '';
        lyrics.value = '';
      }
    }
  );

  // 组件挂载完成
  onMounted(() => {
    // 初始化音频元素
    if (audioRef.value) {
      // 设置初始音量
      audioRef.value.volume = playerStore.volume / 100;

      // 如果有当前歌曲且状态为播放中，尝试开始播放
      if (playerStore.currentSong && playerStore.playing) {
        // 设置音频源
        currentSongUrl.value = getSongUrl(playerStore.currentSong.id);

        // 尝试播放
        audioRef.value.play().catch(error => {
          console.error('初始化播放失败:', error);
          if (playerStore.playing) {
            playerStore.togglePlay(); // 切换到暂停状态
          }
        });
      }
    }
  });
  </script>

  <style scoped>
  .animate-slide-in-right {
    animation: slideInRight 0.3s ease-out;
  }

  @keyframes slideInRight {
    from {
      transform: translateX(100%);
    }
    to {
      transform: translateX(0);
    }
  }
  </style>