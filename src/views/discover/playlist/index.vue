<template>
  <div class="playlist-page">
    <!-- 歌单分类 -->
    <div class="mb-6">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-xl font-bold">全部歌单</h2>
        <button 
          class="px-4 py-1.5 rounded-full border border-gray-300 dark:border-gray-700 flex items-center gap-1"
          @click="showCategoryModal = true"
        >
          <span>{{ currentCategory }}</span>
          <div class="i-carbon-chevron-down"></div>
        </button>
      </div>
      <div class="flex flex-wrap gap-2">
        <button 
          class="px-3 py-1 text-sm rounded-full" 
          :class="currentCategory === '全部' ? 'bg-primary text-white' : 'bg-gray-100 dark:bg-dark-800 hover:bg-gray-200 dark:hover:bg-dark-700'"
          @click="changeCategory('全部')"
        >全部</button>
        <button 
          v-for="tag in hotCategories" 
          :key="tag.name" 
          class="px-3 py-1 text-sm rounded-full" 
          :class="currentCategory === tag.name ? 'bg-primary text-white' : 'bg-gray-100 dark:bg-dark-800 hover:bg-gray-200 dark:hover:bg-dark-700'"
          @click="changeCategory(tag.name)"
        >
          {{ tag.name }}
        </button>
      </div>
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
      <div v-for="i in 20" :key="i" class="playlist-item">
        <div class="relative rounded-lg overflow-hidden aspect-square shadow-md mb-2 bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
        <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2"></div>
        <div class="h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-2/3"></div>
      </div>
    </div>

    <!-- 歌单列表 -->
    <div v-else class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
      <div 
        v-for="playlist in playlists" 
        :key="playlist.id" 
        class="playlist-item cursor-pointer"
        @click="navigateToPlaylist(playlist.id)"
      >
        <div class="relative rounded-lg overflow-hidden aspect-square shadow-md mb-2">
          <img :src="playlist.coverImgUrl + '?param=200y200'" class="w-full h-full object-cover" :alt="playlist.name" />
          <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
            <div class="flex items-center text-white text-xs">
              <div class="i-carbon-play-filled mr-1"></div>
              <span>{{ formatPlayCount(playlist.playCount) }}</span>
            </div>
          </div>
        </div>
        <div class="text-sm line-clamp-2 h-10">{{ playlist.name }}</div>
        <div class="text-xs text-gray-500">by {{ playlist.creator.nickname }}</div>
      </div>
    </div>

    <!-- 分页 -->
    <div class="flex justify-center mt-8">
      <div class="flex items-center gap-2">
        <button 
          class="w-8 h-8 rounded-full border border-gray-300 dark:border-gray-700 flex items-center justify-center"
          :disabled="currentPage <= 1"
          @click="changePage(currentPage - 1)"
        >
          <div class="i-carbon-chevron-left"></div>
        </button>
        <button 
          v-for="page in displayPages" 
          :key="page" 
          class="w-8 h-8 rounded-full flex items-center justify-center"
          :class="currentPage === page ? 'bg-primary text-white' : 'border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-dark-800'"
          @click="changePage(page)"
        >
          {{ page }}
        </button>
        <button 
          class="w-8 h-8 rounded-full border border-gray-300 dark:border-gray-700 flex items-center justify-center"
          :disabled="currentPage >= totalPages"
          @click="changePage(currentPage + 1)"
        >
          <div class="i-carbon-chevron-right"></div>
        </button>
      </div>
    </div>

    <!-- 分类选择弹窗 (简化版) -->
    <n-modal v-model:show="showCategoryModal" preset="card" title="选择分类" style="width: 600px;">
      <div class="max-h-96 overflow-y-auto">
        <div class="mb-4">
          <h3 class="font-medium mb-2">热门分类</h3>
          <div class="flex flex-wrap gap-2">
            <button 
              v-for="tag in hotCategories" 
              :key="tag.name"
              class="px-3 py-1 text-sm rounded-full bg-gray-100 dark:bg-dark-800 hover:bg-gray-200 dark:hover:bg-dark-700"
              @click="changeCategory(tag.name); showCategoryModal = false"
            >
              {{ tag.name }}
            </button>
          </div>
        </div>
        <div v-for="(cats, type) in categories" :key="type" class="mb-4">
          <h3 class="font-medium mb-2">{{ type }}</h3>
          <div class="flex flex-wrap gap-2">
            <button 
              v-for="cat in cats" 
              :key="cat"
              class="px-3 py-1 text-sm rounded-full bg-gray-100 dark:bg-dark-800 hover:bg-gray-200 dark:hover:bg-dark-700"
              @click="changeCategory(cat); showCategoryModal = false"
            >
              {{ cat }}
            </button>
          </div>
        </div>
      </div>
    </n-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getPlaylistCategories } from '@/api/playlist'
