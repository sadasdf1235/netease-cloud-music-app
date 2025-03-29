<template>
  <div class="player-lyric">
    <!-- 歌词按钮 -->
    <button
      class="lyric-button flex items-center justify-center p-2 rounded-full hover:bg-gray-100 dark:hover:bg-dark-700"
      @click="toggleLyric"
      :class="{ 'text-primary': showLyric }"
    >
      <div class="i-carbon-closed-caption text-xl"></div>
    </button>

    <!-- 歌词面板 -->
    <div
      v-if="showLyric"
      class="lyric-panel fixed inset-0 bg-black/50 z-50 flex justify-center items-center"
      @click.self="showLyric = false"
    >
      <div
        class="w-full max-w-xl bg-white dark:bg-dark-800 rounded-lg shadow-xl p-6 max-h-[90vh] flex flex-col"
      >
        <!-- 歌词面板头部 -->
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-bold">
            {{ currentSong?.name || '暂无歌曲' }}
          </h3>
          <button
            class="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-dark-700"
            @click="showLyric = false"
          >
            <div class="i-carbon-close"></div>
          </button>
        </div>

        <!-- 歌词内容 -->
        <div class="flex-1 overflow-hidden relative">
          <!-- 无歌词提示 -->
          <div
            v-if="!lyrics.length"
            class="h-full flex items-center justify-center text-gray-500"
          >
            {{ loading ? '歌词加载中...' : '暂无歌词' }}
          </div>

          <!-- 歌词列表 -->
          <div
            v-else
            ref="lyricContainerRef"
            class="h-64 md:h-96 overflow-y-auto px-2 mask-gradient"
          >
            <div class="h-24 md:h-40"></div>
            <p
              v-for="(line, index) in lyrics"
              :key="index"
              :class="[
                'text-center py-2 transition-all duration-300',
                currentLyricIndex === index
                  ? 'text-primary font-bold text-base md:text-lg'
                  : 'text-gray-500 text-sm md:text-base'
              ]"
              :ref="(el: HTMLElement | null) => { if (el && currentLyricIndex === index) currentLineRef = el; }"
            >
              {{ line.text }}
            </p>
            <div class="h-24 md:h-40"></div>
          </div>
        </div>

        <!-- 播放控制 -->
        <div class="pt-4 border-t border-gray-200 dark:border-gray-700 mt-4">
          <div class="flex items-center justify-between">
            <div class="text-sm text-gray-500">
              {{ formatTime(currentTime) }} / {{ formatTime(duration) }}
            </div>
            <div class="flex items-center gap-4">
              <button
                class="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-dark-700"
                @click="$emit('prev')"
              >
                <div class="i-carbon-skip-back-filled text-xl"></div>
              </button>
              <button
                class="p-3 rounded-full bg-primary text-white"
                @click="$emit('toggle-play')"
              >
                <div
                  :class="[
                    isPlaying ? 'i-carbon-pause-filled' : 'i-carbon-play-filled',
                    'text-xl'
                  ]"
                ></div>
              </button>
              <button
                class="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-dark-700"
                @click="$emit('next')"
              >
                <div class="i-carbon-skip-forward-filled text-xl"></div>
              </button>
            </div>
            <div class="text-sm">
              <button
                class="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-dark-700"
                @click="$emit('toggle-play-mode')"
              >
                <div
                  :class="[
                    playMode.loop
                      ? 'i-carbon-repeat text-primary'
                      : playMode.random
                      ? 'i-carbon-shuffle text-primary'
                      : 'i-carbon-repeat',
                    'text-xl'
                  ]"
                ></div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * 歌词显示组件
 * @description 显示当前播放歌曲的歌词，支持滚动和高亮当前行
 */
import { ref, watch, nextTick, onMounted } from 'vue';
import { formatTime } from '@/utils/format';
import type { Song } from '@/types/models/song';

// 定义类型
type LyricLine = { 
  time: number;
  text: string;
};

