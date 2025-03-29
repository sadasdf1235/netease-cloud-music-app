<template>
  <div class="artist-card bg-white dark:bg-dark-900 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
    <div class="relative aspect-square overflow-hidden">
      <!-- 艺术家头像 -->
      <img
        :src="artist.picUrl + '?param=300y300'"
        class="w-full h-full object-cover transition-transform hover:scale-110 duration-500"
        :alt="artist.name"
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
      <!-- 艺术家名称 -->
      <div
        class="text-sm font-medium line-clamp-1 mb-1 hover:text-primary cursor-pointer"
        @click="navigateToArtist"
      >
        {{ artist.name }}
      </div>

      <!-- 艺术家别名 -->
      <div v-if="artist.alias && artist.alias.length > 0" class="text-xs text-gray-500 line-clamp-1">
        {{ artist.alias.join(' / ') }}
      </div>

      <!-- 艺术家标签 -->
      <div v-if="showTags && artist.musicSize" class="flex items-center gap-1 mt-1">
        <span class="text-xs px-1.5 py-0.5 rounded-full bg-gray-100 dark:bg-dark-800 text-gray-500">
          单曲 {{ artist.musicSize }}
        </span>
        <span v-if="artist.albumSize" class="text-xs px-1.5 py-0.5 rounded-full bg-gray-100 dark:bg-dark-800 text-gray-500">
          专辑 {{ artist.albumSize }}
        </span>
        <span v-if="artist.mvSize" class="text-xs px-1.5 py-0.5 rounded-full bg-gray-100 dark:bg-dark-800 text-gray-500">
          MV {{ artist.mvSize }}
        </span>
      </div>

      <!-- 关注按钮 -->
      <div v-if="showFollowButton" class="mt-2">
        <button
          class="w-full py-1 text-xs rounded-full transition-colors"
          :class="isFollowed ? 'bg-gray-200 dark:bg-dark-700 text-gray-700 dark:text-gray-300' : 'bg-primary text-white'"
          @click.stop="toggleFollow"
        >
          {{ isFollowed ? '已关注' : '+ 关注' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * 艺术家卡片组件
 * @description 用于展示歌手信息
 */
import { defineProps, defineEmits, ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

// 组件属性
const props = defineProps({
  /** 艺术家信息 */
  artist: {
    type: Object,
    required: true
  },
  /** 是否显示标签 */
  showTags: {
    type: Boolean,
    default: true
  },
  /** 是否显示关注按钮 */
  showFollowButton: {
    type: Boolean,
    default: true
  },
  /** 初始关注状态 */
  initialFollowed: {
    type: Boolean,
    default: false
  }
});

// 组件事件
const emit = defineEmits(['play', 'follow', 'unfollow']);

// 关注状态
const isFollowed = ref(props.initialFollowed);

/**
 * 播放艺术家热门歌曲
 */
function onPlay() {
  emit('play', props.artist.id);
}

/**
 * 导航到艺术家详情页
 */
function navigateToArtist() {
  router.push(`/discover/artist/${props.artist.id}`);
}

/**
 * 切换关注状态
 */
function toggleFollow() {
  isFollowed.value = !isFollowed.value;

  if (isFollowed.value) {
    emit('follow', props.artist.id);
  } else {
    emit('unfollow', props.artist.id);
  }
}
</script>