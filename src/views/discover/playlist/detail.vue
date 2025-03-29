<template>
  <div class="playlist-detail-page">
    <DataFetcher
      :requestFn="getPlaylistDetail"
      :params="{ id: playlistId }"
      @success="handleSuccess"
      @error="handleError"
      loadingText="加载歌单..."
      emptyText="暂无歌单信息"
    >
      <template #loading>
        <n-spin size="medium" />
      </template>
      <template #error="{ error, retry }">
        <div class="error-message">
          <p>{{ error.message }}</p>
          <n-button @click="retry">重试</n-button>
        </div>
      </template>
      <template #default="{ data }">
        <div class="flex flex-col md:flex-row gap-6 mb-6">
          <div class="relative w-64 h-64 flex-shrink-0 rounded-lg overflow-hidden shadow-md mx-auto md:mx-0">
            <img :src="data.coverImgUrl + '?param=512y512'" class="w-full h-full object-cover" :alt="data.name" />
            <div class="absolute top-2 right-2 text-white text-xs px-2 py-1 rounded bg-black/50">
              <div class="flex items-center">
                <div class="i-carbon-music mr-1"></div>
                <span>{{ data.trackCount }}首</span>
              </div>
            </div>
            <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
              <div class="flex items-center text-white text-sm">
                <div class="i-carbon-play-filled mr-1"></div>
                <span>{{ formatPlayCount(data.playCount) }}</span>
              </div>
            </div>
          </div>

          <div class="flex-1">
            <h1 class="text-2xl font-bold mb-2">{{ data.name }}</h1>
            <div class="flex items-center text-sm text-gray-500 mb-4">
              <img
                v-if="data.creator"
                :src="data.creator.avatarUrl + '?param=30y30'"
                class="w-6 h-6 rounded-full mr-2"
                :alt="data.creator.nickname"
              />
              <span v-if="data.creator" class="mr-4">{{ data.creator.nickname }}</span>
              <div class="flex items-center">
                <div class="i-carbon-time mr-1"></div>
                <span>创建于 {{ formatDate(data.createTime) }}</span>
              </div>
            </div>

            <div class="flex flex-wrap items-center gap-2 mb-3">
              <span v-for="tag in data.tags" :key="tag" class="px-2 py-0.5 text-xs rounded-full bg-gray-100 dark:bg-dark-800">
                {{ tag }}
              </span>
              <span v-if="!data.tags || data.tags.length === 0" class="text-xs text-gray-500">暂无标签</span>
            </div>

            <div class="text-sm text-gray-600 dark:text-gray-400 mb-4" :class="{'line-clamp-2': !showFullDesc}">
              {{ data.description || '暂无简介' }}
            </div>
            <div v-if="data.description && data.description.length > 100" class="text-xs text-primary cursor-pointer mb-4" @click="showFullDesc = !showFullDesc">
              {{ showFullDesc ? '收起' : '显示全部' }}
            </div>

            <div class="flex flex-wrap items-center gap-3">
              <button
                class="px-6 py-2 rounded-full bg-primary text-white flex items-center gap-1"
                @click="playAll"
              >
                <div class="i-carbon-play-filled"></div>
                <span>播放全部</span>
              </button>
              <button
                class="icon-btn"
                :class="{'text-red-500': isCollected}"
                @click="toggleCollect"
              >
                <div :class="isCollected ? 'i-carbon-favorite-filled' : 'i-carbon-favorite'"></div>
              </button>
              <button class="icon-btn" @click="sharePlaylist">
                <div class="i-carbon-share"></div>
              </button>
              <button class="icon-btn" @click="downloadPlaylist">
                <div class="i-carbon-download"></div>
              </button>
            </div>
          </div>
        </div>
      </template>
    </DataFetcher>

    <!-- 歌曲列表 -->
    <div class="bg-white dark:bg-dark-900 rounded-lg p-4 shadow-sm">
      <MusicList
        :tracks="tracks"
        :loading="loading"
        :show-search="true"
        :show-count="true"
        :search-placeholder="'搜索歌单音乐'"
        :empty-text="'歌单中暂无歌曲'"
        @play="playSongFromList"
        @add-to-playlist="addToPlaylist"
        @toggle-like="toggleLike"
        @more-actions="showMoreActions"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { usePlayerStore } from '@/stores/player'
import { getPlaylistDetail, getPlaylistTracks } from '@/api/modules/playlist'
import { useMessage } from 'naive-ui'
import MusicList from '@/components/music/MusicList.vue'
import DataFetcher from '@/components/ui/DataFetcher.vue'

const route = useRoute()
const router = useRouter()
const playerStore = usePlayerStore()
const message = useMessage()

/**
 * 歌单ID - 从路由参数中获取
 * @description 使用computed确保路由参数变化时自动更新
 */
const playlistId = computed(() => Number(route.params.id))

// 加载状态
const loading = ref(true)
// 收藏状态
const isCollected = ref(false)
// 显示完整描述
const showFullDesc = ref(false)

/**
 * 歌单基本信息
 * @description 包含歌单的封面、名称、创建者、标签等信息
 */
const playlistInfo = ref({
  id: 0,
  name: '',
  coverImgUrl: '',
  description: '',
  tags: [],
  trackCount: 0,
  playCount: 0,
  createTime: 0,
  creator: null
})

// 歌曲列表
const tracks = ref([])

// 搜索关键词
const searchKeyword = ref('')

/**
 * 过滤后的歌曲列表
 * @description 根据搜索关键词过滤歌曲列表
 */
