<template>
  <div class="search-page container mx-auto px-4 py-6">
    <!-- 搜索框 -->
    <div class="mb-6">
      <div class="relative max-w-2xl mx-auto">
        <input
          v-model="searchKeyword"
          type="text"
          placeholder="搜索音乐、歌手、歌词、用户"
          class="w-full py-3 px-5 pr-12 rounded-full bg-gray-100 dark:bg-dark-800 focus:outline-none focus:ring-2 focus:ring-primary"
          @keyup.enter="handleSearch"
        />
        <button
          class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-primary"
          @click="handleSearch"
        >
          <div class="i-carbon-search text-xl"></div>
        </button>
      </div>
    </div>

    <!-- 热门搜索 -->
    <div v-if="!hasSearched" class="mb-8">
      <h2 class="text-xl font-bold mb-4">热门搜索</h2>
      <div class="flex flex-wrap gap-2">
        <button
          v-for="(hot, index) in hotSearches"
          :key="index"
          class="px-3 py-1.5 rounded-full bg-gray-100 dark:bg-dark-800 hover:bg-gray-200 dark:hover:bg-dark-700 text-sm transition-colors"
          @click="searchKeyword = hot.first; handleSearch()"
        >
          {{ hot.first }}
        </button>
      </div>
    </div>

    <!-- 搜索历史 -->
    <div v-if="!hasSearched && searchHistory.length > 0" class="mb-8">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-xl font-bold">搜索历史</h2>
        <button
          class="text-sm text-gray-500 hover:text-primary"
          @click="clearSearchHistory"
        >
          清空
        </button>
      </div>
      <div class="flex flex-wrap gap-2">
        <div
          v-for="(history, index) in searchHistory"
          :key="index"
          class="flex items-center px-3 py-1.5 rounded-full bg-gray-100 dark:bg-dark-800 hover:bg-gray-200 dark:hover:bg-dark-700 text-sm transition-colors"
        >
          <span class="cursor-pointer" @click="searchKeyword = history; handleSearch()">
            {{ history }}
          </span>
          <button
            class="ml-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            @click.stop="removeSearchHistory(index)"
          >
            <div class="i-carbon-close text-xs"></div>
          </button>
        </div>
      </div>
    </div>

    <!-- 搜索结果 -->
    <div v-if="hasSearched">
      <div class="mb-6">
        <h1 class="text-2xl font-bold">
          <span class="text-primary">"{{ currentKeyword }}"</span> 的搜索结果
        </h1>
      </div>

      <!-- 搜索结果组件 -->
      <SearchResults
        :keywords="currentKeyword"
        :loading="loading"
        :songs="searchResults.songs"
        :song-count="searchResults.songCount"
        :albums="searchResults.albums"
        :album-count="searchResults.albumCount"
        :artists="searchResults.artists"
        :artist-count="searchResults.artistCount"
        :playlists="searchResults.playlists"
        :playlist-count="searchResults.playlistCount"
        @play-song="playSong"
        @play-album="playAlbum"
        @play-artist="playArtist"
        @play-playlist="playPlaylist"
        @add-to-playlist="addToPlaylist"
        @toggle-like="toggleLike"
        @follow-artist="followArtist"
        @unfollow-artist="unfollowArtist"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * 搜索页面
 * @description 提供搜索功能，展示热门搜索和搜索结果
 */
import { ref, reactive, computed, onMounted, watch } from 'vue';
import { usePlayerStore } from '@/stores/player';
import { useMessage } from 'naive-ui';
import { search, getSearchHot, multiSearch } from '@/api/modules/search';
import { getAlbumDetail } from '@/api/modules/album';
import { getArtistSongs } from '@/api/modules/artist';
import { getPlaylistDetail, getPlaylistTracks } from '@/api/modules/playlist';
import { SearchType } from '@/types/api/search';
import SearchResults from './SearchResults.vue';
import { useRoute } from 'vue-router';

const playerStore = usePlayerStore();
const message = useMessage();
const route = useRoute();

// 搜索关键词
const searchKeyword = ref('');
// 当前搜索的关键词
const currentKeyword = ref('');
// 是否已经搜索过
const hasSearched = ref(false);
// 加载状态
const loading = ref(false);
// 热门搜索
const hotSearches = ref<any[]>([]);
// 搜索历史
const searchHistory = ref<string[]>([]);
// 搜索结果
const searchResults = reactive({
  songs: [] as any[],
  songCount: 0,
  albums: [] as any[],
  albumCount: 0,
  artists: [] as any[],
  artistCount: 0,
  playlists: [] as any[],
  playlistCount: 0
});

/**
 * 处理搜索
 */
async function handleSearch() {
  if (!searchKeyword.value.trim()) {
    message.warning('请输入搜索关键词');
    return;
  }

  // 更新当前搜索关键词
  currentKeyword.value = searchKeyword.value.trim();
  // 标记已搜索
  hasSearched.value = true;
  // 添加到搜索历史
  addSearchHistory(currentKeyword.value);
  // 开始加载
  loading.value = true;

  try {
    // 执行多类型搜索
    const result = await multiSearch(currentKeyword.value, [
      SearchType.SONG,
      SearchType.ALBUM,
      SearchType.ARTIST,
      SearchType.PLAYLIST
    ]);

    // 更新搜索结果
    if (result) {
      searchResults.songs = result.songs || [];
      searchResults.songCount = result.songCount || 0;
      searchResults.albums = result.albums || [];
      searchResults.albumCount = result.albumCount || 0;
      searchResults.artists = result.artists || [];
      searchResults.artistCount = result.artistCount || 0;
      searchResults.playlists = result.playlists || [];
      searchResults.playlistCount = result.playlistCount || 0;
    }
  } catch (error) {
    console.error('搜索失败:', error);
    message.error('搜索失败，请稍后再试');
  } finally {
    loading.value = false;
  }
}

