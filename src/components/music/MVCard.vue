<template>
  <div class="mv-card group cursor-pointer" @click="$emit('click')">
    <!-- 封面 -->
    <div class="relative rounded-lg overflow-hidden aspect-video shadow-md mb-2">
      <img
        :src="mv.cover"
        :alt="mv.name"
        class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
      />
      <!-- 播放按钮 -->
      <div
        class="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        @click.stop="$emit('play', mv.id)"
      >
        <n-icon size="36" class="text-white">
          <PlayCircleOutline />
        </n-icon>
      </div>
      <!-- 时长 -->
      <div class="absolute bottom-1 right-1 px-1.5 py-0.5 text-xs text-white bg-black/60 rounded">
        {{ formatDuration(mv.duration) }}
      </div>
      <!-- 播放量 -->
      <div class="absolute top-1 right-1 px-1.5 py-0.5 text-xs text-white bg-black/60 rounded flex items-center">
        <n-icon size="14" class="mr-0.5">
          <PlayOutline />
        </n-icon>
        {{ formatCount(mv.playCount) }}
      </div>
    </div>
    <!-- 标题 -->
    <h3 class="text-sm font-medium line-clamp-1 mb-1 group-hover:text-primary transition-colors">
      {{ mv.name }}
    </h3>
    <!-- 歌手 -->
    <p class="text-xs text-gray-500 line-clamp-1">
      {{ mv.artistName }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { PlayCircleOutline, PlayOutline } from '@vicons/ionicons5';
import type { MV } from '@/types/mv';
import { formatDuration, formatCount } from '@/utils/format';

defineProps<{
  mv: MV;
}>();

defineEmits<{
  (e: 'click'): void;
  (e: 'play', id: number): void;
}>();
</script>

<style scoped>
.mv-card {
  transition: transform 0.3s ease;
}

.mv-card:hover {
  transform: translateY(-4px);
}
</style>