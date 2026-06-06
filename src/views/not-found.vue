<!--
  404 页面
  @description 路由未匹配时展示的兜底页面
-->
<template>
  <div class="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
    <!-- 404 图标 -->
    <div class="i-carbon-warning-alt text-8xl text-gray-300 dark:text-gray-600 mb-6"></div>

    <!-- 标题 -->
    <h1 class="text-6xl font-bold text-gray-200 dark:text-gray-700 mb-4">404</h1>

    <!-- 描述 -->
    <p class="text-lg text-gray-500 dark:text-gray-400 mb-2">页面走丢了~</p>
    <p class="text-sm text-gray-400 dark:text-gray-500 mb-8">
      你访问的页面不存在或已被移除
    </p>

    <!-- 操作按钮 -->
    <div class="flex gap-4">
      <button
        class="px-6 py-2 bg-primary text-white rounded-full text-sm hover:opacity-90 transition-opacity"
        @click="goHome"
      >
        返回首页
      </button>
      <button
        class="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 rounded-full text-sm hover:bg-gray-50 dark:hover:bg-dark-800 transition-colors"
        @click="goBack"
      >
        返回上一页
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter();

function goHome() {
  router.push('/');
}

function goBack() {
  router.back();
}
</script>
