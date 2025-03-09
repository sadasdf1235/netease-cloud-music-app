<template>
  <div
    class="playlist-card relative group cursor-pointer"
    @click="$emit('click')"
  >
    <!-- 封面图 -->
    <div class="relative rounded-lg overflow-hidden aspect-square shadow-md mb-2">
      <img
        :src="playlist.coverImgUrl + '?param=200y200'"
        class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
        :alt="playlist.name"
      />
      <!-- 播放次数 -->
      <div class="absolute top-0 right-0 p-2">
        <div class="flex items-center text-white text-xs bg-black/50 px-2 py-1 rounded-full">
          <div class="i-carbon-play-filled mr-1"></div>
          <span>{{ formatPlayCount(playlist.playCount) }}</span>
        </div>
      </div>
      <!-- 播放按钮 -->
      <div
        class="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        @click.stop="$emit('play', playlist.id)"
      >
        <div class="w-12 h-12 rounded-full bg-primary/90 hover:bg-primary flex items-center justify-center text-white text-xl">
          <div class="i-carbon-play-filled"></div>
        </div>
      </div>
    </div>

    <!-- 歌单信息 -->
    <div class="text-sm line-clamp-2 h-10 group-hover:text-primary transition-colors">
      {{ playlist.name }}
    </div>
    <div class="text-xs text-gray-500 dark:text-gray-400 flex items-center">
      <img
        v-if="playlist.creator.avatarUrl"
        :src="playlist.creator.avatarUrl + '?param=24y24'"
        class="w-4 h-4 rounded-full mr-1"
        :alt="playlist.creator.nickname"
      />
      <span>by {{ playlist.creator.nickname }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Playlist } from '@/types/playlist';

defineProps<{
  playlist: Playlist;
}>();

defineEmits<{
  (e: 'click'): void;
  (e: 'play', id: number): void;
}>();

// 格式化播放次数
function formatPlayCount(count: number) {
  if (count > 100000000) {
    return Math.floor(count / 100000000) + '亿';
  } else if (count > 10000) {
    return Math.floor(count / 10000) + '万';
  }
  return count;
}
</script>