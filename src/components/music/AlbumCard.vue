<template>
  <div class="album-card bg-white dark:bg-dark-900 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
    <div class="relative aspect-square overflow-hidden">
      <!-- 专辑封面 -->
      <img
        :src="album.picUrl + '?param=300y300'"
        class="w-full h-full object-cover transition-transform hover:scale-110 duration-500"
        :alt="album.name"
      />

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

    <div class="p-3">
      <!-- 专辑名称 -->
      <div
        class="text-sm font-medium line-clamp-1 mb-1 hover:text-primary cursor-pointer"
        @click="navigateToAlbum"
      >
        {{ album.name }}
      </div>

      <!-- 艺术家 -->
      <div class="text-xs text-gray-500 line-clamp-1">
        <span
          class="hover:text-primary cursor-pointer"
          @click="navigateToArtist"
        >
          {{ getArtistName() }}
        </span>
      </div>

      <!-- 发行时间 -->
      <div v-if="showPublishTime && album.publishTime" class="text-xs text-gray-400 mt-1">
        {{ formatPublishTime(album.publishTime) }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * 专辑卡片组件
 * @description 用于展示专辑信息
 */
import { defineProps, defineEmits } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

// 组件属性
const props = defineProps({
  /** 专辑信息 */
  album: {
    type: Object,
    required: true
  },
  /** 是否显示发行时间 */
  showPublishTime: {
    type: Boolean,
    default: true
  }
});

// 组件事件
const emit = defineEmits(['play']);

/**
 * 获取艺术家名称
 * @returns 艺术家名称
 */
function getArtistName() {
  if (props.album.artists && props.album.artists.length > 0) {
    return props.album.artists.map((artist: any) => artist.name).join(' / ');
  }

  if (props.album.artist) {
    return props.album.artist.name;
  }

  return '未知艺术家';
}

/**
 * 格式化发行时间
 * @param timestamp 时间戳
 * @returns 格式化后的日期
 */
function formatPublishTime(timestamp: number) {
  const date = new Date(timestamp);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

/**
 * 播放专辑
 */
function onPlay() {
  emit('play', props.album.id);
}

/**
 * 导航到专辑详情页
 */
function navigateToAlbum() {
  router.push(`/discover/album/${props.album.id}`);
}

/**
 * 导航到艺术家详情页
 */
function navigateToArtist() {
  const artistId = props.album.artists?.[0]?.id || props.album.artist?.id;
  if (artistId) {
    router.push(`/discover/artist/${artistId}`);
  }
}
</script>