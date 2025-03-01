import { defineStore } from 'pinia'

export interface Song {
  id: number
  name: string
  artists: Array<{ id: number, name: string }>
  album: { id: number, name: string, picUrl: string }
  duration: number
  url?: string
}

export const usePlayerStore = defineStore('player', () => {
  // 当前播放列表
  const playlist = ref<Song[]>([])
  // 当前播放歌曲索引
  const currentIndex = ref(-1)
  // 当前播放歌曲
  const currentSong = computed(() => playlist.value[currentIndex.value] || null)
  // 播放状态
  const playing = ref(false)
  // 播放模式：0-顺序播放，1-单曲循环，2-随机播放
  const playMode = ref(0)
  // 音量
  const volume = ref(60)
  
  // 设置播放列表
  function setPlaylist(list: Song[]) {
    playlist.value = list
  }
  
  // 添加歌曲到播放列表
  function addToPlaylist(song: Song) {
    // 检查是否已存在
    const index = playlist.value.findIndex(item => item.id === song.id)
    if (index === -1) {
      playlist.value.push(song)
    }
  }
  
  // 播放指定索引的歌曲
  function play(index: number) {
    if (index >= 0 && index < playlist.value.length) {
      currentIndex.value = index
      playing.value = true
    }
  }
  
  // 播放/暂停切换
  function togglePlay() {
    playing.value = !playing.value
  }
  
  // 下一首
  function next() {
    if (playlist.value.length === 0) return
    
    if (playMode.value === 2) {
      // 随机播放
      let randomIndex = Math.floor(Math.random() * playlist.value.length)
      // 避免随机到当前歌曲
      while (randomIndex === currentIndex.value && playlist.value.length > 1) {
        randomIndex = Math.floor(Math.random() * playlist.value.length)
      }
      currentIndex.value = randomIndex
    } else {
      // 顺序播放
      currentIndex.value = (currentIndex.value + 1) % playlist.value.length
    }
    
    playing.value = true
  }
  
  // 上一首
  function prev() {
    if (playlist.value.length === 0) return
    
    if (playMode.value === 2) {
      // 随机播放
      let randomIndex = Math.floor(Math.random() * playlist.value.length)
      // 避免随机到当前歌曲
      while (randomIndex === currentIndex.value && playlist.value.length > 1) {
        randomIndex = Math.floor(Math.random() * playlist.value.length)
      }
      currentIndex.value = randomIndex
    } else {
      // 顺序播放
      currentIndex.value = (currentIndex.value - 1 + playlist.value.length) % playlist.value.length
    }
    
    playing.value = true
  }
  
  // 切换播放模式
  function changePlayMode() {
    playMode.value = (playMode.value + 1) % 3
  }
  
  // 设置音量
  function setVolume(val: number) {
    volume.value = val
  }
  
  return {
    playlist,
    currentIndex,
    currentSong,
    playing,
    playMode,
    volume,
    setPlaylist,
    addToPlaylist,
    play,
    togglePlay,
    next,
    prev,
    changePlayMode,
    setVolume
  }
})