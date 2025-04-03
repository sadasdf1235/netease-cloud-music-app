<template>
  <div class="search-history">
    <div class="flex items-center justify-between mb-2">
      <div class="text-sm text-gray-500">搜索历史</div>
      <n-button text type="primary" size="tiny" @click="clearHistory">
        <template #icon>
          <div class="i-carbon-trash-can"></div>
        </template>
        清空
      </n-button>
    </div>
    <div class="flex flex-wrap gap-2">
      <n-tag
        v-for="item in history"
        :key="item"
        size="small"
        round
        :bordered="false"
        class="cursor-pointer hover:bg-primary hover:text-white transition-colors"
        @click="$emit('select', item)"
      >
        {{ item }}
      </n-tag>
      <div v-if="history.length === 0" class="text-sm text-gray-400">
        暂无搜索历史
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useLocalStorage } from '@vueuse/core';

const props = defineProps<{
  storageKey?: string;
  maxLength?: number;
}>();

const emit = defineEmits<{
  (e: 'select', keyword: string): void;
}>();

// 搜索历史
const history = useLocalStorage<string[]>(props.storageKey || 'search-history', []);

/**
 * 添加搜索历史
 */
function addHistory(keyword: string) {
  if (!keyword.trim()) return;

  // 移除重复项
  const index = history.value.indexOf(keyword);
  if (index > -1) {
    history.value.splice(index, 1);
  }

  // 添加到开头
  history.value.unshift(keyword);

  // 限制长度
  if (props.maxLength && history.value.length > props.maxLength) {
    history.value = history.value.slice(0, props.maxLength);
  }
}

/**
 * 清空搜索历史
 */
function clearHistory() {
  history.value = [];
}

// 暴露方法给父组件
defineExpose({
  addHistory
});
</script>

<style scoped>
.search-history {
  padding: 12px;
  background-color: var(--n-card-color);
  border-radius: 8px;
}
</style>