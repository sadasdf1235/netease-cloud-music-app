/**
 * 音乐播放器Hook
 * @description 提供音乐播放器操作的封装，管理音频播放状态
 */
import { ref, computed, watch, onMounted, onUnmounted, type Ref } from 'vue';
import { storeToRefs } from 'pinia';
import { usePlayerStore } from '@/stores/player';
import { getSongUrl, getSongDetail, getLyric } from '@/api/modules/music-song';
import { formatTime } from '@/utils/format';
import type { Song } from '@/types/models/song';
import type { PlayerHookResult } from '@/types/components';
import type { SongUrlResponse } from '@/types/api/music';

/**
 * 音乐播放器Hook
 * @returns 播放器控制相关的状态和方法
 */
export function usePlayer(): PlayerHookResult {
  // 播放器Store
  const playerStore = usePlayerStore();
  const { currentSongIndex, playlist, playing: storeIsPlaying } = storeToRefs(playerStore);

  // 音频元素引用
  const audioRef: Ref<HTMLAudioElement | null> = ref(null);
  // 当前歌曲信息
  const currentSong: Ref<Song | null> = ref(null);
  // 播放状态
  const playing = computed(() => storeIsPlaying.value);
  // 是否静音
  const muted = ref(false);
  // 音量(0-100)
  const volume = ref(60);
  // 加载状态
  const loading = ref(false);
  // 错误状态
  const error = ref(false);
  // 错误信息
  const errorMessage = ref('');
  // 当前播放时间(秒)
  const currentTime = ref(0);
  // 歌曲总时长(秒)
  const duration = ref(0);
  // 播放进度(0-100)
  const progress = computed(() => {
    if (duration.value <= 0) return 0;
    return Math.min(100, (currentTime.value * 100) / duration.value);
  });

  // 循环模式(0:列表循环,1:单曲循环,2:随机播放)
  const loopMode = ref(0);
  // 是否随机播放
  const random = ref(false);
  // 歌词
  const lyric = ref('');

  /**
   * 初始化音频元素
   */
  const initAudio = () => {
    if (!audioRef.value) {
      audioRef.value = new Audio();
      audioRef.value.volume = volume.value / 100;

      // 添加事件监听
      audioRef.value.addEventListener('timeupdate', onTimeUpdate);
      audioRef.value.addEventListener('ended', onEnded);
      audioRef.value.addEventListener('canplay', onCanPlay);
      audioRef.value.addEventListener('error', onError);
    }
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
      errorMessage.value = '';

      // 如果有正在播放的歌曲，先暂停
      if (audioRef.value && !audioRef.value.paused) {
        audioRef.value.pause();
      }

      // 获取歌曲URL
      const urlRes = await getSongUrl(id);
      if (urlRes && urlRes.code === 200 && urlRes.data?.[0]?.url) {
        if (audioRef.value) {
          audioRef.value.src = urlRes.data[0].url;
        }
      } else {
        error.value = true;
        errorMessage.value = '获取歌曲链接失败';
        loading.value = false;
        return;
      }

      // 获取歌曲详情
      const detailRes = await getSongDetail(id);
      if (detailRes && detailRes.code === 200 && detailRes.songs?.[0]) {
        currentSong.value = detailRes.songs[0];
      }

      // 获取歌词
      const lyricRes = await getLyric(id);
      if (lyricRes && lyricRes.code === 200) {
        lyric.value = lyricRes.lrc?.lyric || '';
      }

      loading.value = false;
    } catch (err: unknown) {
      console.error('加载歌曲失败:', err);
      error.value = true;
      errorMessage.value = '加载歌曲失败，请稍后再试';
      loading.value = false;
    }
  };

  /**
   * 播放
   */
  const play = () => {
    if (loading.value) return;

    if (!audioRef.value || !audioRef.value.src) {
      if (playlist.value.length > 0 && currentSongIndex.value >= 0) {
        loadSong(playlist.value[currentSongIndex.value].id);
      }
      return;
    }

    audioRef.value.play().then(() => {
      playerStore.togglePlay();
    }).catch((err: unknown) => {
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
   * 切换播放状态
   */
  const togglePlay = () => {
    if (!audioRef.value) return;
    if (audioRef.value.paused) {
      play();
    } else {
      pause();
    }
  };

  /**
   * 上一首
   */
  const prevSong = () => {
    playerStore.prev();
  };

  /**
   * 下一首
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
    volume.value = val;
    audioRef.value.volume = val / 100;
    if (val > 0 && muted.value) {
      muted.value = false;
      audioRef.value.muted = false;
    }
  };

  /**
   * 设置播放进度
   * @param value 进度百分比(0-100)
   */
  const setProgress = (value: number) => {
    if (!audioRef.value || duration.value <= 0) return;
    const targetTime = (value * duration.value) / 100;
    audioRef.value.currentTime = targetTime;
    currentTime.value = targetTime;
  };

  /**
   * 切换循环模式
   */
  const toggleLoop = () => {
    loopMode.value = (loopMode.value + 1) % 3;
    playerStore.setLoopMode(loopMode.value);
  };

  /**
   * 切换随机播放
   */
  const toggleRandom = () => {
    random.value = !random.value;
    playerStore.setRandom(random.value);
  };

  /**
   * 监听播放进度变化
   */
  const onTimeUpdate = () => {
    if (!audioRef.value) return;
    currentTime.value = audioRef.value.currentTime;
    // 可以在这里添加歌词同步等功能
  };

  /**
   * 监听播放结束
   */
  const onEnded = () => {
    // 根据循环模式决定下一步操作
    if (loopMode.value === 1) {
      // 单曲循环
      if (audioRef.value) {
        audioRef.value.currentTime = 0;
        audioRef.value.play().catch((err: unknown) => {
          console.error('重新播放失败:', err);
        });
      }
    } else {
      // 列表循环或随机播放
      nextSong();
    }
  };

  /**
   * 监听可以播放事件
   */
  const onCanPlay = () => {
    if (!audioRef.value) return;
    duration.value = audioRef.value.duration;

    if (playing.value) {
      audioRef.value.play().catch((err: unknown) => {
        console.error('自动播放失败:', err);
      });
    }
  };

  /**
   * 监听错误事件
   */
  const onError = (e: Event) => {
    console.error('播放器错误:', e);
    error.value = true;
    errorMessage.value = '播放出错，请稍后再试';
    loading.value = false;
  };

  // 监听当前歌曲变化
  watch(currentSongIndex, (newIndex: number) => {
    if (newIndex >= 0 && newIndex < playlist.value.length) {
      const newSong = playlist.value[newIndex];
      if (newSong?.id) {
        loadSong(newSong.id);
      }
    }
  });

  // 监听播放状态变化
  watch(storeIsPlaying, (isPlaying: boolean) => {
    if (!audioRef.value) return;

    if (isPlaying) {
      audioRef.value.play().catch((err: unknown) => {
        console.error('播放状态监听错误:', err);
      });
    } else {
      audioRef.value.pause();
    }
  });

  // 组件挂载时初始化音频元素
  onMounted(() => {
    initAudio();
    // 加载当前歌曲
    if (playlist.value.length > 0 && currentSongIndex.value >= 0) {
      loadSong(playlist.value[currentSongIndex.value].id);
    }
  });

  // 组件卸载时清理资源
  onUnmounted(() => {
    if (audioRef.value) {
      audioRef.value.pause();
      audioRef.value.removeEventListener('timeupdate', onTimeUpdate);
      audioRef.value.removeEventListener('ended', onEnded);
      audioRef.value.removeEventListener('canplay', onCanPlay);
      audioRef.value.removeEventListener('error', onError);
      audioRef.value = null;
    }
  });

  return {
    currentSong,
    playing,
    progress,
    currentTime,
    duration,
    volume,
    random,
    loopMode,
    lyric,
    loading,
    error,
    errorMessage,
    playlist: playlist.value,
    play,
    pause,
    togglePlay,
    prevSong,
    nextSong,
    setVolume,
    setProgress,
    toggleLoop,
    toggleRandom
  };
}

export default usePlayer;