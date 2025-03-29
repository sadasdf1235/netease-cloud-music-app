<template>
  <div class="toplist-page p-6">
    <h1 class="text-2xl font-bold mb-6">音乐排行榜</h1>

    <DataFetcher
      :requestFn="getToplistDetail"
      @success="handleSuccess"
      @error="handleError"
      loadingText="加载榜单..."
      emptyText="暂无榜单信息"
    >
      <template #loading>
        <div class="flex justify-center items-center py-12">
          <n-spin size="large" />
        </div>
      </template>
      <template #error="{ error, retry }">
        <div class="error-message text-center py-12">
          <p class="text-red-500 mb-4">{{ error.message }}</p>
          <n-button @click="retry" type="primary">重试</n-button>
        </div>
      </template>
      <template #default="{ data }">
        <!-- 官方榜单 -->
        <div class="mb-10">
          <h2 class="text-xl font-bold mb-4 flex items-center">
            <div class="i-carbon-award text-xl mr-2"></div>
            官方榜单
          </h2>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div
              v-for="playlist in officialList"
              :key="playlist.id"
              class="bg-white dark:bg-dark-900 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div class="flex p-4">
                <!-- 封面图 -->
                <div class="relative mr-4 flex-shrink-0">
                  <img
                    :src="playlist.coverImgUrl + '?param=120y120'"
                    class="w-28 h-28 object-cover rounded-lg"
                    :alt="playlist.name"
                  />
                  <div class="absolute top-2 right-2 text-xs px-1.5 py-0.5 rounded bg-black/50 text-white">
                    <div class="flex items-center">
                      <div class="i-carbon-play-filled mr-1"></div>
                      <span>{{ formatPlayCount(playlist.playCount) }}</span>
                    </div>
                  </div>
                </div>
                
                <!-- 榜单信息 -->
                <div class="flex-1 overflow-hidden">
                  <h3 class="text-lg font-bold mb-2 hover:text-primary cursor-pointer truncate" @click="goToDetail(playlist.id)">
                    {{ playlist.name }}
                  </h3>
                  <div class="text-xs text-gray-500 mb-2">
                    {{ playlist.updateFrequency }}
                  </div>
                  
                  <!-- 前5首歌曲 -->
                  <ul class="text-sm">
                    <li
                      v-for="(track, index) in playlist.tracks?.slice(0, 5)"
                      :key="track.id"
                      class="mb-1 truncate"
                    >
                      <span class="inline-block w-4 text-gray-400">{{ index + 1 }}.</span>
                      <span class="hover:text-primary cursor-pointer" @click="playSong(track.id)">
                        {{ track.name }}
                      </span>
                      <span class="text-gray-500 text-xs"> - {{ formatArtists(track.ar) }}</span>
                    </li>
                  </ul>
                  
                  <div class="mt-2">
                    <n-button text size="small" @click="goToDetail(playlist.id)">
                      <div class="flex items-center text-primary">
                        <span>查看全部</span>
                        <div class="i-carbon-chevron-right"></div>
                      </div>
                    </n-button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 特色榜单 -->
        <div class="mb-10">
          <h2 class="text-xl font-bold mb-4 flex items-center">
            <div class="i-carbon-star text-xl mr-2"></div>
            特色榜单
          </h2>
          <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <div
              v-for="playlist in featureList"
              :key="playlist.id"
              class="bg-white dark:bg-dark-900 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div class="relative">
                <img
                  :src="playlist.coverImgUrl + '?param=200y200'"
                  class="w-full aspect-square object-cover"
                  :alt="playlist.name"
                />
                <div class="absolute top-2 right-2 text-xs px-1.5 py-0.5 rounded bg-black/50 text-white">
                  <div class="flex items-center">
                    <div class="i-carbon-play-filled mr-1"></div>
                    <span>{{ formatPlayCount(playlist.playCount) }}</span>
                  </div>
                </div>
              </div>
              <div class="p-3">
                <h3 class="text-sm font-bold mb-1 line-clamp-2 hover:text-primary cursor-pointer" @click="goToDetail(playlist.id)">
                  {{ playlist.name }}
                </h3>
                <div class="text-xs text-gray-500">
                  {{ playlist.updateFrequency }}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 全球榜单 -->
        <div>
          <h2 class="text-xl font-bold mb-4 flex items-center">
            <div class="i-carbon-earth text-xl mr-2"></div>
            全球榜单
          </h2>
          <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <div
              v-for="playlist in globalList"
              :key="playlist.id"
              class="bg-white dark:bg-dark-900 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div class="relative">
                <img
                  :src="playlist.coverImgUrl + '?param=200y200'"
                  class="w-full aspect-square object-cover"
                  :alt="playlist.name"
                />
                <div class="absolute top-2 right-2 text-xs px-1.5 py-0.5 rounded bg-black/50 text-white">
                  <div class="flex items-center">
                    <div class="i-carbon-play-filled mr-1"></div>
                    <span>{{ formatPlayCount(playlist.playCount) }}</span>
                  </div>
                </div>
              </div>
              <div class="p-3">
                <h3 class="text-sm font-bold mb-1 line-clamp-2 hover:text-primary cursor-pointer" @click="goToDetail(playlist.id)">
                  {{ playlist.name }}
                </h3>
                <div class="text-xs text-gray-500">
                  {{ playlist.updateFrequency }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </DataFetcher>
  </div>
</template>

<script setup lang="ts">
/**
 * 排行榜页面
 * @description 展示各类音乐排行榜，包括官方榜、特色榜和全球榜
 */
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { usePlayerStore } from '@/stores/player';
import { useMessage } from 'naive-ui';
import { getToplistDetail } from '@/api/modules/toplist';
import { getSongUrl, getSongDetail } from '@/api/modules/music-song';
import DataFetcher from '@/components/ui/DataFetcher.vue';
import type { ToplistInfo } from '@/types/toplist';
import type { SongUrlResponse, SongDetailResponse } from '@/types/api';

// 扩展ToplistInfo类型，添加API返回的实际属性
interface ToplistInfoExtended extends ToplistInfo {
  ToplistType?: string | null; // API返回的特殊属性，标识是否为官方榜单
}

const router = useRouter();
const playerStore = usePlayerStore();
const message = useMessage();

// 所有榜单数据
const allPlaylists = ref<ToplistInfoExtended[]>([]);
// 加载状态
const loading = ref(true);

// 官方榜单（云音乐特色榜）
const officialList = computed(() => {
  return allPlaylists.value.filter((playlist: ToplistInfoExtended) => playlist.ToplistType);
});

// 特色榜单
const featureList = computed(() => {
  return allPlaylists.value.filter((playlist: ToplistInfoExtended) => 
    !playlist.ToplistType && 
    !playlist.name.includes('全球') && 
    !playlist.name.includes('UK') && 
    !playlist.name.includes('日本') && 
    !playlist.name.includes('韩国') &&
    !playlist.name.includes('美国')
  );
});

// 全球榜单
const globalList = computed(() => {
  return allPlaylists.value.filter((playlist: ToplistInfoExtended) => 
    !playlist.ToplistType && 
    (playlist.name.includes('全球') || 
     playlist.name.includes('UK') || 
     playlist.name.includes('日本') || 
     playlist.name.includes('韩国') ||
     playlist.name.includes('美国'))
  );
});

/**
 * 处理成功获取数据
 * @param data 服务器返回的数据
 */
const handleSuccess = (data: any) => {
  allPlaylists.value = data.list || [];
  loading.value = false;
};

/**
 * 处理获取数据失败
 * @param error 错误信息
 */
const handleError = (error: Error) => {
  console.error('获取榜单失败:', error);
  loading.value = false;
};

/**
 * 格式化播放次数
 * @param count 播放次数
 * @returns 格式化后的播放次数（例如：10万、1亿）
 */
const formatPlayCount = (count: number) => {
  if (!count) return '0';
  if (count < 10000) return count.toString();
  if (count < 100000000) return Math.floor(count / 10000) + '万';
  return Math.floor(count / 100000000) + '亿';
};

/**
 * 格式化歌手列表
 * @param artists 歌手数组
 * @returns 格式化后的歌手字符串（例如：歌手1/歌手2）
 */
const formatArtists = (artists: any[]) => {
  if (!artists || !artists.length) return '';
  return artists.map(artist => artist.name).join('/');
};

/**
 * 跳转到榜单详情页
 * @param id 榜单ID
 */
const goToDetail = (id: number) => {
  router.push(`/discover/playlist/${id}`);
};

/**
 * 播放单曲
 * @param id 歌曲ID
 */
const playSong = async (id: number) => {
  try {
    // 获取歌曲详情
    const detailRes = await getSongDetail(id) as SongDetailResponse;
    if (detailRes.songs && detailRes.songs.length > 0) {
      const song = detailRes.songs[0];
      
      // 获取歌曲播放地址
      const urlRes = await getSongUrl(id) as SongUrlResponse;
      if (urlRes.data && urlRes.data[0] && urlRes.data[0].url) {
        // 设置播放列表并播放
        playerStore.setPlaylist([song]);
        playerStore.play(0);
        message.success(`正在播放: ${song.name}`);
      } else {
        message.error('该歌曲暂无版权或为付费歌曲');
      }
    }
  } catch (error) {
    console.error('播放歌曲失败:', error);
    message.error('播放失败，请稍后再试');
  }
};
</script>

<style scoped>
.toplist-page {
  min-height: calc(100vh - 64px);
}
</style>