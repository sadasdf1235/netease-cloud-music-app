<template>
  <div class="user-follows">
    <!-- 标签切换 -->
    <div class="mb-4 border-b border-gray-200 dark:border-gray-700">
      <div class="flex">
        <button 
          v-for="(tab, index) in tabs" 
          :key="index"
          class="py-2 px-4 text-sm font-medium border-b-2 -mb-px"
          :class="activeTab === index 
            ? 'border-primary text-primary' 
            : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'"
          @click="activeTab = index"
        >
          {{ tab.name }}
          <span class="ml-1 text-xs text-gray-400">({{ tab.count }})</span>
        </button>
      </div>
    </div>
    
    <!-- 加载状态 -->
    <div v-if="loading" class="flex justify-center py-12">
      <n-spin size="medium" />
    </div>
    
    <!-- 空状态 -->
    <div v-else-if="displayUsers.length === 0" class="py-12 text-center text-gray-500">
      <div class="i-carbon-user-multiple text-6xl mx-auto mb-4"></div>
      <p>{{ activeTab === 0 ? '暂无关注' : '暂无粉丝' }}</p>
    </div>
    
    <!-- 用户列表 -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div 
        v-for="user in displayUsers" 
        :key="user.userId" 
        class="user-item bg-white dark:bg-dark-900 rounded-lg p-4 shadow-sm flex items-center"
      >
        <!-- 用户头像 -->
        <div 
          class="w-12 h-12 rounded-full overflow-hidden cursor-pointer"
          @click="goToUserPage(user.userId)"
        >
          <img 
            :src="user.avatarUrl + '?param=48y48'" 
            class="w-full h-full object-cover" 
            :alt="user.nickname" 
            loading="lazy"
          />
        </div>
        
        <!-- 用户信息 -->
        <div class="ml-3 flex-1 overflow-hidden">
          <div 
            class="flex items-center cursor-pointer"
            @click="goToUserPage(user.userId)"
          >
            <span class="text-sm font-medium truncate hover:text-primary">{{ user.nickname }}</span>
            <!-- 性别图标 -->
            <div v-if="user.gender === 1" class="i-carbon-male ml-1 text-blue-500"></div>
            <div v-else-if="user.gender === 2" class="i-carbon-female ml-1 text-pink-500"></div>
            <!-- VIP标识 -->
            <div v-if="user.vipType > 0" class="ml-1 text-xs px-1 py-0.5 rounded-sm bg-red-500 text-white">VIP</div>
          </div>
          
          <!-- 用户签名 -->
          <div class="text-xs text-gray-500 mt-1 line-clamp-1">
            {{ user.signature || '这个人很懒，什么都没有留下' }}
          </div>
        </div>
        
        <!-- 操作按钮 -->
        <div class="ml-2">
          <n-button 
            size="tiny" 
            :type="user.followed ? 'default' : 'primary'" 
            @click="handleToggleFollow(user)"
          >
            <div v-if="user.followed" class="i-carbon-checkmark mr-1"></div>
            <div v-else class="i-carbon-add mr-1"></div>
            {{ user.followed ? '已关注' : '关注' }}
          </n-button>
        </div>
      </div>
    </div>
    
    <!-- 分页 -->
    <div v-if="showPagination && Math.ceil(totalCount / pageSize) > 1" class="flex justify-center mt-6">
      <n-pagination
        v-model:page="currentPage"
        :page-count="Math.ceil(totalCount / pageSize)"
        :page-size="pageSize"
        :page-slot="5"
        @update:page="handlePageChange"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * 用户关注和粉丝列表组件
 * @description 展示用户的关注和粉丝，支持关注/取消关注操作
 */
import { ref, computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/user';
import { useMessage } from 'naive-ui';

// 路由实例
const router = useRouter();
// 用户状态
const userStore = useUserStore();
// 消息组件
const message = useMessage();

// 定义组件属性
const props = defineProps({
  /** 关注列表 */
  follows: {
    type: Array,
    default: () => []
  },
  /** 粉丝列表 */
  followers: {
    type: Array,
    default: () => []
  },
  /** 是否正在加载 */
  loading: {
    type: Boolean,
    default: false
  },
  /** 是否显示分页 */
  showPagination: {
    type: Boolean,
    default: true
  },
  /** 当前页码 */
  page: {
    type: Number,
    default: 1
  },
  /** 每页条数 */
  pageSize: {
    type: Number,
    default: 30
  },
  /** 总数 */
  followsCount: {
    type: Number,
    default: 0
  },
  /** 粉丝总数 */
  followersCount: {
    type: Number,
    default: 0
  }
});

// 定义事件
const emit = defineEmits(['page-change', 'toggle-follow']);

// 当前活动标签索引：0-关注, 1-粉丝
const activeTab = ref(0);
// 当前页码
const currentPage = ref(props.page);

/**
 * 标签列表
 */
const tabs = computed(() => [
  { name: '关注', count: props.followsCount },
  { name: '粉丝', count: props.followersCount }
]);

/**
 * 当前展示的用户列表
 */
const displayUsers = computed(() => {
  return activeTab.value === 0 ? props.follows : props.followers;
});

/**
 * 总数
 */
const totalCount = computed(() => {
  return activeTab.value === 0 ? props.followsCount : props.followersCount;
});

/**
 * 跳转到用户页面
 * @param userId 用户ID
 */
function goToUserPage(userId: number): void {
  router.push({
    name: 'user-detail',
    params: { id: userId }
  });
}

/**
 * 处理关注/取消关注
 * @param user 用户对象
 */
function handleToggleFollow(user: any): void {
  // 检查是否已登录
  if (!userStore.isLoggedIn) {
    message.warning('请先登录');
    return;
  }
  
  emit('toggle-follow', user, !user.followed);
}

/**
 * 处理页码变化
 * @param page 新的页码
 */
function handlePageChange(page: number): void {
  currentPage.value = page;
  emit('page-change', activeTab.value, page);
}

// 监听标签变化，重置页码
watch(activeTab, () => {
  currentPage.value = 1;
  emit('page-change', activeTab.value, 1);
});

// 监听属性page变化
watch(() => props.page, (newPage) => {
  if (newPage !== currentPage.value) {
    currentPage.value = newPage;
  }
});
</script>

<style scoped>
.user-item {
  transition: all 0.3s ease;
}

.user-item:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}
</style> 