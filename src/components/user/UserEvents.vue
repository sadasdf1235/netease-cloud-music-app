<template>
  <div class="user-events">
    <div class="section-header flex items-center justify-between mb-4">
      <h3 class="text-lg font-bold">动态</h3>
      <div v-if="events.length > 0" class="text-sm text-primary cursor-pointer" @click="handleViewAll">
        查看全部
        <div class="i-carbon-arrow-right inline-block align-middle"></div>
      </div>
    </div>
    
    <!-- 加载状态 -->
    <div v-if="loading" class="flex justify-center py-12">
      <n-spin size="medium" />
    </div>
    
    <!-- 空状态 -->
    <div v-else-if="events.length === 0" class="py-12 text-center text-gray-500">
      <div class="i-carbon-events text-6xl mx-auto mb-4"></div>
      <p>暂无动态</p>
    </div>
    
    <!-- 动态列表 -->
    <div v-else class="space-y-4">
      <div 
        v-for="event in events" 
        :key="event.id" 
        class="event-item bg-white dark:bg-dark-900 rounded-lg p-4 shadow-sm"
      >
        <!-- 用户信息 -->
        <div class="flex items-center mb-3">
          <img 
            :src="event.user.avatarUrl + '?param=40y40'" 
            class="w-10 h-10 rounded-full object-cover" 
            :alt="event.user.nickname" 
          />
          <div class="ml-3">
            <div class="text-sm font-medium">{{ event.user.nickname }}</div>
            <div class="text-xs text-gray-500">{{ formatTimeAgo(event.eventTime) }}</div>
          </div>
        </div>
        
        <!-- 动态内容 -->
        <div class="mb-3">
          <!-- 文字内容 -->
          <p class="text-sm mb-2">{{ event.content }}</p>
          
          <!-- 分享内容 -->
          <div 
            v-if="event.resource" 
            class="p-3 bg-gray-50 dark:bg-dark-800 rounded-lg"
            @click="handleResourceClick(event.resource)"
          >
            <!-- 资源信息 -->
            <div class="flex">
              <div class="w-16 h-16 rounded overflow-hidden flex-shrink-0">
                <img 
                  :src="event.resource.coverUrl + '?param=64y64'" 
                  class="w-full h-full object-cover" 
                  :alt="event.resource.title" 
                />
              </div>
              <div class="ml-3 flex-1 overflow-hidden">
                <div class="text-sm font-medium line-clamp-1">{{ event.resource.title }}</div>
                <div class="text-xs text-gray-500 mt-1">
                  <template v-if="event.resource.type === 'song'">
                    歌曲 - {{ event.resource.artist }}
                  </template>
                  <template v-else-if="event.resource.type === 'playlist'">
                    歌单 - {{ event.resource.trackCount }}首歌曲
                  </template>
                  <template v-else-if="event.resource.type === 'album'">
                    专辑 - {{ event.resource.artist }}
                  </template>
                  <template v-else>
                    {{ event.resource.type }}
                  </template>
                </div>
              </div>
            </div>
          </div>
          
          <!-- 图片内容 -->
          <div v-if="event.images && event.images.length > 0" class="mt-2 grid grid-cols-3 gap-1">
            <div 
              v-for="(img, index) in event.images" 
              :key="index" 
              class="event-image rounded overflow-hidden aspect-square"
              @click="handlePreviewImage(event.images, index)"
            >
              <img :src="img + '?param=200y200'" class="w-full h-full object-cover" alt="动态图片" loading="lazy" />
            </div>
          </div>
        </div>
        
        <!-- 互动区域 -->
        <div class="flex items-center justify-between text-sm">
          <div class="flex items-center space-x-4">
            <button 
              class="flex items-center opacity-80 hover:opacity-100" 
              :class="event.liked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'"
              @click="handleLike(event)"
            >
              <div :class="event.liked ? 'i-carbon-favorite-filled' : 'i-carbon-favorite'" class="mr-1"></div>
              <span>{{ event.likedCount || '点赞' }}</span>
            </button>
            <button class="flex items-center text-gray-500 opacity-80 hover:opacity-100" @click="handleComment(event)">
              <div class="i-carbon-chat mr-1"></div>
              <span>{{ event.commentCount || '评论' }}</span>
            </button>
            <button class="flex items-center text-gray-500 opacity-80 hover:opacity-100" @click="handleShare(event)">
              <div class="i-carbon-share mr-1"></div>
              <span>分享</span>
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 加载更多 -->
    <div v-if="hasMore && !loading" class="text-center mt-4">
      <n-button 
        size="small" 
        @click="loadMore" 
        :loading="loadingMore"
      >
        加载更多
      </n-button>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * 用户动态展示组件
 * @description 展示用户的音乐动态，如分享的歌曲、歌单等
 */
import { ref, defineProps, defineEmits } from 'vue';
import { useRouter } from 'vue-router';
import { useMessage } from 'naive-ui';

// 消息组件
const message = useMessage();
// 路由实例
const router = useRouter();

// 定义组件属性
const props = defineProps({
  /** 动态列表 */
  events: {
    type: Array,
    required: true,
    default: () => []
  },
  /** 是否有更多动态 */
  hasMore: {
    type: Boolean,
    default: false
  },
  /** 是否正在加载 */
  loading: {
    type: Boolean,
    default: false
  },
  /** 是否正在加载更多 */
  loadingMore: {
    type: Boolean,
    default: false
  }
});

// 定义事件
const emit = defineEmits([
  'view-all',
  'load-more',
  'like',
  'comment',
  'share',
  'resource-click',
  'preview-image'
]);

/**
 * 格式化相对时间
 * @param timestamp 时间戳
 * @returns 相对时间（例如：3天前、刚刚）
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
  
  // 格式化日期
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  
  return `${year}-${month}-${day}`;
}

/**
 * 处理查看全部
 */
function handleViewAll(): void {
  emit('view-all');
}

/**
 * 加载更多动态
 */
function loadMore(): void {
  emit('load-more');
}

/**
 * 处理点赞
 * @param event 动态对象
 */
function handleLike(event: any): void {
  emit('like', event);
}

/**
 * 处理评论
 * @param event 动态对象
 */
function handleComment(event: any): void {
  emit('comment', event);
}

/**
 * 处理分享
 * @param event 动态对象
 */
function handleShare(event: any): void {
  emit('share', event);
}

/**
 * 处理资源点击
 * @param resource 资源对象
 */
function handleResourceClick(resource: any): void {
  emit('resource-click', resource);
}

/**
 * 处理预览图片
 * @param images 图片列表
 * @param index 当前图片索引
 */
function handlePreviewImage(images: string[], index: number): void {
  emit('preview-image', images, index);
}
</script>

<style scoped>
.event-item {
  transition: all 0.3s ease;
}

.event-item:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.event-image {
  cursor: pointer;
  transition: all 0.2s ease-in-out;
}

.event-image:hover {
  opacity: 0.9;
}
</style> 