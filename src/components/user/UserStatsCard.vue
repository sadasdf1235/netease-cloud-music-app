<template>
  <div class="stats-card rounded-lg overflow-hidden bg-white dark:bg-dark-900 shadow-sm">
    <div class="p-4 border-b border-gray-100 dark:border-dark-800">
      <h3 class="text-base font-medium flex items-center">
        <div :class="icon" class="mr-2 text-primary"></div>
        {{ title }}
      </h3>
    </div>
    <div class="p-4">
      <div class="flex items-center justify-between mb-4">
        <div class="text-3xl font-bold text-primary">{{ count }}</div>
        <div 
          v-if="showTrend" 
          class="text-sm"
          :class="trendUp ? 'text-green-500' : 'text-red-500'"
        >
          <div :class="trendUp ? 'i-carbon-arrow-up' : 'i-carbon-arrow-down'" class="mr-1 inline-block"></div>
          {{ trendValue }}%
        </div>
      </div>
      <div class="text-sm text-gray-500">{{ description }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * 用户统计卡片组件
 * @description 用于展示用户各类数据统计信息
 */

// 定义属性
const props = defineProps({
  /** 标题 */
  title: {
    type: String,
    required: true
  },
  /** 图标class */
  icon: {
    type: String,
    default: 'i-carbon-chart-line'
  },
  /** 统计数值 */
  count: {
    type: [Number, String],
    required: true
  },
  /** 描述文字 */
  description: {
    type: String,
    default: ''
  },
  /** 是否显示趋势 */
  showTrend: {
    type: Boolean,
    default: false
  },
  /** 趋势是否向上 */
  trendUp: {
    type: Boolean,
    default: true
  },
  /** 趋势值 */
  trendValue: {
    type: [Number, String],
    default: 0
  }
});
</script>

<style scoped>
.stats-card {
  transition: all 0.3s ease;
}

.stats-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}
</style> 