<template>
    <div class="player-info flex items-center mb-4">
      <div v-if="song">
        <!-- 歌曲封面 -->
        <div class="w-16 h-16 rounded overflow-hidden mr-4 flex-shrink-0">
          <img
            :src="song.album.picUrl + '?param=64y64'"
            :alt="song.name"
            class="w-full h-full object-cover"
          />
        </div>

        <!-- 歌曲信息 -->
        <div class="flex-1 min-w-0">
          <div class="text-base font-medium truncate">
            {{ song.name }}
          </div>
          <div class="text-sm text-gray-500 truncate">
            {{ formatArtists(song.artists) }}
          </div>
        </div>

        <!-- 操作按钮 -->
        <div class="flex items-center">
          <!-- 喜欢按钮 -->
          <button class="icon-btn mr-2" @click="onLike" :title="isLiked ? '取消喜欢' : '添加到我喜欢'">
            <div :class="['hover:text-red-500', isLiked ? 'text-red-500 i-carbon-favorite-filled' : 'text-gray-400 i-carbon-favorite']"></div>
          </button>

          <!-- 播放列表按钮 -->
          <button class="icon-btn" @click="onShowPlaylist" title="播放列表">
            <div class="i-carbon-list text-gray-400 hover:text-primary"></div>
          </button>
        </div>
      </div>

      <!-- 无歌曲时的占位 -->
      <div v-else class="w-full flex items-center justify-between">
        <span class="text-gray-500">暂无播放内容</span>
        <button class="icon-btn" @click="onShowPlaylist" title="播放列表">
          <div class="i-carbon-list text-gray-400 hover:text-primary"></div>
        </button>
      </div>
    </div>
  </template>

  <script setup lang="ts">
  /**
   * 播放信息组件
   * @description 显示当前播放歌曲的信息
   */
  import { defineProps, defineEmits } from 'vue';
  import type { SimpleSong } from '@/types/models/song';

  /**
   * 组件属性
   */
  const props = defineProps<{
    /** 当前播放歌曲 */
    song?: SimpleSong;
    /** 是否已收藏 */
    isLiked?: boolean;
  }>();

  /**
   * 组件事件
   */
  const emit = defineEmits<{
    /** 喜欢/取消喜欢歌曲 */
    (e: 'like'): void;
    /** 显示播放列表 */
    (e: 'show-playlist'): void;
  }>();

  /**
   * 格式化歌手名称
   * @param artists 歌手数组
   * @returns 以 / 分隔的歌手名称
   */
  function formatArtists(artists: any[]) {
    if (!artists || artists.length === 0) return '';
    return artists.map(artist => artist.name).join(' / ');
  }

  /**
   * 喜欢/取消喜欢歌曲
   */
  function onLike() {
    emit('like');
  }

  /**
   * 显示播放列表
   */
  function onShowPlaylist() {
    emit('show-playlist');
  }
  </script>