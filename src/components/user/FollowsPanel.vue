<template>
  <div class="follows-panel">
    <!-- 标签切换 -->
    <div class="flex border-b border-gray-200 dark:border-dark-700 mb-4">
      <button
        v-for="tab in tabs"
        :key="tab.value"
        class="px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-px"
        :class="[
          activeTab === tab.value
            ? 'text-primary border-primary'
            : 'text-gray-500 border-transparent hover:text-gray-700 dark:hover:text-gray-300'
        ]"
        @click="activeTab = tab.value"
      >
        {{ tab.label }}
      </button>
    </div>

    <!-- 加载中状态 -->
    <div v-if="loading" class="flex justify-center py-10">
      <n-spin size="medium" />
    </div>

    <!-- 无数据状态 -->
    <div v-else-if="getUserList.length === 0" class="py-10 text-center text-gray-500">
      <div :class="activeTab === 'follows' ? 'i-carbon-user-follow' : 'i-carbon-group'" class="text-6xl mx-auto mb-4"></div>
      <p>{{ activeTab === 'follows' ? '暂无关注' : '暂无粉丝' }}</p>
      <p class="mt-2 text-sm">
        {{ activeTab === 'follows' ? '去寻找你喜欢的人吧~' : '继续创作优质内容，会有更多人关注你~' }}
      </p>
    </div>

    <!-- 用户列表 -->
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      <div
        v-for="user in getUserList"
        :key="user.userId"
        class="follow-card bg-white dark:bg-dark-900 rounded-lg p-4 flex items-center"
      >
        <!-- 用户头像 -->
        <div class="relative flex-shrink-0">
          <img
            :src="user.avatarUrl + '?param=100y100'"
            :alt="user.nickname"
            class="w-16 h-16 rounded-full object-cover border-2 border-white dark:border-dark-700 shadow"
          />
          <div
            v-if="user.vipType && user.vipType > 0"
            class="absolute -bottom-1 -right-1 bg-primary text-white text-xs px-1.5 py-0.5 rounded-full"
          >
            VIP
          </div>
        </div>

        <!-- 用户信息 -->
        <div class="ml-4 flex-1 min-w-0">
          <div class="flex items-center">
            <h3 class="text-sm font-bold truncate mr-1" :title="user.nickname">{{ user.nickname }}</h3>
            <span
              v-if="user.gender === 1"
              class="text-blue-500 i-carbon-male text-xs"
              title="男性"
            ></span>
            <span
              v-else-if="user.gender === 2"
              class="text-pink-500 i-carbon-female text-xs"
              title="女性"
            ></span>
          </div>
          <div class="text-xs text-gray-500 mt-1 flex items-center">
            <div class="i-carbon-user-multiple mr-1"></div>
            <span>{{ formatNumber(user.followeds || 0) }} 粉丝</span>
          </div>
          <div v-if="user.signature" class="text-xs text-gray-500 mt-1 truncate" :title="user.signature">
            {{ user.signature }}
          </div>
        </div>

        <!-- 操作按钮 -->
        <div class="ml-3">
          <n-button
            size="tiny"
            :type="user.followed ? 'default' : 'primary'"
            :ghost="user.followed"
            @click="handleFollow(user)"
          >
            {{ user.followed ? '已关注' : '关注' }}
          </n-button>
        </div>
      </div>
    </div>

    <!-- 分页 -->
    <div v-if="total > pageSize" class="flex justify-center mt-6">
      <n-pagination
        v-model:page="currentPage"
        :page-count="Math.ceil(total / pageSize)"
        :page-size="pageSize"
        :page-slot="5"
        @update:page="handlePageChange"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * 用户关注与粉丝面板组件
 * @description 展示用户的关注列表和粉丝列表，支持关注/取消关注操作
 */
import { ref, computed, watch } from 'vue';
import { NSpin, NButton, NPagination } from 'naive-ui';
import type { UserProfile } from '@/types/models/user';

// 定义组件属性
const props = defineProps({
  /** 关注列表 */
  follows: {
    type: Array as () => UserProfile[],
    default: () => []
  },
  /** 粉丝列表 */
  followers: {
    type: Array as () => UserProfile[],
    default: () => []
  },
  /** 是否加载中 */
  loading: {
    type: Boolean,
    default: false
  },
  /** 总数量 */
  total: {
    type: Number,
    default: 0
  },
  /** 当前页码 */
  currentPage: {
    type: Number,
    default: 1
  },
  /** 每页显示数量 */
  pageSize: {
    type: Number,
    default: 30
  }
});

// 定义事件
const emit = defineEmits(['follow', 'page-change']);

// 标签页
const tabs = [
  { label: '我的关注', value: 'follows' },
  { label: '我的粉丝', value: 'followers' }
];

// 当前激活的标签
const activeTab = ref('follows');

// 计算获取当前应该显示的用户列表
const getUserList = computed(() => {
  return activeTab.value === 'follows' ? props.follows : props.followers;
});

/**
 * 格式化数字
 * @param num 数字
 * @returns 格式化后的字符串
 */
function formatNumber(num: number): string {
  if (num >= 100000000) {
    return (num / 100000000).toFixed(1) + '亿';
  } else if (num >= 10000) {
    return (num / 10000).toFixed(1) + '万';
  } else {
    return num.toString();
  }
}

/**
 * 处理关注/取消关注
 * @param user 用户对象
 */
function handleFollow(user: UserProfile): void {
  emit('follow', { userId: user.userId, followed: !user.followed });
}

/**
 * 处理分页变化
 * @param page 页码
 */
function handlePageChange(page: number): void {
  emit('page-change', { tab: activeTab.value, page });
}

// 监听标签变化，重置为第一页
watch(activeTab, (newTab) => {
  emit('page-change', { tab: newTab, page: 1 });
});
</script>

<style scoped>
.follow-card {
  transition: all 0.3s ease;
}

.follow-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}
</style> 