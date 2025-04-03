<template>
  <div 
    class="loading-spinner"
    :class="[
      size === 'small' ? 'h-4 w-4' : 
      size === 'medium' ? 'h-8 w-8' : 
      'h-12 w-12',
      { 'border-primary': !color, [`border-${color}`]: color }
    ]"
  >
    <div class="animate-spin rounded-full h-full w-full border-b-2"></div>
  </div>
</template>

<script setup lang="ts">
/**
 * 加载动画组件
 * @description 提供不同大小和颜色的加载动画
 */
interface Props {
  /**
   * 加载动画大小
   * @default medium
   */
  size?: 'small' | 'medium' | 'large';
  
  /**
   * 加载动画颜色
   * @default primary
   */
  color?: string;
}

withDefaults(defineProps<Props>(), {
  size: 'medium',
  color: ''
});
</script>

<style scoped>
.loading-spinner {
  @apply inline-block;
}
</style> 