const props = defineProps({
  /** 当前播放的歌曲 */
  currentSong: {
    type: Object as () => Song | null,
    default: null
  },
  /** 歌词文本 */
  lyricText: {
    type: String,
    default: ''
  },
  /** 当前播放时间(秒) */
  currentTime: {
    type: Number,
    default: 0
  },
  /** 歌曲总时长(秒) */
  duration: {
    type: Number,
    default: 0
  },
  /** 是否正在播放 */
  isPlaying: {
    type: Boolean,
    default: false
  },
  /** 播放模式 */
  playMode: {
    type: Object as () => { loop: boolean; random: boolean },
    default: () => ({ loop: false, random: false })
  },
  /** 是否正在加载歌词 */
  loading: {
    type: Boolean,
    default: false
  }
});

// 发送事件
const emit = defineEmits<{
  (e: 'toggle-play'): void;
  (e: 'prev'): void;
  (e: 'next'): void;
  (e: 'toggle-play-mode'): void;
}>();

// 是否显示歌词面板
const showLyric = ref(false);
// 歌词列表
const lyrics = ref<LyricLine[]>([]);
// 当前高亮的歌词索引
const currentLyricIndex = ref(-1);
// 歌词容器元素
const lyricContainerRef = ref<HTMLElement | null>(null);
// 当前行元素
const currentLineRef = ref<HTMLElement | null>(null);

/**
 * 解析歌词文本
 * @param text 歌词文本
 * @returns 解析后的歌词数组
 */
function parseLyric(text: string): LyricLine[] {
  if (!text) return [];

  const lines = text.split('\n');
  const pattern = /\[(\d{2}):(\d{2})\.(\d{2,3})\]/; // 匹配[00:00.000]格式
  const result: LyricLine[] = [];

  lines.forEach((line) => {
    if (!line) return;

    const match = pattern.exec(line);
    if (!match) return;

    const minutes = parseInt(match[1], 10);
    const seconds = parseInt(match[2], 10);
    const milliseconds = parseInt(match[3], 10);
    const time = minutes * 60 + seconds + milliseconds / 1000;
    const text = line.replace(pattern, '').trim();

    if (text) {
      result.push({ time, text });
    }
  });

  // 按时间排序
  return result.sort((a, b) => a.time - b.time);
}

/**
 * 查找当前播放时间对应的歌词索引
 * @param time 当前播放时间(秒)
 * @returns 对应的歌词索引
 */
function findLyricIndex(time: number): number {
  const index = lyrics.value.findIndex((item: LyricLine, i: number) => {
    const nextTime = lyrics.value[i + 1]?.time ?? Infinity;
    return time >= item.time && time < nextTime;
  });
  return index;
}

/**
 * 滚动到当前歌词行
 */
function scrollToCurrentLine() {
  if (!lyricContainerRef.value || !currentLineRef.value) return;

  const container = lyricContainerRef.value;
  const element = currentLineRef.value;
  const containerHeight = container.clientHeight;
  const elementTop = element.offsetTop;
  const scrollTop = elementTop - containerHeight / 2 + element.offsetHeight / 2;

  container.scrollTo({
    top: scrollTop,
    behavior: 'smooth'
  });
}

/**
 * 切换歌词面板显示状态
 */
function toggleLyric() {
  showLyric.value = !showLyric.value;
}

// 监听歌词文本变化
watch(
  () => props.lyricText,
  (newLyric: string) => {
    lyrics.value = parseLyric(newLyric || '');
    currentLyricIndex.value = -1;
  }
);

// 监听播放时间变化，更新当前歌词
watch(
  () => props.currentTime,
  (newTime: number) => {
    const index = findLyricIndex(newTime);
    if (index !== currentLyricIndex.value) {
      currentLyricIndex.value = index;
      nextTick(() => {
        scrollToCurrentLine();
      });
    }
  }
);

// 监听歌词面板显示状态变化
watch(showLyric, (isShow: boolean) => {
  if (isShow) {
    nextTick(() => {
      scrollToCurrentLine();
    });
  }
});

// 组件挂载时初始化歌词
onMounted(() => {
  if (props.lyricText) {
    lyrics.value = parseLyric(props.lyricText || '');
  }
});
</script>

<style scoped>
/* 歌词渐变遮罩效果 */
.mask-gradient {
  mask-image: linear-gradient(
    to bottom,
    transparent 0%,
    black 15%,
    black 85%,
    transparent 100%
  );
  -webkit-mask-image: linear-gradient(
    to bottom,
    transparent 0%,
    black 15%,
    black 85%,
    transparent 100%
  );
}
</style> 