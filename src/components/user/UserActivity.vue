<template>
  <div class="user-activity">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-lg font-bold flex items-center">
        <div class="i-carbon-activity mr-2 text-primary"></div>
        最近动态
      </h3>
      <button v-if="activities.length > 0" class="text-sm text-primary" @click="handleShowMore">
        查看更多
        <div class="i-carbon-arrow-right inline-block align-text-bottom"></div>
      </button>
    </div>

    <div v-if="loading" class="py-8 flex justify-center">
      <n-spin size="medium" />
    </div>

    <div v-else-if="activities.length > 0" class="space-y-6">
      <!-- 动态项目 -->
      <div 
        v-for="(activity, index) in activities" 
        :key="index"
        class="activity-item"
      >
        <!-- 动态头部：用户信息和时间 -->
        <div class="flex items-center mb-2">
          <img 
            :src="activity.user.avatarUrl + '?param=30y30'" 
            class="w-6 h-6 rounded-full mr-2"
            :alt="activity.user.nickname"
          />
          <span class="text-sm font-medium mr-2">{{ activity.user.nickname }}</span>
          <span class="text-xs text-gray-500">{{ formatTimeAgo(activity.time) }}</span>
        </div>

        <!-- 动态内容 -->
        <div class="pl-8">
          <!-- 动态类型 -->
          <div class="text-sm mb-2">
            {{ getActivityTypeText(activity.type) }}
          </div>

          <!-- 动态内容卡片 -->
          <div 
            v-if="activity.resource" 
            class="bg-gray-50 dark:bg-dark-800 rounded-lg p-3 mb-2 cursor-pointer"
            @click="handleActivityClick(activity)"
          >
            <div class="flex items-center">
              <!-- 资源图片 -->
              <div class="w-12 h-12 rounded overflow-hidden flex-shrink-0 mr-3">
                <img 
                  :src="getResourceImage(activity) + '?param=50y50'" 
                  class="w-full h-full object-cover"
                  :alt="getResourceTitle(activity)"
                />
              </div>
              <!-- 资源信息 -->
              <div class="flex-1 min-w-0">
                <div class="text-sm font-medium truncate">{{ getResourceTitle(activity) }}</div>
                <div class="text-xs text-gray-500 truncate">{{ getResourceDesc(activity) }}</div>
              </div>
            </div>
          </div>

          <!-- 评论内容 -->
          <div v-if="activity.msg" class="text-sm mb-2">
            {{ activity.msg }}
          </div>

          <!-- 互动按钮 -->
          <div class="flex items-center text-xs text-gray-500">
            <button class="mr-4 hover:text-primary">
              <div class="i-carbon-thumbs-up inline-block mr-1"></div>
              赞 ({{ activity.info?.likedCount || 0 }})
            </button>
            <button class="mr-4 hover:text-primary">
              <div class="i-carbon-chat inline-block mr-1"></div>
              评论 ({{ activity.info?.commentCount || 0 }})
            </button>
            <button class="hover:text-primary">
              <div class="i-carbon-share inline-block mr-1"></div>
              分享
            </button>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="py-8 text-center text-gray-500">
      <div class="i-carbon-unknown-filled text-5xl mx-auto mb-3"></div>
      <p>暂无动态</p>
      <p class="mt-2 text-sm">关注一些好友，了解他们的音乐动态吧~</p>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * 用户动态组件
 * @description 显示用户的最近动态，包括听歌、收藏、评论等活动
 */
import { ref, onMounted } from 'vue';
import { NSpin } from 'naive-ui';
import { getUserEvents } from '@/api/modules/user';

// 定义属性
const props = defineProps({
  /** 用户ID */
  userId: {
    type: Number,
    required: true
  },
  /** 显示数量 */
  limit: {
    type: Number,
    default: 5
  }
});

// 定义事件
const emit = defineEmits(['showMore', 'activityClick']);

// 加载状态
const loading = ref(false);
// 动态列表
const activities = ref<any[]>([]);

/**
 * 格式化相对时间
 * @param timestamp 时间戳
 * @returns 相对时间（如：3天前）
 */
