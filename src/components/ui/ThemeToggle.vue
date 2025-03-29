<template>
  <div class="theme-toggle">
    <n-dropdown trigger="click" :options="options" @select="handleSelect">
      <button class="icon-btn flex items-center">
        <div v-if="themeMode === 'auto'" class="i-carbon-screen text-lg"></div>
        <div v-else-if="themeMode === 'light'" class="i-carbon-sun text-lg"></div>
        <div v-else class="i-carbon-moon text-lg"></div>
        <span class="ml-1 text-sm hidden sm:inline">{{ themeName }}</span>
      </button>
    </n-dropdown>
  </div>
</template>

<script setup lang="ts">
import { computed, h } from 'vue';
import { useTheme } from '@/hooks';
import type { DropdownOption } from 'naive-ui';

// 使用主题管理Hook
const { themeMode, themeName, setThemeMode } = useTheme();

// 下拉菜单选项
const options = computed<DropdownOption[]>(() => [
  {
    label: '浅色模式',
    key: 'light',
    icon: () => h('div', { class: 'i-carbon-sun mr-1' })
  },
  {
    label: '深色模式',
    key: 'dark',
    icon: () => h('div', { class: 'i-carbon-moon mr-1' })
  },
  {
    label: '跟随系统',
    key: 'auto',
    icon: () => h('div', { class: 'i-carbon-screen mr-1' })
  }
]);

// 处理选择
const handleSelect = (key: string) => {
  setThemeMode(key as 'light' | 'dark' | 'auto');
};
</script>

<style scoped>
.theme-toggle {
  display: inline-flex;
  align-items: center;
}

.icon-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem;
  border-radius: 0.375rem;
  transition: background-color 0.2s;
}

.icon-btn:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

:deep(.dark) .icon-btn:hover {
  background-color: rgba(255, 255, 255, 0.1);
}
</style>