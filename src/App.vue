<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();

// 需要缓存的组件名称列表
const cachedViews = computed(() => {
  if (route.meta.keepAlive) {
    return [route.name as string];
  }
  return [];
});
</script>

<template>
  <router-view v-slot="{ Component }">
    <keep-alive :include="cachedViews">
      <component :is="Component" />
    </keep-alive>
  </router-view>
</template>

<style>
#app {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
    Ubuntu, Cantarell, 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-rendering: optimizeLegibility;
}

/* 全局过渡动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* 进度条样式 */
#nprogress .bar {
  background: var(--primary-color) !important;
}

#nprogress .peg {
  box-shadow: 0 0 10px var(--primary-color), 0 0 5px var(--primary-color) !important;
}
</style>
