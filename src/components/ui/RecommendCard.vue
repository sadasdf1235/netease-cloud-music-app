<template>
  <div
    class="recommend-card cursor-pointer transition-transform hover:scale-105"
    @click="handleClick"
  >
    <div class="relative rounded-lg overflow-hidden aspect-square shadow-md mb-2">
      <!-- 图片展示 -->
      <img
        :src="coverUrl"
        class="w-full h-full object-cover"
        :alt="title"
      />

      <!-- 播放次数或其他信息 -->
      <div
        v-if="count"
        class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2"
      >
        <div class="flex items-center text-white text-xs">
          <div :class="countIcon" class="mr-1"></div>
          <span>{{ formatCount(count) }}</span>
        </div>
      </div>

      <!-- 播放按钮 -->
      <div
        class="absolute inset-0 bg-black/30 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center"
        @click.stop="onPlay"
      >
        <div class="w-12 h-12 rounded-full bg-primary/90 flex items-center justify-center text-white">
          <div class="i-carbon-play-filled text-xl"></div>
        </div>
      </div>
    </div>

    <!-- 标题 -->
    <div class="text-sm line-clamp-2 h-10">{{ title }}</div>

    <!-- 描述信息 -->
    <div v-if="description" class="text-xs text-gray-500 truncate">{{ description }}</div>
  </div>
</template>

<script setup lang="ts">
/**
 * 推荐卡片组件
 * @description 用于展示推荐的歌单、专辑或歌手
 */
import { defineProps, defineEmits } from 'vue';

// 组件属性
const props = defineProps({
  /** 封面URL */
  coverUrl: {
    type: String,
    required: true
  },
  /** 卡片标题 */
  title: {
    type: String,
    required: true
  },
  /** 卡片描述 */
  description: {
    type: String,
    default: ''
  },
  /** 数量信息(播放次数、歌曲数等) */
  count: {
    type: Number,
    default: 0
  },
  /** 数量前的图标 */
  countIcon: {
    type: String,
    default: 'i-carbon-play-filled'
  },
  /** 内容类型 */
  type: {
    type: String,
    default: 'playlist', // playlist, album, artist, song
    validator: (value: string) => ['playlist', 'album', 'artist', 'song'].includes(value)
  },
  /** 内容ID */
  id: {
    type: Number,
    required: true
  }
});

// 组件事件
const emit = defineEmits(['click', 'play']);

/**
 * 点击卡片
 */
function handleClick() {
  emit('click', { id: props.id, type: props.type });
}

/**
 * 播放内容
 */
function onPlay() {
  emit('play', { id: props.id, type: props.type });
}

/**
 * 格式化数量
 * @param count 数量
 * @returns 格式化后的字符串
 */
function formatCount(count: number): string {
  if (count < 10000) {
    return count.toString();
  } else if (count < 100000000) {
    return (count / 10000).toFixed(1) + '万';
  } else {
    return (count / 100000000).toFixed(1) + '亿';
  }
}
</script>