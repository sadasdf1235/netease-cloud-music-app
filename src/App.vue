<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watch } from 'vue'

type ViewKey = 'discover' | 'charts' | 'library'
type MoodKey = '全部' | '通勤' | '夜晚' | '专注' | '派对'
type PlayMode = 'sequence' | 'repeat' | 'shuffle'

interface Artist {
  id: number
  name: string
  avatar: string
  role: string
  listeners: string
}

interface Track {
  id: number
  title: string
  artist: string
  album: string
  cover: string
  duration: number
  audioUrl: string
  mood: MoodKey[]
  energy: number
  plays: number
  explicit?: boolean
}

interface Playlist {
  id: number
  title: string
  subtitle: string
  cover: string
  tag: string
  color: string
  tracks: Track[]
}

interface Chart {
  id: number
  title: string
  description: string
  accent: string
  tracks: Track[]
}

interface LyricLine {
  time: number
  text: string
}

interface StoredPlayerState {
  currentTrackId?: number
  likedIds?: number[]
  playMode?: PlayMode
  queueIds?: number[]
  volume?: number
}

const navItems: Array<{ key: ViewKey; label: string; icon: string }> = [
  { key: 'discover', label: '发现', icon: 'i-carbon-music' },
  { key: 'charts', label: '榜单', icon: 'i-carbon-chart-line' },
  { key: 'library', label: '音乐库', icon: 'i-carbon-folder' },
]

const moods: MoodKey[] = ['全部', '通勤', '夜晚', '专注', '派对']

const artists: Artist[] = [
  {
    id: 1,
    name: 'Luna Harbour',
    role: '城市氛围 / Synth Pop',
    listeners: '248 万月听众',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=220&q=80',
  },
  {
    id: 2,
    name: 'Morning Tape',
    role: 'Indie Rock / Live Session',
    listeners: '98 万月听众',
    avatar: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=220&q=80',
  },
  {
    id: 3,
    name: 'NOVA 11',
    role: '电子 / Future Garage',
    listeners: '167 万月听众',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=220&q=80',
  },
  {
    id: 4,
    name: '山海电台',
    role: '华语民谣 / 城市叙事',
    listeners: '312 万月听众',
    avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=220&q=80',
  },
]

const tracks: Track[] = [
  {
    id: 101,
    title: 'Crimson Avenue',
    artist: 'Luna Harbour',
    album: 'Neon Weather',
    cover: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=420&q=80',
    duration: 324,
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    mood: ['通勤', '派对'],
    energy: 86,
    plays: 2380000,
  },
  {
    id: 102,
    title: 'Late Train Home',
    artist: 'Morning Tape',
    album: 'Room With A Signal',
    cover: 'https://images.unsplash.com/photo-1493246507139-91e8fad9978e?auto=format&fit=crop&w=420&q=80',
    duration: 283,
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    mood: ['夜晚', '通勤'],
    energy: 64,
    plays: 1160000,
  },
  {
    id: 103,
    title: 'Silk Circuit',
    artist: 'NOVA 11',
    album: 'Soft Machine Hearts',
    cover: 'https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=420&q=80',
    duration: 351,
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    mood: ['专注', '夜晚'],
    energy: 72,
    plays: 1950000,
  },
  {
    id: 104,
    title: '雾中的码头',
    artist: '山海电台',
    album: '晚风档案',
    cover: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=420&q=80',
    duration: 267,
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
    mood: ['夜晚', '专注'],
    energy: 48,
    plays: 3290000,
  },
  {
    id: 105,
    title: 'Window Seat',
    artist: 'Luna Harbour',
    album: 'Neon Weather',
    cover: 'https://images.unsplash.com/photo-1487014679447-9f8336841d58?auto=format&fit=crop&w=420&q=80',
    duration: 299,
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
    mood: ['通勤', '专注'],
    energy: 78,
    plays: 1420000,
  },
  {
    id: 106,
    title: 'Glass Floor',
    artist: 'NOVA 11',
    album: 'Soft Machine Hearts',
    cover: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=420&q=80',
    duration: 312,
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3',
    mood: ['派对'],
    energy: 93,
    plays: 4080000,
    explicit: true,
  },
  {
    id: 107,
    title: 'Blue Hour Notes',
    artist: 'Morning Tape',
    album: 'Room With A Signal',
    cover: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=420&q=80',
    duration: 242,
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3',
    mood: ['专注', '夜晚'],
    energy: 56,
    plays: 920000,
  },
  {
    id: 108,
    title: '热带低压',
    artist: '山海电台',
    album: '晚风档案',
    cover: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=420&q=80',
    duration: 276,
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3',
    mood: ['通勤', '派对'],
    energy: 81,
    plays: 2210000,
  },
]

const playlists: Playlist[] = [
  {
    id: 201,
    title: '今日私享雷达',
    subtitle: '按你的最近偏好混合城市流行、电子和华语叙事。',
    cover: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=520&q=80',
    tag: '每日更新',
    color: '#b3261e',
    tracks: [tracks[0], tracks[2], tracks[4], tracks[6]],
  },
  {
    id: 202,
    title: '深夜低光播放',
    subtitle: '适合写作、整理思绪和凌晨回家的柔软曲线。',
    cover: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=520&q=80',
    tag: '夜晚',
    color: '#246a73',
    tracks: [tracks[1], tracks[3], tracks[6], tracks[2]],
  },
  {
    id: 203,
    title: '高能通勤舱',
    subtitle: '节拍更靠前，帮你把早高峰调成可控模式。',
    cover: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=520&q=80',
    tag: '通勤',
    color: '#d99224',
    tracks: [tracks[5], tracks[7], tracks[0], tracks[4]],
  },
]

const charts: Chart[] = [
  {
    id: 301,
    title: '云端热歌榜',
    description: '过去 24 小时站内增长最快的歌曲。',
    accent: '#b3261e',
    tracks: [tracks[5], tracks[3], tracks[0], tracks[7], tracks[2]],
  },
  {
    id: 302,
    title: '独立新声榜',
    description: '编辑部持续追踪的新专和现场录音。',
    accent: '#246a73',
    tracks: [tracks[1], tracks[6], tracks[4], tracks[3], tracks[0]],
  },
  {
    id: 303,
    title: '效率专注榜',
    description: '更适合长时间沉浸的低干扰作品。',
    accent: '#7b4f9d',
    tracks: [tracks[2], tracks[6], tracks[4], tracks[1], tracks[3]],
  },
]

const lyricLines: LyricLine[] = [
  { time: 0, text: '把城市的噪声压低一点' },
  { time: 18, text: '让节拍从玻璃窗外慢慢靠近' },
  { time: 42, text: '今天的心情被整理成一条播放队列' },
  { time: 68, text: '下一首歌，刚好接住此刻的你' },
]

const playerStorageKey = 'netease-cloud-music-app:player-state'
const defaultLikedIds = [101, 103, 104]
const defaultQueue = [...playlists[0].tracks]
const trackMap = new Map(tracks.map((track) => [track.id, track]))

/**
 * 判断本地存储是否可用。
 * @returns 当前运行环境是否能访问 localStorage
 */
function canUseStorage() {
  return typeof window !== 'undefined' && Boolean(window.localStorage)
}

