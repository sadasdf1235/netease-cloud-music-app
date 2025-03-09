<template>
  <div class="artist-page">
    <!-- 歌手分类 -->
    <div class="mb-6 bg-white dark:bg-dark-900 rounded-lg p-4 shadow-sm">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <!-- 语种 -->
        <div>
          <h3 class="text-sm font-medium mb-2">语种：</h3>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="(areaItem, areaIndex) in areaList"
              :key="areaIndex"
              :class="[
                'px-3 py-1 text-sm rounded-full',
                currentArea === areaItem.value ? 'bg-primary text-white' : 'bg-gray-100 dark:bg-dark-800 hover:bg-gray-200 dark:hover:bg-dark-700'
              ]"
              @click="handleAreaChange(areaItem.value)"
            >
              {{ areaItem.name }}
            </button>
          </div>
        </div>

        <!-- 分类 -->
        <div>
          <h3 class="text-sm font-medium mb-2">分类：</h3>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="(typeItem, typeIndex) in typeList"
              :key="typeIndex"
              :class="[
                'px-3 py-1 text-sm rounded-full',
                currentType === typeItem.value ? 'bg-primary text-white' : 'bg-gray-100 dark:bg-dark-800 hover:bg-gray-200 dark:hover:bg-dark-700'
              ]"
              @click="handleTypeChange(typeItem.value)"
            >
              {{ typeItem.name }}
            </button>
          </div>
        </div>

        <!-- 筛选 -->
        <div class="md:col-span-2">
          <h3 class="text-sm font-medium mb-2">筛选：</h3>
          <div class="flex flex-wrap gap-2">
            <button
              :class="[
                'px-3 py-1 text-sm rounded-full',
                currentInitial === -1 ? 'bg-primary text-white' : 'bg-gray-100 dark:bg-dark-800 hover:bg-gray-200 dark:hover:bg-dark-700'
              ]"
              @click="handleInitialChange(-1)"
            >
              热门
            </button>
            <button
              v-for="letter in 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')"
              :key="letter"
              :class="[
                'px-2 py-1 text-xs rounded-full',
                currentInitial === letter ? 'bg-primary text-white' : 'bg-gray-100 dark:bg-dark-800 hover:bg-gray-200 dark:hover:bg-dark-700'
              ]"
              @click="handleInitialChange(letter)"
            >
              {{ letter }}
            </button>
            <button
              :class="[
                'px-2 py-1 text-xs rounded-full',
                currentInitial === '0' ? 'bg-primary text-white' : 'bg-gray-100 dark:bg-dark-800 hover:bg-gray-200 dark:hover:bg-dark-700'
              ]"
              @click="handleInitialChange('0')"
            >
              #
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
      <div v-for="i in 30" :key="i" class="artist-item text-center">
        <div class="relative overflow-hidden rounded-full aspect-square mb-3">
          <div class="absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
        </div>
        <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-20 mx-auto"></div>
      </div>
    </div>

    <!-- 歌手列表 -->
    <div v-else-if="artists.length > 0" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
      <router-link
        v-for="artist in artists"
        :key="artist.id"
        :to="`/discover/artist/${artist.id}`"
        class="artist-item text-center hover:opacity-90 transition-opacity"
      >
        <div class="relative overflow-hidden rounded-full aspect-square mb-3">
          <img
            :src="artist.picUrl + '?param=200y200'"
            class="absolute inset-0 w-full h-full object-cover hover:scale-110 transition-transform duration-300"
            :alt="artist.name"
          />
        </div>
        <div class="text-sm font-medium truncate">{{ artist.name }}</div>
      </router-link>
    </div>

    <!-- 无数据状态 -->
    <div v-else class="py-20 text-center text-gray-500">
      <div class="i-carbon-music-note text-5xl mx-auto mb-4"></div>
      <p>暂无歌手数据</p>
    </div>

    <!-- 分页 -->
    <div v-if="!loading && artists.length > 0" class="flex justify-center mt-8">
      <div class="flex items-center gap-2">
        <button
          class="w-8 h-8 rounded-full border border-gray-300 dark:border-gray-700 flex-center"
          :disabled="currentPage <= 1"
          :class="{'opacity-50 cursor-not-allowed': currentPage <= 1}"
          @click="handlePageChange(currentPage - 1)"
        >
          <div class="i-carbon-chevron-left"></div>
        </button>

        <button
          v-if="currentPage > 3"
          class="w-8 h-8 rounded-full border border-gray-300 dark:border-gray-700 flex-center hover:bg-gray-100 dark:hover:bg-dark-800"
          @click="handlePageChange(1)"
        >
          1
        </button>

        <span v-if="currentPage > 4" class="px-1">...</span>

        <button
          v-for="page in displayPages"
          :key="page"
          :class="[
            'w-8 h-8 rounded-full flex-center',
            currentPage === page
              ? 'bg-primary text-white'
              : 'border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-dark-800'
          ]"
          @click="handlePageChange(page)"
        >
          {{ page }}
        </button>

        <span v-if="currentPage < totalPages - 3" class="px-1">...</span>

        <button
          v-if="currentPage < totalPages - 2 && totalPages > 5"
          class="w-8 h-8 rounded-full border border-gray-300 dark:border-gray-700 flex-center hover:bg-gray-100 dark:hover:bg-dark-800"
          @click="handlePageChange(totalPages)"
        >
          {{ totalPages }}
        </button>

        <button
          class="w-8 h-8 rounded-full border border-gray-300 dark:border-gray-700 flex-center"
          :disabled="currentPage >= totalPages"
          :class="{'opacity-50 cursor-not-allowed': currentPage >= totalPages}"
          @click="handlePageChange(currentPage + 1)"
        >
          <div class="i-carbon-chevron-right"></div>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { getArtists } from '@/api/artist'