/**
 * 添加搜索历史
 * @param keyword 搜索关键词
 */
function addSearchHistory(keyword: string) {
  // 如果已存在，先移除
  const index = searchHistory.value.indexOf(keyword);
  if (index !== -1) {
    searchHistory.value.splice(index, 1);
  }
  // 添加到最前面
  searchHistory.value.unshift(keyword);
  // 最多保留10条
  if (searchHistory.value.length > 10) {
    searchHistory.value.pop();
  }
  // 保存到本地存储
  localStorage.setItem('searchHistory', JSON.stringify(searchHistory.value));
}

/**
 * 移除搜索历史
 * @param index 索引
 */
function removeSearchHistory(index: number) {
  searchHistory.value.splice(index, 1);
  localStorage.setItem('searchHistory', JSON.stringify(searchHistory.value));
}

/**
 * 清空搜索历史
 */
function clearSearchHistory() {
  searchHistory.value = [];
  localStorage.removeItem('searchHistory');
}

/**
 * 播放歌曲
 * @param data 包含歌曲和索引的对象
 */
function playSong(data: { track: any, index: number }) {
  playerStore.setPlaylist(searchResults.songs);
  playerStore.play(data.index);
}

/**
 * 播放专辑
 * @param id 专辑ID
 */
function playAlbum(id: number) {
  getAlbumDetail(id).then((res: any) => {
    if (res.songs && res.songs.length > 0) {
      playerStore.setPlaylist(res.songs);
      playerStore.play(0);
      message.success(`开始播放专辑《${res.album.name}》`);
    } else {
      message.warning('专辑中暂无歌曲');
    }
  }).catch((err: any) => {
    console.error('播放专辑失败:', err);
    message.error('播放失败，请稍后再试');
  });
}

/**
 * 播放艺术家热门歌曲
 * @param id 艺术家ID
 */
function playArtist(id: number) {
  getArtistSongs(id).then((res: any) => {
    if (res.songs && res.songs.length > 0) {
      playerStore.setPlaylist(res.songs);
      playerStore.play(0);
      message.success(`开始播放 ${res.artist.name} 的热门歌曲`);
    } else {
      message.warning('暂无热门歌曲');
    }
  }).catch((err: any) => {
    console.error('播放艺术家热门歌曲失败:', err);
    message.error('播放失败，请稍后再试');
  });
}

/**
 * 播放歌单
 * @param id 歌单ID
 */
function playPlaylist(id: number) {
  getPlaylistDetail(id).then((res: any) => {
    if (res.playlist && res.playlist.trackIds) {
      getPlaylistTracks(id, res.playlist.trackIds.map((t: any) => t.id)).then((tracksRes: any) => {
        if (tracksRes.songs && tracksRes.songs.length > 0) {
          playerStore.setPlaylist(tracksRes.songs);
          playerStore.play(0);
          message.success(`开始播放歌单《${res.playlist.name}》`);
        } else {
          message.warning('歌单中暂无歌曲');
        }
      });
    }
  }).catch((err: any) => {
    console.error('播放歌单失败:', err);
    message.error('播放失败，请稍后再试');
  });
}

/**
 * 添加歌曲到播放列表
 * @param track 歌曲对象
 */
function addToPlaylist(track: any) {
  // 检查歌曲是否已在播放列表中
  const existingIndex = playerStore.playlist.findIndex((item: any) => item.id === track.id);

  if (existingIndex === -1) {
    // 添加到播放列表
    const newPlaylist = [...playerStore.playlist, track];
    playerStore.setPlaylist(newPlaylist);
    message.success('已添加到播放列表');
  } else {
    message.info('歌曲已在播放列表中');
  }
}

/**
 * 切换歌曲喜欢状态
 * @param track 歌曲对象
 */
function toggleLike(track: any) {
  // 这里应该调用API来喜欢/取消喜欢歌曲
  // 由于API未实现，这里只做提示
  message.success(`${track.name} 已添加到我喜欢的音乐`);
}

/**
 * 关注艺术家
 * @param id 艺术家ID
 */
function followArtist(id: number) {
  // 这里应该调用API来关注艺术家
  // 由于API未实现，这里只做提示
  message.success('关注成功');
}

/**
 * 取消关注艺术家
 * @param id 艺术家ID
 */
function unfollowArtist(id: number) {
  // 这里应该调用API来取消关注艺术家
  // 由于API未实现，这里只做提示
  message.success('已取消关注');
}

// 组件挂载时获取热门搜索和搜索历史
onMounted(async () => {
  // 获取热门搜索
  try {
    const res = await getSearchHot();
    if (res && res.result && res.result.hots) {
      hotSearches.value = res.result.hots;
    }
  } catch (error) {
    console.error('获取热门搜索失败:', error);
  }

  // 获取搜索历史
  try {
    const history = localStorage.getItem('searchHistory');
    if (history) {
      searchHistory.value = JSON.parse(history);
    }
  } catch (error) {
    console.error('获取搜索历史失败:', error);
  }

  // 从URL参数获取搜索关键词
  const keywords = route.query.keywords as string;
  if (keywords) {
    searchKeyword.value = keywords;
    handleSearch();
  }
});

// 监听路由变化，更新搜索关键词
watch(
  () => route.query.keywords,
  (newKeywords) => {
    if (newKeywords && newKeywords !== currentKeyword.value) {
      searchKeyword.value = newKeywords as string;
      handleSearch();
    }
  }
);
</script>