/**
 * 从本地存储读取播放器状态。
 * @returns 解析后的播放器状态
 */
function readStoredPlayerState(): StoredPlayerState {
  if (!canUseStorage()) return {}

  try {
    const rawState = window.localStorage.getItem(playerStorageKey)
    if (!rawState) return {}
    return JSON.parse(rawState) as StoredPlayerState
  } catch {
    return {}
  }
}

/**
 * 将歌曲 id 列表还原为有效歌曲列表。
 * @param ids 待还原的歌曲 id 列表
 * @returns 去重后的歌曲列表
 */
function restoreTracksByIds(ids?: number[]) {
  if (!ids?.length) return []

  const uniqueIds = [...new Set(ids)]
  return uniqueIds
    .map((id) => trackMap.get(id))
    .filter((track): track is Track => Boolean(track))
}

/**
 * 从缓存状态恢复播放队列。
 * @param state 缓存状态
 * @returns 可用的播放队列
 */
function restoreQueue(state: StoredPlayerState) {
  const storedQueue = restoreTracksByIds(state.queueIds)
  return storedQueue.length ? storedQueue : defaultQueue
}

/**
 * 从缓存状态恢复当前歌曲。
 * @param state 缓存状态
 * @param restoredQueue 已恢复的播放队列
 * @returns 当前播放歌曲
 */
function restoreCurrentTrack(state: StoredPlayerState, restoredQueue: Track[]) {
  const storedTrack = state.currentTrackId ? trackMap.get(state.currentTrackId) : undefined
  return storedTrack || restoredQueue[0] || tracks[0]
}

/**
 * 从缓存状态恢复收藏歌曲。
 * @param state 缓存状态
 * @returns 收藏歌曲 id 集合
 */
function restoreLikedIds(state: StoredPlayerState) {
  if (!state.likedIds) return [...defaultLikedIds]

  const storedLikedIds = restoreTracksByIds(state.likedIds).map((track) => track.id)
  return storedLikedIds
}

/**
 * 从缓存状态恢复音量。
 * @param state 缓存状态
 * @returns 0 到 100 之间的音量
 */
function restoreVolume(state: StoredPlayerState) {
  if (typeof state.volume !== 'number') return 78
  return Math.min(100, Math.max(0, state.volume))
}

/**
 * 从缓存状态恢复播放模式。
 * @param state 缓存状态
 * @returns 可用的播放模式
 */
function restorePlayMode(state: StoredPlayerState): PlayMode {
  if (state.playMode === 'repeat' || state.playMode === 'shuffle') return state.playMode
  return 'sequence'
}

const storedPlayerState = readStoredPlayerState()
const initialQueue = restoreQueue(storedPlayerState)
const audioRef = ref<HTMLAudioElement | null>(null)
const activeView = ref<ViewKey>('discover')
const activeMood = ref<MoodKey>('全部')
const searchKeyword = ref('')
const isSearchFocused = ref(false)
let searchBlurTimer: number | undefined
const isPlaying = ref(false)
const currentTime = ref(0)
const currentTrack = ref<Track>(restoreCurrentTrack(storedPlayerState, initialQueue))
const duration = ref(currentTrack.value.duration)
const volume = ref(restoreVolume(storedPlayerState))
const queue = ref<Track[]>(initialQueue)
const likedIds = ref<Set<number>>(new Set(restoreLikedIds(storedPlayerState)))
const playMode = ref<PlayMode>(restorePlayMode(storedPlayerState))
const isQueueOpen = ref(false)
const isLyricOpen = ref(false)
const toastMessage = ref('')

const filteredTracks = computed(() => {
  const keyword = searchKeyword.value.trim().toLowerCase()

  if (keyword) {
    return tracks.filter((track) => {
      return [track.title, track.artist, track.album].some((field) => field.toLowerCase().includes(keyword))
    })
  }

  const moodTracks = activeMood.value === '全部'
    ? tracks
    : tracks.filter((track) => track.mood.includes(activeMood.value))

  return moodTracks
})

const searchSuggestions = computed(() => {
  const keyword = searchKeyword.value.trim().toLowerCase()
  if (!keyword) return []

  return tracks
    .filter((track) => `${track.title} ${track.artist} ${track.album}`.toLowerCase().includes(keyword))
    .slice(0, 4)
})

const queueIndex = computed(() => queue.value.findIndex((track) => track.id === currentTrack.value.id))

const likedTracks = computed(() => tracks.filter((track) => likedIds.value.has(track.id)))

const hasEmptySearchResult = computed(() => {
  return searchKeyword.value.trim().length > 0 && filteredTracks.value.length === 0
})

const hasVisibleSearchSuggestions = computed(() => {
  return isSearchFocused.value && searchSuggestions.value.length > 0
})

const trackPanelTitle = computed(() => {
  return searchKeyword.value.trim() ? '全站搜索结果' : '今日推荐歌曲'
})

const trackPanelSummary = computed(() => {
  const keyword = searchKeyword.value.trim()
  if (keyword) return `${filteredTracks.value.length} 首匹配「${keyword}」`
  return `${filteredTracks.value.length} 首匹配`
})

const heroStyle = computed(() => {
  return {
    backgroundImage: `linear-gradient(90deg, rgb(21 16 12 / 92%) 0%, rgb(21 16 12 / 64%) 46%, rgb(21 16 12 / 8%) 100%), url(${currentTrack.value.cover})`,
  }
})

const activeLyric = computed(() => {
  return lyricLines.reduce((current, line) => {
    return currentTime.value >= line.time ? line : current
  }, lyricLines[0])
})

const playModeMeta = computed(() => {
  if (playMode.value === 'repeat') {
    return { icon: 'i-carbon-repeat-one', label: '单曲循环' }
  }

  if (playMode.value === 'shuffle') {
    return { icon: 'i-carbon-shuffle', label: '随机播放' }
  }

  return { icon: 'i-carbon-repeat', label: '顺序播放' }
})

/**
 * 保存播放器和个人音乐状态。
 */
function savePlayerState() {
  if (!canUseStorage()) return

  const state: StoredPlayerState = {
    currentTrackId: currentTrack.value.id,
    likedIds: [...likedIds.value],
    playMode: playMode.value,
    queueIds: queue.value.map((track) => track.id),
    volume: volume.value,
  }

  window.localStorage.setItem(playerStorageKey, JSON.stringify(state))
}

watch([currentTrack, queue, likedIds, playMode, volume], savePlayerState, { deep: true })

onMounted(() => {
  duration.value = currentTrack.value.duration
  if (audioRef.value) {
    audioRef.value.volume = volume.value / 100
  }
  savePlayerState()
})

/**
 * 切换主视图。
 * @param view 目标视图标识
 */
function setView(view: ViewKey) {
  activeView.value = view
  isQueueOpen.value = false
  if (view !== 'discover') {
    searchKeyword.value = ''
    activeMood.value = '全部'
    closeSearchSuggestions()
  }
}

/**
 * 切换心情筛选。
 * @param mood 心情标签
 */
function selectMood(mood: MoodKey) {
  activeMood.value = mood
  searchKeyword.value = ''
  closeSearchSuggestions()
}

/**
 * 清空搜索和心情筛选。
 */
