<template>
  <div 
    v-if="show"
    class="guide-tooltip fixed inset-0 z-50"
    @click="close"
  >
    <!-- 遮罩层 -->
    <div class="absolute inset-0 bg-black/50"></div>

    <!-- 引导内容 -->
    <div 
      class="absolute bg-white dark:bg-dark-800 rounded-lg shadow-lg p-4 max-w-sm"
      :style="position"
      @click.stop
    >
      <!-- 标题 -->
      <div class="flex items-center justify-between mb-2">
        <h3 class="text-lg font-medium">{{ title }}</h3>
        <button 
          class="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-dark-700 transition-colors"
          @click="close"
        >
          <div class="i-carbon-close text-lg"></div>
        </button>
      </div>

      <!-- 内容 -->
      <p class="text-gray-600 dark:text-gray-400">{{ content }}</p>

      <!-- 操作按钮 -->
      <div class="mt-4 flex items-center justify-between">
        <button
          v-if="showSkip"
          class="text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          @click="skip"
        >
          跳过引导
        </button>
        <div class="flex items-center space-x-2">
          <button
            v-if="showPrev"
            class="px-3 py-1 text-sm rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-dark-700 dark:text-gray-300 dark:hover:bg-dark-600"
            @click="prev"
          >
            上一步
          </button>
          <button
            class="px-3 py-1 text-sm rounded-full bg-primary text-white hover:bg-primary/90"
            @click="next"
          >
            {{ isLast ? '完成' : '下一步' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * 操作引导组件
 * @description 提供分步骤的操作引导功能
 */
import { ref, computed } from 'vue';

interface Step {
  title: string;
  content: string;
  position: {
    top?: string;
    left?: string;
    right?: string;
    bottom?: string;
  };
}

interface Props {
  /**
   * 引导步骤
   */
  steps: Step[];
  
  /**
   * 是否显示跳过按钮
   * @default true
   */
  showSkip?: boolean;
  
  /**
   * 是否显示遮罩层
   * @default true
   */
  showMask?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  showSkip: true,
  showMask: true
});

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'complete'): void;
}>();

// 当前步骤
const currentStep = ref(0);

// 是否显示引导
const show = ref(true);

// 当前步骤数据
const currentStepData = computed(() => props.steps[currentStep.value]);

// 是否是最后一步
const isLast = computed(() => currentStep.value === props.steps.length - 1);

// 是否显示上一步按钮
const showPrev = computed(() => currentStep.value > 0);

// 计算位置样式
const position = computed(() => ({
  ...currentStepData.value.position,
  transform: 'translate(-50%, -50%)'
}));

// 关闭引导
function close() {
  show.value = false;
  emit('close');
}

// 跳过引导
function skip() {
  close();
  emit('complete');
}

// 上一步
function prev() {
  if (currentStep.value > 0) {
    currentStep.value--;
  }
}

// 下一步
function next() {
  if (isLast.value) {
    close();
    emit('complete');
  } else {
    currentStep.value++;
  }
}
</script>

<style scoped>
.guide-tooltip {
  @apply pointer-events-none;
}

.guide-tooltip > div:not(:first-child) {
  @apply pointer-events-auto;
}
</style> 