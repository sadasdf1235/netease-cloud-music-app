<template>
  <div class="user-center container mx-auto px-4 py-6">
    <template v-if="userStore.isLoggedIn">
      <!-- 用户信息 -->
      <div class="user-profile mb-8 flex flex-col md:flex-row bg-white dark:bg-dark-900 rounded-lg shadow-md p-6">
        <!-- 头像和基本信息 -->
        <div class="flex items-center mb-6 md:mb-0 md:mr-8">
          <div class="relative">
            <img
              :src="userStore.profile?.avatarUrl + '?param=160y160'"
              alt="用户头像"
              class="w-24 h-24 rounded-full object-cover border-4 border-white dark:border-dark-700 shadow-lg"
            />
            <div
              v-if="userStore.profile?.vipType && userStore.profile.vipType > 0"
              class="absolute -bottom-1 -right-1 bg-primary text-white text-xs px-2 py-0.5 rounded-full"
            >
              VIP
            </div>
          </div>
          <div class="ml-4">
            <h1 class="text-xl font-bold flex items-center">
              {{ userStore.profile?.nickname || '未登录' }}
              <span
                v-if="userStore.profile?.gender === 1"
                class="ml-2 text-blue-500 i-carbon-male"
                title="男性"
              ></span>
              <span
                v-else-if="userStore.profile?.gender === 2"
                class="ml-2 text-pink-500 i-carbon-female"
                title="女性"
              ></span>
            </h1>
            <div class="text-gray-500 text-sm mt-1">
              <p>Lv.{{ userStore.profile?.level || 0 }}</p>
            </div>
            <div class="flex items-center text-sm mt-3">
              <button class="flex items-center mr-4">
                <span class="mr-1">{{ formatNumber(userStore.profile?.follows || 0) }}</span>
                <span>关注</span>
              </button>
              <button class="flex items-center">
                <span class="mr-1">{{ formatNumber(userStore.profile?.followeds || 0) }}</span>
                <span>粉丝</span>
              </button>
            </div>
          </div>
        </div>

        <!-- 用户签名和统计 -->
        <div class="flex-1 border-t pt-4 md:pt-0 md:border-t-0 md:border-l md:pl-8">
          <div class="max-w-lg">
            <div class="text-gray-600 dark:text-gray-400 text-sm mb-4">
              <p>{{ userStore.profile?.signature || '这个人很懒，什么都没写~' }}</p>
            </div>
            <div class="flex flex-wrap -mx-2">
              <div class="px-2 w-1/3">
                <div class="bg-gray-50 dark:bg-dark-800 p-3 rounded-lg text-center">
                  <div class="text-xl font-bold">{{ collectStats.songs }}</div>
                  <div class="text-xs text-gray-500">喜欢的音乐</div>
                </div>
              </div>
              <div class="px-2 w-1/3">
                <div class="bg-gray-50 dark:bg-dark-800 p-3 rounded-lg text-center">
                  <div class="text-xl font-bold">{{ collectStats.playlists }}</div>
                  <div class="text-xs text-gray-500">创建的歌单</div>
                </div>
              </div>
              <div class="px-2 w-1/3">
                <div class="bg-gray-50 dark:bg-dark-800 p-3 rounded-lg text-center">
                  <div class="text-xl font-bold">{{ collectStats.albums }}</div>
                  <div class="text-xs text-gray-500">收藏的专辑</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 内容标签页 -->
      <div class="bg-white dark:bg-dark-900 rounded-lg shadow-md overflow-hidden mb-8">
        <div class="border-b border-gray-200 dark:border-gray-700">
          <div class="flex overflow-x-auto hide-scrollbar">
            <button
              v-for="(tab, index) in tabs"
              :key="index"
              class="px-6 py-4 text-sm font-medium transition-colors whitespace-nowrap"
              :class="[
                activeTab === tab.value 
                  ? 'text-primary border-b-2 border-primary' 
                  : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
              ]"
              @click="activeTab = tab.value"
            >
              {{ tab.label }}
            </button>
          </div>
        </div>

        <div class="p-6">
          <!-- 我的收藏 -->
          <div v-if="activeTab === 'collect'">
            <div v-if="isLoading" class="text-center py-10">
              <n-spin size="large" />
            </div>
            <div v-else-if="collectedPlaylists.length > 0">
              <h2 class="text-lg font-bold mb-4">我创建的歌单</h2>
              <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-8">
                <div 
                  v-for="playlist in createdPlaylists" 
                  :key="playlist.id"
                  class="playlist-card"
                >
                  <div class="relative aspect-square overflow-hidden rounded-lg mb-2">
                    <img 
                      :src="playlist.coverImgUrl + '?param=200y200'" 
                      :alt="playlist.name"
                      class="w-full h-full object-cover transition-transform hover:scale-110"
                    />
                    <div class="absolute bottom-2 right-2 w-8 h-8 bg-black/50 rounded-full flex items-center justify-center text-white cursor-pointer">
                      <div class="i-carbon-play-filled"></div>
                    </div>
                  </div>
                  <div class="text-sm font-medium line-clamp-2">{{ playlist.name }}</div>
                  <div class="text-xs text-gray-500 mt-1">{{ playlist.trackCount }}首</div>
                </div>
              </div>

              <h2 class="text-lg font-bold mb-4">我收藏的歌单</h2>
              <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                <div 
                  v-for="playlist in collectedPlaylists" 
                  :key="playlist.id"
                  class="playlist-card"
                >
                  <div class="relative aspect-square overflow-hidden rounded-lg mb-2">
                    <img 
                      :src="playlist.coverImgUrl + '?param=200y200'" 
                      :alt="playlist.name"
                      class="w-full h-full object-cover transition-transform hover:scale-110"
                    />
                    <div class="absolute bottom-2 right-2 w-8 h-8 bg-black/50 rounded-full flex items-center justify-center text-white cursor-pointer">
                      <div class="i-carbon-play-filled"></div>
                    </div>
                  </div>
                  <div class="text-sm font-medium line-clamp-2">{{ playlist.name }}</div>
                  <div class="text-xs text-gray-500 mt-1">
                    <span>by </span>
                    <span class="hover:text-primary">{{ playlist.creator?.nickname }}</span>
                  </div>
                </div>
              </div>
            </div>
            <div v-else class="py-10 text-center text-gray-500">
              <div class="i-carbon-music-add text-5xl mx-auto mb-4"></div>
              <p>暂无收藏的歌单</p>
              <p class="mt-2 text-sm">去发现页面寻找心仪的内容吧~</p>
            </div>
          </div>

          <!-- 播放历史 -->
          <div v-else-if="activeTab === 'history'">
            <div v-if="isLoading" class="text-center py-10">
              <n-spin size="large" />
            </div>
            <div v-else-if="playHistory.length > 0">
              <h2 class="text-lg font-bold mb-4">最近播放</h2>
              <MusicList
                :tracks="playHistory"
                :loading="isLoading"
                :show-search="false"
                :show-count="true"
                :empty-text="'暂无播放历史'"
                @play="playSong"
                @add-to-playlist="addToPlaylist"
                @toggle-like="toggleLike"
                @more-actions="showMoreActions"
              />
            </div>
            <div v-else class="py-10 text-center text-gray-500">
              <div class="i-carbon-recently-viewed text-5xl mx-auto mb-4"></div>
              <p>暂无播放历史</p>
              <p class="mt-2 text-sm">去发现一些好听的音乐吧~</p>
            </div>
          </div>

          <!-- 我的关注 -->
          <div v-else-if="activeTab === 'follows'">
            <div v-if="isLoading" class="text-center py-10">
              <n-spin size="large" />
            </div>
            <div v-else-if="follows.length > 0">
              <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                <div 
                  v-for="artist in follows" 
                  :key="artist.id"
                  class="artist-card"
                >
                  <div class="relative aspect-square overflow-hidden rounded-full mb-2">
                    <img 
                      :src="artist.avatarUrl + '?param=200y200'" 
                      :alt="artist.name"
                      class="w-full h-full object-cover"
                    />
                  </div>
                  <div class="text-center">
                    <div class="text-sm font-medium">{{ artist.name }}</div>
                    <div class="text-xs text-gray-500 mt-1">
                      {{ formatNumber(artist.followeds || 0) }} 粉丝
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div v-else class="py-10 text-center text-gray-500">
              <div class="i-carbon-user-favorite text-5xl mx-auto mb-4"></div>
              <p>暂无关注的用户/歌手</p>
              <p class="mt-2 text-sm">去发现页面寻找你喜爱的歌手吧~</p>
            </div>
          </div>
        </div>
      </div>
    </template>

    <!-- 未登录状态 -->
    <div v-else class="flex flex-col items-center justify-center py-20 bg-white dark:bg-dark-900 rounded-lg shadow-md">
      <div class="i-carbon-user-avatar text-8xl text-gray-300 mb-4"></div>
      <h2 class="text-2xl font-bold mb-2">登录网易云音乐</h2>
      <p class="text-gray-500 mb-6">享受音乐的独特魅力</p>
      <n-button type="primary" size="large" @click="$router.push('/login')">
        立即登录
      </n-button>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * 用户个人中心页面
 * @description 显示用户基本信息、收藏内容、播放历史等
 */
