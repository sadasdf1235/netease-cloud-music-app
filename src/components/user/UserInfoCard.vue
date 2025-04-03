<template>
  <div class="user-info-card bg-white dark:bg-dark-900 rounded-lg shadow-sm overflow-hidden">
    <!-- 用户背景封面 -->
    <div class="relative h-48 bg-gradient-to-r from-primary/80 to-blue-500/80 overflow-hidden">
      <img 
        v-if="userInfo.backgroundUrl" 
        :src="userInfo.backgroundUrl + '?param=800y300'" 
        class="w-full h-full object-cover opacity-70"
        loading="lazy"
        alt="用户背景"
      />
      <div class="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-black/60 to-transparent"></div>
    </div>
    
    <!-- 用户基本信息 -->
    <div class="relative px-6 pb-6">
      <!-- 头像 -->
      <div class="absolute -top-16 left-6 border-4 border-white dark:border-dark-900 rounded-full shadow-lg">
        <img 
          :src="userInfo.avatarUrl + '?param=120y120'" 
          class="w-32 h-32 rounded-full object-cover"
          :alt="userInfo.nickname" 
        />
        <div v-if="userInfo.vipType > 0" class="absolute -bottom-1 -right-1 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
          VIP{{ userInfo.vipType }}
        </div>
      </div>
      
      <!-- 用户名和简介 -->
      <div class="ml-40 pt-4">
        <div class="flex items-center flex-wrap gap-2">
          <h2 class="text-xl font-bold">{{ userInfo.nickname }}</h2>
          
          <!-- 性别图标 -->
          <div v-if="userInfo.gender === 1" class="i-carbon-male fill-blue-500"></div>
          <div v-else-if="userInfo.gender === 2" class="i-carbon-female fill-pink-500"></div>
          
          <!-- 等级 -->
          <div class="px-2 py-0.5 text-xs bg-primary/10 text-primary rounded-full">
            Lv.{{ userInfo.level || 0 }}
          </div>
        </div>
        
        <!-- 用户签名 -->
        <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
          {{ userInfo.signature || '这个人很懒，什么都没有留下' }}
        </p>
        
        <!-- 社交信息 -->
        <div class="flex mt-4 gap-6">
          <div class="text-center">
            <div class="text-lg font-medium">{{ formatCount(userInfo.follows || 0) }}</div>
            <div class="text-xs text-gray-500">关注</div>
          </div>
          <div class="text-center">
            <div class="text-lg font-medium">{{ formatCount(userInfo.followeds || 0) }}</div>
            <div class="text-xs text-gray-500">粉丝</div>
          </div>
          <div class="text-center">
            <div class="text-lg font-medium">{{ userInfo.playCount ? formatCount(userInfo.playCount) : '0' }}</div>
            <div class="text-xs text-gray-500">听歌数</div>
          </div>
        </div>
      </div>
      
      <!-- 操作按钮 -->
      <div class="mt-6 flex gap-3">
        <template v-if="isCurrentUser">
          <n-button type="primary" size="small" @click="handleEditProfile">
            <div class="i-carbon-edit mr-1"></div>
            编辑资料
          </n-button>
        </template>
        <template v-else>
          <n-button 
            :type="isFollowing ? 'default' : 'primary'" 
            size="small"
            @click="handleToggleFollow"
          >
            <div :class="isFollowing ? 'i-carbon-checkmark' : 'i-carbon-add'" class="mr-1"></div>
            {{ isFollowing ? '已关注' : '关注' }}
          </n-button>
          <n-button type="default" size="small" @click="handleSendMessage">
            <div class="i-carbon-send mr-1"></div>
            发私信
          </n-button>
        </template>
      </div>
    </div>
    
    <!-- 用户社交标签 -->
    <div class="px-6 pb-6 flex flex-wrap gap-2">
      <div v-for="tag in userInfo.tags" :key="tag" class="px-2 py-1 bg-gray-100 dark:bg-dark-800 rounded-full text-xs">
        {{ tag }}
      </div>
      <div v-if="!userInfo.tags || userInfo.tags.length === 0" class="text-xs text-gray-500">
        暂无标签
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * 用户信息卡片组件
 * @description 展示用户基本信息、社交数据和操作按钮
 */
import { computed } from 'vue';
import { useUserStore } from '@/stores/user';
import { useMessage } from 'naive-ui';

// 消息组件
const message = useMessage();
// 用户状态管理
const userStore = useUserStore();

// 定义组件属性
const props = defineProps({
  /** 用户信息对象 */
  userInfo: {
    type: Object,
    required: true,
    default: () => ({
      userId: 0,
      nickname: '',
      avatarUrl: '',
      backgroundUrl: '',
      signature: '',
      gender: 0,
      follows: 0,
      followeds: 0,
      level: 0,
      vipType: 0,
      playCount: 0,
      tags: []
    })
  },
  /** 是否已关注该用户 */
  isFollowing: {
    type: Boolean,
    default: false
  }
});

// 定义事件
const emit = defineEmits(['edit-profile', 'toggle-follow', 'send-message']);

// 判断是否为当前登录用户
const isCurrentUser = computed(() => {
  return userStore.profile?.userId === props.userInfo.userId;
});

/**
 * 格式化数字
 * @param count 数量
 * @returns 格式化后的数字
 */
function formatCount(count: number): string {
  if (count >= 100000000) {
    return (count / 100000000).toFixed(1) + '亿';
  } else if (count >= 10000) {
    return (count / 10000).toFixed(1) + '万';
  } else {
    return count.toString();
  }
}

/**
 * 处理编辑个人资料
 */
function handleEditProfile(): void {
  emit('edit-profile');
}

/**
 * 处理关注/取消关注
 */
function handleToggleFollow(): void {
  emit('toggle-follow', !props.isFollowing);
}

/**
 * 处理发送私信
 */
function handleSendMessage(): void {
  emit('send-message');
}
</script>

<style scoped>
.user-info-card {
  transition: all 0.3s ease;
}
</style> 