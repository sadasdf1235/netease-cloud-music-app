<template>
  <div class="album-page">
    <!-- 新碟分类 -->
    <div class="mb-6">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-xl font-bold">新碟上架</h2>
        <div class="flex items-center gap-3">
          <div class="flex rounded-full bg-gray-100 dark:bg-dark-800 p-1">
            <button class="px-4 py-1 rounded-full bg-primary text-white">全部</button>
            <button class="px-4 py-1 rounded-full hover:bg-gray-200 dark:hover:bg-dark-700">华语</button>
            <button class="px-4 py-1 rounded-full hover:bg-gray-200 dark:hover:bg-dark-700">欧美</button>
            <button class="px-4 py-1 rounded-full hover:bg-gray-200 dark:hover:bg-dark-700">韩国</button>
            <button class="px-4 py-1 rounded-full hover:bg-gray-200 dark:hover:bg-dark-700">日本</button>
          </div>
        </div>
      </div>
    </div>

    <!-- 新碟列表 -->
    <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
      <div v-for="i in 20" :key="i" class="album-item">
        <div class="relative rounded-lg overflow-hidden aspect-square shadow-md mb-2">
          <div class="absolute inset-0 bg-gray-200 dark:bg-gray-700"></div>
          <div class="absolute top-0 right-0 bg-primary/80 text-white text-xs px-2 py-1">新碟</div>
          <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
            <div class="flex items-center text-white text-xs">
              <div class="i-carbon-play-filled mr-1"></div>
              <span>试听</span>
            </div>
          </div>
        </div>
        <div class="text-sm font-medium truncate">专辑名称 {{ i }}</div>
        <div class="text-xs text-gray-500 truncate">歌手名称</div>
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
// 这里将来会添加获取新碟数据的逻辑
</script>