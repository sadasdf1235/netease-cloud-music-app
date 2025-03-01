<template>
  <div class="toplist-page">
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
      <!-- 左侧榜单分类 -->
      <div class="md:col-span-1">
        <h3 class="text-lg font-medium mb-4">云音乐特色榜</h3>
        <div class="space-y-3">
          <div v-for="i in 4" :key="i" class="flex items-center p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-800 cursor-pointer transition-colors">
            <div class="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded mr-3 flex-shrink-0"></div>
            <div>
              <div class="font-medium">热门榜单 {{ i }}</div>
              <div class="text-xs text-gray-500 mt-1">每天更新</div>
            </div>
          </div>
        </div>
        
        <h3 class="text-lg font-medium mb-4 mt-6">全球媒体榜</h3>
        <div class="space-y-3">
          <div v-for="i in 6" :key="i" class="flex items-center p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-800 cursor-pointer transition-colors">
            <div class="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded mr-3 flex-shrink-0"></div>
            <div>
              <div class="font-medium">媒体榜单 {{ i }}</div>
              <div class="text-xs text-gray-500 mt-1">每周更新</div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 右侧榜单详情 -->
      <div class="md:col-span-3">
        <div class="bg-white dark:bg-dark-900 rounded-lg p-6 shadow-sm">
          <!-- 榜单头部 -->
          <div class="flex flex-col md:flex-row md:items-center gap-6 mb-6">
            <div class="w-48 h-48 bg-gray-200 dark:bg-gray-700 rounded-lg flex-shrink-0"></div>
            <div>
              <h2 class="text-2xl font-bold mb-2">热歌榜</h2>
              <div class="flex items-center text-sm text-gray-500 mb-4">
                <div class="i-carbon-update mr-1"></div>
                <span>最近更新：10月1日</span>
              </div>
              <div class="flex items-center gap-3">
                <button class="px-6 py-2 rounded-full bg-primary text-white flex items-center gap-1">
                  <div class="i-carbon-play-filled"></div>
                  <span>播放</span>
                </button>
                <button class="icon-btn">
                  <div class="i-carbon-favorite"></div>
                </button>
                <button class="icon-btn">
                  <div class="i-carbon-share"></div>
                </button>
                <button class="icon-btn">
                  <div class="i-carbon-download"></div>
                </button>
              </div>
            </div>
          </div>
          
          <!-- 榜单歌曲列表 -->
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead class="border-b border-gray-200 dark:border-gray-700">
                <tr>
                  <th class="py-3 text-left w-16">#</th>
                  <th class="py-3 text-left">歌曲</th>
                  <th class="py-3 text-left">歌手</th>
                  <th class="py-3 text-left">专辑</th>
                  <th class="py-3 text-left w-24">时长</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="i in 20" :key="i" class="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-dark-800">
                  <td class="py-3 px-2">
                    <div class="flex items-center justify-between">
                      <span :class="{'text-primary font-medium': i <= 3}">{{ i }}</span>
                      <div class="i-carbon-play text-gray-400 hover:text-primary cursor-pointer"></div>
                    </div>
                  </td>
                  <td class="py-3">歌曲名称 {{ i }}</td>
                  <td class="py-3">歌手名称</td>
                  <td class="py-3">专辑名称</td>
                  <td class="py-3 text-gray-500">03:30</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// 这里将来会添加获取排行榜数据的逻辑
</script>