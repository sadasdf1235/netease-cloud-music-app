import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Song } from '@/types/song'
import { STORAGE_KEY, PLAY_MODE } from '@/constants/storage'
import { getSongUrl, getLyric } from '@/api/song'

export const usePlayerStore = defineStore('player', {
  state: () => ({
    // 播放状态
    playing: false,
    currentTime: 0,
    duration: 0,
    volume: Number(localStorage.getItem(STORAGE_KEY.VOLUME)) || 0.7,
    playMode: localStorage.getItem(STORAGE_KEY.PLAY_MODE) || PLAY_MODE.SEQUENCE,

    // 播放列表
    playlist: [] as Song[],
    currentIndex: -1,
  }),

  getters: {
    currentSong: (state): Song | null => state.playlist[state.currentIndex] || null,
  },

  actions: {
    // 播放指定索引的歌曲
    async play(index: number) {
      if (index < 0 || index >= this.playlist.length) return;
      this.currentIndex = index;
      this.playing = true;
    },

    // 暂停播放
    pause() {
      this.playing = false;
    },

    // 切换播放状态
    togglePlay() {
      this.playing = !this.playing;
    },

    // 上一首
    prev() {
      if (this.playlist.length === 0) return;

      let index = this.currentIndex - 1;
      if (index < 0) {
        index = this.playlist.length - 1;
      }

      this.play(index);
    },

    // 下一首
    next() {
      if (this.playlist.length === 0) return;

      let index: number;
      if (this.playMode === PLAY_MODE.RANDOM) {
        // 随机播放
        index = Math.floor(Math.random() * this.playlist.length);
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

    // 跳转到指定时间
    seek(time: number) {
      this.currentTime = time;
    },

    // 设置音量
    setVolume(volume: number) {
      this.volume = volume;
      localStorage.setItem(STORAGE_KEY.VOLUME, volume.toString());
    },

    // 设置播放模式
    setPlayMode(mode: string) {
      this.playMode = mode;
      localStorage.setItem(STORAGE_KEY.PLAY_MODE, mode);
    },

    // 设置播放列表
    setPlaylist(list: Song[]) {
      this.playlist = list;
      this.currentIndex = -1;
    },

    // 添加歌曲到播放列表
    addToPlaylist(song: Song) {
      const index = this.playlist.findIndex(item => item.id === song.id);
      if (index === -1) {
        this.playlist.push(song);
      }
    },

    // 从播放列表移除歌曲
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

    // 清空播放列表
    clearPlaylist() {
      this.playlist = [];
      this.currentIndex = -1;
      this.playing = false;
    },
  },
})
