<template>
    <div class="player-controls flex items-center justify-center gap-4">
      <!-- 播放模式 -->
      <button class="icon-btn" @click="togglePlayMode" title="切换播放模式">
        <div
          v-if="!playMode.loop && !playMode.random"
          class="i-carbon-repeat"
        ></div>
        <div
          v-else-if="playMode.loop"
          class="i-carbon-repeat-one"
        ></div>
        <div
          v-else-if="playMode.random"
          class="i-carbon-shuffle"
        ></div>
      </button>

      <!-- 上一首 -->
      <button class="icon-btn" @click="onPrev" title="上一首">
        <div class="i-carbon-previous-filled"></div>
      </button>

      <!-- 播放/暂停 -->
      <button
        class="w-12 h-12 rounded-full bg-primary flex-center text-white"
        @click="onTogglePlay"
        title="播放/暂停"
      >
        <div
          v-if="isPlaying"
          class="i-carbon-pause-filled text-xl"
        ></div>
        <div v-else class="i-carbon-play-filled text-xl"></div>
      </button>

      <!-- 下一首 -->
      <button class="icon-btn" @click="onNext" title="下一首">
        <div class="i-carbon-next-filled"></div>
      </button>
    </div>
  </template>

  <script setup lang="ts">
  /**
   * 播放控制组件
   * @description 包含播放/暂停、上一首/下一首、播放模式等控制按钮
   */
  import { defineProps, defineEmits } from 'vue';
  import { PlayMode } from '@/types/store/player';

  /**
   * 组件属性
   */
  const props = defineProps<{
    /** 是否正在播放 */
    isPlaying: boolean;
    /** 播放模式 */
    playMode: {
      loop: boolean;
      random: boolean;
    };
  }>();

  /**
   * 组件事件
   */
  const emit = defineEmits<{
    /** 切换播放/暂停 */
    (e: 'toggle-play'): void;
    /** 上一首 */
    (e: 'prev'): void;
    /** 下一首 */
    (e: 'next'): void;
    /** 切换播放模式 */
    (e: 'toggle-play-mode'): void;
  }>();

  /**
   * 切换播放/暂停
   */
  function onTogglePlay() {
    emit('toggle-play');
  }

  /**
   * 上一首
   */
  function onPrev() {
    emit('prev');
  }

  /**
   * 下一首
   */
  function onNext() {
    emit('next');
  }

  /**
   * 切换播放模式
   */
  function togglePlayMode() {
    emit('toggle-play-mode');
  }
  </script>