<template>
  <div class="artist-page">
    <!-- 歌手分类 -->
    <div class="mb-6 bg-white dark:bg-dark-900 rounded-lg p-4 shadow-sm">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <!-- 语种 -->
        <div>
          <h3 class="text-sm font-medium mb-2">语种：</h3>
          <div class="flex flex-wrap gap-2">
            <button class="px-3 py-1 text-sm rounded-full bg-primary text-white">全部</button>
            <button class="px-3 py-1 text-sm rounded-full bg-gray-100 dark:bg-dark-800 hover:bg-gray-200 dark:hover:bg-dark-700">华语</button>
            <button class="px-3 py-1 text-sm rounded-full bg-gray-100 dark:bg-dark-800 hover:bg-gray-200 dark:hover:bg-dark-700">欧美</button>
            <button class="px-3 py-1 text-sm rounded-full bg-gray-100 dark:bg-dark-800 hover:bg-gray-200 dark:hover:bg-dark-700">日本</button>
            <button class="px-3 py-1 text-sm rounded-full bg-gray-100 dark:bg-dark-800 hover:bg-gray-200 dark:hover:bg-dark-700">韩国</button>
            <button class="px-3 py-1 text-sm rounded-full bg-gray-100 dark:bg-dark-800 hover:bg-gray-200 dark:hover:bg-dark-700">其他</button>
          </div>
        </div>
        
        <!-- 分类 -->
        <div>
          <h3 class="text-sm font-medium mb-2">分类：</h3>
          <div class="flex flex-wrap gap-2">
            <button class="px-3 py-1 text-sm rounded-full bg-primary text-white">全部</button>
            <button class="px-3 py-1 text-sm rounded-full bg-gray-100 dark:bg-dark-800 hover:bg-gray-200 dark:hover:bg-dark-700">男歌手</button>
            <button class="px-3 py-1 text-sm rounded-full bg-gray-100 dark:bg-dark-800 hover:bg-gray-200 dark:hover:bg-dark-700">女歌手</button>
            <button class="px-3 py-1 text-sm rounded-full bg-gray-100 dark:bg-dark-800 hover:bg-gray-200 dark:hover:bg-dark-700">乐队组合</button>
          </div>
        </div>
        
        <!-- 筛选 -->
        <div class="md:col-span-2">
          <h3 class="text-sm font-medium mb-2">筛选：</h3>
          <div class="flex flex-wrap gap-2">
            <button class="px-3 py-1 text-sm rounded-full bg-primary text-white">热门</button>
            <button v-for="letter in 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')" :key="letter"
              class="px-2 py-1 text-xs rounded-full bg-gray-100 dark:bg-dark-800 hover:bg-gray-200 dark:hover:bg-dark-700">
              {{ letter }}
            </button>
            <button class="px-2 py-1 text-xs rounded-full bg-gray-100 dark:bg-dark-800 hover:bg-gray-200 dark:hover:bg-dark-700">
              #
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 歌手列表 -->
    <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
      <div v-for="i in 30" :key="i" class="artist-item text-center">
        <div class="relative overflow-hidden rounded-full aspect-square mb-3">
          <div class="absolute inset-0 bg-gray-200 dark:bg-gray-700 hover:scale-110 transition-transform duration-300"></div>
        </div>
        <div class="text-sm font-medium">歌手名称 {{ i }}</div>
      </div>
    </div>
    
    <!-- 分页 -->
    <div class="flex justify-center mt-8">
      <div class="flex items-center gap-2">
        <button class="w-8 h-8 rounded-full border border-gray-300 dark:border-gray-700 flex-center">
          <div class="i-carbon-chevron-left"></div>
        </button>
        <button class="w-8 h-8 rounded-full bg-primary text-white flex-center">1</button>
        <button v-for="i in 5" :key="i" class="w-8 h-8 rounded-full border border-gray-300 dark:border-gray-700 flex-center hover:bg-gray-100 dark:hover:bg-dark-800">
          {{ i + 1 }}
        </button>
        <button class="w-8 h-8 rounded-full border border-gray-300 dark:border-gray-700 flex-center">
          <div class="i-carbon-chevron-right"></div>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// 这里将来会添加获取歌手数据的逻辑
</script>