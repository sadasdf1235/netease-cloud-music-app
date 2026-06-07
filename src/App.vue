<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watch } from 'vue'

type ViewKey = 'discover' | 'charts' | 'library'
type MoodKey = '全部' | '通勤' | '夜晚' | '专注' | '派对'
type PlayMode = 'sequence' | 'repeat' | 'shuffle'
type PlaybackQuality = 'standard' | 'high' | 'lossless'
type SleepTimerMinutes = 0 | 15 | 30 | 60

interface Artist {
  id: number
  name: string
  avatar: string
  role: string
  listeners: string
}

interface ArtistStat {
  label: string
  value: string
  icon: string
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

interface PlaylistStat {
  label: string
  value: string
  icon: string
}

interface Chart {
  id: number
  title: string
  description: string
  accent: string
  trend: string
  updateLabel: string
  tracks: Track[]
}

interface ChartStat {
  label: string
  value: string
  icon: string
}

interface SearchArtistResult {
  name: string
  avatar: string
  role: string
  listeners: string
  tracks: Track[]
}

interface SearchAlbumResult {
  key: string
  title: string
  artist: string
  cover: string
  tracks: Track[]
  totalDuration: number
  totalPlays: number
}

interface LyricLine {
  time: number
  text: string
}

interface StoredPlayerState {
  autoPlayNext?: boolean
  currentTime?: number
  currentTrackId?: number
  immersiveLyrics?: boolean
  likedIds?: number[]
  playMode?: PlayMode
  playbackQuality?: PlaybackQuality
  queueIds?: number[]
  recentTrackIds?: number[]
  sleepTimerMinutes?: number
  volume?: number
}

const navItems: Array<{ key: ViewKey; label: string; icon: string }> = [
  { key: 'discover', label: '发现', icon: 'i-carbon-music' },
  { key: 'charts', label: '榜单', icon: 'i-carbon-chart-line' },
  { key: 'library', label: '音乐库', icon: 'i-carbon-folder' },
]

const moods: MoodKey[] = ['全部', '通勤', '夜晚', '专注', '派对']

const playbackQualityOptions: Array<{ key: PlaybackQuality; label: string; detail: string }> = [
  { key: 'standard', label: '标准', detail: '流畅' },
  { key: 'high', label: '高品', detail: '均衡' },
  { key: 'lossless', label: '臻享', detail: '细节' },
]

const sleepTimerOptions: Array<{ minutes: SleepTimerMinutes; label: string }> = [
  { minutes: 0, label: '关闭' },
  { minutes: 15, label: '15 分钟' },
  { minutes: 30, label: '30 分钟' },
  { minutes: 60, label: '60 分钟' },
]

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
    trend: '+18%',
    updateLabel: '每小时刷新',
    tracks: [tracks[5], tracks[3], tracks[0], tracks[7], tracks[2]],
  },
  {
    id: 302,
    title: '独立新声榜',
    description: '编辑部持续追踪的新专和现场录音。',
    accent: '#246a73',
    trend: '+11%',
    updateLabel: '每日 10:00',
    tracks: [tracks[1], tracks[6], tracks[4], tracks[3], tracks[0]],
  },
  {
    id: 303,
    title: '效率专注榜',
    description: '更适合长时间沉浸的低干扰作品。',
    accent: '#7b4f9d',
    trend: '+9%',
    updateLabel: '工作日更新',
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
const defaultRecentIds = [103, 102, 105, 104]
const defaultQueue = [...playlists[0].tracks]
const trackMap = new Map(tracks.map((track) => [track.id, track]))

/**
 * 判断歌曲字段是否命中搜索关键词。
 * @param track 待匹配歌曲
 * @param keyword 小写搜索关键词
 * @returns 是否命中标题、艺人或专辑
 */
function matchesSearchKeyword(track: Track, keyword: string) {
  return [track.title, track.artist, track.album].some((field) => field.toLowerCase().includes(keyword))
}

/**
 * 按艺人聚合搜索命中的歌曲。
 * @param matchedTracks 搜索命中的歌曲列表
 * @returns 艺人维度的搜索结果
 */
function createSearchArtistResults(matchedTracks: Track[]): SearchArtistResult[] {
  const artistGroups = matchedTracks.reduce<Map<string, Track[]>>((groups, track) => {
    groups.set(track.artist, [...(groups.get(track.artist) || []), track])
    return groups
  }, new Map())

  return [...artistGroups.entries()]
    .map(([name, artistTracks]) => {
      const fallbackTrack = artistTracks[0]
      const artist = artists.find((item) => item.name === name)

      return {
        name,
        avatar: artist?.avatar || fallbackTrack.cover,
        role: artist?.role || '独立音乐人',
        listeners: artist?.listeners || `${formatPlayCount(fallbackTrack.plays)} 次播放`,
        tracks: artistTracks,
      }
    })
    .sort((current, next) => next.tracks.length - current.tracks.length || next.tracks[0].plays - current.tracks[0].plays)
}

/**
 * 按专辑聚合搜索命中的歌曲。
 * @param matchedTracks 搜索命中的歌曲列表
 * @returns 专辑维度的搜索结果
 */
function createSearchAlbumResults(matchedTracks: Track[]): SearchAlbumResult[] {
  const albumGroups = matchedTracks.reduce<Map<string, Track[]>>((groups, track) => {
    const key = `${track.artist}::${track.album}`
    groups.set(key, [...(groups.get(key) || []), track])
    return groups
  }, new Map())

  return [...albumGroups.entries()]
    .map(([key, albumTracks]) => {
      const coverTrack = albumTracks[0]

      return {
        key,
        title: coverTrack.album,
        artist: coverTrack.artist,
        cover: coverTrack.cover,
        tracks: albumTracks,
        totalDuration: albumTracks.reduce((total, track) => total + track.duration, 0),
        totalPlays: albumTracks.reduce((total, track) => total + track.plays, 0),
      }
    })
    .sort((current, next) => next.totalPlays - current.totalPlays)
}

/**
 * 获取全部专辑列表。
 * @returns 按播放量排序后的专辑集合
 */
function createAlbumResults() {
  return createSearchAlbumResults(tracks)
}

/**
 * 获取艺人的全部歌曲。
 * @param artist 目标艺人
 * @returns 该艺人名下歌曲
 */
function getArtistTracks(artist: Artist) {
  return tracks.filter((track) => track.artist === artist.name)
}

/**
 * 获取艺人播放量合计。
 * @param artist 目标艺人
 * @returns 该艺人歌曲播放量合计
 */
function getArtistTotalPlays(artist: Artist) {
  return getArtistTracks(artist).reduce((total, track) => total + track.plays, 0)
}

/**
 * 获取艺人的热门歌曲。
 * @param artist 目标艺人
 * @returns 按播放量排序后的歌曲
 */
function getArtistPopularTracks(artist: Artist) {
  return [...getArtistTracks(artist)].sort((current, next) => next.plays - current.plays)
}

/**
 * 获取歌单总时长。
 * @param playlist 歌单数据
 * @returns 歌单内歌曲时长合计
 */
function getPlaylistTotalDuration(playlist: Playlist) {
  return playlist.tracks.reduce((total, track) => total + track.duration, 0)
}

/**
 * 获取歌单总播放量。
 * @param playlist 歌单数据
 * @returns 歌单内歌曲播放量合计
 */
function getPlaylistTotalPlays(playlist: Playlist) {
  return playlist.tracks.reduce((total, track) => total + track.plays, 0)
}

/**
 * 获取歌单主要艺人摘要。
 * @param playlist 歌单数据
 * @returns 前两位艺人组成的摘要
 */
function getPlaylistArtistSummary(playlist: Playlist) {
  const artistNames = [...new Set(playlist.tracks.map((track) => track.artist))]
  return artistNames.slice(0, 2).join(' / ')
}

/**
 * 获取榜单总播放量。
 * @param chart 榜单数据
 * @returns 榜单内歌曲播放量合计
 */
function getChartTotalPlays(chart: Chart) {
  return chart.tracks.reduce((total, track) => total + track.plays, 0)
}

/**
 * 获取榜单平均能量值。
 * @param chart 榜单数据
 * @returns 四舍五入后的平均能量
 */
function getChartAverageEnergy(chart: Chart) {
  if (!chart.tracks.length) return 0
  const totalEnergy = chart.tracks.reduce((total, track) => total + track.energy, 0)
  return Math.round(totalEnergy / chart.tracks.length)
}

/**
 * 获取榜单第一首歌曲。
 * @param chart 榜单数据
 * @returns 榜首歌曲
 */
function getChartLeadTrack(chart: Chart) {
  return chart.tracks[0]
}

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
 * 从缓存状态恢复当前播放进度。
 * @param state 缓存状态
 * @param fallbackTrack 当前播放歌曲
 * @returns 可用的播放秒数
 */
function restoreCurrentTime(state: StoredPlayerState, fallbackTrack: Track) {
  if (state.currentTrackId !== fallbackTrack.id || typeof state.currentTime !== 'number') return 0

  const safeTime = Math.max(0, Math.floor(state.currentTime))
  return Math.min(safeTime, Math.max(0, fallbackTrack.duration - 8))
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
 * 从缓存状态恢复最近播放歌曲。
 * @param state 缓存状态
 * @param fallbackTrack 当前播放歌曲
 * @returns 最近播放歌曲 id 列表
 */
function restoreRecentTrackIds(state: StoredPlayerState, fallbackTrack: Track) {
  const storedRecentIds = restoreTracksByIds(state.recentTrackIds).map((track) => track.id)
  if (storedRecentIds.length) return storedRecentIds

  return [fallbackTrack.id, ...defaultRecentIds.filter((id) => id !== fallbackTrack.id)].slice(0, 6)
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

/**
 * 从缓存状态恢复音质偏好。
 * @param state 缓存状态
 * @returns 可用的音质档位
 */
function restorePlaybackQuality(state: StoredPlayerState): PlaybackQuality {
  if (state.playbackQuality === 'standard' || state.playbackQuality === 'lossless') return state.playbackQuality
  return 'high'
}

/**
 * 从缓存状态恢复睡眠定时。
 * @param state 缓存状态
 * @returns 可用的睡眠定时分钟数
 */
function restoreSleepTimerMinutes(state: StoredPlayerState): SleepTimerMinutes {
  if (state.sleepTimerMinutes === 15 || state.sleepTimerMinutes === 30 || state.sleepTimerMinutes === 60) {
    return state.sleepTimerMinutes
  }

  return 0
}

/**
 * 从缓存状态恢复自动续播偏好。
 * @param state 缓存状态
 * @returns 是否自动播放下一首
 */
function restoreAutoPlayNext(state: StoredPlayerState) {
  return state.autoPlayNext !== false
}

/**
 * 从缓存状态恢复沉浸歌词偏好。
 * @param state 缓存状态
 * @returns 是否默认展开歌词
 */
function restoreImmersiveLyrics(state: StoredPlayerState) {
  return state.immersiveLyrics === true
}

const storedPlayerState = readStoredPlayerState()
const initialQueue = restoreQueue(storedPlayerState)
const initialCurrentTrack = restoreCurrentTrack(storedPlayerState, initialQueue)
const initialCurrentTime = restoreCurrentTime(storedPlayerState, initialCurrentTrack)
const initialRecentTrackIds = restoreRecentTrackIds(storedPlayerState, initialCurrentTrack)
const audioRef = ref<HTMLAudioElement | null>(null)
const activeView = ref<ViewKey>('discover')
const activeMood = ref<MoodKey>('全部')
const searchKeyword = ref('')
const isSearchFocused = ref(false)
let searchBlurTimer: number | undefined
const isPlaying = ref(false)
const currentTime = ref(initialCurrentTime)
const currentTrack = ref<Track>(initialCurrentTrack)
const duration = ref(currentTrack.value.duration)
const volume = ref(restoreVolume(storedPlayerState))
const queue = ref<Track[]>(initialQueue)
const likedIds = ref<Set<number>>(new Set(restoreLikedIds(storedPlayerState)))
const recentTrackIds = ref<number[]>(initialRecentTrackIds)
const playMode = ref<PlayMode>(restorePlayMode(storedPlayerState))
const isQueueOpen = ref(false)
const isSettingsOpen = ref(false)
const playbackQuality = ref<PlaybackQuality>(restorePlaybackQuality(storedPlayerState))
const sleepTimerMinutes = ref<SleepTimerMinutes>(restoreSleepTimerMinutes(storedPlayerState))
const autoPlayNext = ref(restoreAutoPlayNext(storedPlayerState))
const immersiveLyrics = ref(restoreImmersiveLyrics(storedPlayerState))
const isLyricOpen = ref(immersiveLyrics.value)
const toastMessage = ref('')
const albums = createAlbumResults()
const selectedPlaylist = ref<Playlist>(playlists[0])
const selectedArtist = ref<Artist>(artists[0])
const selectedAlbum = ref<SearchAlbumResult>(albums[0])

const normalizedSearchKeyword = computed(() => searchKeyword.value.trim())

const normalizedSearchTerm = computed(() => normalizedSearchKeyword.value.toLowerCase())

const isSearching = computed(() => normalizedSearchKeyword.value.length > 0)

const filteredTracks = computed(() => {
  if (normalizedSearchTerm.value) {
    return tracks.filter((track) => matchesSearchKeyword(track, normalizedSearchTerm.value))
  }

  const moodTracks = activeMood.value === '全部'
    ? tracks
    : tracks.filter((track) => track.mood.includes(activeMood.value))

  return moodTracks
})

const searchSuggestions = computed(() => {
  const keyword = normalizedSearchTerm.value
  if (!keyword) return []

  return tracks
    .filter((track) => matchesSearchKeyword(track, keyword))
    .slice(0, 4)
})

const searchResultArtists = computed(() => {
  if (!isSearching.value) return []
  return createSearchArtistResults(filteredTracks.value)
})

const searchResultAlbums = computed(() => {
  if (!isSearching.value) return []
  return createSearchAlbumResults(filteredTracks.value)
})

const searchResultSummary = computed(() => {
  if (!isSearching.value) return ''
  if (!filteredTracks.value.length) return `暂无与「${normalizedSearchKeyword.value}」相关的内容`
  return `${filteredTracks.value.length} 首歌曲 · ${searchResultArtists.value.length} 位艺人 · ${searchResultAlbums.value.length} 张专辑`
})

const selectedPlaylistArtistSummary = computed(() => {
  return getPlaylistArtistSummary(selectedPlaylist.value)
})

const selectedPlaylistStats = computed<PlaylistStat[]>(() => {
  return [
    { label: '曲目', value: `${selectedPlaylist.value.tracks.length} 首`, icon: 'i-carbon-music' },
    { label: '总时长', value: formatTime(getPlaylistTotalDuration(selectedPlaylist.value)), icon: 'i-carbon-time' },
    { label: '播放量', value: formatPlayCount(getPlaylistTotalPlays(selectedPlaylist.value)), icon: 'i-carbon-activity' },
  ]
})

const selectedAlbumLeadTrack = computed(() => {
  return selectedAlbum.value.tracks[0]
})

const featuredChart = charts[0]

const featuredChartLeadTrack = computed(() => {
  return getChartLeadTrack(featuredChart)
})

const chartOverviewStats = computed<ChartStat[]>(() => {
  const totalTrackCount = charts.reduce((total, chart) => total + chart.tracks.length, 0)
  const totalPlayCount = charts.reduce((total, chart) => total + getChartTotalPlays(chart), 0)
  const hottestChart = charts.reduce((current, chart) => {
    return getChartTotalPlays(chart) > getChartTotalPlays(current) ? chart : current
  }, charts[0])

  return [
    { label: '榜单覆盖', value: `${totalTrackCount} 首`, icon: 'i-carbon-analytics' },
    { label: '热度峰值', value: formatPlayCount(totalPlayCount), icon: 'i-carbon-activity' },
    { label: '主打榜单', value: hottestChart.title, icon: 'i-carbon-star' },
  ]
})

const queueIndex = computed(() => queue.value.findIndex((track) => track.id === currentTrack.value.id))

const likedTracks = computed(() => tracks.filter((track) => likedIds.value.has(track.id)))

const recentTracks = computed(() => restoreTracksByIds(recentTrackIds.value))

const favoriteArtists = computed(() => {
  const artistCounts = likedTracks.value.reduce<Record<string, number>>((counts, track) => {
    counts[track.artist] = (counts[track.artist] || 0) + 1
    return counts
  }, {})

  return Object.entries(artistCounts)
    .sort(([, currentCount], [, nextCount]) => nextCount - currentCount)
    .slice(0, 3)
    .map(([name, count]) => ({ name, count }))
})

const selectedArtistTracks = computed(() => {
  return getArtistPopularTracks(selectedArtist.value)
})

const selectedArtistLeadTrack = computed(() => {
  return selectedArtistTracks.value[0]
})

const selectedArtistStats = computed<ArtistStat[]>(() => {
  return [
    { label: '作品', value: `${selectedArtistTracks.value.length} 首`, icon: 'i-carbon-music' },
    { label: '累计播放', value: formatPlayCount(getArtistTotalPlays(selectedArtist.value)), icon: 'i-carbon-activity' },
    { label: '月听众', value: selectedArtist.value.listeners, icon: 'i-carbon-user-multiple' },
  ]
})

const hasEmptySearchResult = computed(() => {
  return isSearching.value && filteredTracks.value.length === 0
})

const hasVisibleSearchSuggestions = computed(() => {
  return isSearchFocused.value && searchSuggestions.value.length > 0
})

const trackPanelTitle = computed(() => {
  return isSearching.value ? '歌曲结果' : '今日推荐歌曲'
})

const trackPanelSummary = computed(() => {
  const keyword = normalizedSearchKeyword.value
  if (keyword) return `${filteredTracks.value.length} 首匹配「${keyword}」`
  return `${filteredTracks.value.length} 首匹配`
})

const continueProgress = computed(() => {
  if (!duration.value) return 0
  return Math.min(100, Math.round((currentTime.value / duration.value) * 100))
})

const continueProgressLabel = computed(() => {
  if (currentTime.value > 0) {
    return `已听 ${formatTime(currentTime.value)} / ${formatTime(duration.value)}`
  }

  return `${formatTime(duration.value)} 时长 · 当前队列 ${queue.value.length} 首`
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

const queueButtonLabel = computed(() => {
  return `打开播放队列，当前 ${queue.value.length} 首`
})

const queueSummaryLabel = computed(() => {
  if (queueIndex.value < 0) return `${queue.value.length} 首歌曲`
  return `${queue.value.length} 首歌曲 · 当前第 ${queueIndex.value + 1} 首`
})

const currentQualityMeta = computed(() => {
  return playbackQualityOptions.find((option) => option.key === playbackQuality.value) || playbackQualityOptions[1]
})

const sleepTimerLabel = computed(() => {
  if (!sleepTimerMinutes.value) return '睡眠定时已关闭'
  return `${sleepTimerMinutes.value} 分钟后暂停播放`
})

const settingsButtonLabel = computed(() => {
  return `打开播放设置，当前音质 ${currentQualityMeta.value.label}`
})

/**
 * 保存播放器和个人音乐状态。
 */
function savePlayerState() {
  if (!canUseStorage()) return

  const state: StoredPlayerState = {
    autoPlayNext: autoPlayNext.value,
    currentTime: Math.floor(currentTime.value),
    currentTrackId: currentTrack.value.id,
    immersiveLyrics: immersiveLyrics.value,
    likedIds: [...likedIds.value],
    playMode: playMode.value,
    playbackQuality: playbackQuality.value,
    queueIds: queue.value.map((track) => track.id),
    recentTrackIds: recentTrackIds.value,
    sleepTimerMinutes: sleepTimerMinutes.value,
    volume: volume.value,
  }

  window.localStorage.setItem(playerStorageKey, JSON.stringify(state))
}

watch(
  [currentTrack, currentTime, queue, likedIds, playMode, recentTrackIds, volume, playbackQuality, sleepTimerMinutes, autoPlayNext, immersiveLyrics],
  savePlayerState,
  { deep: true },
)

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
  isSettingsOpen.value = false
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
 * 记录最近播放歌曲。
 * @param track 播放过的歌曲
 */
function rememberRecentTrack(track: Track) {
  recentTrackIds.value = [track.id, ...recentTrackIds.value.filter((id) => id !== track.id)].slice(0, 6)
}

/**
 * 继续播放当前歌曲。
 */
async function continuePlayback() {
  isPlaying.value = true
  await nextTick()

  if (!audioRef.value) return
  if (currentTime.value > 0) audioRef.value.currentTime = currentTime.value

  await audioRef.value.play().catch(() => {
    isPlaying.value = false
    showToast('继续播放失败，请再次点击播放')
  })
}

/**
 * 计算偏好艺人占比。
 * @param count 艺人在收藏中的歌曲数量
 * @returns CSS 宽度百分比
 */
function getFavoriteArtistShare(count: number) {
  if (!likedTracks.value.length) return '0%'
  return `${Math.max(16, Math.round((count / likedTracks.value.length) * 100))}%`
}

/**
 * 选择要查看详情的歌单。
 * @param playlist 目标歌单
 */
function selectPlaylist(playlist: Playlist) {
  selectedPlaylist.value = playlist
}

/**
 * 选择要查看详情的艺人。
 * @param artist 目标艺人
 */
function selectArtist(artist: Artist) {
  selectedArtist.value = artist
}

/**
 * 选择要查看详情的专辑。
 * @param album 目标专辑
 */
function selectAlbum(album: SearchAlbumResult) {
  selectedAlbum.value = album
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
  rememberRecentTrack(track)

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
 * 播放艺人热门歌曲。
 * @param artist 目标艺人
 */
function playArtist(artist: Artist) {
  const artistTracks = getArtistPopularTracks(artist)
  const [firstTrack] = artistTracks
  if (!firstTrack) return
  selectArtist(artist)
  void playTrack(firstTrack, artistTracks)
  showToast(`开始播放 ${artist.name}`)
}

/**
 * 播放歌单中的指定歌曲。
 * @param playlist 歌曲所属歌单
 * @param track 目标歌曲
 */
function playPlaylistTrack(playlist: Playlist, track: Track) {
  selectPlaylist(playlist)
  void playTrack(track, playlist.tracks)
}

/**
 * 将歌单中未在队列内的歌曲追加到播放队列。
 * @param playlist 目标歌单
 */
function addPlaylistToQueue(playlist: Playlist) {
  const nextTracks = playlist.tracks.filter((track) => !queue.value.some((item) => item.id === track.id))

  if (!nextTracks.length) {
    showToast('歌单歌曲已在队列中')
    return
  }

  queue.value = [...queue.value, ...nextTracks]
  showToast(`已添加《${playlist.title}》到队列`)
}

/**
 * 播放指定专辑。
 * @param album 目标专辑
 */
function playAlbum(album: SearchAlbumResult) {
  const [firstTrack] = album.tracks
  if (!firstTrack) return
  selectAlbum(album)
  void playTrack(firstTrack, album.tracks)
  showToast(`开始播放《${album.title}》`)
}

/**
 * 播放专辑中的指定歌曲。
 * @param album 歌曲所属专辑
 * @param track 目标歌曲
 */
function playAlbumTrack(album: SearchAlbumResult, track: Track) {
  selectAlbum(album)
  void playTrack(track, album.tracks)
}

/**
 * 播放指定榜单。
 * @param chart 目标榜单
 */
function playChart(chart: Chart) {
  const [firstTrack] = chart.tracks
  if (!firstTrack) return
  void playTrack(firstTrack, chart.tracks)
  showToast(`开始播放${chart.title}`)
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
 * 处理歌曲自然播放结束。
 */
function handleTrackEnded() {
  if (!autoPlayNext.value) {
    isPlaying.value = false
    currentTime.value = 0
    showToast('自动续播已关闭')
    return
  }

  playNextTrack()
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
  const loadedDuration = audioRef.value?.duration || currentTrack.value.duration
  duration.value = loadedDuration

  if (audioRef.value && currentTime.value > 0 && currentTime.value < loadedDuration) {
    audioRef.value.currentTime = currentTime.value
  }
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
 * 打开或关闭播放设置面板。
 */
function toggleSettingsPanel() {
  isSettingsOpen.value = !isSettingsOpen.value
  if (isSettingsOpen.value) isQueueOpen.value = false
}

/**
 * 关闭播放设置面板。
 */
function closeSettingsPanel() {
  isSettingsOpen.value = false
}

/**
 * 切换音质偏好。
 * @param quality 目标音质档位
 */
function selectPlaybackQuality(quality: PlaybackQuality) {
  playbackQuality.value = quality
  const qualityMeta = playbackQualityOptions.find((option) => option.key === quality)
  showToast(`已切换为${qualityMeta?.label || '高品'}音质`)
}

/**
 * 切换自动续播偏好。
 */
function toggleAutoPlayNext() {
  autoPlayNext.value = !autoPlayNext.value
  showToast(autoPlayNext.value ? '已开启自动续播' : '已关闭自动续播')
}

/**
 * 切换沉浸歌词偏好。
 */
function toggleImmersiveLyrics() {
  immersiveLyrics.value = !immersiveLyrics.value
  isLyricOpen.value = immersiveLyrics.value
  showToast(immersiveLyrics.value ? '已开启沉浸歌词' : '已关闭沉浸歌词')
}

/**
 * 设置睡眠定时。
 * @param minutes 睡眠定时分钟数
 */
function setSleepTimer(minutes: SleepTimerMinutes) {
  sleepTimerMinutes.value = minutes
  showToast(minutes ? `将在 ${minutes} 分钟后暂停` : '已关闭睡眠定时')
}

/**
 * 获取歌曲在播放队列中的位置。
 * @param track 目标歌曲
 * @returns 队列索引
 */
function findQueueTrackIndex(track: Track) {
  return queue.value.findIndex((item) => item.id === track.id)
}

/**
 * 交换播放队列中的两首歌曲。
 * @param source 原始队列
 * @param currentIndex 当前索引
 * @param nextIndex 目标索引
 * @returns 调整后的队列
 */
function swapQueueTracks(source: Track[], currentIndex: number, nextIndex: number) {
  const nextQueue = [...source]
  const currentTrackItem = nextQueue[currentIndex]
  const nextTrackItem = nextQueue[nextIndex]
  if (!currentTrackItem || !nextTrackItem) return source
  nextQueue[currentIndex] = nextTrackItem
  nextQueue[nextIndex] = currentTrackItem
  return nextQueue
}

/**
 * 将歌曲插入到队列指定位置。
 * @param source 原始队列
 * @param track 目标歌曲
 * @param index 插入位置
 * @returns 插入后的队列
 */
function insertQueueTrackAt(source: Track[], track: Track, index: number) {
  const nextQueue = [...source]
  nextQueue.splice(Math.max(0, index), 0, track)
  return nextQueue
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
 * 调整歌曲在播放队列中的顺序。
 * @param track 目标歌曲
 * @param direction 移动方向，-1 为上移，1 为下移
 */
function moveQueueTrack(track: Track, direction: -1 | 1) {
  const currentIndex = findQueueTrackIndex(track)
  const nextIndex = currentIndex + direction

  if (currentIndex < 0) return

  if (nextIndex < 0 || nextIndex >= queue.value.length) {
    showToast(direction < 0 ? '已在队列顶部' : '已在队列底部')
    return
  }

  queue.value = swapQueueTracks(queue.value, currentIndex, nextIndex)
  showToast('已调整播放顺序')
}

/**
 * 将歌曲设为当前歌曲后的下一首。
 * @param track 目标歌曲
 */
function playQueueTrackNext(track: Track) {
  if (track.id === currentTrack.value.id) {
    showToast('当前歌曲正在播放')
    return
  }

  const queueWithoutTrack = queue.value.filter((item) => item.id !== track.id)
  const currentIndex = queueWithoutTrack.findIndex((item) => item.id === currentTrack.value.id)
  const insertIndex = currentIndex >= 0 ? currentIndex + 1 : 1
  queue.value = insertQueueTrackAt(queueWithoutTrack, track, insertIndex)
  showToast(`已将《${track.title}》设为下一首`)
}

/**
 * 仅保留当前播放歌曲。
 */
function keepCurrentQueueTrack() {
  queue.value = [currentTrack.value]
  showToast('已仅保留当前播放')
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

/**
 * 使用艺人名继续搜索。
 * @param artistName 艺人名
 */
function selectSearchArtist(artistName: string) {
  searchKeyword.value = artistName
  activeMood.value = '全部'
  activeView.value = 'discover'
  closeSearchSuggestions()
}

/**
 * 播放搜索结果中的专辑。
 * @param album 搜索专辑结果
 */
function playSearchAlbum(album: SearchAlbumResult) {
  playAlbum(album)
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

          <section v-if="isSearching" class="search-results-overview" aria-label="搜索结果概览">
            <div class="search-result-hero">
              <span class="section-kicker">Search</span>
              <h2>{{ normalizedSearchKeyword }}</h2>
              <p>{{ searchResultSummary }}</p>
            </div>

            <div v-if="filteredTracks.length" class="search-groups">
              <section class="search-group">
                <div class="search-group-head">
                  <span class="i-carbon-music" aria-hidden="true"></span>
                  <strong>歌曲</strong>
                  <small>{{ filteredTracks.length }} 首</small>
                </div>
                <button
                  v-for="track in filteredTracks.slice(0, 2)"
                  :key="track.id"
                  type="button"
                  class="search-mini-track"
                  @click="playTrack(track, filteredTracks)"
                >
                  <img :src="track.cover" :alt="track.album" />
                  <span>
                    <strong>{{ track.title }}</strong>
                    <small>{{ track.artist }}</small>
                  </span>
                  <i class="i-carbon-play-filled" aria-hidden="true"></i>
                </button>
              </section>

              <section class="search-group">
                <div class="search-group-head">
                  <span class="i-carbon-user-avatar" aria-hidden="true"></span>
                  <strong>艺人</strong>
                  <small>{{ searchResultArtists.length }} 位</small>
                </div>
                <button
                  v-for="artist in searchResultArtists.slice(0, 2)"
                  :key="artist.name"
                  type="button"
                  class="search-artist-card"
                  @click="selectSearchArtist(artist.name)"
                >
                  <img :src="artist.avatar" :alt="artist.name" />
                  <span>
                    <strong>{{ artist.name }}</strong>
                    <small>{{ artist.role }}</small>
                  </span>
                  <em>{{ artist.tracks.length }} 首</em>
                </button>
              </section>

              <section class="search-group">
                <div class="search-group-head">
                  <span class="i-carbon-recording" aria-hidden="true"></span>
                  <strong>专辑</strong>
                  <small>{{ searchResultAlbums.length }} 张</small>
                </div>
                <button
                  v-for="album in searchResultAlbums.slice(0, 2)"
                  :key="album.key"
                  type="button"
                  class="search-album-card"
                  @click="playSearchAlbum(album)"
                >
                  <img :src="album.cover" :alt="album.title" />
                  <span>
                    <strong>{{ album.title }}</strong>
                    <small>{{ album.artist }} · {{ formatTime(album.totalDuration) }}</small>
                  </span>
                  <i class="i-carbon-play-filled" aria-hidden="true"></i>
                </button>
              </section>
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
            <article
              v-for="playlist in playlists"
              :key="playlist.id"
              :class="['playlist-card', { active: selectedPlaylist.id === playlist.id }]"
            >
              <img :src="playlist.cover" :alt="playlist.title" />
              <div>
                <span :style="{ color: playlist.color }">{{ playlist.tag }}</span>
                <h3>{{ playlist.title }}</h3>
                <p>{{ playlist.subtitle }}</p>
                <div class="playlist-card-actions">
                  <button type="button" @click="playPlaylist(playlist)">
                    <span class="i-carbon-play-filled" aria-hidden="true"></span>
                    播放
                  </button>
                  <button type="button" class="playlist-detail-button" @click="selectPlaylist(playlist)">
                    <span class="i-carbon-view" aria-hidden="true"></span>
                    详情
                  </button>
                </div>
              </div>
            </article>
          </section>

          <section class="playlist-detail" :style="{ '--accent': selectedPlaylist.color }" aria-label="歌单详情">
            <div class="playlist-detail-cover">
              <img :src="selectedPlaylist.cover" :alt="selectedPlaylist.title" />
            </div>

            <div class="playlist-detail-body">
              <div class="playlist-detail-head">
                <div>
                  <span class="section-kicker">{{ selectedPlaylist.tag }}</span>
                  <h2>{{ selectedPlaylist.title }}</h2>
                  <p>{{ selectedPlaylist.subtitle }}</p>
                  <small>{{ selectedPlaylistArtistSummary }}</small>
                </div>
                <div class="playlist-detail-actions">
                  <button type="button" class="primary-button" @click="playPlaylist(selectedPlaylist)">
                    <span class="i-carbon-play-filled" aria-hidden="true"></span>
                    播放全部
                  </button>
                  <button type="button" class="ghost-button" @click="addPlaylistToQueue(selectedPlaylist)">
                    <span class="i-carbon-add-alt" aria-hidden="true"></span>
                    加入队列
                  </button>
                </div>
              </div>

              <div class="playlist-stat-grid" aria-label="歌单统计">
                <article v-for="stat in selectedPlaylistStats" :key="stat.label" class="playlist-stat-card">
                  <span :class="stat.icon" aria-hidden="true"></span>
                  <small>{{ stat.label }}</small>
                  <strong>{{ stat.value }}</strong>
                </article>
              </div>

              <div class="playlist-detail-list">
                <button
                  v-for="(track, index) in selectedPlaylist.tracks"
                  :key="track.id"
                  type="button"
                  class="playlist-detail-track"
                  @click="playPlaylistTrack(selectedPlaylist, track)"
                >
                  <span class="playlist-track-index">{{ String(index + 1).padStart(2, '0') }}</span>
                  <img :src="track.cover" :alt="track.album" />
                  <span class="playlist-track-copy">
                    <strong>{{ track.title }}</strong>
                    <small>{{ track.artist }} · {{ track.album }}</small>
                  </span>
                  <em>{{ formatPlayCount(track.plays) }}</em>
                  <time>{{ formatTime(track.duration) }}</time>
                </button>
              </div>
            </div>
          </section>

          <section class="album-section" aria-label="新碟速览">
            <div class="section-row compact">
              <div>
                <span class="section-kicker">Albums</span>
                <h2>新碟与专辑</h2>
              </div>
              <p class="section-note">按完整作品收听，把一组声音连成更完整的叙事。</p>
            </div>

            <div class="album-grid">
              <button
                v-for="album in albums"
                :key="album.key"
                type="button"
                :class="['album-card', { active: selectedAlbum.key === album.key }]"
                @click="selectAlbum(album)"
              >
                <img :src="album.cover" :alt="album.title" />
                <span>
                  <strong>{{ album.title }}</strong>
                  <small>{{ album.artist }} · {{ album.tracks.length }} 首</small>
                </span>
              </button>
            </div>

            <section class="album-detail" aria-label="专辑详情">
              <div class="album-detail-cover">
                <img :src="selectedAlbum.cover" :alt="selectedAlbum.title" />
              </div>

              <div class="album-detail-body">
                <div class="album-detail-head">
                  <div>
                    <span class="section-kicker">Album Focus</span>
                    <h3>{{ selectedAlbum.title }}</h3>
                    <p>{{ selectedAlbum.artist }} · {{ selectedAlbum.tracks.length }} 首 · {{ formatTime(selectedAlbum.totalDuration) }}</p>
                    <small>累计播放 {{ formatPlayCount(selectedAlbum.totalPlays) }}</small>
                  </div>
                  <div class="album-detail-actions">
                    <button type="button" class="primary-button" @click="playAlbum(selectedAlbum)">
                      <span class="i-carbon-play-filled" aria-hidden="true"></span>
                      播放专辑
                    </button>
                    <button
                      v-if="selectedAlbumLeadTrack"
                      type="button"
                      class="ghost-button"
                      @click="playAlbumTrack(selectedAlbum, selectedAlbumLeadTrack)"
                    >
                      <span class="i-carbon-headphones" aria-hidden="true"></span>
                      试听主打
                    </button>
                  </div>
                </div>

                <div class="album-track-list">
                  <button
                    v-for="(track, index) in selectedAlbum.tracks"
                    :key="track.id"
                    type="button"
                    class="album-track-button"
                    @click="playAlbumTrack(selectedAlbum, track)"
                  >
                    <span>{{ String(index + 1).padStart(2, '0') }}</span>
                    <img :src="track.cover" :alt="track.album" />
                    <strong>{{ track.title }}</strong>
                    <time>{{ formatTime(track.duration) }}</time>
                  </button>
                </div>
              </div>
            </section>
          </section>

          <section class="artist-strip">
            <div class="section-row compact">
              <div>
                <span class="section-kicker">Artists</span>
                <h2>正在被听见的声音</h2>
              </div>
            </div>
            <div class="artist-list">
              <button
                v-for="artist in artists"
                :key="artist.id"
                type="button"
                :class="['artist-card', { active: selectedArtist.id === artist.id }]"
                @click="selectArtist(artist)"
              >
                <img :src="artist.avatar" :alt="artist.name" />
                <strong>{{ artist.name }}</strong>
                <span>{{ artist.role }}</span>
                <small>{{ artist.listeners }}</small>
              </button>
            </div>

            <section class="artist-detail" aria-label="艺人详情">
              <div class="artist-detail-profile">
                <img :src="selectedArtist.avatar" :alt="selectedArtist.name" />
                <div>
                  <span class="section-kicker">Artist Radio</span>
                  <h3>{{ selectedArtist.name }}</h3>
                  <p>{{ selectedArtist.role }}</p>
                  <div class="artist-detail-actions">
                    <button type="button" class="primary-button" @click="playArtist(selectedArtist)">
                      <span class="i-carbon-play-filled" aria-hidden="true"></span>
                      播放热门
                    </button>
                    <button
                      v-if="selectedArtistLeadTrack"
                      type="button"
                      class="ghost-button"
                      @click="playTrack(selectedArtistLeadTrack, selectedArtistTracks)"
                    >
                      <span class="i-carbon-headphones" aria-hidden="true"></span>
                      试听代表作
                    </button>
                  </div>
                </div>
              </div>

              <div class="artist-stat-grid" aria-label="艺人统计">
                <article v-for="stat in selectedArtistStats" :key="stat.label" class="artist-stat-card">
                  <span :class="stat.icon" aria-hidden="true"></span>
                  <small>{{ stat.label }}</small>
                  <strong>{{ stat.value }}</strong>
                </article>
              </div>

              <div class="artist-track-list">
                <button
                  v-for="track in selectedArtistTracks"
                  :key="track.id"
                  type="button"
                  class="artist-track-button"
                  @click="playTrack(track, selectedArtistTracks)"
                >
                  <img :src="track.cover" :alt="track.album" />
                  <span>
                    <strong>{{ track.title }}</strong>
                    <small>{{ track.album }} · {{ formatPlayCount(track.plays) }}</small>
                  </span>
                  <time>{{ formatTime(track.duration) }}</time>
                </button>
              </div>
            </section>
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

          <section class="chart-dashboard" aria-label="榜单概览">
            <article class="chart-feature-card" :style="{ '--accent': featuredChart.accent }">
              <div class="chart-feature-copy">
                <span class="section-kicker">本日主榜</span>
                <h3>{{ featuredChart.title }}</h3>
                <p>{{ featuredChart.description }}</p>
                <div class="chart-feature-actions">
                  <button type="button" class="primary-button" @click="playChart(featuredChart)">
                    <span class="i-carbon-play-filled" aria-hidden="true"></span>
                    播放整榜
                  </button>
                  <button
                    v-if="featuredChartLeadTrack"
                    type="button"
                    class="ghost-button"
                    @click="playTrack(featuredChartLeadTrack, featuredChart.tracks)"
                  >
                    <span class="i-carbon-headphones" aria-hidden="true"></span>
                    试听榜首
                  </button>
                </div>
              </div>

              <div v-if="featuredChartLeadTrack" class="chart-lead-row">
                <img :src="featuredChartLeadTrack.cover" :alt="featuredChartLeadTrack.album" />
                <span>
                  <small>TOP 1</small>
                  <strong>{{ featuredChartLeadTrack.title }}</strong>
                  <em>{{ featuredChartLeadTrack.artist }} · {{ formatPlayCount(featuredChartLeadTrack.plays) }}</em>
                </span>
              </div>
            </article>

            <div class="chart-stat-grid">
              <article v-for="stat in chartOverviewStats" :key="stat.label" class="chart-stat-card">
                <span :class="stat.icon" aria-hidden="true"></span>
                <small>{{ stat.label }}</small>
                <strong>{{ stat.value }}</strong>
              </article>
            </div>
          </section>

          <div class="chart-grid">
            <article v-for="chart in charts" :key="chart.id" class="chart-card" :style="{ '--accent': chart.accent }">
              <div class="chart-head">
                <span></span>
                <div class="chart-head-body">
                  <div class="chart-title-row">
                    <h3>{{ chart.title }}</h3>
                    <em>
                      <span class="i-carbon-arrow-up" aria-hidden="true"></span>
                      {{ chart.trend }}
                    </em>
                  </div>
                  <p>{{ chart.description }}</p>
                  <div class="chart-meta-row">
                    <small>
                      <span class="i-carbon-time" aria-hidden="true"></span>
                      {{ chart.updateLabel }}
                    </small>
                    <small>
                      <span class="i-carbon-activity" aria-hidden="true"></span>
                      能量 {{ getChartAverageEnergy(chart) }}%
                    </small>
                  </div>
                  <button type="button" class="chart-play-button" @click="playChart(chart)">
                    <span class="i-carbon-play-filled" aria-hidden="true"></span>
                    播放整榜
                  </button>
                </div>
              </div>
              <ol>
                <li v-for="(track, index) in chart.tracks" :key="track.id">
                  <button type="button" class="chart-track-button" @click="playTrack(track, chart.tracks)">
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
              <p>继续上次的播放进度，回看最近听过的声音，沉淀属于你的音乐偏好。</p>
            </div>
            <button type="button" class="primary-button" @click="isQueueOpen = true">
              打开播放队列
            </button>
          </section>

          <section class="library-dashboard" aria-label="音乐库概览">
            <article class="continue-card">
              <img :src="currentTrack.cover" :alt="currentTrack.album" />
              <div>
                <span class="section-kicker">Continue</span>
                <h3>{{ currentTrack.title }}</h3>
                <p>{{ currentTrack.artist }} · {{ currentTrack.album }}</p>
                <div class="continue-progress" aria-label="当前播放进度">
                  <span :style="{ width: `${continueProgress}%` }"></span>
                </div>
                <small>{{ continueProgressLabel }}</small>
                <div class="continue-actions">
                  <button type="button" class="primary-button" @click="continuePlayback">
                    <span class="i-carbon-play-filled" aria-hidden="true"></span>
                    继续播放
                  </button>
                  <button type="button" class="ghost-button" @click="isQueueOpen = true">
                    <span class="i-carbon-list" aria-hidden="true"></span>
                    查看队列
                  </button>
                </div>
              </div>
            </article>

            <aside class="taste-panel">
              <div>
                <span class="section-kicker">Taste</span>
                <h3>收藏偏好</h3>
              </div>
              <div v-if="favoriteArtists.length" class="taste-list">
                <div v-for="artist in favoriteArtists" :key="artist.name" class="taste-item">
                  <span>
                    <strong>{{ artist.name }}</strong>
                    <small>{{ artist.count }} 首收藏</small>
                  </span>
                  <i :style="{ width: getFavoriteArtistShare(artist.count) }"></i>
                </div>
              </div>
              <p v-else>收藏歌曲后，这里会形成你的常听轮廓。</p>
            </aside>
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

          <section class="recent-section">
            <div class="panel-heading">
              <h3>最近播放</h3>
              <small>{{ recentTracks.length }} 首记录</small>
            </div>
            <div class="recent-grid">
              <button
                v-for="track in recentTracks"
                :key="track.id"
                type="button"
                class="recent-card"
                @click="playTrack(track, recentTracks)"
              >
                <img :src="track.cover" :alt="track.album" />
                <span>
                  <strong>{{ track.title }}</strong>
                  <small>{{ track.artist }} · {{ formatTime(track.duration) }}</small>
                </span>
              </button>
            </div>
          </section>

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

    <button
      v-if="isSettingsOpen"
      type="button"
      class="settings-backdrop"
      aria-label="点击遮罩关闭播放设置"
      @click="closeSettingsPanel"
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
        <button type="button" class="ghost-button subtle" @click="keepCurrentQueueTrack">
          <span class="i-carbon-music" aria-hidden="true"></span>
          仅保留当前
        </button>
        <small>{{ queueSummaryLabel }}</small>
      </div>

      <article
        v-for="(track, index) in queue"
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
        <div class="queue-controls" aria-label="队列歌曲操作">
          <button
            type="button"
            class="queue-tool"
            @click="playQueueTrackNext(track)"
            :aria-label="`将 ${track.title} 设为下一首播放`"
          >
            <span class="i-carbon-next-filled" aria-hidden="true"></span>
          </button>
          <button
            type="button"
            class="queue-tool queue-move"
            :disabled="index === 0"
            @click="moveQueueTrack(track, -1)"
            :aria-label="`上移 ${track.title}`"
          >
            <span class="i-carbon-arrow-up" aria-hidden="true"></span>
          </button>
          <button
            type="button"
            class="queue-tool queue-move"
            :disabled="index === queue.length - 1"
            @click="moveQueueTrack(track, 1)"
            :aria-label="`下移 ${track.title}`"
          >
            <span class="i-carbon-arrow-down" aria-hidden="true"></span>
          </button>
          <button type="button" class="queue-tool danger" @click="removeFromQueue(track)" :aria-label="`从队列移除 ${track.title}`">
            <span class="i-carbon-close" aria-hidden="true"></span>
          </button>
        </div>
      </article>
    </aside>

    <aside :class="['settings-panel', { open: isSettingsOpen }]" aria-label="播放设置">
      <div class="queue-head">
        <div>
          <span class="section-kicker">Settings</span>
          <h2>播放设置</h2>
        </div>
        <button type="button" class="icon-button" @click="closeSettingsPanel" aria-label="关闭播放设置">
          <span class="i-carbon-close" aria-hidden="true"></span>
        </button>
      </div>

      <section class="settings-block" aria-label="音质设置">
        <div class="settings-block-head">
          <span class="settings-icon" aria-hidden="true">
            <span class="i-carbon-volume-up"></span>
          </span>
          <div>
            <strong>音质偏好</strong>
            <small>当前 {{ currentQualityMeta.label }} · {{ currentQualityMeta.detail }}</small>
          </div>
        </div>
        <div class="quality-segments">
          <button
            v-for="option in playbackQualityOptions"
            :key="option.key"
            type="button"
            :class="{ active: playbackQuality === option.key }"
            @click="selectPlaybackQuality(option.key)"
            :aria-label="`切换为${option.label}音质`"
          >
            <strong>{{ option.label }}</strong>
            <small>{{ option.detail }}</small>
          </button>
        </div>
      </section>

      <section class="settings-block" aria-label="播放行为设置">
        <button type="button" class="settings-toggle" @click="toggleAutoPlayNext" :aria-pressed="autoPlayNext">
          <span class="settings-icon" aria-hidden="true">
            <span class="i-carbon-next-filled"></span>
          </span>
          <span>
            <strong>自动续播</strong>
            <small>{{ autoPlayNext ? '歌曲结束后继续下一首' : '歌曲结束后暂停' }}</small>
          </span>
          <i :class="{ active: autoPlayNext }" aria-hidden="true"></i>
        </button>
        <button type="button" class="settings-toggle" @click="toggleImmersiveLyrics" :aria-pressed="immersiveLyrics">
          <span class="settings-icon" aria-hidden="true">
            <span class="i-carbon-microphone"></span>
          </span>
          <span>
            <strong>沉浸歌词</strong>
            <small>{{ immersiveLyrics ? '播放页默认展开歌词' : '手动查看歌词' }}</small>
          </span>
          <i :class="{ active: immersiveLyrics }" aria-hidden="true"></i>
        </button>
      </section>

      <section class="settings-block" aria-label="睡眠定时">
        <div class="settings-block-head">
          <span class="settings-icon" aria-hidden="true">
            <span class="i-carbon-timer"></span>
          </span>
          <div>
            <strong>睡眠定时</strong>
            <small>{{ sleepTimerLabel }}</small>
          </div>
        </div>
        <div class="sleep-options">
          <button
            v-for="option in sleepTimerOptions"
            :key="option.minutes"
            type="button"
            :class="{ active: sleepTimerMinutes === option.minutes }"
            @click="setSleepTimer(option.minutes)"
          >
            {{ option.label }}
          </button>
        </div>
      </section>
    </aside>

    <footer class="player-bar">
      <audio
        ref="audioRef"
        :src="currentTrack.audioUrl"
        preload="metadata"
        @loadedmetadata="handleLoadedMetadata"
        @timeupdate="handleTimeUpdate"
        @ended="handleTrackEnded"
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
          class="icon-button queue-toggle-button"
          :data-count="queue.length"
          :title="queueButtonLabel"
          :aria-label="queueButtonLabel"
          @click="toggleQueuePanel"
        >
          <span class="i-carbon-list" aria-hidden="true"></span>
        </button>
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
        <button
          type="button"
          class="icon-button settings-toggle-button"
          :title="settingsButtonLabel"
          :aria-label="settingsButtonLabel"
          @click="toggleSettingsPanel"
        >
          <span class="i-carbon-settings" aria-hidden="true"></span>
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
.playlist-detail-button,
.playlist-detail-track,
.album-card,
.album-track-button,
.chart-play-button,
.chart-track-button,
.artist-card,
.artist-track-button,
.recent-card,
.search-mini-track,
.search-artist-card,
.search-album-card,
.queue-play,
.queue-tool {
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

.search-results-overview {
  display: grid;
  grid-template-columns: minmax(240px, 0.34fr) minmax(0, 1fr);
  gap: 16px;
  align-items: stretch;
}

.search-result-hero {
  min-width: 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 28px;
  padding: 20px;
  border-radius: 8px;
  background: #121620;
  color: #fff;
  overflow: hidden;
}

.search-result-hero .section-kicker {
  color: #ffcf66;
}

.search-result-hero h2 {
  max-width: 100%;
  margin: 0;
  color: #fff;
  font-size: clamp(30px, 5vw, 54px);
  line-height: 0.98;
  letter-spacing: 0;
  overflow-wrap: anywhere;
}

.search-result-hero p {
  margin: 0;
  color: rgb(255 255 255 / 68%);
}

.search-groups {
  min-width: 0;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
}

.search-group {
  min-width: 0;
  display: grid;
  align-content: start;
  gap: 10px;
  padding: 14px;
  border: 1px solid rgb(34 28 23 / 10%);
  border-radius: 8px;
  background: rgb(255 255 255 / 84%);
  box-shadow: 0 16px 48px rgb(31 23 17 / 8%);
}

.search-group-head {
  min-width: 0;
  display: grid;
  grid-template-columns: 28px minmax(0, 1fr) auto;
  align-items: center;
  gap: 8px;
}

.search-group-head > span {
  width: 28px;
  height: 28px;
  display: grid;
  place-items: center;
  border-radius: 8px;
  background: #eef4f1;
  color: #b3261e;
}

.search-group-head strong,
.search-group-head small {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.search-group-head small {
  color: #756c62;
}

.search-mini-track,
.search-artist-card,
.search-album-card {
  min-width: 0;
  width: 100%;
  display: grid;
  grid-template-columns: 48px minmax(0, 1fr) auto;
  align-items: center;
  gap: 10px;
  padding: 8px;
  border-radius: 8px;
  background: #f6f8fb;
  color: inherit;
  text-align: left;
}

.search-mini-track:hover,
.search-artist-card:hover,
.search-album-card:hover {
  background: #eef4f1;
}

.search-mini-track img,
.search-artist-card img,
.search-album-card img {
  width: 48px;
  height: 48px;
  border-radius: 8px;
  object-fit: cover;
}

.search-artist-card img {
  border-radius: 50%;
}

.search-mini-track span,
.search-artist-card span,
.search-album-card span {
  min-width: 0;
}

.search-mini-track strong,
.search-mini-track small,
.search-artist-card strong,
.search-artist-card small,
.search-album-card strong,
.search-album-card small {
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.search-mini-track small,
.search-artist-card small,
.search-album-card small {
  color: #756c62;
}

.search-mini-track i,
.search-album-card i {
  width: 28px;
  height: 28px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  background: #121620;
  color: #fff;
}

.search-artist-card em {
  color: #b3261e;
  font-size: 12px;
  font-style: normal;
  font-weight: 800;
  white-space: nowrap;
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
.library-card,
.continue-card,
.taste-panel,
.recent-section {
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
.playlist-detail-body,
.playlist-detail-head > div,
.playlist-track-copy,
.album-card span,
.album-detail-body,
.album-detail-head > div,
.artist-detail-profile > div,
.artist-track-button span,
.chart-track-meta,
.continue-card > div,
.recent-card span,
.player-track > div {
  min-width: 0;
}

.track-meta strong,
.track-meta small,
.playlist-card h3,
.playlist-card p,
.playlist-track-copy strong,
.playlist-track-copy small,
.album-card strong,
.album-card small,
.album-track-button strong,
.artist-track-button strong,
.artist-track-button small,
.chart-track-meta strong,
.chart-track-meta small,
.continue-card h3,
.continue-card p,
.recent-card strong,
.recent-card small,
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
  position: relative;
  display: grid;
  grid-template-columns: 136px 1fr;
  gap: 16px;
  min-width: 0;
  padding: 14px;
  transition:
    border-color 0.18s ease,
    box-shadow 0.18s ease,
    transform 0.18s ease;
}

.playlist-card.active {
  border-color: rgb(179 38 30 / 36%);
  box-shadow: 0 18px 56px rgb(179 38 30 / 14%);
  transform: translateY(-2px);
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

.playlist-card-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 10px;
}

.playlist-card button {
  display: inline-flex;
  align-items: center;
  max-width: 100%;
  gap: 6px;
  padding: 8px 11px;
  border-radius: 8px;
  background: #121620;
  color: #fff;
}

.playlist-detail-button {
  border: 1px solid rgb(34 28 23 / 12%);
  background: #fff !important;
  color: #28231f !important;
}

.playlist-detail {
  display: grid;
  grid-template-columns: minmax(220px, 0.42fr) minmax(0, 1fr);
  gap: 18px;
  padding: 18px;
  border: 1px solid rgb(34 28 23 / 10%);
  border-radius: 8px;
  background:
    linear-gradient(135deg, rgb(255 255 255 / 90%), rgb(255 255 255 / 72%)),
    linear-gradient(135deg, var(--accent), transparent 44%);
  box-shadow: 0 16px 48px rgb(31 23 17 / 8%);
}

.playlist-detail-cover {
  min-width: 0;
}

.playlist-detail-cover img {
  width: 100%;
  height: 100%;
  min-height: 320px;
  border-radius: 8px;
  object-fit: cover;
}

.playlist-detail-body {
  display: grid;
  gap: 16px;
}

.playlist-detail-head {
  display: flex;
  align-items: start;
  justify-content: space-between;
  gap: 18px;
}

.playlist-detail-head h2,
.playlist-detail-head p {
  margin: 0;
}

.playlist-detail-head h2 {
  font-size: clamp(28px, 4vw, 42px);
  line-height: 1;
}

.playlist-detail-head p {
  max-width: 620px;
  margin-top: 10px;
  color: #6b6258;
}

.playlist-detail-head small {
  display: block;
  margin-top: 10px;
  color: #756c62;
}

.playlist-detail-actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 10px;
}

.playlist-stat-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;
}

.playlist-stat-card {
  min-width: 0;
  display: grid;
  gap: 8px;
  padding: 14px;
  border-radius: 8px;
  background: rgb(255 255 255 / 74%);
}

.playlist-stat-card > span {
  color: var(--accent);
  font-size: 20px;
}

.playlist-stat-card small {
  color: #756c62;
}

.playlist-stat-card strong {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.playlist-detail-list {
  display: grid;
  gap: 8px;
}

.playlist-detail-track {
  min-width: 0;
  width: 100%;
  display: grid;
  grid-template-columns: 30px 48px minmax(0, 1fr) 72px 48px;
  align-items: center;
  gap: 10px;
  padding: 8px;
  border-radius: 8px;
  background: rgb(255 255 255 / 64%);
  color: inherit;
  text-align: left;
}

.playlist-detail-track:hover {
  background: #eef4f1;
}

.playlist-detail-track img {
  width: 48px;
  height: 48px;
  border-radius: 8px;
  object-fit: cover;
}

.playlist-track-index,
.playlist-detail-track em,
.playlist-detail-track time {
  color: #756c62;
  font-size: 13px;
  white-space: nowrap;
}

.playlist-track-index {
  font-weight: 900;
}

.playlist-track-copy {
  display: grid;
  gap: 3px;
}

.playlist-detail-track em {
  font-style: normal;
}

.playlist-detail-track time {
  justify-self: end;
}

.album-section {
  display: grid;
  gap: 16px;
}

.album-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
}

.album-card {
  min-width: 0;
  display: grid;
  grid-template-columns: 64px minmax(0, 1fr);
  align-items: center;
  gap: 12px;
  padding: 12px;
  border: 1px solid rgb(34 28 23 / 10%);
  border-radius: 8px;
  background: #fff;
  color: inherit;
  text-align: left;
  transition:
    border-color 0.18s ease,
    box-shadow 0.18s ease,
    transform 0.18s ease;
}

.album-card.active {
  border-color: rgb(179 38 30 / 32%);
  box-shadow: 0 16px 46px rgb(179 38 30 / 12%);
  transform: translateY(-2px);
}

.album-card img {
  width: 64px;
  height: 64px;
  border-radius: 8px;
  object-fit: cover;
}

.album-card span,
.album-card strong,
.album-card small {
  display: block;
}

.album-card small {
  color: #756c62;
}

.album-detail {
  display: grid;
  grid-template-columns: 220px minmax(0, 1fr);
  gap: 18px;
  padding: 16px;
  border: 1px solid rgb(34 28 23 / 10%);
  border-radius: 8px;
  background:
    linear-gradient(135deg, rgb(18 22 30 / 94%), rgb(36 106 115 / 88%)),
    #121620;
  color: #fff;
  box-shadow: 0 20px 60px rgb(18 22 30 / 18%);
}

.album-detail .section-kicker {
  color: #ffcf66;
}

.album-detail-cover img {
  width: 100%;
  height: 100%;
  min-height: 260px;
  border-radius: 8px;
  object-fit: cover;
}

.album-detail-body {
  display: grid;
  gap: 16px;
}

.album-detail-head {
  display: flex;
  align-items: start;
  justify-content: space-between;
  gap: 18px;
}

.album-detail-head h3,
.album-detail-head p {
  margin: 0;
}

.album-detail-head h3 {
  font-size: clamp(30px, 4vw, 46px);
  line-height: 1;
}

.album-detail-head p,
.album-detail-head small {
  color: rgb(255 255 255 / 72%);
}

.album-detail-head p {
  margin-top: 10px;
}

.album-detail-head small {
  display: block;
  margin-top: 10px;
}

.album-detail-actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 10px;
}

.album-detail .primary-button {
  background: #fff;
  color: #121620;
  box-shadow: none;
}

.album-detail .ghost-button {
  border-color: rgb(255 255 255 / 18%);
  background: rgb(255 255 255 / 10%);
  color: #fff;
}

.album-track-list {
  display: grid;
  gap: 8px;
}

.album-track-button {
  min-width: 0;
  width: 100%;
  display: grid;
  grid-template-columns: 28px 46px minmax(0, 1fr) 48px;
  align-items: center;
  gap: 10px;
  padding: 8px;
  border-radius: 8px;
  background: rgb(255 255 255 / 10%);
  color: inherit;
  text-align: left;
}

.album-track-button:hover {
  background: rgb(255 255 255 / 16%);
}

.album-track-button span,
.album-track-button time {
  color: rgb(255 255 255 / 66%);
  font-size: 13px;
  white-space: nowrap;
}

.album-track-button img {
  width: 46px;
  height: 46px;
  border-radius: 8px;
  object-fit: cover;
}

.album-track-button time {
  justify-self: end;
}

.artist-strip {
  display: grid;
  gap: 16px;
}

.artist-list {
  grid-template-columns: repeat(4, minmax(0, 1fr));
}

.artist-card {
  min-width: 0;
  padding: 16px;
  border: 1px solid rgb(34 28 23 / 10%);
  border-radius: 8px;
  background: #fff;
  color: inherit;
  text-align: left;
  transition:
    border-color 0.18s ease,
    box-shadow 0.18s ease,
    transform 0.18s ease;
}

.artist-card.active {
  border-color: rgb(36 106 115 / 38%);
  box-shadow: 0 18px 52px rgb(36 106 115 / 13%);
  transform: translateY(-2px);
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

.artist-detail {
  display: grid;
  grid-template-columns: minmax(0, 1.1fr) minmax(260px, 0.9fr);
  gap: 16px;
  align-items: stretch;
  padding: 16px;
  border: 1px solid rgb(34 28 23 / 10%);
  border-radius: 8px;
  background: rgb(255 255 255 / 84%);
  box-shadow: 0 16px 48px rgb(31 23 17 / 8%);
}

.artist-detail-profile {
  min-width: 0;
  display: grid;
  grid-template-columns: 132px minmax(0, 1fr);
  gap: 16px;
  align-items: center;
}

.artist-detail-profile > img {
  width: 132px;
  height: 132px;
  border-radius: 8px;
  object-fit: cover;
}

.artist-detail-profile h3,
.artist-detail-profile p {
  margin: 0;
}

.artist-detail-profile h3 {
  font-size: clamp(28px, 4vw, 42px);
  line-height: 1;
}

.artist-detail-profile p {
  margin-top: 10px;
  color: #6f665c;
}

.artist-detail-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 18px;
}

.artist-stat-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;
  grid-column: 1 / -1;
}

.artist-stat-card {
  min-width: 0;
  display: grid;
  gap: 8px;
  padding: 14px;
  border-radius: 8px;
  background: #f6f8fb;
}

.artist-stat-card > span {
  color: #246a73;
  font-size: 20px;
}

.artist-stat-card small {
  color: #756c62;
}

.artist-stat-card strong {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.artist-track-list {
  min-width: 0;
  display: grid;
  gap: 8px;
}

.artist-track-button {
  min-width: 0;
  width: 100%;
  display: grid;
  grid-template-columns: 48px minmax(0, 1fr) 48px;
  align-items: center;
  gap: 10px;
  padding: 8px;
  border-radius: 8px;
  background: #f6f8fb;
  color: inherit;
  text-align: left;
}

.artist-track-button:hover {
  background: #eef4f1;
}

.artist-track-button img {
  width: 48px;
  height: 48px;
  border-radius: 8px;
  object-fit: cover;
}

.artist-track-button span {
  display: grid;
  gap: 3px;
}

.artist-track-button time {
  justify-self: end;
  color: #756c62;
  font-size: 13px;
  white-space: nowrap;
}

.chart-grid {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.chart-dashboard {
  display: grid;
  grid-template-columns: minmax(0, 1.3fr) minmax(260px, 0.7fr);
  gap: 16px;
  align-items: stretch;
}

/* 榜单概览卡片负责强调主榜和核心播放入口。 */
.chart-feature-card {
  min-width: 0;
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(180px, 220px);
  align-items: end;
  gap: 18px;
  padding: 22px;
  border-radius: 8px;
  background:
    radial-gradient(circle at top right, rgb(255 255 255 / 14%), transparent 34%),
    linear-gradient(135deg, #121620 0%, var(--accent) 100%);
  color: #fff;
  box-shadow: 0 20px 60px rgb(18 22 30 / 22%);
}

.chart-feature-copy {
  min-width: 0;
  display: grid;
  gap: 14px;
}

.chart-feature-card .section-kicker,
.chart-lead-row small {
  color: #ffcf66;
}

.chart-feature-card h3,
.chart-feature-card p,
.chart-stat-card strong {
  margin: 0;
}

.chart-feature-card h3 {
  font-size: clamp(30px, 4vw, 42px);
  line-height: 0.98;
}

.chart-feature-card p {
  max-width: 520px;
  color: rgb(255 255 255 / 74%);
}

.chart-feature-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.chart-feature-card .primary-button {
  background: #fff;
  color: #121620;
  box-shadow: none;
}

.chart-feature-card .ghost-button {
  border-color: rgb(255 255 255 / 18%);
  background: rgb(255 255 255 / 10%);
  color: #fff;
}

.chart-lead-row {
  min-width: 0;
  display: grid;
  grid-template-columns: 72px minmax(0, 1fr);
  align-items: center;
  gap: 12px;
  padding: 12px;
  border: 1px solid rgb(255 255 255 / 12%);
  border-radius: 8px;
  background: rgb(255 255 255 / 10%);
  backdrop-filter: blur(10px);
}

.chart-lead-row img {
  width: 72px;
  height: 72px;
  border-radius: 8px;
  object-fit: cover;
}

.chart-lead-row span {
  min-width: 0;
  display: grid;
  gap: 4px;
}

.chart-lead-row strong,
.chart-lead-row em {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.chart-lead-row em {
  color: rgb(255 255 255 / 74%);
  font-style: normal;
}

.chart-stat-grid {
  display: grid;
  gap: 12px;
}

.chart-stat-card {
  min-width: 0;
  display: grid;
  align-content: start;
  gap: 10px;
  padding: 18px;
  border: 1px solid rgb(34 28 23 / 10%);
  border-radius: 8px;
  background: rgb(255 255 255 / 84%);
  box-shadow: 0 16px 48px rgb(31 23 17 / 8%);
}

.chart-stat-card > span {
  width: 36px;
  height: 36px;
  display: grid;
  place-items: center;
  border-radius: 8px;
  background: #eef4f1;
  color: #b3261e;
}

.chart-stat-card small {
  color: #756c62;
}

.chart-stat-card strong {
  font-size: 22px;
  line-height: 1.15;
  overflow-wrap: anywhere;
}

.chart-card {
  display: grid;
  gap: 16px;
  padding: 16px;
}

.chart-head {
  display: flex;
  align-items: stretch;
  gap: 12px;
}

.chart-head > span {
  width: 10px;
  border-radius: 99px;
  background: var(--accent);
}

.chart-head-body {
  min-width: 0;
  display: grid;
  gap: 10px;
}

.chart-title-row {
  display: flex;
  align-items: start;
  justify-content: space-between;
  gap: 12px;
}

.chart-title-row h3 {
  overflow-wrap: anywhere;
}

.chart-title-row em {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  border-radius: 999px;
  background: rgb(179 38 30 / 10%);
  color: #b3261e;
  font-size: 12px;
  font-style: normal;
  font-weight: 800;
  white-space: nowrap;
}

.chart-card p {
  margin: 0;
  color: #6f665c;
}

.chart-meta-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.chart-meta-row small {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  border-radius: 999px;
  background: #f6f8fb;
  color: #5f574f;
}

.chart-play-button {
  width: fit-content;
  min-height: 40px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 0 14px;
  border-radius: 8px;
  background: #121620;
  color: #fff;
  text-align: center;
  transition:
    transform 0.18s ease,
    box-shadow 0.18s ease,
    background 0.18s ease;
}

.chart-play-button:hover {
  background: #1d2432;
  box-shadow: 0 12px 26px rgb(18 22 30 / 18%);
  transform: translateY(-1px);
}

.chart-card ol {
  display: grid;
  gap: 8px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.chart-track-button {
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

.chart-track-button > span:first-child {
  display: grid;
  place-items: center;
  color: var(--accent);
  font-weight: 800;
}

.chart-track-meta {
  display: grid;
  gap: 3px;
}

.chart-track-button:hover {
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

.chart-track-button time {
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

.library-dashboard {
  display: grid;
  grid-template-columns: minmax(0, 1.45fr) minmax(260px, 0.55fr);
  gap: 16px;
  align-items: stretch;
}

.continue-card {
  display: grid;
  grid-template-columns: 168px minmax(0, 1fr);
  gap: 18px;
  padding: 16px;
}

.continue-card > img {
  width: 100%;
  aspect-ratio: 1;
  border-radius: 8px;
  object-fit: cover;
}

.continue-card h3,
.taste-panel h3 {
  margin: 0;
}

.continue-card p,
.taste-panel p {
  color: #6f665c;
}

.continue-progress {
  height: 8px;
  margin: 18px 0 8px;
  border-radius: 99px;
  background: #d9dee8;
  overflow: hidden;
}

.continue-progress span {
  display: block;
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(90deg, #b3261e, #d99224);
}

.continue-card small {
  color: #746a5d;
}

.continue-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 18px;
}

.taste-panel,
.recent-section {
  padding: 16px;
}

.taste-list {
  display: grid;
  gap: 14px;
  margin-top: 18px;
}

.taste-item {
  display: grid;
  gap: 8px;
}

.taste-item span {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.taste-item small {
  color: #756c62;
  white-space: nowrap;
}

.taste-item i {
  height: 7px;
  border-radius: 99px;
  background: #b3261e;
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

.recent-section {
  display: grid;
  gap: 8px;
}

.recent-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;
}

.recent-card {
  min-width: 0;
  display: grid;
  grid-template-columns: 54px minmax(0, 1fr);
  align-items: center;
  gap: 10px;
  padding: 10px;
  border-radius: 8px;
  background: #f6f8fb;
  color: inherit;
  text-align: left;
  cursor: pointer;
}

.recent-card:hover {
  background: #eef4f1;
}

.recent-card img {
  width: 54px;
  height: 54px;
  border-radius: 8px;
  object-fit: cover;
}

.recent-card strong,
.recent-card small {
  display: block;
}

.recent-card small {
  color: #756c62;
}

.queue-backdrop {
  position: fixed;
  inset: 0;
  z-index: 18;
  border: 0;
  background: rgb(18 22 30 / 26%);
  cursor: pointer;
}

.settings-backdrop {
  position: fixed;
  inset: 0;
  z-index: 18;
  border: 0;
  background: rgb(18 22 30 / 30%);
  cursor: pointer;
}

.queue-panel,
.settings-panel {
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

.queue-panel.open,
.settings-panel.open {
  transform: translateX(0);
}

.queue-actions {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 10px;
  padding: 0 8px 14px;
  border-bottom: 1px solid rgb(34 28 23 / 8%);
}

.queue-actions .ghost-button {
  flex: 1 1 150px;
  justify-content: center;
}

.queue-actions .ghost-button.subtle {
  border-color: transparent;
  background: #edf3f6;
  color: #24313c;
}

.queue-actions small {
  flex: 1 0 100%;
  color: #746a5d;
  white-space: nowrap;
}

.queue-item {
  width: 100%;
  display: grid;
  grid-template-columns: minmax(0, 1fr) 48px;
  grid-template-areas:
    'track time'
    'controls controls';
  align-items: center;
  gap: 8px 10px;
  padding: 9px;
  border-radius: 8px;
}

.queue-item.active,
.queue-item:hover {
  background: #edf3f6;
}

.queue-play {
  grid-area: track;
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
  grid-area: time;
  color: #766d62;
  font-size: 13px;
  justify-self: end;
}

.queue-controls {
  grid-area: controls;
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 6px;
}

.queue-tool {
  min-width: 0;
  height: 32px;
  display: grid;
  place-items: center;
  border-radius: 8px;
  background: #fff;
  color: #8b8176;
}

.queue-tool:hover {
  background: rgb(36 106 115 / 10%);
  color: #246a73;
}

.queue-tool.danger:hover {
  background: rgb(179 38 30 / 10%);
  color: #b3261e;
}

.queue-tool:disabled {
  cursor: not-allowed;
  opacity: 0.32;
}

.settings-panel {
  display: grid;
  align-content: start;
  gap: 16px;
}

.settings-block {
  display: grid;
  gap: 12px;
  padding: 14px;
  border: 1px solid rgb(34 28 23 / 8%);
  border-radius: 8px;
  background: #fbfaf7;
}

.settings-block-head {
  display: grid;
  grid-template-columns: 34px minmax(0, 1fr);
  align-items: center;
  gap: 10px;
}

.settings-icon {
  width: 34px;
  height: 34px;
  display: grid;
  place-items: center;
  border-radius: 8px;
  background: #edf3f6;
  color: #246a73;
}

.settings-icon :where([class^='i-carbon-'], [class*=' i-carbon-']) {
  color: inherit;
}

.settings-block strong,
.settings-block small {
  display: block;
}

.settings-block small {
  color: #756c62;
}

.quality-segments,
.sleep-options {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 8px;
}

.quality-segments button,
.sleep-options button,
.settings-toggle {
  border: 0;
  font: inherit;
  cursor: pointer;
}

.quality-segments button,
.sleep-options button {
  min-width: 0;
  padding: 10px;
  border-radius: 8px;
  background: #fff;
  color: #24313c;
  text-align: center;
}

.quality-segments button.active,
.sleep-options button.active {
  background: #121620;
  color: #fff;
}

.quality-segments button.active small {
  color: rgb(255 255 255 / 68%);
}

.settings-toggle {
  min-width: 0;
  display: grid;
  grid-template-columns: 34px minmax(0, 1fr) 46px;
  align-items: center;
  gap: 10px;
  padding: 10px;
  border-radius: 8px;
  background: #fff;
  color: inherit;
  text-align: left;
}

.settings-toggle i {
  width: 46px;
  height: 26px;
  position: relative;
  border-radius: 999px;
  background: #ddd6cc;
}

.settings-toggle i::after {
  content: '';
  position: absolute;
  top: 4px;
  left: 4px;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #fff;
  transition: transform 0.18s ease;
}

.settings-toggle i.active {
  background: #246a73;
}

.settings-toggle i.active::after {
  transform: translateX(20px);
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

.queue-toggle-button {
  position: relative;
}

.queue-toggle-button::after {
  position: absolute;
  right: -4px;
  top: -4px;
  min-width: 16px;
  height: 16px;
  display: grid;
  place-items: center;
  padding: 0 4px;
  border-radius: 999px;
  background: #ffcf66;
  color: #121620;
  font-size: 11px;
  font-weight: 900;
  line-height: 1;
  content: attr(data-count);
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
  .album-grid,
  .library-dashboard,
  .recent-grid,
  .artist-list {
    grid-template-columns: 1fr 1fr;
  }

  .chart-dashboard,
  .chart-feature-card {
    grid-template-columns: 1fr;
  }

  .playlist-detail {
    grid-template-columns: 1fr;
  }

  .playlist-detail-cover img {
    height: 280px;
    min-height: 0;
  }

  .album-detail {
    grid-template-columns: 1fr;
  }

  .album-detail-cover img {
    height: 280px;
    min-height: 0;
  }

  .artist-detail {
    grid-template-columns: 1fr;
  }

  .artist-track-list {
    grid-column: 1 / -1;
  }

  .chart-stat-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .search-results-overview {
    grid-template-columns: 1fr;
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
  .playlist-detail,
  .playlist-stat-grid,
  .album-grid,
  .album-detail,
  .chart-grid,
  .chart-dashboard,
  .library-dashboard,
  .library-grid,
  .recent-grid,
  .artist-list,
  .artist-detail,
  .artist-stat-grid,
  .search-groups {
    grid-template-columns: 1fr;
  }

  .search-result-hero {
    gap: 18px;
    padding: 18px;
  }

  .search-mini-track,
  .search-artist-card,
  .search-album-card {
    grid-template-columns: 44px minmax(0, 1fr) auto;
  }

  .search-mini-track img,
  .search-artist-card img,
  .search-album-card img {
    width: 44px;
    height: 44px;
  }

  .chart-feature-card,
  .chart-stat-grid {
    grid-template-columns: 1fr;
  }

  .chart-feature-card {
    padding: 18px;
  }

  .chart-feature-actions,
  .chart-title-row,
  .chart-meta-row {
    align-items: stretch;
    flex-direction: column;
  }

  .chart-feature-actions .primary-button,
  .chart-feature-actions .ghost-button,
  .chart-play-button {
    width: 100%;
  }

  .chart-lead-row {
    grid-template-columns: 60px minmax(0, 1fr);
  }

  .chart-lead-row img {
    width: 60px;
    height: 60px;
  }

  .continue-card {
    grid-template-columns: 1fr;
  }

  .continue-card > img {
    max-height: 260px;
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

  .playlist-card-actions,
  .playlist-detail-head,
  .playlist-detail-actions {
    align-items: stretch;
    flex-direction: column;
  }

  .playlist-card button,
  .playlist-detail-actions .primary-button,
  .playlist-detail-actions .ghost-button {
    width: 100%;
  }

  .playlist-detail {
    padding: 14px;
  }

  .playlist-detail-cover img {
    height: 220px;
  }

  .playlist-detail-track {
    grid-template-columns: 26px 44px minmax(0, 1fr) 44px;
  }

  .playlist-detail-track img {
    width: 44px;
    height: 44px;
  }

  .playlist-detail-track em {
    display: none;
  }

  .album-detail {
    padding: 14px;
  }

  .album-detail-cover img {
    height: 220px;
  }

  .album-detail-head,
  .album-detail-actions {
    align-items: stretch;
    flex-direction: column;
  }

  .album-detail-actions .primary-button,
  .album-detail-actions .ghost-button {
    width: 100%;
  }

  .album-track-button {
    grid-template-columns: 24px 42px minmax(0, 1fr) 42px;
  }

  .album-track-button img {
    width: 42px;
    height: 42px;
  }

  .artist-detail {
    padding: 14px;
  }

  .artist-detail-profile {
    grid-template-columns: 1fr;
  }

  .artist-detail-profile > img {
    width: 100%;
    height: 220px;
  }

  .artist-detail-actions {
    align-items: stretch;
    flex-direction: column;
  }

  .artist-detail-actions .primary-button,
  .artist-detail-actions .ghost-button {
    width: 100%;
  }

  .artist-track-button {
    grid-template-columns: 44px minmax(0, 1fr) 42px;
  }

  .artist-track-button img {
    width: 44px;
    height: 44px;
  }

  .player-bar {
    grid-template-columns: minmax(0, 1fr) auto;
    grid-template-areas:
      'track tools'
      'controls controls';
    gap: 10px 12px;
    padding: 12px 14px 10px;
  }

  .player-track {
    grid-area: track;
    grid-template-columns: 44px minmax(0, 1fr);
    gap: 10px;
  }

  .player-track img {
    width: 44px;
    height: 44px;
  }

  .player-track strong,
  .player-track small {
    max-width: 100%;
  }

  .player-track small {
    font-size: 12px;
  }

  .player-controls {
    grid-area: controls;
    gap: 10px;
  }

  .control-buttons {
    justify-content: space-between;
  }

  .play-button {
    width: 42px;
    height: 42px;
  }

  .progress-line {
    grid-template-columns: 34px 1fr 34px;
    gap: 6px;
  }

  .player-tools {
    grid-area: tools;
    justify-content: flex-end;
    gap: 4px;
  }

  .player-tools .icon-button {
    width: 32px;
    height: 32px;
  }

  .volume-control {
    display: none;
  }

  .queue-toggle-button::after {
    right: -2px;
    top: -2px;
  }

  .toast {
    bottom: 168px;
  }
}
</style>