function clearSearch() {
  searchKeyword.value = ''
  activeMood.value = '全部'
  closeSearchSuggestions()
}

/**
 * 取消待执行的搜索建议关闭任务。
 */
function cancelSearchBlurTimer() {
  if (searchBlurTimer === undefined) return
  window.clearTimeout(searchBlurTimer)
  searchBlurTimer = undefined
}

/**
 * 打开搜索建议面板。
 */
function openSearchSuggestions() {
  cancelSearchBlurTimer()
  isSearchFocused.value = true
}

/**
 * 关闭搜索建议面板。
 */
function closeSearchSuggestions() {
  cancelSearchBlurTimer()
  isSearchFocused.value = false
}

/**
 * 将关键词搜索切换为全站结果视图。
 */
function activateGlobalSearchView() {
  if (!searchKeyword.value.trim()) return
  activeMood.value = '全部'
  activeView.value = 'discover'
  isQueueOpen.value = false
}

/**
 * 响应搜索输入，确保结果列表和建议同时更新。
 * @param event 输入事件
 */
function handleSearchInput(event: Event) {
  openSearchSuggestions()
  const target = event.target as HTMLInputElement
  searchKeyword.value = target.value
  if (target.value.trim()) activateGlobalSearchView()
}

/**
 * 延迟关闭搜索建议，保证点击建议项能先完成。
 */
function scheduleCloseSearchSuggestions() {
  cancelSearchBlurTimer()
  searchBlurTimer = window.setTimeout(() => {
    isSearchFocused.value = false
    searchBlurTimer = undefined
  }, 120)
}

/**
 * 确认当前关键词搜索。
 */
function confirmSearch() {
  activateGlobalSearchView()
  closeSearchSuggestions()
}

/**
 * 将秒数格式化为播放器时间。
 * @param seconds 秒数
 * @returns mm:ss 格式时间
 */
function formatTime(seconds: number) {
  const safeSeconds = Number.isFinite(seconds) ? Math.max(0, Math.floor(seconds)) : 0
  const minutes = Math.floor(safeSeconds / 60)
  const remainSeconds = String(safeSeconds % 60).padStart(2, '0')
  return `${minutes}:${remainSeconds}`
}

/**
 * 格式化播放次数。
 * @param count 原始播放次数
 * @returns 中文短格式
 */
function formatPlayCount(count: number) {
  if (count >= 100000000) return `${(count / 100000000).toFixed(1)} 亿`
  if (count >= 10000) return `${Math.round(count / 10000)} 万`
  return String(count)
}

/**
 * 显示短提示。
 * @param message 提示文案
 */
function showToast(message: string) {
  toastMessage.value = message
  window.setTimeout(() => {
    if (toastMessage.value === message) toastMessage.value = ''
  }, 1800)
}

/**
 * 播放指定歌曲。
 * @param track 目标歌曲
 * @param source 播放来源列表
 */
async function playTrack(track: Track, source = tracks) {
  currentTrack.value = track
  queue.value = [...source]
  duration.value = track.duration
  currentTime.value = 0
  isPlaying.value = true

  await nextTick()
  await audioRef.value?.play().catch(() => {
    isPlaying.value = false
    showToast('浏览器阻止了自动播放，请再次点击播放')
  })
}

/**
 * 播放指定歌单。
 * @param playlist 目标歌单
 */
function playPlaylist(playlist: Playlist) {
  const [firstTrack] = playlist.tracks
  if (!firstTrack) return
  void playTrack(firstTrack, playlist.tracks)
  showToast(`开始播放《${playlist.title}》`)
}

/**
 * 切换当前播放状态。
 */
async function togglePlayback() {
  if (!audioRef.value) return

  if (isPlaying.value) {
    audioRef.value.pause()
    isPlaying.value = false
    return
  }

  isPlaying.value = true
  await audioRef.value.play().catch(() => {
    isPlaying.value = false
    showToast('播放失败，请检查网络后重试')
  })
}

/**
 * 播放队列中的下一首。
 */
function playNextTrack() {
  if (playMode.value === 'repeat') {
    void playTrack(currentTrack.value, queue.value)
    return
  }

  if (playMode.value === 'shuffle' && queue.value.length > 1) {
    let randomIndex = queueIndex.value
    while (randomIndex === queueIndex.value) {
      randomIndex = Math.floor(Math.random() * queue.value.length)
    }
    const randomTrack = queue.value[randomIndex]
    if (randomTrack) void playTrack(randomTrack, queue.value)
    return
  }

  const nextIndex = queueIndex.value >= 0 ? (queueIndex.value + 1) % queue.value.length : 0
  const nextTrack = queue.value[nextIndex]
  if (nextTrack) void playTrack(nextTrack, queue.value)
}

/**
 * 播放队列中的上一首。
 */
function playPreviousTrack() {
  const previousIndex = queueIndex.value > 0 ? queueIndex.value - 1 : queue.value.length - 1
  const previousTrack = queue.value[previousIndex]
  if (previousTrack) void playTrack(previousTrack, queue.value)
}

/**
 * 切换播放模式。
 */
function togglePlayMode() {
  const nextMode: Record<PlayMode, PlayMode> = {
    sequence: 'repeat',
    repeat: 'shuffle',
    shuffle: 'sequence',
  }

  playMode.value = nextMode[playMode.value]
  showToast(`已切换为${playModeMeta.value.label}`)
}

/**
 * 处理音频元数据加载。
 */
function handleLoadedMetadata() {
  duration.value = audioRef.value?.duration || currentTrack.value.duration
}

/**
 * 同步音频播放进度。
 */
function handleTimeUpdate() {
  currentTime.value = audioRef.value?.currentTime || 0
}

/**
 * 跳转到指定播放进度。
 * @param event 滑块事件
 */
function seekTrack(event: Event) {
  const target = event.target as HTMLInputElement
  const nextTime = Number(target.value)
  currentTime.value = nextTime
  if (audioRef.value) audioRef.value.currentTime = nextTime
}

/**
 * 更新播放器音量。
 * @param event 滑块事件
 */
function updateVolume(event: Event) {
  const target = event.target as HTMLInputElement
  volume.value = Number(target.value)
  if (audioRef.value) audioRef.value.volume = volume.value / 100
}

/**
 * 收藏或取消收藏歌曲。
 * @param track 目标歌曲
 */
function toggleLike(track: Track) {
  const nextLikedIds = new Set(likedIds.value)
  if (nextLikedIds.has(track.id)) {
    nextLikedIds.delete(track.id)
    showToast('已从我喜欢移除')
  } else {
    nextLikedIds.add(track.id)
    showToast('已加入我喜欢')
  }
  likedIds.value = nextLikedIds
}

/**
 * 判断歌曲是否已收藏。
 * @param track 目标歌曲
 */
function isLiked(track: Track) {
  return likedIds.value.has(track.id)
}

/**
 * 将歌曲加入播放队列。
 * @param track 目标歌曲
 */
function addToQueue(track: Track) {
  if (queue.value.some((item) => item.id === track.id)) {
    showToast('歌曲已在播放队列中')
    return
  }

  queue.value = [...queue.value, track]
  showToast('已添加到播放队列')
}

/**
 * 打开或关闭播放队列。
 */