import { getTopPlaylistsByCategory } from '@/api/music'

const router = useRouter()

// 加载状态
const loading = ref(true)

// 分类数据
const categories = ref({})
const hotCategories = ref([])
const currentCategory = ref('全部')
const showCategoryModal = ref(false)

// 歌单数据
const playlists = ref([])
const currentPage = ref(1)
const pageSize = 30
const total = ref(0)

// 计算总页数
const totalPages = computed(() => Math.ceil(total.value / pageSize))

// 计算要显示的页码
const displayPages = computed(() => {
  const pages = []
  const maxDisplayPages = 5
  
  if (totalPages.value <= maxDisplayPages) {
    // 如果总页数小于等于最大显示页数，则显示所有页码
    for (let i = 1; i <= totalPages.value; i++) {
      pages.push(i)
    }
  } else {
    // 否则，显示当前页附近的页码
    let startPage = Math.max(1, currentPage.value - Math.floor(maxDisplayPages / 2))
    let endPage = Math.min(totalPages.value, startPage + maxDisplayPages - 1)
    
    // 调整起始页，确保显示的页码数量为 maxDisplayPages
    if (endPage - startPage + 1 < maxDisplayPages) {
      startPage = Math.max(1, endPage - maxDisplayPages + 1)
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i)
    }
  }
  
  return pages
})

// 格式化播放次数
function formatPlayCount(count) {
  if (count > 100000000) {
    return Math.floor(count / 100000000) + '亿'
  } else if (count > 10000) {
    return Math.floor(count / 10000) + '万'
  }
  return count
}

// 跳转到歌单详情
function navigateToPlaylist(id) {
  router.push(`/discover/playlist/${id}`)
}

// 获取歌单分类
async function fetchCategories() {
  try {
    const res = await getPlaylistCategories()
    if (res && res.categories && res.sub) {
      // 处理分类数据
      const categoriesData = {}
      Object.keys(res.categories).forEach(key => {
        categoriesData[res.categories[key]] = []
      })
      
      res.sub.forEach(item => {
        const category = res.categories[item.category]
        if (categoriesData[category]) {
          categoriesData[category].push(item.name)
        }
      })
      
      categories.value = categoriesData
      
      // 热门分类
      hotCategories.value = res.sub.filter(item => item.hot).slice(0, 8)
    }
  } catch (error) {
    console.error('获取歌单分类失败:', error)
  }
}

// 获取歌单列表
async function fetchPlaylists() {
  try {
    loading.value = true
    const offset = (currentPage.value - 1) * pageSize
    const res = await getTopPlaylistsByCategory(currentCategory.value, pageSize, offset)
    
    if (res && res.playlists) {
      playlists.value = res.playlists
      total.value = res.total || 0
    }
    
    loading.value = false
  } catch (error) {
    console.error('获取歌单列表失败:', error)
    loading.value = false
  }
}

// 切换分类
function changeCategory(category) {
  if (currentCategory.value === category) return
  currentCategory.value = category
  currentPage.value = 1 // 切换分类时重置页码
  fetchPlaylists()
}

// 切换页码
function changePage(page) {
  if (page < 1 || page > totalPages.value || page === currentPage.value) return
  currentPage.value = page
  fetchPlaylists()
}

onMounted(async () => {
  await fetchCategories()
  await fetchPlaylists()
})
</script>