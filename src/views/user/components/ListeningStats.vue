<template>
  <div class="listening-stats bg-white dark:bg-dark-900 rounded-lg shadow-md p-6">
    <!-- 加载状态 -->
    <div v-if="isLoading" class="flex items-center justify-center h-64">
      <LoadingSpinner size="large" />
    </div>

    <!-- 错误提示 -->
    <ErrorMessage
      v-else-if="error"
      type="error"
      message="加载数据失败"
      description="请稍后重试或联系客服"
      :actions="[
        {
          text: '重试',
          type: 'primary',
          onClick: loadListeningStats
        },
        {
          text: '返回',
          type: 'text',
          onClick: () => router.back()
        }
      ]"
    />

    <!-- 数据展示 -->
    <template v-else>
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-xl font-bold">听歌统计</h2>
        <div class="flex items-center space-x-2">
          <button
            class="px-3 py-1 text-sm rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors flex items-center"
            @click="exportData"
          >
            <div class="i-carbon-download mr-1"></div>
            导出数据
          </button>
        </div>
      </div>
      
      <!-- 统计卡片 -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div 
          v-for="(stat, index) in stats" 
          :key="index"
          class="stat-card bg-gray-50 dark:bg-dark-800 p-4 rounded-lg text-center"
        >
          <div class="text-2xl font-bold mb-1">{{ stat.value }}</div>
          <div class="text-sm text-gray-500">{{ stat.label }}</div>
        </div>
      </div>

      <!-- 听歌趋势图 -->
      <div class="mt-8">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-medium">听歌趋势</h3>
          <div class="flex items-center space-x-2">
            <button
              v-for="(range, index) in timeRanges"
              :key="index"
              class="px-3 py-1 text-sm rounded-full transition-colors"
              :class="[
                currentTimeRange === range.value
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 dark:bg-dark-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-dark-700'
              ]"
              @click="currentTimeRange = range.value"
            >
              {{ range.label }}
            </button>
          </div>
        </div>
        <div class="h-64 bg-gray-50 dark:bg-dark-800 rounded-lg p-4">
          <div ref="chartRef" class="w-full h-full"></div>
        </div>
      </div>

      <!-- 听歌时段分布 -->
      <div class="mt-8">
        <h3 class="text-lg font-medium mb-4">听歌时段分布</h3>
        <div class="grid grid-cols-6 gap-2">
          <div 
            v-for="(hour, index) in hourDistribution" 
            :key="index"
            class="hour-bar relative"
          >
            <div 
              class="absolute bottom-0 w-full bg-primary/20 rounded-t transition-all duration-500"
              :style="{ height: hour.percentage + '%' }"
            ></div>
            <div class="absolute bottom-0 w-full text-center text-xs text-gray-500">
              {{ hour.label }}
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
/**
 * 用户听歌统计组件
 * @description 展示用户的听歌时长、数量等统计信息
 */
import { ref, onMounted, watch } from 'vue';
import { useUserStore } from '@/stores/user';
import { getUserListenRank } from '@/api/modules/user';
import type { ListenRankResponse } from '@/types/models/user';
import * as echarts from 'echarts';
import { useDataCache } from '@/composables/useDataCache';
import LoadingSpinner from '@/components/common/LoadingSpinner.vue';
import ErrorMessage from '@/components/common/ErrorMessage.vue';
import { useRouter } from 'vue-router';

const userStore = useUserStore();
const chartRef = ref<HTMLElement | null>(null);
let chart: echarts.ECharts | null = null;
const router = useRouter();

// 时间范围选择
const currentTimeRange = ref<'week' | 'month'>('week');
const timeRanges = [
  { label: '最近一周', value: 'week' },
  { label: '最近一月', value: 'month' }
];

// 统计数据
const stats = ref([
  { label: '总听歌时长', value: '0小时' },
  { label: '总听歌数量', value: '0首' },
  { label: '本周听歌时长', value: '0小时' },
  { label: '本周听歌数量', value: '0首' }
]);

// 听歌时段分布（示例数据）
const hourDistribution = ref([
  { label: '00-04', percentage: 10 },
  { label: '04-08', percentage: 5 },
  { label: '08-12', percentage: 20 },
  { label: '12-16', percentage: 25 },
  { label: '16-20', percentage: 30 },
  { label: '20-24', percentage: 40 }
]);

// 趋势数据
const trendData = ref({
  week: {
    dates: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
    counts: [0, 0, 0, 0, 0, 0, 0]
  },
  month: {
    dates: Array.from({ length: 30 }, (_, i) => `${i + 1}日`),
    counts: Array(30).fill(0)
  }
});

// 使用数据缓存
const { data: cachedData, isLoading, error, loadData } = useDataCache<ListenRankResponse>({
  key: `user_listen_rank_${userStore.profile?.userId}`,
  ttl: 30 * 60 * 1000, // 30分钟缓存
  preload: true
});

/**
 * 初始化图表
 */
function initChart() {
  if (!chartRef.value) return;
  
  chart = echarts.init(chartRef.value);
  updateChart();
}

/**
 * 更新图表数据
 */
function updateChart() {
  if (!chart) return;
  
  const data = trendData.value[currentTimeRange.value];
  
  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: data.dates,
      axisLabel: {
        color: '#666'
      }
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        color: '#666'
      }
    },
    series: [
      {
        name: '听歌数量',
        type: 'bar',
        data: data.counts,
        itemStyle: {
          color: '#1db954'
        },
        emphasis: {
          itemStyle: {
            color: '#1ed760'
          }
        }
      }
    ]
  };
  
  chart.setOption(option);
}

/**
 * 加载听歌统计数据
 */
async function loadListeningStats() {
  if (!userStore.isLoggedIn || !userStore.profile?.userId) return;
  
  await loadData(async () => {
    const res = await getUserListenRank(userStore.profile.userId, 1) as ListenRankResponse;
    if (res && 'weekData' in res && res.weekData) {
      // 计算统计数据
      const weekCount = res.weekData.length;
      const weekDuration = weekCount * 3; // 假设每首歌平均3分钟
      
      stats.value = [
        { label: '总听歌时长', value: '0小时' }, // 需要后端提供
        { label: '总听歌数量', value: '0首' }, // 需要后端提供
        { label: '本周听歌时长', value: `${Math.round(weekDuration / 60)}小时` },
        { label: '本周听歌数量', value: `${weekCount}首` }
      ];

      // 更新趋势数据
      const today = new Date().getDay();
      const weekData = trendData.value.week;
      weekData.counts[today] = weekCount;
    }
    return res;
  });
}

/**
 * 导出听歌数据
 */
function exportData() {
  const data = {
    stats: stats.value,
    hourDistribution: hourDistribution.value,
    trendData: trendData.value,
    exportTime: new Date().toLocaleString()
  };

  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `网易云音乐听歌统计_${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// 监听时间范围变化
watch(currentTimeRange, () => {
  updateChart();
});

// 监听窗口大小变化
window.addEventListener('resize', () => {
  chart?.resize();
});

onMounted(() => {
  loadListeningStats();
  initChart();
});
</script>

<style scoped>
.stat-card {
  transition: all 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-2px);
}

.hour-bar {
  height: 100px;
}
</style> 