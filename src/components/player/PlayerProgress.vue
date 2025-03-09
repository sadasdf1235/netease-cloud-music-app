<template>
    <div class="player-progress">
      <!-- 时间和进度信息 -->
      <div class="flex justify-between text-xs text-gray-500 mb-1">
        <span>{{ formatTime(currentTime) }}</span>
        <span>{{ formatTime(duration) }}</span>
      </div>

      <!-- 进度条 -->
      <div
        class="h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden cursor-pointer"
        @click="onProgressClick"
        ref="progressBarRef"
      >
        <div
          class="h-full bg-primary transition-all"
          :style="{ width: `${progress}%` }"
        ></div>
      </div>
    </div>
  </template>

  <script setup lang="ts">
  /**
   * 播放进度条组件
   * @description 显示和控制播放进度
   */
  import { defineProps, defineEmits, ref } from 'vue';

  /**
   * 组件属性
   */
  const props = defineProps<{
    /** 当前播放时间（秒） */
    currentTime: number;
    /** 总时长（秒） */
    duration: number;
    /** 播放进度（百分比） */
    progress: number;
  }>();

  /**
   * 组件事件
   */
  const emit = defineEmits<{
    /** 进度改变事件 */
    (e: 'seek', time: number): void;
  }>();

  /**
   * 进度条DOM引用
   */
  const progressBarRef = ref<HTMLDivElement | null>(null);

  /**
   * 格式化时间
   * @param time 时间（秒）
   * @returns 格式化后的时间字符串 (MM:SS)
   */
  function formatTime(time: number): string {
    if (isNaN(time)) return '00:00';

    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }

  /**
   * 点击进度条事件处理
   * @param e 鼠标事件
   */
  function onProgressClick(e: MouseEvent) {
    if (!progressBarRef.value || props.duration <= 0) {
      return;
    }

    const rect = progressBarRef.value.getBoundingClientRect();
    const percent = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));

    // 计算新的播放时间
    const newTime = percent * props.duration;

    // 发送事件给父组件
    emit('seek', newTime);
  }
  </script>