const filteredTracks = computed(() => {
  if (!searchKeyword.value) return tracks.value

  const keyword = searchKeyword.value.toLowerCase()
  return tracks.value.filter(track => {
    return track.name.toLowerCase().includes(keyword) ||
           formatArtists(track.ar).toLowerCase().includes(keyword) ||
           (track.al?.name && track.al.name.toLowerCase().includes(keyword))
  })
})

/**
 * 格式化日期
 * @param timestamp 时间戳
 * @returns 格式化后的日期字符串 (YYYY-MM-DD)
 */
function formatDate(timestamp) {
  if (!timestamp) return ''
  const date = new Date(timestamp)
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

/**
 * 格式化歌手名称
 * @param artists 歌手数组
 * @returns 以斜杠分隔的歌手名称字符串
 */
function formatArtists(artists) {
  if (!artists || !artists.length) return ''
  return artists.map(artist => artist.name).join('/')
}

/**
 * 格式化时长
 * @param duration 时长(毫秒)
 * @returns 格式化后的时长字符串 (MM:SS)
 */
function formatDuration(duration) {
  if (!duration) return '00:00'
  const minutes = Math.floor(duration / 1000 / 60)
  const seconds = Math.floor((duration / 1000) % 60)
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}

/**
 * 格式化播放次数
 * @param count 播放次数
 * @returns 格式化后的播放次数
 */
function formatPlayCount(count) {
  if (!count) return '0'
  if (count < 10000) return count.toString()
  if (count < 100000000) return Math.floor(count / 10000) + '万'
  return Math.floor(count / 100000000) + '亿'
}

/**
 * 播放全部歌曲
 * @description 将整个歌单添加到播放列表并开始播放第一首
 */
function playAll() {
  if (tracks.value.length === 0) {
    message.warning('歌单中没有歌曲')
    return
  }

  // 将歌曲列表转换为播放器需要的格式
  const songList = tracks.value.map(track => ({
    id: track.id,
    name: track.name,
    artists: track.ar,
    album: {
      id: track.al?.id,
      name: track.al?.name,
      picUrl: track.al?.picUrl
    },
    duration: track.dt
  }))

  playerStore.setPlaylist(songList)
  playerStore.play(0)
  message.success('已开始播放全部歌曲')
}

/**
 * 从列表中播放歌曲
 * @param data 包含歌曲和索引的对象
 */
function playSongFromList(data: { track: any, index: number }) {
  // 设置播放列表为当前显示的歌单
  playerStore.setPlaylist(tracks.value);
  // 播放选中的歌曲
  playerStore.play(data.index);
}

/**
 * 添加歌曲到播放列表
 * @param track 歌曲对象
 */
function addToPlaylist(track: any) {
  // 检查歌曲是否已在播放列表中
  const existingIndex = playerStore.playlist.findIndex((item: any) => item.id === track.id);

  if (existingIndex === -1) {
    // 添加到播放列表
    const newPlaylist = [...playerStore.playlist, track];
    playerStore.setPlaylist(newPlaylist);
    message.success('已添加到播放列表');
  } else {
    message.info('歌曲已在播放列表中');
  }
}

/**
 * 切换歌曲喜欢状态
 * @param track 歌曲对象
 */
function toggleLike(track: any) {
  // 这里应该调用API来喜欢/取消喜欢歌曲
  // 由于API未实现，这里只做提示
  message.success(`${track.name} 已添加到我喜欢的音乐`);
}

/**
 * 显示更多操作
 * @param track 歌曲对象
 */
function showMoreActions(track: any) {
  // 这里可以显示一个操作菜单，如下载、分享等
  message.info('更多操作功能开发中');
}

/**
 * 收藏/取消收藏歌单
 * @description 模拟收藏功能，实际项目中应调用相应API
 */
function toggleCollect() {
  isCollected.value = !isCollected.value
  message.success(isCollected.value ? '收藏成功' : '已取消收藏')
  // 实际项目中应调用收藏/取消收藏API
}

/**
 * 分享歌单
 * @description 模拟分享功能，实际项目中应调用相应API
 */
function sharePlaylist() {
  // 复制分享链接到剪贴板
  const shareUrl = `${window.location.origin}${window.location.pathname}?id=${playlistId.value}`
  navigator.clipboard.writeText(shareUrl).then(() => {
    message.success('分享链接已复制到剪贴板')
  }).catch(() => {
    message.error('复制失败，请手动复制链接')
  })
}

/**
 * 下载歌单
 * @description 模拟下载功能，实际项目中应调用相应API
 */
function downloadPlaylist() {
  message.info('下载功能开发中...')
}

const handleSuccess = (data: any) => {
  playlistInfo.value = data;
  loading.value = false;
};

const handleError = (error: Error) => {
  console.error('获取歌单详情失败:', error);
  loading.value = false;
};

const getPlaylistDetail = async () => {
  loading.value = true;
  const detailRes = await getPlaylistDetail(playlistId.value);
  return detailRes;
};

const getPlaylistTracks = async () => {
  const tracksRes = await getPlaylistTracks(playlistId.value);
  return tracksRes;
};

// 监听路由参数变化，重新获取数据
watch(() => route.params.id, (newId) => {
  if (newId) {
    getPlaylistDetail()
  }
})

onMounted(() => {
  if (playlistId.value) {
    getPlaylistDetail()
  } else {
    message.error('歌单ID无效')
    router.push('/discover/playlist')
  }
})
</script>

<style scoped>
.playlist-detail-page {
  padding: 20px;
}
</style>