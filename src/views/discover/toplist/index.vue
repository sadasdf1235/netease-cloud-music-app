<template>
  <div class="toplist-page">
    <DataFetcher
      :requestFn="getAllToplist"
      @success="handleSuccess"
      @error="handleError"
      loadingText="加载榜单..."
      emptyText="暂无榜单信息"
    >
      <template #loading>
        <n-spin size="medium" />
      </template>
      <template #error="{ error, retry }">
        <div class="error-message">
          <p>{{ error.message }}</p>
          <n-button @click="retry">重试</n-button>
        </div>
      </template>
      <template #default="{ data }">
        <h1 class="text-2xl font-bold mb-4">排行榜</h1>
        <ul>
          <li v-for="toplist in data.list" :key="toplist.id">
            <div class="flex justify-between items-center">
              <span>{{ toplist.name }}</span>
              <span>{{ formatPlayCount(toplist.playCount) }}</span>
            </div>
          </li>
        </ul>
      </template>
    </DataFetcher>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { getAllToplist } from '@/api/modules/toplist';
import DataFetcher from '@/components/ui/DataFetcher.vue';

const loading = ref(true);
const playlists = ref([]);

const handleSuccess = (data: any) => {
  playlists.value = data.list;
  loading.value = false;
};

const handleError = (error: Error) => {
  console.error('获取榜单失败:', error);
  loading.value = false;
};
</script>

<style scoped>
.toplist-page {
  padding: 20px;
}
</style>