<script setup lang="ts">
import AppHeader from './AppHeader.vue';
import AppSider from './AppSider.vue';
import AppPlayer from './AppPlayer.vue';
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
  <a-layout class="app-layout">
    <!-- 顶部导航 -->
    <AppHeader class="app-header" />

    <a-layout>
      <!-- 侧边栏 -->
      <AppSider class="app-sider" />

      <!-- 主要内容区 -->
      <a-layout-content class="app-content">
        <router-view v-slot="{ Component }">
          <keep-alive :include="cachedViews">
            <component :is="Component" />
          </keep-alive>
        </router-view>
      </a-layout-content>
    </a-layout>

    <!-- 底部播放器 -->
    <AppPlayer class="app-player" />
  </a-layout>
</template>

<style lang="less" scoped>
.app-layout {
  min-height: 100vh;
  background-color: @body-background;

  .app-header {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1000;
    height: 64px;
    padding: 0;
    background-color: @component-background;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  }

  .app-sider {
    position: fixed;
    top: 64px;
    left: 0;
    bottom: 72px;
    z-index: 100;
    width: 200px !important;
    background-color: @component-background;
    border-right: 1px solid @border-color-split;
    overflow-y: auto;
  }

  .app-content {
    margin-top: 64px;
    margin-left: 200px;
    margin-bottom: 72px;
    padding: @padding-md;
    min-height: calc(100vh - 136px);
    background-color: @body-background;
  }

  .app-player {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 1000;
    height: 72px;
    padding: 0;
    background-color: @component-background;
    border-top: 1px solid @border-color-split;
  }
}

// 滚动条样式
.app-sider {
  &::-webkit-scrollbar {
    width: 4px;
    height: 4px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: @text-color-secondary;
    border-radius: 2px;

    &:hover {
      background: @text-color;
    }
  }
}
</style>