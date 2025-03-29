<!--
  通用数据获取组件
  @description 封装数据获取逻辑，提供加载状态、错误处理和重试功能
-->
<template>
  <div class="data-fetcher">
    <!-- 加载状态 -->
    <div v-if="loading && !error" class="data-fetcher__loading">
      <slot name="loading">
        <n-spin size="medium">
          <template #description>
            <span>{{ loadingText }}</span>
          </template>
        </n-spin>
      </slot>
    </div>

    <!-- 错误状态 -->
    <div v-else-if="error" class="data-fetcher__error">
      <slot name="error" :error="error" :retry="retry">
        <div class="flex flex-col items-center justify-center py-8">
          <div class="i-carbon-warning-alt text-5xl text-red-500 mb-4"></div>
          <p class="text-gray-600 dark:text-gray-400 mb-4">{{ error.message }}</p>
          <n-button @click="retry" type="primary" size="small">
            <template #icon>
              <div class="i-carbon-restart"></div>
            </template>
            重试
          </n-button>
        </div>
      </slot>
    </div>

    <!-- 空数据状态 -->
    <div v-else-if="isEmpty" class="data-fetcher__empty">
      <slot name="empty">
        <div class="flex flex-col items-center justify-center py-8">
          <div class="i-carbon-folder text-5xl text-gray-400 mb-4"></div>
          <p class="text-gray-500 dark:text-gray-400">{{ emptyText }}</p>
        </div>
      </slot>
    </div>

    <!-- 数据内容 -->
    <div v-else class="data-fetcher__content">
      <slot :data="data"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, watch } from 'vue';
import { useMessage } from 'naive-ui';
import { useRequest } from '@/hooks/useRequest';
import { handleApiError, showErrorMessage } from '@/utils/errorHandler';

/**
 * 组件属性
 */
const props = defineProps({
  /** 请求函数 */
  requestFn: {
    type: Function as unknown as () => Promise<any>,
    required: true
  },
  /** 请求参数 */
  params: {
    type: Object,
    default: () => ({})
  },
  /** 是否自动请求 */
  immediate: {
    type: Boolean,
    default: true
  },
  /** 是否自动重试 */
  retryOnError: {
    type: Boolean,
    default: false
  },
  /** 最大重试次数 */
  maxRetries: {
    type: Number,
    default: 3
  },
  /** 重试延迟(ms) */
  retryDelay: {
    type: Number,
    default: 1000
  },
  /** 加载文本 */
  loadingText: {
    type: String,
    default: '加载中...'
  },
  /** 空数据文本 */
  emptyText: {
    type: String,
    default: '暂无数据'
  },
  /** 判断数据是否为空的函数 */
  isEmptyFn: {
    type: Function,
    default: (data: any) => {
      if (data === null || data === undefined) return true;
      if (Array.isArray(data)) return data.length === 0;
      if (typeof data === 'object') return Object.keys(data).length === 0;
      return false;
    }
  }
});

/**
 * 组件事件
 */
const emit = defineEmits<{
  /** 加载成功事件 */
  (e: 'success', data: any): void;
  /** 加载失败事件 */
  (e: 'error', error: Error): void;
  /** 加载完成事件 */
  (e: 'complete'): void;
}>();

// 消息API
const message = useMessage();

// 使用请求Hook
const { data, loading, error, success, run, reset, retryCount } = useRequest(
  props.requestFn,
  props.params,
  {
    immediate: props.immediate,
    retryOnError: props.retryOnError,
    maxRetries: props.maxRetries,
    retryDelay: props.retryDelay,
    onSuccess: (result) => {
      emit('success', result);
    },
    onError: (err) => {
      const errorInfo = handleApiError(err);
      showErrorMessage(errorInfo, message);
      emit('error', err);
    },
    onFinally: () => {
      emit('complete');
    }
  }
);

/**
 * 判断数据是否为空
 */
const isEmpty = computed(() => {
  return props.isEmptyFn(data.value);
});

/**
 * 重试请求
 */
const retry = () => {
  run(props.params);
};

// 监听参数变化，自动重新请求
watch(
  () => props.params,
  (newParams) => {
    if (props.immediate && !loading.value) {
      run(newParams);
    }
  },
  { deep: true }
);
</script>

<style scoped>
.data-fetcher {
  width: 100%;
  position: relative;
}

.data-fetcher__loading,
.data-fetcher__error,
.data-fetcher__empty {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100px;
  width: 100%;
}
</style> 