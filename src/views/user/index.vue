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
                activeTab === tab.key
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
              ]"
              @click="activeTab = tab.key"
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

          <!-- 听歌排行 -->
          <div v-else-if="activeTab === 'rank'">
            <ListeningRank />
          </div>

          <!-- 听歌偏好 -->
          <div v-else-if="activeTab === 'preference'">
            <MusicPreference />
          </div>

          <!-- 听歌统计 -->
          <div v-else-if="activeTab === 'stats'">
            <ListeningStats />
          </div>

          <!-- 个人资料 -->
          <div v-else-if="activeTab === 'profile'">
            <ProfileEditor />
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

    <!-- 操作引导 -->
    <GuideTooltip
      v-if="showGuide"
      :steps="guideSteps"
      @complete="completeGuide"
    />
  </div>
</template>

<script setup lang="ts">
/**
 * 用户个人中心页面
 * @description 显示用户基本信息、收藏内容、播放历史等
 */
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/user';
import { usePlayerStore } from '@/stores/player';
import { useMessage, NSpin, NButton } from 'naive-ui';
import { getUserPlaylists } from '@/api/modules/user';
import MusicList from '@/components/music/MusicList.vue';
import ListeningRank from './components/ListeningRank.vue';
import ListeningPreference from './components/ListeningPreference.vue';
import ProfileEditor from './components/ProfileEditor.vue';
import ListeningStats from './components/ListeningStats.vue';
import MusicPreference from './components/MusicPreference.vue';
import type { UserProfile, Playlist, UserPlaylistsResponse } from '@/types/models/user';
import PageTransition from '@/components/ui/PageTransition.vue';
import GuideTooltip from '@/components/ui/GuideTooltip.vue';

const userStore = useUserStore();
const playerStore = usePlayerStore();
const router = useRouter();
const message = useMessage();

// 页面状态
const isLoading = ref(false);
const activeTab = ref<'stats' | 'preference' | 'rank'>('stats');

// 标签页定义
const tabs = [
  { key: 'stats', label: '听歌统计' },
  { key: 'preference', label: '音乐偏好' },
  { key: 'rank', label: '听歌排行' }
];

// 收藏统计
const collectStats = ref({
  songs: 0,
  playlists: 0,
  albums: 0
});

// 歌单数据
const playlists = ref<Playlist[]>([]);
const createdPlaylists = computed(() => {
  return playlists.value.filter((playlist: Playlist) =>
    playlist.creator && playlist.creator.userId === userStore.profile?.userId
  );
});
const collectedPlaylists = computed(() => {
  return playlists.value.filter((playlist: Playlist) =>
    playlist.creator && playlist.creator.userId !== userStore.profile?.userId
  );
});

/**
 * 加载用户歌单
 */
async function loadUserPlaylists() {
  if (!userStore.isLoggedIn || !userStore.profile?.userId) return;

  isLoading.value = true;
  try {
    const res = await getUserPlaylists(userStore.profile.userId) as UserPlaylistsResponse;
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
 * 格式化数字，如果大于10000则显示为"xx万"
 */
function formatNumber(num: number): string {
  if (num >= 10000) {
    return (num / 10000).toFixed(1) + '万';
  }
  return num.toString();
}

// 引导步骤
const guideSteps = [
  {
    title: '听歌统计',
    content: '这里展示了你的听歌时长、数量等统计信息，帮助你了解自己的听歌习惯。',
    position: {
      top: '30%',
      left: '50%'
    }
  },
  {
    title: '音乐偏好',
    content: '这里展示了你的音乐风格偏好、常听歌手和语言偏好，帮助你发现自己的音乐品味。',
    position: {
      top: '30%',
      left: '50%'
    }
  },
  {
    title: '听歌排行',
    content: '这里展示了你最近一周/一月的听歌排行，帮助你回顾最近喜欢的音乐。',
    position: {
      top: '30%',
      left: '50%'
    }
  }
];

// 是否显示引导
const showGuide = ref(true);

// 完成引导
function completeGuide() {
  showGuide.value = false;
  // 可以在这里保存用户完成引导的状态
  localStorage.setItem('user_guide_completed', 'true');
}

// 检查是否需要显示引导
onMounted(() => {
  const completed = localStorage.getItem('user_guide_completed');
  if (completed === 'true') {
    showGuide.value = false;
  }
});

// 页面初始化
onMounted(async () => {
  // 如果已登录，则加载用户数据
  if (userStore.isLoggedIn) {
    await loadUserPlaylists();
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

.playlist-card {
  transition: all 0.3s ease;
}

.playlist-card:hover {
  transform: translateY(-4px);
}
</style>