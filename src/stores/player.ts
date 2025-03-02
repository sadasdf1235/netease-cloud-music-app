import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const usePlayerStore = defineStore('player', () => {
  // 播放列表
  const playlist = ref<any[]>([])
  // 当前播放索引
  const currentIndex = ref(-1)
  // 播放状态
  const playing = ref(false)
  // 音量
  const volume = ref(60)
  // 当前播放时间（秒）
  const currentTime = ref(0)
  // 总时长（秒）
  const duration = ref(0)
  // 播放进度（百分比）
  const progress = ref(0)
  // 是否循环播放
  const loop = ref(false)
  // 是否随机播放
  const random = ref(false)

  // 当前歌曲
  const currentSong = computed(() => {
    if (playlist.value.length > 0 && currentIndex.value >= 0 && currentIndex.value < playlist.value.length) {
      console.log('当前歌曲索引:', currentIndex.value);
      console.log('当前歌曲:', playlist.value[currentIndex.value]);
      return playlist.value[currentIndex.value]
    }
    return null
  })

  // 设置播放列表
  function setPlaylist(list: any[]) {
    console.log('设置播放列表, 长度:', list.length, '第一首歌:', list[0]?.name);
    playlist.value = list
  }

  // 播放指定索引的歌曲
  function play(index: number) {
    console.log('播放索引:', index);
    if (index >= 0 && index < playlist.value.length) {
      currentIndex.value = index
      playing.value = true
      console.log('已设置当前索引:', currentIndex.value);
      console.log('当前播放状态:', playing.value ? '播放' : '暂停');
      console.log('当前歌曲:', playlist.value[currentIndex.value]?.name);
    } else {
      console.error('无效的播放索引:', index, '播放列表长度:', playlist.value.length);
    }
  }

  // 切换播放状态
  function togglePlay() {
    playing.value = !playing.value;
    console.log("播放状态已切换, 当前为:", playing.value ? "播放" : "暂停");
  }

  // 上一首
  function prev() {
    if (playlist.value.length === 0) return
    
    let newIndex = currentIndex.value - 1
    if (newIndex < 0) {
      newIndex = playlist.value.length - 1
    }
    
    currentIndex.value = newIndex
    console.log('播放上一首, 新索引:', currentIndex.value);
    
    // 如果当前是播放状态，确保继续播放
    if (playing.value) {
      playing.value = true
    }
  }

  // 下一首
  function next() {
    if (playlist.value.length === 0) return
    
    let newIndex = currentIndex.value + 1
    if (newIndex >= playlist.value.length) {
      newIndex = 0
    }
    
    currentIndex.value = newIndex
    console.log('播放下一首, 新索引:', currentIndex.value);
    
    // 如果当前是播放状态，确保继续播放
    if (playing.value) {
      playing.value = true
    }
  }

  // 设置音量
  function setVolume(val: number) {
    volume.value = val
  }

  // 更新当前播放时间
  function updateCurrentTime(time: number) {
    currentTime.value = time;
  }

  // 更新总时长
  function updateDuration(value: number) {
    duration.value = value;
    console.log("音频总时长已更新:", value);
  }

  // 设置进度
  function setProgress(value: number) {
    progress.value = value;
  }

  // 切换循环播放
  function toggleLoop() {
    loop.value = !loop.value
    // 如果开启循环，关闭随机
    if (loop.value) {
      random.value = false
    }
  }

  // 切换随机播放
  function toggleRandom() {
    random.value = !random.value
    // 如果开启随机，关闭循环
    if (random.value) {
      loop.value = false
    }
  }

  return {
    playlist,
    currentIndex,
    playing,
    volume,
    currentTime,
    duration,
    progress,
    loop,
    random,
    currentSong,
    setPlaylist,
    play,
    togglePlay,
    prev,
    next,
    setVolume,
    updateCurrentTime,
    updateDuration,
    setProgress,
    toggleLoop,
    toggleRandom
  }
})
