<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/user';
import type { MenuProps } from 'ant-design-vue';

const router = useRouter();
const userStore = useUserStore();

// 导航菜单项
const menuItems: MenuProps['items'] = [
  {
    key: 'discover',
    label: '发现音乐',
    children: [
      {
        key: 'recommend',
        label: '推荐',
      },
      {
        key: 'playlist',
        label: '歌单',
      },
      {
        key: 'toplist',
        label: '排行榜',
      },
      {
        key: 'artist',
        label: '歌手',
      },
      {
        key: 'album',
        label: '专辑',
      },
    ],
  },
  {
    key: 'my',
    label: '我的音乐',
  },
  {
    key: 'follow',
    label: '关注',
  },
];

// 菜单点击事件
const handleMenuClick: MenuProps['onClick'] = ({ key }) => {
  router.push({ name: key });
};

// 搜索事件
const onSearch = (value: string) => {
  if (value.trim()) {
    router.push({
      name: 'search',
      query: { keywords: value.trim() },
    });
  }
};

// 登录事件
const handleLogin = () => {
  router.push('/login');
};

// 退出登录
const handleLogout = () => {
  userStore.logout();
  router.push('/');
};
</script>

<template>
  <a-layout-header class="header">
    <div class="header-left">
      <!-- Logo -->
      <router-link to="/" class="logo">
        <img src="@/assets/logo.png" alt="网易云音乐" />
      </router-link>

      <!-- 导航菜单 -->
      <a-menu
        v-model:selectedKeys="[$route.name]"
        mode="horizontal"
        :items="menuItems"
        @click="handleMenuClick"
      />
    </div>

    <div class="header-right">
      <!-- 搜索框 -->
      <a-input-search
        v-model:value="searchValue"
        placeholder="搜索音乐、歌手、歌词、用户"
        style="width: 200px"
        @search="onSearch"
      />

      <!-- 用户信息 -->
      <template v-if="userStore.isLoggedIn">
        <a-dropdown>
          <a class="user-info" @click.prevent>
            <a-avatar :src="userStore.profile?.avatarUrl">
              {{ userStore.profile?.nickname?.charAt(0) }}
            </a-avatar>
            <span class="nickname">{{ userStore.profile?.nickname }}</span>
          </a>
          <template #overlay>
            <a-menu>
              <a-menu-item key="profile">
                <router-link to="/user">个人主页</router-link>
              </a-menu-item>
              <a-menu-item key="settings">
                <router-link to="/settings">设置</router-link>
              </a-menu-item>
              <a-menu-item key="logout" @click="handleLogout">
                退出登录
              </a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>
      </template>
      <template v-else>
        <a-button type="link" @click="handleLogin">登录</a-button>
      </template>
    </div>
  </a-layout-header>
</template>

<style lang="less" scoped>
.header {
  .flex-between();
  padding: 0 @padding-lg;
  background-color: @component-background;

  .header-left {
    .flex-start();

    .logo {
      margin-right: @margin-lg;

      img {
        width: 120px;
        height: 32px;
      }
    }
  }

  .header-right {
    .flex-end();
    gap: @margin-lg;

    .user-info {
      .flex-start();
      gap: @margin-xs;
      color: @text-color;

      .nickname {
        .text-ellipsis();
        max-width: 100px;
      }
    }
  }

  :deep(.ant-menu-horizontal) {
    border-bottom: none;
  }
}
</style>