function toggleQueuePanel() {
  isQueueOpen.value = !isQueueOpen.value
}

/**
 * 关闭播放队列。
 */
function closeQueuePanel() {
  isQueueOpen.value = false
}

/**
 * 从播放队列移除歌曲。
 * @param track 目标歌曲
 */
function removeFromQueue(track: Track) {
  if (queue.value.length <= 1) {
    showToast('播放队列至少保留一首歌')
    return
  }

  const nextQueue = queue.value.filter((item) => item.id !== track.id)
  queue.value = nextQueue

  if (currentTrack.value.id === track.id) {
    const [nextTrack] = nextQueue
    if (nextTrack) void playTrack(nextTrack, nextQueue)
  }

  showToast('已从播放队列移除')
}

/**
 * 重置播放队列为每日推荐。
 */
function resetQueue() {
  queue.value = [...defaultQueue]
  const [firstTrack] = queue.value
  if (firstTrack) {
    currentTrack.value = firstTrack
    duration.value = firstTrack.duration
    currentTime.value = 0
  }
  showToast('播放队列已重置')
}

/**
 * 应用搜索建议。
 * @param track 建议歌曲
 */
function selectSuggestion(track: Track) {
  searchKeyword.value = track.title
  activeMood.value = '全部'
  activeView.value = 'discover'
  isQueueOpen.value = false
  closeSearchSuggestions()
}
</script>

