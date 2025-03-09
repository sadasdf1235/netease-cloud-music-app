/**
 * 音乐播放器Hook
 * @description 提供音乐播放器操作的封装，管理音频播放状态
 */
import { ref, computed, watch, onMounted, onUnmounted } from 'vue';
import { storeToRefs } from 'pinia';
import { usePlayerStore } from '@/stores/player';
import { getSongUrl, getSongDetail, getLyric } from '@/api/modules/music';
import { formatTime } from '@/utils/format';
import type { Song } from '@/types';

/**
 * 音乐播放器Hook
 * @returns 包含播放器状态和操作方法的对象
 */
export function usePlayer() {
  // 获取播放器状态管理
  const playerStore = usePlayerStore();
  const {
    currentSong,
    playing,
    currentTime,
    duration,
    volume,
    playlist,
    currentIndex,
    loop,
    random
  } = storeToRefs(playerStore);

  // 音频元素引用
  const audioRef = ref<HTMLAudioElement | null>(null);
  // 歌词
  const lyric = ref<string>('');
  // 歌曲URL
  const songUrl = ref<string>('');
  // 加载状态
  const loading = ref<boolean>(false);
  // 错误状态
  const error = ref<boolean>(false);
  // 错误信息
  const errorMessage = ref<string>('');

  /**
   * 格式化后的当前播放时间
   */
  const formattedCurrentTime = computed(() => {
    return formatTime(currentTime.value);
  });

  /**
   * 格式化后的总时长
   */
  const formattedDuration = computed(() => {
    return formatTime(duration.value);
  });

  /**
   * 初始化音频元素
   */
  const initAudio = () => {
    if (!audioRef.value) return;

    // 音量设置
    audioRef.value.volume = volume.value / 100;

    // 事件监听
    audioRef.value.addEventListener('timeupdate', onTimeUpdate);
    audioRef.value.addEventListener('ended', onEnded);
    audioRef.value.addEventListener('canplay', onCanPlay);
    audioRef.value.addEventListener('error', onError);
  };

  /**
   * 加载歌曲
   * @param id 歌曲ID
   */
  const loadSong = async (id: number) => {
    if (!id) return;

    try {
      loading.value = true;
      error.value = false;

      // 获取歌曲URL
      const urlRes = await getSongUrl(id);
      if (urlRes.code === 200 && urlRes.data?.length > 0) {
        songUrl.value = urlRes.data[0].url;

        if (!songUrl.value) {
          throw new Error('无法获取歌曲播放链接');
        }
      } else {
        throw new Error('获取歌曲URL失败');
      }

      // 获取歌词
      const lyricRes = await getLyric(id);
      if (lyricRes.code === 200) {
        lyric.value = lyricRes.lrc?.lyric || '';
      }

      loading.value = false;
    } catch (err) {
      loading.value = false;
      error.value = true;
      errorMessage.value = err instanceof Error ? err.message : '加载歌曲失败';
      console.error('加载歌曲失败:', err);
    }
  };

  /**
   * 播放
   */
  const play = () => {
    if (!audioRef.value || !songUrl.value) return;

    audioRef.value.play().then(() => {
      playerStore.togglePlay();
    }).catch(err => {
      console.error('播放失败:', err);
      error.value = true;
      errorMessage.value = '播放失败，请稍后再试';
    });
  };

  /**
   * 暂停
   */
  const pause = () => {
    if (!audioRef.value) return;

    audioRef.value.pause();
    playerStore.togglePlay();
  };

  /**
   * 切换播放/暂停状态
   */
  const togglePlay = () => {
    if (playing.value) {
      pause();
    } else {
      play();
    }
  };

  /**
   * 播放上一首
   */
  const prevSong = () => {
    playerStore.prev();
  };

  /**
   * 播放下一首
   */
  const nextSong = () => {
    playerStore.next();
  };

  /**
   * 设置音量
   * @param val 音量值(0-100)
   */
  const setVolume = (val: number) => {
    if (!audioRef.value) return;

    playerStore.setVolume(val);
    audioRef.value.volume = val / 100;
  };

  /**
   * 设置播放进度
   * @param value 进度值(0-100)
   */
  const setProgress = (value: number) => {
    if (!audioRef.value || !duration.value) return;

    const time = (value / 100) * duration.value;
    audioRef.value.currentTime = time;
    playerStore.updateCurrentTime(time);
    playerStore.setProgress(value);
  };

  /**
   * 切换循环播放状态
   */
  const toggleLoop = () => {
    playerStore.toggleLoop();
  };

  /**
   * 切换随机播放状态
   */
  const toggleRandom = () => {
    playerStore.toggleRandom();
  };

  /**
   * 时间更新事件处理
   */
  const onTimeUpdate = () => {
    if (!audioRef.value) return;

    const time = audioRef.value.currentTime;
    playerStore.updateCurrentTime(time);

    if (duration.value > 0) {
      const progress = (time / duration.value) * 100;
      playerStore.setProgress(progress);
    }
  };

  /**
   * 播放结束事件处理
   */
  const onEnded = () => {
    if (loop.value) {
      // 单曲循环
      if (audioRef.value) {
        audioRef.value.currentTime = 0;
        audioRef.value.play();
      }
    } else {
      // 播放下一首
      nextSong();
    }
  };

  /**
   * 可以播放事件处理
   */
  const onCanPlay = () => {
    if (!audioRef.value) return;

    playerStore.updateDuration(audioRef.value.duration);

    if (playing.value) {
      audioRef.value.play().catch(err => {
        console.error('自动播放失败:', err);
      });
    }
  };

  /**
   * 错误事件处理
   */
  const onError = (e: Event) => {
    console.error('音频播放错误:', e);
    error.value = true;
    errorMessage.value = '音频播放错误，请稍后再试';
  };

  // 监听当前歌曲变化
  watch(currentSong, (newSong) => {
    if (newSong?.id) {
      loadSong(newSong.id);
    }
  }, { immediate: true });

  // 监听播放状态变化
  watch(playing, (isPlaying) => {
    if (!audioRef.value) return;

    if (isPlaying) {
      audioRef.value.play().catch(err => {
        console.error('播放状态监听错误:', err);
      });
    } else {
      audioRef.value.pause();
    }
  });

  // 组件挂载时
  onMounted(() => {
    audioRef.value = new Audio();
    initAudio();
  });

  // 组件卸载时
  onUnmounted(() => {
    if (audioRef.value) {
      audioRef.value.removeEventListener('timeupdate', onTimeUpdate);
      audioRef.value.removeEventListener('ended', onEnded);
      audioRef.value.removeEventListener('canplay', onCanPlay);
      audioRef.value.removeEventListener('error', onError);
      audioRef.value.pause();
      audioRef.value = null;
    }
  });

  return {
    // 状态
    currentSong,
    playing,
    currentTime,
    duration,
    volume,
    playlist,
    currentIndex,
    loop,
    random,
    audioRef,
    lyric,
    songUrl,
    loading,
    error,
    errorMessage,
    formattedCurrentTime,
    formattedDuration,

    // 方法
    play,
    pause,
    togglePlay,
    prevSong,
    nextSong,
    setVolume,
    setProgress,
    toggleLoop,
    toggleRandom,
    loadSong
  };
}

export default usePlayer;