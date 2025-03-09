<template>
  <div class="search-results">
    <!-- 歌曲结果 -->
    <div v-if="songs && songs.length > 0" class="mb-8">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-xl font-bold">歌曲</h2>
        <router-link
          v-if="songCount > 5"
          :to="`/search/songs?keywords=${encodeURIComponent(keywords)}`"
          class="text-sm text-gray-500 hover:text-primary"
        >
          更多 &gt;
        </router-link>
      </div>

      <MusicList
        :tracks="songs"
        :loading="loading"
        :show-search="false"
        :show-count="false"
        empty-text="暂无相关歌曲"
        @play="playSongFromList"
        @add-to-playlist="addToPlaylist"
        @toggle-like="toggleLike"
        @more-actions="showMoreActions"
      />
    </div>

    <!-- 专辑结果 -->
    <div v-if="albums && albums.length > 0" class="mb-8">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-xl font-bold">专辑</h2>
        <router-link
          v-if="albumCount > 5"
          :to="`/search/albums?keywords=${encodeURIComponent(keywords)}`"
          class="text-sm text-gray-500 hover:text-primary"
        >
          更多 &gt;
        </router-link>
      </div>

      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        <AlbumCard
          v-for="album in albums"
          :key="album.id"
          :album="album"
          @play="playAlbum"
        />
      </div>
    </div>

    <!-- 歌手结果 -->
    <div v-if="artists && artists.length > 0" class="mb-8">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-xl font-bold">歌手</h2>
        <router-link
          v-if="artistCount > 5"
          :to="`/search/artists?keywords=${encodeURIComponent(keywords)}`"
          class="text-sm text-gray-500 hover:text-primary"
        >
          更多 &gt;
        </router-link>
      </div>

      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <ArtistCard
          v-for="artist in artists"
          :key="artist.id"
          :artist="artist"
          :show-tags="false"
          @play="playArtistHotSongs"
          @follow="followArtist"
          @unfollow="unfollowArtist"
        />
      </div>
    </div>

    <!-- 歌单结果 -->
    <div v-if="playlists && playlists.length > 0" class="mb-8">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-xl font-bold">歌单</h2>
        <router-link
          v-if="playlistCount > 5"
          :to="`/search/playlists?keywords=${encodeURIComponent(keywords)}`"
          class="text-sm text-gray-500 hover:text-primary"
        >
          更多 &gt;
        </router-link>
      </div>

      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        <RecommendCard
          v-for="playlist in playlists"
          :key="playlist.id"
          :id="playlist.id"
          :cover-url="playlist.coverImgUrl"
          :title="playlist.name"
          :description="playlist.creator?.nickname"
          :count="playlist.playCount"
          type="playlist"
          @click="navigateToPlaylist(playlist.id)"
          @play="playPlaylist(playlist.id)"
        />
      </div>
    </div>

    <!-- 无结果提示 -->
    <div v-if="noResults" class="py-16 text-center text-gray-500">
      <div class="i-carbon-search text-5xl mx-auto mb-4"></div>
      <p>未找到与"{{ keywords }}"相关的内容</p>
      <p class="mt-2 text-sm">换个关键词试试吧~</p>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * 搜索结果组件
 * @description 展示搜索结果，包括歌曲、专辑、歌手和歌单
 */
import { computed, defineProps, defineEmits } from 'vue';
import { usePlayerStore } from '@/stores/player';
import { useMessage } from 'naive-ui';
import MusicList from '@/components/common/MusicList.vue';
import AlbumCard from '@/components/common/AlbumCard.vue';
import ArtistCard from '@/components/common/ArtistCard.vue';
import RecommendCard from '@/components/common/RecommendCard.vue';
import type { Album, Artist, Song } from '@/types/models/song';

interface SearchAlbum extends Album {
  id: number;
  name: string;
  picUrl: string;
}

interface SearchArtist extends Artist {
  id: number;
  name: string;
  picUrl: string;
}

interface SearchPlaylist {
  id: number;
  name: string;
  coverImgUrl: string;
  playCount: number;
  creator?: {
    nickname: string;
  };
}

const props = defineProps({
  /** 搜索关键词 */
  keywords: {
    type: String,
    required: true
  },
  /** 是否加载中 */
  loading: {
    type: Boolean,
    default: false
  },
  /** 歌曲列表 */
  songs: {
    type: Array as () => Song[],
    default: () => []
  },
  /** 歌曲总数 */
  songCount: {
    type: Number,
    default: 0
  },
  /** 专辑列表 */
  albums: {
    type: Array as () => SearchAlbum[],
    default: () => []
  },
  /** 专辑总数 */
  albumCount: {
    type: Number,
    default: 0
  },
  /** 歌手列表 */
  artists: {
    type: Array as () => SearchArtist[],
    default: () => []
  },
  /** 歌手总数 */
  artistCount: {
    type: Number,
    default: 0
  },
  /** 歌单列表 */
  playlists: {
    type: Array as () => SearchPlaylist[],
    default: () => []
  },
  /** 歌单总数 */
  playlistCount: {
    type: Number,
    default: 0
  }
});

const emit = defineEmits([
  'play-song',
  'play-album',
  'play-artist',
  'play-playlist',
  'add-to-playlist',
  'toggle-like',
  'follow-artist',
  'unfollow-artist'
]);

const playerStore = usePlayerStore();
const message = useMessage();

// 是否没有搜索结果
const noResults = computed(() => {
  return (
    (!props.songs || props.songs.length === 0) &&
    (!props.albums || props.albums.length === 0) &&
    (!props.artists || props.artists.length === 0) &&
    (!props.playlists || props.playlists.length === 0)
  );
});

/**
 * 从列表中播放歌曲
 * @param data 包含歌曲和索引的对象
 */
function playSongFromList(data: { track: any, index: number }) {
  emit('play-song', data);
}

/**
 * 添加歌曲到播放列表
 * @param track 歌曲对象
 */
function addToPlaylist(track: any) {
  emit('add-to-playlist', track);
}

/**
 * 切换歌曲喜欢状态
 * @param track 歌曲对象
 */
function toggleLike(track: any) {
  emit('toggle-like', track);
}

/**
 * 显示更多操作
 * @param track 歌曲对象
 */
function showMoreActions(track: any) {
  message.info('更多操作功能开发中');
}

/**
 * 播放专辑
 * @param id 专辑ID
 */
function playAlbum(id: number) {
  emit('play-album', id);
}

/**
 * 播放艺术家热门歌曲
 * @param id 艺术家ID
 */
function playArtistHotSongs(id: number) {
  emit('play-artist', id);
}

/**
 * 关注艺术家
 * @param id 艺术家ID
 */
function followArtist(id: number) {
  emit('follow-artist', id);
}

/**
 * 取消关注艺术家
 * @param id 艺术家ID
 */
function unfollowArtist(id: number) {
  emit('unfollow-artist', id);
}

/**
 * 导航到歌单详情页
 * @param id 歌单ID
 */
function navigateToPlaylist(id: number) {
  window.location.href = `/discover/playlist/${id}`;
}

/**
 * 播放歌单
 * @param id 歌单ID
 */
function playPlaylist(id: number) {
  emit('play-playlist', id);
}
</script>