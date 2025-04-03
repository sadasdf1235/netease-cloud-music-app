<template>
  <div class="comment-section">
    <!-- 评论输入框 -->
    <div class="comment-input-container bg-white dark:bg-dark-900 p-4 mb-6 rounded-lg shadow-sm">
      <div class="flex gap-3">
        <div class="flex-shrink-0">
          <img :src="avatarUrl || 'https://p3.music.126.net/VnZiScyynmG-pWHGQJKC-g==/109951166361218466.jpg'" class="w-10 h-10 rounded-full object-cover" alt="用户头像" />
        </div>
        <div class="flex-1">
          <textarea
            v-model="commentContent"
            class="w-full px-4 py-2 border border-gray-200 dark:border-dark-700 rounded-lg bg-gray-50 dark:bg-dark-800 focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="添加评论..."
            rows="3"
          ></textarea>
          <div class="flex justify-between mt-2">
            <div class="flex items-center">
              <button class="icon-btn text-gray-500 hover:text-primary">
                <div class="i-carbon-face-add"></div>
              </button>
              <button class="icon-btn ml-2 text-gray-500 hover:text-primary">
                <div class="i-carbon-link"></div>
              </button>
            </div>
            <div>
              <n-button 
                type="primary" 
                size="small" 
                :loading="submitting"
                :disabled="!commentContent.trim()"
                @click="handleSubmitComment"
              >
                发表评论
              </n-button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 评论数量统计 -->
    <div class="flex items-center mb-4">
      <h3 class="text-lg font-bold">评论</h3>
      <span class="ml-2 text-sm text-gray-500">({{ totalCount }})</span>
    </div>

    <!-- 热门评论 -->
    <div v-if="hotComments.length > 0" class="mb-8">
      <div class="flex items-center mb-4">
        <div class="i-carbon-fire-alt text-red-500 mr-1"></div>
        <h4 class="text-base font-medium">热门评论</h4>
      </div>
      <div class="space-y-4">
        <div
          v-for="comment in hotComments"
          :key="comment.commentId"
          class="comment-item bg-white dark:bg-dark-900 p-4 rounded-lg shadow-sm"
        >
          <div class="flex gap-3">
            <div class="flex-shrink-0">
              <img :src="comment.user.avatarUrl + '?param=40y40'" class="w-10 h-10 rounded-full object-cover" :alt="comment.user.nickname" />
            </div>
            <div class="flex-1">
              <div class="flex justify-between items-start">
                <div>
                  <span class="text-sm font-medium text-primary">{{ comment.user.nickname }}</span>
                  <span v-if="comment.user.vipRights" class="ml-1 text-xs px-1 py-0.5 rounded bg-red-500 text-white">VIP</span>
                </div>
                <span class="text-xs text-gray-500">{{ formatDate(comment.time) }}</span>
              </div>
              
              <div class="mt-2 text-sm break-words">{{ comment.content }}</div>
              
              <!-- 回复内容 -->
              <div 
                v-if="comment.beReplied && comment.beReplied.length > 0" 
                class="mt-2 p-2 bg-gray-50 dark:bg-dark-800 rounded text-sm"
              >
                <span class="text-primary">@{{ comment.beReplied[0].user.nickname }}: </span>
                <span>{{ comment.beReplied[0].content }}</span>
              </div>
              
              <div class="mt-2 flex items-center justify-between">
                <span class="text-xs text-gray-500">{{ formatTimeAgo(comment.time) }}</span>
                <div class="flex items-center">
                  <button 
                    class="flex items-center text-xs text-gray-500 hover:text-primary" 
                    @click="handleReply(comment)"
                  >
                    <div class="i-carbon-reply mr-1"></div>
                    回复
                  </button>
                  <button 
                    class="flex items-center text-xs ml-4" 
                    :class="comment.liked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'" 
                    @click="handleLike(comment)"
                  >
                    <div :class="comment.liked ? 'i-carbon-favorite-filled' : 'i-carbon-favorite'" class="mr-1"></div>
                    {{ comment.likedCount > 0 ? comment.likedCount : '点赞' }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 最新评论 -->
    <div v-if="comments.length > 0">
      <div class="flex items-center mb-4">
        <div class="i-carbon-chat text-primary mr-1"></div>
        <h4 class="text-base font-medium">最新评论</h4>
      </div>
      <div class="space-y-4">
        <div
          v-for="comment in comments"
          :key="comment.commentId"
          class="comment-item bg-white dark:bg-dark-900 p-4 rounded-lg shadow-sm"
        >
          <div class="flex gap-3">
            <div class="flex-shrink-0">
              <img :src="comment.user.avatarUrl + '?param=40y40'" class="w-10 h-10 rounded-full object-cover" :alt="comment.user.nickname" />
            </div>
            <div class="flex-1">
              <div class="flex justify-between items-start">
                <div>
                  <span class="text-sm font-medium text-primary">{{ comment.user.nickname }}</span>
                  <span v-if="comment.user.vipRights" class="ml-1 text-xs px-1 py-0.5 rounded bg-red-500 text-white">VIP</span>
                </div>
                <span class="text-xs text-gray-500">{{ formatDate(comment.time) }}</span>
              </div>
              
              <div class="mt-2 text-sm break-words">{{ comment.content }}</div>
              
              <!-- 回复内容 -->
              <div 
                v-if="comment.beReplied && comment.beReplied.length > 0" 
                class="mt-2 p-2 bg-gray-50 dark:bg-dark-800 rounded text-sm"
              >
                <span class="text-primary">@{{ comment.beReplied[0].user.nickname }}: </span>
                <span>{{ comment.beReplied[0].content }}</span>
              </div>
              
              <div class="mt-2 flex items-center justify-between">
                <span class="text-xs text-gray-500">{{ formatTimeAgo(comment.time) }}</span>
                <div class="flex items-center">
                  <button 
                    class="flex items-center text-xs text-gray-500 hover:text-primary" 
                    @click="handleReply(comment)"
                  >
                    <div class="i-carbon-reply mr-1"></div>
                    回复
                  </button>
                  <button 
                    class="flex items-center text-xs ml-4" 
                    :class="comment.liked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'" 
                    @click="handleLike(comment)"
                  >
                    <div :class="comment.liked ? 'i-carbon-favorite-filled' : 'i-carbon-favorite'" class="mr-1"></div>
                    {{ comment.likedCount > 0 ? comment.likedCount : '点赞' }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 分页 -->
      <div v-if="totalCount > pageSize" class="flex justify-center mt-6">
        <n-pagination
          v-model:page="currentPage"
          :page-count="Math.ceil(totalCount / pageSize)"
          :page-size="pageSize"
          :page-slot="5"
          @update:page="handlePageChange"
        />
      </div>
    </div>

    <!-- 无评论提示 -->
    <div v-if="comments.length === 0 && hotComments.length === 0" class="py-12 text-center text-gray-500">
      <div class="i-carbon-chat-off text-6xl mx-auto mb-4"></div>
      <p>暂无评论</p>
      <p class="mt-2 text-sm">快来发表第一条评论吧~</p>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * 评论列表组件
 * @description 显示评论列表，包括热门评论和最新评论，支持分页、发表评论和回复功能
 */
import { ref } from 'vue';
import type { Comment } from '@/types/comment';
import { useMessage } from 'naive-ui';

// 定义组件属性
const props = defineProps({
  /** 评论列表 */
  comments: {
    type: Array as () => Comment[],
    default: () => []
  },
  /** 热门评论列表 */
  hotComments: {
    type: Array as () => Comment[],
    default: () => []
  },
  /** 评论总数 */
  totalCount: {
    type: Number,
    default: 0
  },
  /** 每页显示数量 */
  pageSize: {
    type: Number,
    default: 20
  },
  /** 当前页码 */
  currentPage: {
    type: Number,
    default: 1
  },
  /** 用户头像URL */
  avatarUrl: {
    type: String,
    default: ''
  },
  /** 是否正在提交评论 */
  submitting: {
    type: Boolean,
    default: false
  }
});

// 定义事件
const emit = defineEmits([
  'submit-comment',
  'like-comment',
  'reply-comment',
  'page-change'
]);

// 消息提示
const message = useMessage();

// 评论内容
const commentContent = ref('');
// 正在回复的评论
const replyingComment = ref<Comment | null>(null);

/**
 * 格式化日期
 * @param timestamp 时间戳
 * @returns 格式化后的日期 (YYYY-MM-DD HH:mm)
 */
function formatDate(timestamp: number): string {
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  
  return `${year}-${month}-${day} ${hours}:${minutes}`;
}

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
  
  // 大于30天则显示具体日期
  return formatDate(timestamp);
}

/**
 * 处理提交评论
 */
function handleSubmitComment(): void {
  if (!commentContent.value.trim()) {
    message.warning('评论内容不能为空');
    return;
  }
  
  emit('submit-comment', {
    content: commentContent.value,
    replyTo: replyingComment.value
  });
  
  // 清空评论内容和回复状态
  commentContent.value = '';
  replyingComment.value = null;
}

/**
 * 处理点赞评论
 * @param comment 评论对象
 */
function handleLike(comment: Comment): void {
  emit('like-comment', comment);
}

/**
 * 处理回复评论
 * @param comment 评论对象
 */
function handleReply(comment: Comment): void {
  replyingComment.value = comment;
  commentContent.value = `@${comment.user.nickname}: `;
  
  // 聚焦评论输入框
  const textarea = document.querySelector('.comment-input-container textarea');
  if (textarea) {
    textarea.scrollIntoView({ behavior: 'smooth' });
    (textarea as HTMLTextAreaElement).focus();
  }
}

/**
 * 处理页面变化
 * @param page 新的页码
 */
function handlePageChange(page: number): void {
  emit('page-change', page);
}
</script>

<style scoped>
.comment-item:hover {
  background-color: #f9f9f9;
}

.dark .comment-item:hover {
  background-color: #1f2937;
}
</style> 