<template>
  <div class="music-app">
    <aside class="sidebar" aria-label="主导航">
      <div class="brand">
        <span class="brand-mark">N</span>
        <div>
          <strong>网易云音乐</strong>
          <small>Studio Web</small>
        </div>
      </div>

      <nav class="nav-list">
        <button
          v-for="item in navItems"
          :key="item.key"
          :class="['nav-item', { active: activeView === item.key }]"
          type="button"
          @click="setView(item.key)"
        >
          <span :class="item.icon" aria-hidden="true"></span>
          {{ item.label }}
        </button>
      </nav>

      <section class="sidebar-block">
        <p class="block-title">今日状态</p>
        <div class="pulse-card">
          <span class="pulse-dot"></span>
          <strong>{{ likedTracks.length }} 首已收藏</strong>
          <small>你的常听风格偏向城市流行、电子与低光民谣。</small>
        </div>
      </section>
    </aside>

    <div class="workspace">
      <header class="topbar">
        <div class="search-box">
          <span class="i-carbon-search" aria-hidden="true"></span>
          <input
            v-model="searchKeyword"
            type="search"
            placeholder="搜索歌曲、专辑、歌手"
            aria-label="搜索音乐"
            @blur="scheduleCloseSearchSuggestions"
            @focus="openSearchSuggestions"
            @input="handleSearchInput"
            @keydown.enter.prevent="confirmSearch"
            @keydown.escape="closeSearchSuggestions"
          />
          <div v-if="hasVisibleSearchSuggestions" class="suggestions">
            <button
              v-for="track in searchSuggestions"
              :key="track.id"
              type="button"
              @mousedown.prevent
              @click="selectSuggestion(track)"
            >
              <img :src="track.cover" :alt="track.album" />
              <span>{{ track.title }}</span>
              <small>{{ track.artist }}</small>
            </button>
          </div>
        </div>

        <div class="top-actions">
          <button type="button" class="ghost-button" @click="toggleQueuePanel">
            <span class="i-carbon-list" aria-hidden="true"></span>
            队列 {{ queue.length }}
          </button>
          <button type="button" class="primary-button" @click="playPlaylist(playlists[0])">
            <span class="i-carbon-play-filled" aria-hidden="true"></span>
            播放每日推荐
          </button>
        </div>
      </header>

      <main class="content">
        <section v-if="activeView === 'discover'" class="view-section">
          <section class="hero" :style="heroStyle">
            <div class="hero-copy">
              <span class="section-kicker">编辑精选</span>
              <h1>把今天交给一条会呼吸的播放线</h1>
              <p>从通勤到深夜专注，网易云音乐为你整理高质量歌单、热门榜单和可直接播放的音乐队列。</p>
              <div class="hero-actions">
                <button type="button" class="primary-button" @click="playPlaylist(playlists[0])">
                  <span class="i-carbon-play-filled" aria-hidden="true"></span>
                  立即播放
                </button>
                <button type="button" class="ghost-button" @click="setView('charts')">
                  查看榜单
                </button>
              </div>
            </div>
          </section>

          <section class="section-row">
            <div>
              <span class="section-kicker">Mood Filter</span>
              <h2>按此刻心情听歌</h2>
            </div>
            <div class="mood-tabs" role="tablist" aria-label="心情筛选">
              <button
                v-for="mood in moods"
                :key="mood"
                :class="{ active: activeMood === mood }"
                type="button"
                @click="selectMood(mood)"
              >
                {{ mood }}
              </button>
            </div>
          </section>

          <section class="main-grid">
            <div class="track-panel">
              <div class="panel-heading">
                <h3>{{ trackPanelTitle }}</h3>
                <small>{{ trackPanelSummary }}</small>
              </div>

              <article
                v-for="(track, index) in filteredTracks"
                :key="track.id"
                :class="['track-row', { playing: currentTrack.id === track.id }]"
              >
                <span class="track-index">{{ String(index + 1).padStart(2, '0') }}</span>
                <button
                  type="button"
                  class="cover-button"
                  :aria-label="`播放 ${track.title}`"
                  @click="playTrack(track, filteredTracks)"
                >
                  <img :src="track.cover" :alt="track.album" />
                  <span class="i-carbon-play-filled" aria-hidden="true"></span>
                </button>
                <div class="track-meta">
                  <strong>{{ track.title }}</strong>
                  <small>{{ track.artist }} · {{ track.album }}</small>
                </div>
                <span class="energy-meter" :style="{ '--energy': `${track.energy}%` }"></span>
                <span class="track-count">{{ formatPlayCount(track.plays) }}</span>
                <button type="button" class="icon-button" @click="toggleLike(track)" :aria-label="isLiked(track) ? '取消收藏' : '收藏歌曲'">
                  <span :class="isLiked(track) ? 'i-carbon-favorite-filled' : 'i-carbon-favorite'" aria-hidden="true"></span>
                </button>
                <button type="button" class="icon-button" aria-label="添加到队列" @click="addToQueue(track)">
                  <span class="i-carbon-add-alt" aria-hidden="true"></span>
                </button>
                <time>{{ formatTime(track.duration) }}</time>
              </article>

              <div v-if="hasEmptySearchResult" class="empty-state">
                <span class="i-carbon-search" aria-hidden="true"></span>
                <strong>没有找到匹配歌曲</strong>
                <p>换一个关键词，或者回到全部心情继续发现音乐。</p>
                <button type="button" class="ghost-button" @click="clearSearch">
                  清空筛选
                </button>
              </div>
            </div>

            <aside class="now-card">
              <img :src="currentTrack.cover" :alt="currentTrack.album" />
              <span class="section-kicker">Now Playing</span>
              <h3>{{ currentTrack.title }}</h3>
              <p>{{ currentTrack.artist }} · {{ currentTrack.album }}</p>
              <button type="button" class="ghost-button full" @click="isLyricOpen = !isLyricOpen">
                <span class="i-carbon-microphone" aria-hidden="true"></span>
                {{ isLyricOpen ? '收起歌词' : '查看歌词' }}
              </button>
              <div v-if="isLyricOpen" class="lyric-box">
                <p
                  v-for="line in lyricLines"
                  :key="line.time"
                  :class="{ active: activeLyric.time === line.time }"
                >
                  {{ line.text }}
                </p>
              </div>
            </aside>
          </section>

          <section class="playlist-grid" aria-label="推荐歌单">
            <article v-for="playlist in playlists" :key="playlist.id" class="playlist-card">
              <img :src="playlist.cover" :alt="playlist.title" />
              <div>
                <span :style="{ color: playlist.color }">{{ playlist.tag }}</span>
                <h3>{{ playlist.title }}</h3>
                <p>{{ playlist.subtitle }}</p>
                <button type="button" @click="playPlaylist(playlist)">
                  <span class="i-carbon-play-filled" aria-hidden="true"></span>
                  播放歌单
                </button>
              </div>
            </article>
          </section>

          <section class="artist-strip">
            <div class="section-row compact">
              <div>
                <span class="section-kicker">Artists</span>
                <h2>正在被听见的声音</h2>
              </div>
            </div>
            <div class="artist-list">
              <article v-for="artist in artists" :key="artist.id" class="artist-card">
                <img :src="artist.avatar" :alt="artist.name" />
                <strong>{{ artist.name }}</strong>
                <span>{{ artist.role }}</span>
                <small>{{ artist.listeners }}</small>
              </article>
            </div>
          </section>
        </section>

        <section v-else-if="activeView === 'charts'" class="view-section">
          <section class="section-row">
            <div>
              <span class="section-kicker">Charts</span>
              <h2>实时音乐榜单</h2>
            </div>
            <p class="section-note">按热度、新声和专注场景拆分，让发现新歌更像一张清晰的工作台。</p>
          </section>

          <div class="chart-grid">
            <article v-for="chart in charts" :key="chart.id" class="chart-card" :style="{ '--accent': chart.accent }">
              <div class="chart-head">
                <span></span>
                <div>
                  <h3>{{ chart.title }}</h3>
                  <p>{{ chart.description }}</p>
                </div>
              </div>
              <ol>
                <li v-for="(track, index) in chart.tracks" :key="track.id">
                  <button type="button" @click="playTrack(track, chart.tracks)">
                    <span>{{ index + 1 }}</span>
                    <img :src="track.cover" :alt="track.album" />
                    <span class="chart-track-meta">
                      <strong>{{ track.title }}</strong>
                      <small>{{ track.artist }}</small>
                    </span>
                    <time>{{ formatTime(track.duration) }}</time>
                  </button>
                </li>
              </ol>
            </article>
          </div>
        </section>

        <section v-else class="view-section">
          <section class="library-hero">
            <div>
              <span class="section-kicker">Library</span>
              <h2>你的音乐库</h2>
              <p>集中管理收藏、播放队列和保存歌单，适合长期反复使用。</p>
            </div>
            <button type="button" class="primary-button" @click="isQueueOpen = true">
              打开播放队列
            </button>
          </section>

          <div class="library-grid">
            <article class="library-card">
              <span class="i-carbon-favorite-filled" aria-hidden="true"></span>
              <strong>{{ likedTracks.length }}</strong>
              <p>我喜欢的音乐</p>
            </article>
            <article class="library-card">
              <span class="i-carbon-list" aria-hidden="true"></span>
              <strong>{{ queue.length }}</strong>
              <p>当前播放队列</p>
            </article>
            <article class="library-card">
              <span class="i-carbon-playlist" aria-hidden="true"></span>
              <strong>{{ playlists.length }}</strong>
              <p>保存歌单</p>
            </article>
          </div>

          <section class="track-panel">
            <div class="panel-heading">
              <h3>收藏歌曲</h3>
              <small>可直接播放或加入队列</small>
            </div>
            <article v-for="track in likedTracks" :key="track.id" class="track-row library-track-row">
              <button
                type="button"
                class="cover-button"
                :aria-label="`播放 ${track.title}`"
                @click="playTrack(track, likedTracks)"
              >
                <img :src="track.cover" :alt="track.album" />
                <span class="i-carbon-play-filled" aria-hidden="true"></span>
              </button>
              <div class="track-meta">
                <strong>{{ track.title }}</strong>
                <small>{{ track.artist }} · {{ track.album }}</small>
              </div>
              <button type="button" class="icon-button" aria-label="添加到队列" @click="addToQueue(track)">
                <span class="i-carbon-add-alt" aria-hidden="true"></span>
              </button>
              <time>{{ formatTime(track.duration) }}</time>
            </article>

            <div v-if="!likedTracks.length" class="empty-state">
              <span class="i-carbon-favorite" aria-hidden="true"></span>
              <strong>还没有收藏歌曲</strong>
              <p>在发现页点亮喜欢，音乐库会自动保存你的常听清单。</p>
              <button type="button" class="ghost-button" @click="setView('discover')">
                去发现音乐
              </button>
            </div>
          </section>
        </section>
      </main>
    </div>

    <button
      v-if="isQueueOpen"
      type="button"
      class="queue-backdrop"
      aria-label="关闭播放队列"
      @click="closeQueuePanel"
    ></button>

    <aside :class="['queue-panel', { open: isQueueOpen }]" aria-label="播放队列">
      <div class="queue-head">
        <div>
          <span class="section-kicker">Queue</span>
          <h2>播放队列</h2>
        </div>
        <button type="button" class="icon-button" @click="closeQueuePanel" aria-label="关闭队列">
          <span class="i-carbon-close" aria-hidden="true"></span>
        </button>
      </div>

      <div class="queue-actions">
        <button type="button" class="ghost-button" @click="resetQueue">
          <span class="i-carbon-restart" aria-hidden="true"></span>
          重置每日推荐
        </button>
        <small>{{ queue.length }} 首歌曲</small>
      </div>

      <article
        v-for="track in queue"
        :key="track.id"
        :class="['queue-item', { active: currentTrack.id === track.id }]"
      >
        <button type="button" class="queue-play" @click="playTrack(track, queue)" :aria-label="`播放 ${track.title}`">
          <img :src="track.cover" :alt="track.album" />
          <span>
            <strong>{{ track.title }}</strong>
            <small>{{ track.artist }}</small>
          </span>
        </button>
        <time>{{ formatTime(track.duration) }}</time>
        <button type="button" class="queue-remove" @click="removeFromQueue(track)" :aria-label="`从队列移除 ${track.title}`">
          <span class="i-carbon-close" aria-hidden="true"></span>
        </button>
      </article>
    </aside>

    <footer class="player-bar">
      <audio
        ref="audioRef"
        :src="currentTrack.audioUrl"
        preload="metadata"
        @loadedmetadata="handleLoadedMetadata"
        @timeupdate="handleTimeUpdate"
        @ended="playNextTrack"
      ></audio>

      <div class="player-track">
        <img :src="currentTrack.cover" :alt="currentTrack.album" />
        <div>
          <strong>{{ currentTrack.title }}</strong>
          <small>{{ currentTrack.artist }}</small>
        </div>
      </div>

      <div class="player-controls">
        <div class="control-buttons">
          <button type="button" class="icon-button" @click="playPreviousTrack" aria-label="上一首">
            <span class="i-carbon-previous-filled" aria-hidden="true"></span>
          </button>
          <button type="button" class="play-button" @click="togglePlayback" aria-label="播放或暂停">
            <span :class="isPlaying ? 'i-carbon-pause-filled' : 'i-carbon-play-filled'" aria-hidden="true"></span>
          </button>
          <button type="button" class="icon-button" @click="playNextTrack" aria-label="下一首">
            <span class="i-carbon-next-filled" aria-hidden="true"></span>
          </button>
        </div>
        <div class="progress-line">
          <time>{{ formatTime(currentTime) }}</time>
          <input
            type="range"
            min="0"
            :max="duration"
            :value="currentTime"
            step="1"
            aria-label="播放进度"
            @input="seekTrack"
          />
          <time>{{ formatTime(duration) }}</time>
        </div>
      </div>

      <div class="player-tools">
        <button
          type="button"
          class="icon-button mode-button"
          :title="playModeMeta.label"
          :aria-label="playModeMeta.label"
          @click="togglePlayMode"
        >
          <span :class="playModeMeta.icon" aria-hidden="true"></span>
        </button>
        <button type="button" class="icon-button" @click="toggleLike(currentTrack)" aria-label="收藏当前歌曲">
          <span :class="isLiked(currentTrack) ? 'i-carbon-favorite-filled' : 'i-carbon-favorite'" aria-hidden="true"></span>
        </button>
        <label class="volume-control">
          <span class="i-carbon-volume-up" aria-hidden="true"></span>
          <input
            type="range"
            min="0"
            max="100"
            :value="volume"
            aria-label="音量"
            @input="updateVolume"
          />
        </label>
      </div>
    </footer>

    <p v-if="toastMessage" class="toast" role="status">{{ toastMessage }}</p>
  </div>