import type { Artist, ArtistParams } from '@/types/artist'
import { useMessage } from 'naive-ui'

const router = useRouter()
const message = useMessage()

// 加载状态
const loading = ref(true)

// 歌手列表数据
const artists = ref<Artist[]>([])

// 分类数据
const areaList = [
  { name: '全部', value: -1 },
  { name: '华语', value: 7 },
  { name: '欧美', value: 96 },
  { name: '日本', value: 8 },
  { name: '韩国', value: 16 },
  { name: '其他', value: 0 }
]

const typeList = [
  { name: '全部', value: -1 },
  { name: '男歌手', value: 1 },
  { name: '女歌手', value: 2 },
  { name: '乐队组合', value: 3 }
]

// 当前选中的分类
const currentArea = ref(-1)
const currentType = ref(-1)
const currentInitial = ref<number | string>(-1)

// 分页相关
const currentPage = ref(1)
const pageSize = 30
const totalCount = ref(0)
const totalPages = computed(() => Math.ceil(totalCount.value / pageSize))

// 显示的页码范围
const displayPages = computed(() => {
  const pages: number[] = []
  const start = Math.max(1, currentPage.value - 2)
  const end = Math.min(totalPages.value, start + 4)

  for (let i = start; i <= end; i++) {
    pages.push(i)
  }

  return pages
})

// 获取歌手列表数据
async function fetchArtists() {
  try {
    loading.value = true
    const params: ArtistParams = {
      type: currentType.value,
      area: currentArea.value,
      initial: currentInitial.value.toString(),
      limit: pageSize,
      offset: (currentPage.value - 1) * pageSize
    }
    const res = await getArtists(params)
    artists.value = res.artists || []
    totalCount.value = res.more ? (currentPage.value * pageSize + pageSize) : (currentPage.value * pageSize)
    loading.value = false
  } catch (error) {
    console.error('获取歌手列表失败:', error)
    message.error('获取歌手列表失败')
    loading.value = false
  }
}

// 处理分类变化
function handleAreaChange(value: number) {
  currentArea.value = value
  currentPage.value = 1
  fetchArtists()
}

function handleTypeChange(value: number) {
  currentType.value = value
  currentPage.value = 1
  fetchArtists()
}

function handleInitialChange(value: number | string) {
  currentInitial.value = value
  currentPage.value = 1
  fetchArtists()
}

// 处理分页变化
function handlePageChange(page: number) {
  if (page < 1 || page > totalPages.value) return
  currentPage.value = page
  fetchArtists()
}

// 监听分类变化
watch([currentArea, currentType, currentInitial], () => {
  currentPage.value = 1
  fetchArtists()
}, { immediate: false })

// 组件挂载时获取数据
onMounted(() => {
  fetchArtists()
})
</script>