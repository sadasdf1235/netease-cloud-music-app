<template>
  <div class="listening-rank bg-white dark:bg-dark-900 rounded-lg shadow-md p-6">
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-xl font-bold">听歌排行</h2>
      <div class="flex space-x-2">
        <button
          v-for="(range, index) in timeRanges"
          :key="index"
          class="px-3 py-1 text-sm rounded-full transition-colors"
          :class="[
            timeRange === range.value
              ? 'bg-primary text-white'
              : 'bg-gray-100 dark:bg-dark-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-dark-700'
          ]"
          @click="timeRange = range.value"
        >
          {{ range.label }}
        </button>
      </div>
    </div>

    <!-- 排行榜列表 -->
    <div v-if="isLoading" class="text-center py-10">
      <n-spin size="large" />
    </div>
    <div v-else-if="rankList.length > 0">
      <div 
        v-for="(item, index) in rankList" 
        :key="item.song.id"
        class="rank-item flex items-center p-4 hover:bg-gray-50 dark:hover:bg-dark-800 rounded-lg transition-colors"
      >
        <!-- 排名 -->
        <div class="w-8 text-center">
          <span 
            class="text-lg font-bold"
            :class="{
              'text-red-500': index < 3,
              'text-gray-500': index >= 3
            }"
          >
            {{ index + 1 }}
          </span>
        </div>

        <!-- 歌曲信息 -->
        <div class="flex-1 ml-4">
          <div class="flex items-center">
            <img 
              :src="item.song.al.picUrl + '?param=60y60'" 
              :alt="item.song.name"
              class="w-12 h-12 rounded"
            />
            <div class="ml-3">
              <div class="text-base font-medium">{{ item.song.name }}</div>
              <div class="text-sm text-gray-500">
                {{ formatArtists(item.song.ar) }}
              </div>
            </div>
          </div>
        </div>

        <!-- 播放次数 -->
        <div class="text-sm text-gray-500">
          {{ formatNumber(item.playCount) }}次
        </div>

        <!-- 操作按钮 -->
        <div class="ml-4 flex items-center space-x-2">
          <button
            class="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center hover:bg-primary/20 transition-colors"
            @click="playSong(item.song)"
            title="播放"
          >
            <div class="i-carbon-play-filled"></div>
          </button>
          <button
            class="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center hover:bg-primary/20 transition-colors"
            @click="addToPlaylist(item.song)"
            title="添加到播放列表"
          >
            <div class="i-carbon-add"></div>
          </button>
        </div>
      </div>
    </div>
    <div v-else class="py-10 text-center text-gray-500">
      <div class="i-carbon-music text-5xl mx-auto mb-4"></div>
      <p>暂无听歌记录</p>
      <p class="mt-2 text-sm">去发现一些好听的音乐吧~</p>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * 听歌排行榜组件
 * @description 展示用户的听歌排行数据，支持查看最近一周和所有时间的排行
 */
import { ref, watch, computed } from 'vue';
import { useUserStore } from '@/stores/user';
import { usePlayerStore } from '@/stores/player';
import { useMessage, NSpin } from 'naive-ui';
import { getUserListenRank } from '@/api/modules/user';
import type { ListenRankItem, ListenRankResponse } from '@/types/models/user';

const userStore = useUserStore();
const playerStore = usePlayerStore();
const message = useMessage();

// 时间范围选择
const timeRange = ref<'week' | 'all'>('week');
const timeRanges = [
  { label: '最近一周', value: 'week' },
  { label: '所有时间', value: 'all' }
];
const isLoading = ref(false);
const rankList = ref<ListenRankItem[]>([]);

/**
 * 加载听歌排行数据
 */
async function loadRankList() {
  if (!userStore.isLoggedIn || !userStore.profile?.userId) return;
  
  isLoading.value = true;
  try {
    // type=1: 最近一周, type=0: 所有时间
    const type = timeRange.value === 'week' ? 1 : 0;
    const res = await getUserListenRank(userStore.profile.userId, type) as ListenRankResponse;
    if (res && res.weekData) {
      rankList.value = res.weekData;
    }
  } catch (error) {
    console.error('获取听歌排行失败:', error);
    message.error('获取听歌排行失败');
  } finally {
    isLoading.value = false;
  }
}

/**
 * 格式化数字，如果大于10000则显示为"xx万"
 */
function formatNumber(num: number): string {
  if (num >= 10000) {
    return (num / 10000).toFixed(1) + '万';
  }
  return num.toString();
}

/**
 * 播放歌曲
 */
function playSong(song: ListenRankItem['song']) {
  playerStore.setPlaylist([song]);
  playerStore.play(0);
  message.success(`正在播放: ${song.name}`);
}

/**
 * 添加到播放列表
 */
function addToPlaylist(song: ListenRankItem['song']) {
  playerStore.addToPlaylist(song);
  message.success('已添加到播放列表');
}

// 监听时间范围变化
watch(timeRange, () => {
  loadRankList();
});

// 初始加载
loadRankList();

// 格式化歌手名称
const formatArtists = computed(() => {
  return (artists: Array<{ name: string }>) => {
    return artists.map(ar => ar.name).join(' / ');
  };
});
</script>

<style scoped>
.rank-item {
  transition: all 0.3s ease;
}

.rank-item:hover {
  transform: translateX(4px);
}
</style>