</template>

<style scoped>
.music-app {
  min-height: 100vh;
  display: grid;
  grid-template-columns: 248px 1fr;
  padding-bottom: 104px;
  background:
    radial-gradient(circle at 8% 9%, rgb(179 38 30 / 10%), transparent 30%),
    radial-gradient(circle at 92% 16%, rgb(36 106 115 / 12%), transparent 32%),
    linear-gradient(135deg, #f6f8fb 0%, #eef4f1 46%, #f7f4ef 100%);
  color: #1b1715;
}

.sidebar {
  position: sticky;
  top: 0;
  height: 100vh;
  padding: 24px 18px;
  border-right: 1px solid rgb(34 28 23 / 10%);
  background: rgb(18 22 30 / 92%);
  color: #fff;
  backdrop-filter: blur(18px);
}

.brand {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 36px;
}

.brand-mark {
  width: 42px;
  height: 42px;
  display: grid;
  place-items: center;
  border-radius: 8px;
  background: #b3261e;
  color: #fff;
  font-weight: 900;
}

.brand strong,
.track-meta strong,
.player-track strong {
  display: block;
}

.brand small,
.track-meta small,
.player-track small {
  color: #746a5d;
}

.sidebar .brand small {
  color: rgb(255 255 255 / 58%);
}

.nav-list {
  display: grid;
  gap: 8px;
}

.nav-item,
.ghost-button,
.primary-button,
.icon-button,
.play-button,
.cover-button,
.mood-tabs button,
.playlist-card button,
.chart-card button,
.queue-play,
.queue-remove {
  border: 0;
  font: inherit;
  cursor: pointer;
}

/* 固定 Carbon 图标盒模型，避免图标加载前后挤压文字排版。 */
.music-app :where([class^='i-carbon-'], [class*=' i-carbon-']) {
  width: 1em;
  height: 1em;
  display: inline-block;
  flex: 0 0 auto;
  line-height: 1;
  vertical-align: -0.125em;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px;
  border-radius: 8px;
  background: transparent;
  color: rgb(255 255 255 / 68%);
  text-align: left;
}

.nav-item.active,
.nav-item:hover {
  background: rgb(255 255 255 / 12%);
  color: #fff;
}

.sidebar-block {
  margin-top: 34px;
}

.block-title,
.section-kicker {
  margin: 0 0 10px;
  color: #b3261e;
  font-size: 12px;
  font-weight: 900;
  letter-spacing: 0;
  text-transform: uppercase;
}

.pulse-card {
  padding: 16px;
  border: 1px solid rgb(255 255 255 / 14%);
  border-radius: 8px;
  background: rgb(255 255 255 / 8%);
}

.pulse-card small {
  display: block;
  margin-top: 8px;
  color: rgb(255 255 255 / 62%);
}

.pulse-dot {
  width: 9px;
  height: 9px;
  display: inline-block;
  margin-right: 8px;
  border-radius: 99px;
  background: #2e9b70;
  box-shadow: 0 0 0 6px rgb(46 155 112 / 15%);
}

.workspace {
  min-width: 0;
}

.topbar {
  position: sticky;
  top: 0;
  z-index: 5;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  padding: 18px 28px;
  background: rgb(246 248 251 / 78%);
  border-bottom: 1px solid rgb(34 28 23 / 8%);
  backdrop-filter: blur(18px);
}

.search-box {
  position: relative;
  width: min(520px, 100%);
}

.search-box > span {
  position: absolute;
  left: 16px;
  top: 50%;
  color: #7b7165;
  transform: translateY(-50%);
}

.search-box input {
  width: 100%;
  height: 44px;
  padding: 0 16px 0 44px;
  border: 1px solid rgb(34 28 23 / 12%);
  border-radius: 8px;
  background: #fff;
  color: #1b1715;
  outline: none;
}

.search-box input:focus {
  border-color: #b3261e;
  box-shadow: 0 0 0 4px rgb(179 38 30 / 12%);
}

.suggestions {
  position: absolute;
  left: 0;
  right: 0;
  top: calc(100% + 8px);
  z-index: 9;
  padding: 8px;
  border: 1px solid rgb(34 28 23 / 12%);
  border-radius: 8px;
  background: #fff;
  box-shadow: 0 22px 70px rgb(33 22 14 / 18%);
}

.suggestions button {
  width: 100%;
  display: grid;
  grid-template-columns: 40px 1fr auto;
  align-items: center;
  gap: 10px;
  padding: 8px;
  border: 0;
  border-radius: 8px;
  background: transparent;
  text-align: left;
  cursor: pointer;
}

.suggestions button:hover {
  background: #eef4f1;
}

.suggestions span,
.suggestions small {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.suggestions img {
  width: 40px;
  height: 40px;
  border-radius: 6px;
  object-fit: cover;
}

.top-actions,
.hero-actions,
.player-tools,
.control-buttons {
  display: flex;
  align-items: center;
  gap: 10px;
}

.ghost-button,
.primary-button {
  min-height: 40px;
  min-width: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 0 15px;
  border-radius: 8px;
  white-space: nowrap;
}

.ghost-button {
  border: 1px solid rgb(34 28 23 / 13%);
  background: #fff;
  color: #28231f;
}

.primary-button {
  background: #b3261e;
  color: #fff;
  box-shadow: 0 12px 26px rgb(179 38 30 / 18%);
}

.content {
  padding: 28px;
}

.view-section {
  display: grid;
  gap: 26px;
}

.hero {
  min-height: 360px;
  display: flex;
  align-items: center;
  padding: 42px;
  border-radius: 8px;
  background-position: center;
  background-size: cover;
  overflow: hidden;
}

.hero-copy {
  width: min(560px, 100%);
  color: #fff;
}

.hero-copy .section-kicker {
  color: #ffcf66;
}

.hero h1,
.section-row h2,
.library-hero h2 {
  margin: 0;
  letter-spacing: 0;
}

.hero h1 {
  font-size: clamp(38px, 6vw, 74px);
  line-height: 0.96;
}

.hero p {
  max-width: 520px;
  margin: 18px 0 24px;
  color: rgb(255 255 255 / 82%);
  font-size: 18px;
}

.section-row {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 20px;
}

.section-row.compact {
  align-items: start;
}

.section-row h2,
.library-hero h2 {
  font-size: clamp(28px, 4vw, 42px);
}

.section-note {
  max-width: 440px;
  margin: 0;
  color: #6b6258;
}

.mood-tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.mood-tabs button {
  padding: 9px 13px;
  border-radius: 8px;
  background: #fff;
  color: #5f574f;
}

.mood-tabs button.active {
  background: #121620;
  color: #fff;
}

.main-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 320px;
  gap: 20px;
  align-items: start;
}

.track-panel,
.now-card,
.playlist-card,
.chart-card,
.library-hero,
.library-card {
  border: 1px solid rgb(34 28 23 / 10%);
  border-radius: 8px;
  background: rgb(255 255 255 / 84%);
  box-shadow: 0 16px 48px rgb(31 23 17 / 8%);
}

.track-panel {
  padding: 14px;
}

.panel-heading,
.queue-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 8px 8px 14px;
}

