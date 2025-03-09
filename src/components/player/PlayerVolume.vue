<template>
    <div class="player-volume flex items-center gap-2">
      <!-- 音量图标 -->
      <button class="icon-btn" @click="onToggleMute" :title="isMuted ? '取消静音' : '静音'">
        <div
          v-if="isMuted || volume === 0"
          class="i-carbon-volume-mute"
        ></div>
        <div
          v-else-if="volume > 50"
          class="i-carbon-volume-up"
        ></div>
        <div v-else class="i-carbon-volume-down"></div>
      </button>

      <!-- 音量滑块 -->
      <input
        type="range"
        min="0"
        max="100"
        step="1"
        :value="volume"
        @input="onVolumeChange"
        class="w-20"
        :title="`音量：${volume}%`"
      />
    </div>
  </template>

  <script setup lang="ts">
  /**
   * 音量控制组件
   * @description 控制播放音量和静音
   */
  import { defineProps, defineEmits } from 'vue';

  /**
   * 组件属性
   */
  const props = defineProps<{
    /** 音量值 (0-100) */
    volume: number;
    /** 是否静音 */
    isMuted: boolean;
  }>();

  /**
   * 组件事件
   */
  const emit = defineEmits<{
    /** 音量改变事件 */
    (e: 'volume-change', volume: number): void;
    /** 切换静音事件 */
    (e: 'toggle-mute'): void;
  }>();

  /**
   * 处理音量变化
   * @param e 输入事件
   */
  function onVolumeChange(e: Event) {
    const target = e.target as HTMLInputElement;
    const value = Number(target.value);
    emit('volume-change', value);
  }

  /**
   * 切换静音状态
   */
  function onToggleMute() {
    emit('toggle-mute');
  }
  </script>