import { ref, computed, onMounted, defineComponent } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/user';
import { usePlayerStore } from '@/stores/player';
import { useMessage, NSpin, NButton } from 'naive-ui';
import { getUserPlaylists, getUserRecord, getUserFollows } from '@/api/modules/user';
import MusicList from '@/components/music/MusicList.vue';
import type { UserProfile } from '@/types/models/user';

// 定义组件，解决模板中的类型问题
defineComponent({
  name: 'UserCenter',
  components: {
    MusicList,
    NSpin,
    NButton
  }
});

const userStore = useUserStore();
const playerStore = usePlayerStore();
const router = useRouter();
const message = useMessage();

// 页面状态
const isLoading = ref(false);
const activeTab = ref('collect'); // collect, history, follows

// 标签页定义
const tabs = [
  { label: '我的收藏', value: 'collect' },
  { label: '播放历史', value: 'history' },
  { label: '我的关注', value: 'follows' }
];

// 收藏统计
const collectStats = ref({
  songs: 0,
  playlists: 0,
  albums: 0
});

// 歌单数据
const playlists = ref<any[]>([]);
const createdPlaylists = computed(() => {
  return playlists.value.filter((playlist) => 
    playlist.creator && playlist.creator.userId === userStore.profile?.userId
  );
});
const collectedPlaylists = computed(() => {
  return playlists.value.filter((playlist) => 
    playlist.creator && playlist.creator.userId !== userStore.profile?.userId
  );
});

