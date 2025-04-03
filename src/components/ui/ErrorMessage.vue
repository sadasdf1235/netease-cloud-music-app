<template>
  <div 
    class="error-message"
    :class="[
      type === 'error' ? 'bg-red-50 text-red-500 dark:bg-red-900/20' :
      type === 'warning' ? 'bg-yellow-50 text-yellow-500 dark:bg-yellow-900/20' :
      'bg-blue-50 text-blue-500 dark:bg-blue-900/20'
    ]"
  >
    <div class="flex items-center p-4">
      <!-- 图标 -->
      <div class="flex-shrink-0 mr-3">
        <div 
          class="i-carbon-warning-alt"
          :class="[
            type === 'error' ? 'text-red-500' :
            type === 'warning' ? 'text-yellow-500' :
            'text-blue-500'
          ]"
        ></div>
      </div>

      <!-- 消息内容 -->
      <div class="flex-1">
        <p class="text-sm font-medium">{{ message }}</p>
        <p v-if="description" class="mt-1 text-sm opacity-80">{{ description }}</p>
      </div>

      <!-- 关闭按钮 -->
      <button 
        v-if="showClose"
        class="flex-shrink-0 ml-3 p-1 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
        @click="$emit('close')"
      >
        <div class="i-carbon-close text-lg"></div>
      </button>
    </div>

    <!-- 操作按钮 -->
    <div v-if="actions?.length" class="px-4 pb-4 flex items-center space-x-2">
      <button
        v-for="(action, index) in actions"
        :key="index"
        class="px-3 py-1 text-sm rounded-full transition-colors"
        :class="[
          action.type === 'primary' ? 'bg-primary text-white hover:bg-primary/90' :
          action.type === 'secondary' ? 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-dark-700 dark:text-gray-300 dark:hover:bg-dark-600' :
          'text-primary hover:bg-primary/10'
        ]"
        @click="action.onClick"
      >
        {{ action.text }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * 错误提示组件
 * @description 提供不同类型的错误、警告和提示信息展示
 */
interface Action {
  text: string;
  type?: 'primary' | 'secondary' | 'text';
  onClick: () => void;
}

interface Props {
  /**
   * 消息类型
   * @default error
   */
  type?: 'error' | 'warning' | 'info';
  
  /**
   * 消息内容
   */
  message: string;
  
  /**
   * 详细描述
   */
  description?: string;
  
  /**
   * 是否显示关闭按钮
   * @default true
   */
  showClose?: boolean;
  
  /**
   * 操作按钮
   */
  actions?: Action[];
}

withDefaults(defineProps<Props>(), {
  type: 'error',
  showClose: true
});

defineEmits<{
  (e: 'close'): void;
}>();
</script>

<style scoped>
.error-message {
  @apply rounded-lg;
}
</style> 