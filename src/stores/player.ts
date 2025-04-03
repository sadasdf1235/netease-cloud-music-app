/**
 * 播放器状态管理
 * @description 管理音乐播放器的状态、播放列表和播放行为
 */
import { defineStore } from 'pinia'
import type { Song } from '@/types/models/music'
import { STORAGE_KEY, PLAY_MODE } from '@/constants/storage'
import { getSongUrl, getLyric } from '@/api/modules/music-song'

/**
 * 从本地存储中获取值，如果不存在则使用默认值
 * @param key 存储键
 * @param defaultValue 默认值
 * @returns 存储值或默认值
 */
function getStoredValue<T>(key: string, defaultValue: T): T {
  const storedValue = localStorage.getItem(key)
  if (storedValue === null) return defaultValue

  try {
    // 尝试解析JSON
    return JSON.parse(storedValue) as T
  } catch {
    // 如果不是JSON则直接返回
    return storedValue as unknown as T
  }
}

export const usePlayerStore = defineStore('player', {
  state: () => ({
    // 播放状态
    playing: false,
    currentTime: 0,
    duration: 0,
    volume: getStoredValue(STORAGE_KEY.VOLUME, 0.7),
    playMode: getStoredValue(STORAGE_KEY.PLAY_MODE, PLAY_MODE.SEQUENCE),

    // 用于缓存已获取的歌曲URL，避免重复请求
    songUrlCache: new Map<number, string>(),

    // 播放列表
    playlist: [] as Song[],
    currentIndex: -1,

    // 历史记录
    playHistory: getStoredValue<number[]>(STORAGE_KEY.PLAY_HISTORY, []),
  }),

  getters: {
    /**
     * 当前播放歌曲
     */
    currentSong: (state): Song | null => state.playlist[state.currentIndex] || null,

    /**
     * 播放进度百分比
     */
    progress: (state): number => {
      return state.duration > 0 ? (state.currentTime / state.duration) * 100 : 0
    },

    /**
     * 是否为循环播放模式
     */
    loop: (state): boolean => state.playMode === PLAY_MODE.LOOP,

    /**
     * 是否为随机播放模式
     */
    random: (state): boolean => state.playMode === PLAY_MODE.RANDOM
  },

  actions: {
    /**
     * 播放指定索引的歌曲
     * @param index 歌曲在播放列表中的索引
     */
    async play(index: number) {
      if (index < 0 || index >= this.playlist.length) return;
      this.currentIndex = index;
      this.playing = true;

      // 记录播放历史
      const song = this.playlist[index];
      if (song) {
        this.addToPlayHistory(song.id);
      }
    },

    /**
     * 暂停播放
     */
    pause() {
      this.playing = false;
    },

    /**
     * 切换播放状态
     */
    togglePlay() {
      this.playing = !this.playing;
    },

    /**
     * 播放上一首
     */
    prev() {
      if (this.playlist.length === 0) return;

      let index = this.currentIndex - 1;
      if (index < 0) {
        index = this.playlist.length - 1;
      }

      this.play(index);
    },

    /**
     * 播放下一首
     */
    next() {
      if (this.playlist.length === 0) return;

      let index: number;
      if (this.playMode === PLAY_MODE.RANDOM) {
        // 随机播放 - 避免重复播放刚刚的歌曲
        let randomIndex;
        do {
          randomIndex = Math.floor(Math.random() * this.playlist.length);
        } while (randomIndex === this.currentIndex && this.playlist.length > 1);
        index = randomIndex;
      } else if (this.playMode === PLAY_MODE.LOOP) {
        // 单曲循环
        index = this.currentIndex;
      } else {
        // 顺序播放
        index = this.currentIndex + 1;
        if (index >= this.playlist.length) {
          index = 0;
        }
      }

      this.play(index);
    },

    /**
     * 跳转到指定时间
     * @param time 时间(秒)
     */
    seek(time: number) {
      this.currentTime = time;
    },

    /**
     * 设置音量
     * @param volume 音量(0-1)
     */
    setVolume(volume: number) {
      this.volume = volume;
      localStorage.setItem(STORAGE_KEY.VOLUME, volume.toString());
    },

    /**
     * 切换播放模式
     */
    togglePlayMode() {
      // 循环切换: 顺序播放 -> 单曲循环 -> 随机播放 -> 顺序播放
      const modes = [PLAY_MODE.SEQUENCE, PLAY_MODE.LOOP, PLAY_MODE.RANDOM];
      const currentIndex = modes.indexOf(this.playMode);
      const nextIndex = (currentIndex + 1) % modes.length;
      this.setPlayMode(modes[nextIndex]);
    },

    /**
     * 设置播放模式
     * @param mode 播放模式
     */
    setPlayMode(mode: string) {
      this.playMode = mode;
      localStorage.setItem(STORAGE_KEY.PLAY_MODE, mode);
    },

    /**
     * 设置播放列表
     * @param list 歌曲列表
     */
    setPlaylist(list: Song[]) {
      this.playlist = list;
      this.currentIndex = -1;
    },

    /**
     * 添加歌曲到播放列表
     * @param song 要添加的歌曲
     */
    addToPlaylist(song: Song) {
      const index = this.playlist.findIndex(item => item.id === song.id);
      if (index === -1) {
        this.playlist.push(song);
      }
    },

    /**
     * 从播放列表移除歌曲
     * @param song 要移除的歌曲
     */
    removeSong(song: Song) {
      const index = this.playlist.findIndex(item => item.id === song.id);
      if (index > -1) {
        this.playlist.splice(index, 1);
        if (index === this.currentIndex) {
          this.currentIndex = -1;
          this.playing = false;
        } else if (index < this.currentIndex) {
          this.currentIndex--;
        }
      }
    },

    /**
     * 清空播放列表
     */
    clearPlaylist() {
      this.playlist = [];
      this.currentIndex = -1;
      this.playing = false;
    },

    /**
     * 添加歌曲ID到播放历史
     * @param songId 歌曲ID
     */
    addToPlayHistory(songId: number) {
      // 移除现有的相同ID
      const index = this.playHistory.indexOf(songId);
      if (index !== -1) {
        this.playHistory.splice(index, 1);
      }

      // 添加到历史的头部
      this.playHistory.unshift(songId);

      // 限制历史记录最多保存100首
      if (this.playHistory.length > 100) {
        this.playHistory.pop();
      }

      // 保存到本地存储
      localStorage.setItem(STORAGE_KEY.PLAY_HISTORY, JSON.stringify(this.playHistory));
    },

    /**
     * 获取歌曲URL（带缓存）
     * @param songId 歌曲ID
     * @returns 歌曲URL
     */
    async getSongUrlWithCache(songId: number): Promise<string> {
      // 检查缓存
      if (this.songUrlCache.has(songId)) {
        return this.songUrlCache.get(songId) as string;
      }

      // 请求新URL
      try {
        const res = await getSongUrl(songId);
        if (res && res.data && res.data.length > 0) {
          const url = res.data[0].url;
          if (url) {
            // 缓存结果
            this.songUrlCache.set(songId, url);
            return url;
          }
        }
        return '';
      } catch (error) {
        console.error('获取歌曲URL失败:', error);
        return '';
      }
    }
  },
})
