<script setup lang="ts">
import { useUserStore } from '@/stores/user';
import { usePlaylistStore } from '@/stores/playlist';
import type { MenuProps } from 'ant-design-vue';

const router = useRouter();
const userStore = useUserStore();
const playlistStore = usePlaylistStore();

// 获取用户歌单
const { userPlaylists, likedPlaylists } = storeToRefs(playlistStore);

// 监听登录状态，获取歌单
watch(
  () => userStore.isLoggedIn,
  (isLoggedIn) => {
    if (isLoggedIn) {
      playlistStore.getUserPlaylists();
    }
  },
  { immediate: true }
);

// 创建歌单
const handleCreatePlaylist = () => {
  if (!userStore.isLoggedIn) {
    router.push('/login');
    return;
  }
  // TODO: 实现创建歌单功能
};

// 菜单点击事件
const handleMenuClick: MenuProps['onClick'] = ({ key }) => {
  router.push({
    name: 'playlist-detail',
    params: { id: key },
  });
};
</script>

<template>
  <a-layout-sider class="sider" width="200">
    <!-- 创建歌单按钮 -->
    <div class="create-playlist">
      <a-button
        type="primary"
        block
        :disabled="!userStore.isLoggedIn"
        @click="handleCreatePlaylist"
      >
        创建歌单
      </a-button>
    </div>

    <!-- 我的歌单 -->
    <template v-if="userStore.isLoggedIn">
      <div class="playlist-section">
        <div class="section-title">创建的歌单</div>
        <a-menu
          v-if="userPlaylists.length"
          :selectedKeys="[$route.params.id]"
          @click="handleMenuClick"
        >
          <a-menu-item v-for="playlist in userPlaylists" :key="playlist.id">
            <template #icon>
              <img
                class="playlist-cover"
                :src="playlist.coverImgUrl + '?param=40y40'"
                :alt="playlist.name"
              />
            </template>
            {{ playlist.name }}
          </a-menu-item>
        </a-menu>
        <div v-else class="empty-tip">暂无歌单</div>
      </div>

      <div class="playlist-section">
        <div class="section-title">收藏的歌单</div>
        <a-menu
          v-if="likedPlaylists.length"
          :selectedKeys="[$route.params.id]"
          @click="handleMenuClick"
        >
          <a-menu-item v-for="playlist in likedPlaylists" :key="playlist.id">
            <template #icon>
              <img
                class="playlist-cover"
                :src="playlist.coverImgUrl + '?param=40y40'"
                :alt="playlist.name"
              />
            </template>
            {{ playlist.name }}
          </a-menu-item>
        </a-menu>
        <div v-else class="empty-tip">暂无收藏</div>
      </div>
    </template>

    <!-- 未登录提示 -->
    <template v-else>
      <div class="login-tip">
        <p>登录后查看创建和收藏的歌单</p>
        <a-button type="link" @click="router.push('/login')">立即登录</a-button>
      </div>
    </template>
  </a-layout-sider>
</template>

<style lang="less" scoped>
.sider {
  background-color: @component-background;
  border-right: 1px solid @border-color-split;

  .create-playlist {
    padding: @padding-md;
  }

  .playlist-section {
    margin-bottom: @margin-lg;

    .section-title {
      padding: @padding-xs @padding-md;
      color: @text-color-secondary;
      font-size: @font-size-sm;
    }

    .empty-tip {
      padding: @padding-md;
      color: @text-color-secondary;
      text-align: center;
    }

    :deep(.ant-menu-item) {
      height: 48px;
      line-height: 48px;
      padding-right: @padding-md !important;

      .playlist-cover {
        width: 32px;
        height: 32px;
        border-radius: @border-radius-base;
        margin-right: @margin-xs;
      }

      .ant-menu-title-content {
        .text-ellipsis();
      }
    }
  }

  .login-tip {
    padding: @padding-lg;
    text-align: center;
    color: @text-color-secondary;

    p {
      margin-bottom: @margin-xs;
    }
  }
}
</style>