// 播放历史
const playHistory = ref<any[]>([]);

// 关注列表
const follows = ref<any[]>([]);

/**
 * 加载用户歌单
 */
async function loadUserPlaylists() {
  if (!userStore.isLoggedIn || !userStore.profile?.userId) return;
  
  isLoading.value = true;
  try {
    const res = await getUserPlaylists(userStore.profile.userId);
    if (res.playlist) {
      playlists.value = res.playlist;
      collectStats.value.playlists = createdPlaylists.value.length;
    }
  } catch (error) {
    console.error('获取用户歌单失败:', error);
    message.error('获取歌单信息失败');
  } finally {
    isLoading.value = false;
  }
}

/**
 * 加载播放历史
 */
async function loadPlayHistory() {
  if (!userStore.isLoggedIn || !userStore.profile?.userId) return;
  
  isLoading.value = true;
  try {
    // type=1: 最近一周播放, type=0: 所有时间
    const res = await getUserRecord(userStore.profile.userId, 1);
    if (res.weekData) {
      playHistory.value = res.weekData.map((item: any) => item.song);
    }
  } catch (error) {
    console.error('获取播放历史失败:', error);
    message.error('获取播放历史失败');
  } finally {
    isLoading.value = false;
  }
}

/**
 * 加载用户关注列表
 */
async function loadUserFollows() {
  if (!userStore.isLoggedIn || !userStore.profile?.userId) return;
  
  isLoading.value = true;
  try {
    const res = await getUserFollows(userStore.profile.userId);
    if (res && res.follow) {
      follows.value = res.follow;
    }
  } catch (error) {
    console.error('获取关注列表失败:', error);
    message.error('获取关注列表失败');
  } finally {
    isLoading.value = false;
  }
}

/**
 * 格式化数字，如果大于10000则显示为"xx万"
 * @param num 要格式化的数字
 * @returns 格式化后的字符串
 */
function formatNumber(num: number): string {
  if (num >= 10000) {
    return (num / 10000).toFixed(1) + '万';
  }
  return num.toString();
}

/**
 * 播放歌曲
 */
function playSong({ track, index }: { track: any, index: number }) {
  playerStore.setPlaylist([track]);
  playerStore.play(0);
  message.success(`正在播放: ${track.name}`);
}

/**
 * 添加到播放列表
 */
function addToPlaylist(track: any) {
  playerStore.addToPlaylist(track);
  message.success('已添加到播放列表');
}

/**
 * 收藏歌曲
 */
function toggleLike(track: any) {
  message.success(`收藏成功: ${track.name}`);
}

/**
 * 显示更多操作
 */
function showMoreActions(track: any) {
  message.info('更多功能开发中');
}

// 页面初始化
onMounted(async () => {
  // 如果已登录，则加载用户数据
  if (userStore.isLoggedIn) {
    await Promise.all([
      loadUserPlaylists(),
      loadPlayHistory(),
      loadUserFollows()
    ]);
  }
});
</script>

<style scoped>
.hide-scrollbar::-webkit-scrollbar {
  display: none;
}
.hide-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style> 