.panel-heading h3,
.now-card h3,
.playlist-card h3,
.chart-card h3,
.queue-head h2 {
  margin: 0;
}

.panel-heading small {
  color: #786e63;
}

.track-row {
  display: grid;
  grid-template-columns: 32px 52px minmax(150px, 1fr) 84px 72px 38px 38px 50px;
  align-items: center;
  gap: 10px;
  min-height: 72px;
  padding: 10px 8px;
  border-radius: 8px;
}

.library-track-row {
  grid-template-columns: 52px minmax(160px, 1fr) 38px 50px;
}

.track-row:hover,
.track-row.playing {
  background: #eef4f1;
}

.track-index,
.track-count,
.track-row time {
  color: #7c7266;
  font-size: 13px;
  white-space: nowrap;
}

.track-meta,
.playlist-card > div,
.chart-track-meta,
.player-track > div {
  min-width: 0;
}

.track-meta strong,
.track-meta small,
.playlist-card h3,
.playlist-card p,
.chart-track-meta strong,
.chart-track-meta small,
.player-track strong,
.player-track small {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.cover-button {
  position: relative;
  width: 52px;
  height: 52px;
  padding: 0;
  border-radius: 8px;
  overflow: hidden;
  background: #121620;
}

.cover-button::before {
  position: absolute;
  inset: 0;
  background: rgb(0 0 0 / 35%);
  content: '';
  opacity: 0;
  transition: opacity 0.18s ease;
}

.cover-button img,
.player-track img,
.queue-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.cover-button span {
  position: absolute;
  left: 50%;
  top: 50%;
  z-index: 1;
  color: #fff;
  font-size: 22px;
  opacity: 0;
  transform: translate(-50%, -50%);
  transition: opacity 0.18s ease;
}

.cover-button:hover::before,
.track-row.playing .cover-button::before,
.cover-button:hover span,
.track-row.playing .cover-button span {
  opacity: 1;
}

.energy-meter {
  height: 7px;
  border-radius: 99px;
  background: linear-gradient(90deg, #2e9b70 var(--energy), #d9dee8 var(--energy));
}

.icon-button {
  width: 36px;
  height: 36px;
  display: grid;
  place-items: center;
  border-radius: 8px;
  background: transparent;
  color: #5c554d;
}

.icon-button:hover {
  background: #e9eef5;
  color: #b3261e;
}

.mode-button {
  color: #ffcf66;
}

.empty-state {
  display: grid;
  justify-items: center;
  gap: 10px;
  margin: 10px 8px 4px;
  padding: 34px 20px;
  border: 1px dashed rgb(34 28 23 / 16%);
  border-radius: 8px;
  background: rgb(246 248 251 / 72%);
  color: #5f574f;
  text-align: center;
}

.empty-state > span {
  width: 48px;
  height: 48px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  background: #eef4f1;
  color: #b3261e;
  font-size: 24px;
}

.empty-state strong {
  color: #1b1715;
  font-size: 18px;
}

.empty-state p {
  max-width: 320px;
  margin: 0;
}

.now-card {
  padding: 16px;
}

.now-card > img {
  width: 100%;
  aspect-ratio: 1;
  margin-bottom: 16px;
  border-radius: 8px;
  object-fit: cover;
}

.now-card p {
  color: #6f665b;
}

.full {
  width: 100%;
  margin-top: 16px;
}

.lyric-box {
  display: grid;
  gap: 8px;
  margin-top: 14px;
  padding: 14px;
  border-radius: 8px;
  background: #121620;
}

.lyric-box p {
  margin: 0;
  color: rgb(255 255 255 / 56%);
}

.lyric-box p.active {
  color: #ffcf66;
}

.playlist-grid,
.chart-grid,
.library-grid,
.artist-list {
  display: grid;
  gap: 16px;
}

.playlist-grid {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.playlist-card {
  display: grid;
  grid-template-columns: 136px 1fr;
  gap: 16px;
  min-width: 0;
  padding: 14px;
}

.playlist-card img {
  width: 136px;
  height: 136px;
  border-radius: 8px;
  object-fit: cover;
}

.playlist-card span {
  font-size: 12px;
  font-weight: 900;
}

.playlist-card p {
  color: #6b6258;
}

.playlist-card button {
  display: inline-flex;
  align-items: center;
  max-width: 100%;
  gap: 6px;
  margin-top: 10px;
  padding: 8px 11px;
  border-radius: 8px;
  background: #121620;
  color: #fff;
}

.artist-strip {
  display: grid;
  gap: 16px;
}

.artist-list {
  grid-template-columns: repeat(4, minmax(0, 1fr));
}

.artist-card {
  padding: 16px;
  border: 1px solid rgb(34 28 23 / 10%);
  border-radius: 8px;
  background: #fff;
}

.artist-card img {
  width: 72px;
  height: 72px;
  margin-bottom: 14px;
  border-radius: 50%;
  object-fit: cover;
}

.artist-card strong,
.artist-card span,
.artist-card small {
  display: block;
}

.artist-card span,
.artist-card small {
  color: #6f665c;
}

.chart-grid {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.chart-card {
  padding: 16px;
}

.chart-head {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
}

.chart-head > span {
  width: 10px;
  border-radius: 99px;
  background: var(--accent);
}

.chart-card p {
  color: #6f665c;
}

.chart-card ol {
  display: grid;
  gap: 8px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.chart-card button {
  width: 100%;
  display: grid;
  grid-template-columns: 24px 42px minmax(0, 1fr) 44px;
  align-items: center;
  gap: 10px;
  padding: 8px;
  border-radius: 8px;
  background: transparent;
  color: inherit;
  text-align: left;
}

.chart-track-meta {
  display: grid;
  gap: 3px;
}

.chart-card button:hover {
  background: #edf3f6;
}

.chart-card img {
  width: 42px;
  height: 42px;
  border-radius: 6px;
  object-fit: cover;
}

.chart-card small {
  display: block;
  color: #756c62;
}

.chart-card button time {
  justify-self: end;
  white-space: nowrap;
}

.library-hero {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  padding: 28px;
}

.library-hero p {
  max-width: 520px;
  color: #6f665c;
}

.library-grid {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.library-card {
  padding: 20px;
}

.library-card span {
  color: #b3261e;
  font-size: 28px;
}

.library-card strong {
  display: block;
  margin-top: 14px;
  font-size: 34px;
}

.library-card p {
  margin: 0;
  color: #6f665c;
}

.queue-backdrop {
  position: fixed;
  inset: 0;
  z-index: 18;
  border: 0;
  background: rgb(18 22 30 / 26%);
  cursor: pointer;
}

.queue-panel {
  position: fixed;
  top: 0;
  right: 0;
  z-index: 20;
  width: min(390px, 100vw);
  height: 100vh;
  padding: 20px;
  background: #fff;
  border-left: 1px solid rgb(34 28 23 / 10%);
  box-shadow: -24px 0 80px rgb(31 23 17 / 18%);
  overflow-y: auto;
  transform: translateX(105%);
  transition: transform 0.24s ease;
}

.queue-panel.open {
  transform: translateX(0);
}

.queue-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 10px;
  padding: 0 8px 14px;
  border-bottom: 1px solid rgb(34 28 23 / 8%);
}

.queue-actions small {
  color: #746a5d;
  white-space: nowrap;
}

.queue-item {
  width: 100%;
  display: grid;
  grid-template-columns: minmax(0, 1fr) 48px 36px;
  align-items: center;
  gap: 10px;
  padding: 9px;
  border-radius: 8px;
}

.queue-item.active,
.queue-item:hover {
  background: #edf3f6;
}

.queue-play {
  min-width: 0;
  display: grid;
  grid-template-columns: 46px minmax(0, 1fr);
  align-items: center;
  gap: 10px;
  padding: 0;
  background: transparent;
  color: inherit;
  text-align: left;
}

.queue-item small {
  color: #746a5d;
}

.queue-item img {
  width: 46px;
  height: 46px;
  border-radius: 6px;
}

.queue-item span {
  min-width: 0;
}

.queue-item strong,
.queue-item small {
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.queue-item time {
  color: #766d62;
  font-size: 13px;
}

.queue-remove {
  width: 32px;
  height: 32px;
  display: grid;
  place-items: center;
  border-radius: 8px;
  background: transparent;
  color: #8b8176;
}

.queue-remove:hover {
  background: rgb(179 38 30 / 10%);
  color: #b3261e;
}

.player-bar {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 15;
  display: grid;
  grid-template-columns: minmax(220px, 320px) minmax(320px, 1fr) minmax(180px, 280px);
  align-items: center;
  gap: 18px;
  padding: 14px 20px;
  background: rgb(18 22 30 / 94%);
  color: #fff;
  box-shadow: 0 -12px 50px rgb(31 23 17 / 22%);
}

.player-track {
  min-width: 0;
  display: grid;
  grid-template-columns: 58px minmax(0, 1fr);
  align-items: center;
  gap: 12px;
}

.player-track img {
  width: 58px;
  height: 58px;
  border-radius: 8px;
}

.player-track small {
  color: rgb(255 255 255 / 62%);
}

.player-controls {
  display: grid;
  gap: 8px;
}

.control-buttons {
  justify-content: center;
}

.play-button {
  width: 46px;
  height: 46px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  background: #b3261e;
  color: #fff;
}

.player-bar .icon-button {
  color: rgb(255 255 255 / 78%);
}

.player-bar .icon-button:hover {
  background: rgb(255 255 255 / 12%);
  color: #fff;
}

.progress-line {
  display: grid;
  grid-template-columns: 44px 1fr 44px;
  align-items: center;
  gap: 8px;
}

.progress-line time {
  color: rgb(255 255 255 / 58%);
  font-size: 12px;
  text-align: center;
}

input[type='range'] {
  width: 100%;
  accent-color: #ffcf66;
}

.volume-control {
  display: grid;
  grid-template-columns: 22px minmax(80px, 1fr);
  align-items: center;
  gap: 8px;
}

.toast {
  position: fixed;
  left: 50%;
  bottom: 116px;
  z-index: 30;
  margin: 0;
  padding: 10px 14px;
  border-radius: 8px;
  background: #121620;
  color: #fff;
  transform: translateX(-50%);
  box-shadow: 0 16px 40px rgb(31 23 17 / 28%);
}

@media (max-width: 1120px) {
  .music-app {
    grid-template-columns: 88px 1fr;
  }

  .brand div,
  .nav-item {
    font-size: 0;
  }

  .nav-item {
    justify-content: center;
  }

  .nav-item span {
    font-size: 20px;
  }

  .sidebar-block {
    display: none;
  }

  .main-grid,
  .chart-grid,
  .playlist-grid,
  .artist-list {
    grid-template-columns: 1fr 1fr;
  }

  .now-card {
    grid-column: 1 / -1;
  }
}

@media (max-width: 820px) {
  .music-app {
    display: block;
    padding-bottom: 240px;
  }

  .sidebar {
    position: sticky;
    top: 0;
    z-index: 8;
    height: auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px;
  }

  .brand {
    margin: 0;
  }

  .brand div {
    display: none;
  }

  .nav-list {
    grid-auto-flow: column;
  }

  .topbar,
  .section-row,
  .library-hero {
    align-items: stretch;
    flex-direction: column;
  }

  .topbar {
    padding: 14px;
  }

  .top-actions {
    display: grid;
    grid-template-columns: 1fr 1fr;
    overflow-x: visible;
  }

  .top-actions .ghost-button,
  .top-actions .primary-button {
    padding-inline: 10px;
    white-space: normal;
  }

  .content {
    padding: 14px;
  }

  .hero {
    min-height: 430px;
    padding: 24px;
  }

  .main-grid,
  .playlist-grid,
  .chart-grid,
  .library-grid,
  .artist-list {
    grid-template-columns: 1fr;
  }

  .track-row {
    grid-template-columns: 48px minmax(0, 1fr) 38px 44px;
  }

  .library-track-row {
    grid-template-columns: 48px minmax(0, 1fr) 38px;
  }

  .track-index,
  .energy-meter,
  .track-count,
  .track-row time {
    display: none;
  }

  .playlist-card {
    grid-template-columns: 104px 1fr;
  }

  .playlist-card img {
    width: 104px;
    height: 104px;
  }

  .player-bar {
    grid-template-columns: 1fr;
    gap: 10px;
  }

  .player-tools {
    justify-content: space-between;
  }
}
</style>