function formatTimeAgo(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;
  
  // 小于1分钟
  if (diff < 60 * 1000) {
    return '刚刚';
  }
  
  // 小于1小时
  if (diff < 60 * 60 * 1000) {
    return `${Math.floor(diff / (60 * 1000))}分钟前`;
  }
  
  // 小于24小时
  if (diff < 24 * 60 * 60 * 1000) {
    return `${Math.floor(diff / (60 * 60 * 1000))}小时前`;
  }
  
  // 小于30天
  if (diff < 30 * 24 * 60 * 60 * 1000) {
    return `${Math.floor(diff / (24 * 60 * 60 * 1000))}天前`;
  }
  
  // 具体日期
  const date = new Date(timestamp);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

/**
 * 获取动态类型文本
 * @param type 动态类型
 * @returns 对应的文本描述
 */
function getActivityTypeText(type: number): string {
  const typeMap: Record<number, string> = {
    18: '分享单曲',
    19: '分享专辑',
    17: '分享电台节目',
    28: '分享电台节目',
    22: '转发',
    39: '发布视频',
    35: '分享歌单',
    13: '分享歌单',
    24: '分享专栏文章',
    41: '分享视频',
    21: '分享视频'
  };
  
  return typeMap[type] || '分享了内容';
}

/**
 * 获取资源图片
 * @param activity 动态对象
 * @returns 资源图片URL
 */
function getResourceImage(activity: any): string {
  if (!activity.resource) return '';
  
  // 根据不同动态类型，获取对应的图片
  switch (activity.type) {
    case 18: // 分享单曲
      return activity.resource.album?.picUrl || '';
    case 19: // 分享专辑
      return activity.resource.album?.picUrl || activity.resource.picUrl || '';
    case 17: // 分享电台
    case 28:
      return activity.resource.coverUrl || '';
    case 22: // 转发
      return activity.resource.coverImgUrl || activity.resource.picUrl || '';
    case 39: // 视频
    case 41:
    case 21:
      return activity.resource.coverUrl || '';
    case 35: // 歌单
    case 13:
      return activity.resource.coverImgUrl || '';
    default:
      return '';
  }
}

/**
 * 获取资源标题
 * @param activity 动态对象
 * @returns 资源标题
 */
function getResourceTitle(activity: any): string {
  if (!activity.resource) return '';
  return activity.resource.name || activity.resource.title || '';
}

/**
 * 获取资源描述
 * @param activity 动态对象
 * @returns 资源描述
 */
function getResourceDesc(activity: any): string {
  if (!activity.resource) return '';
  
  // 根据不同动态类型，获取对应的描述
  switch (activity.type) {
    case 18: // 分享单曲
      return activity.resource.artists?.map((a: any) => a.name).join('/') || '';
    case 19: // 分享专辑
      return activity.resource.artist?.name || '';
    case 17: // 分享电台
    case 28:
      return activity.resource.dj?.nickname || '';
    case 35: // 歌单
    case 13:
      return `by ${activity.resource.creator?.nickname || ''}`;
    default:
      return '';
  }
}

/**
 * 加载用户动态
 */
async function loadUserEvents() {
  if (!props.userId) return;
  
  try {
    loading.value = true;
    // 注意：此处假设API已经实现，如果没有实现则需要在API模块中添加
    const result = await getUserEvents(props.userId, props.limit);
    
    if (result && result.code === 200) {
      activities.value = result.events || [];
    }
  } catch (error) {
    console.error('加载用户动态失败:', error);
  } finally {
    loading.value = false;
  }
}

/**
 * 处理查看更多
 */
function handleShowMore() {
  emit('showMore');
}

/**
 * 处理点击动态
 * @param activity 动态对象
 */
function handleActivityClick(activity: any) {
  emit('activityClick', activity);
}

onMounted(() => {
  loadUserEvents();
});
</script>

<style scoped>
.activity-item {
  position: relative;
}

.activity-item:not(:last-child)::after {
  content: '';
  position: absolute;
  top: 30px;
  left: 12px;
  bottom: -18px;
  width: 1px;
  background-color: #e5e7eb;
}

.dark .activity-item:not(:last-child)::after {
  background-color: #374151;
}
</style> 