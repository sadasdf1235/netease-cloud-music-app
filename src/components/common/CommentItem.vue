<template>
  <div class="comment-item">
    <div class="flex">
      <!-- 用户头像 -->
      <router-link
        :to="'/user/' + comment.user.userId"
        class="flex-shrink-0 mr-3"
      >
        <n-avatar
          :src="comment.user.avatarUrl"
          :size="40"
          round
        />
      </router-link>

      <div class="flex-1 min-w-0">
        <div class="flex items-start justify-between">
          <div class="min-w-0">
            <!-- 用户名和评论内容 -->
            <div class="flex items-center mb-1">
              <router-link
                :to="'/user/' + comment.user.userId"
                class="text-primary hover:text-primary-deep font-medium truncate mr-2"
              >
                {{ comment.user.nickname }}
              </router-link>
              <span class="text-xs text-gray-500">
                {{ formatDate(comment.time) }}
              </span>
            </div>
            <div class="text-sm text-gray-800 dark:text-gray-200 break-words">
              {{ comment.content }}
            </div>
          </div>

          <!-- 操作按钮 -->
          <div class="flex items-center gap-2 ml-4">
            <n-button
              quaternary
              circle
              size="small"
              :class="{'text-primary': comment.liked}"
              @click="$emit('like', comment)"
            >
              <template #icon>
                <div :class="comment.liked ? 'i-carbon-favorite-filled' : 'i-carbon-favorite'"></div>
              </template>
            </n-button>
            <n-button
              quaternary
              circle
              size="small"
              @click="$emit('reply', comment)"
            >
              <template #icon>
                <div class="i-carbon-reply"></div>
              </template>
            </n-button>
            <n-popconfirm
              v-if="isCurrentUser(comment.user.userId)"
              @positive-click="$emit('delete', comment)"
            >
              <template #trigger>
                <n-button
                  quaternary
                  circle
                  size="small"
                >
                  <template #icon>
                    <div class="i-carbon-trash-can"></div>
                  </template>
                </n-button>
              </template>
              确定要删除这条评论吗？
            </n-popconfirm>
          </div>
        </div>

        <!-- 点赞数 -->
        <div class="mt-1 text-xs text-gray-500">
          {{ comment.likedCount > 0 ? comment.likedCount + ' 赞' : '' }}
        </div>

        <!-- 回复列表 -->
        <div v-if="comment.replies && comment.replies.length > 0" class="mt-2">
          <div
            v-for="reply in comment.replies"
            :key="reply.commentId"
            class="reply-item pl-4 py-2 border-l-2 border-gray-100 dark:border-gray-800"
          >
            <div class="flex items-start">
              <router-link
                :to="'/user/' + reply.user.userId"
                class="flex-shrink-0 mr-2"
              >
                <n-avatar
                  :src="reply.user.avatarUrl"
                  :size="24"
                  round
                />
              </router-link>
              <div class="flex-1 min-w-0">
                <div class="flex items-center mb-1">
                  <router-link
                    :to="'/user/' + reply.user.userId"
                    class="text-primary hover:text-primary-deep text-sm font-medium truncate mr-2"
                  >
                    {{ reply.user.nickname }}
                  </router-link>
                  <span class="text-xs text-gray-500">
                    {{ formatDate(reply.time) }}
                  </span>
                </div>
                <div class="text-sm text-gray-800 dark:text-gray-200 break-words">
                  {{ reply.content }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from '@/stores/user';
import type { Comment } from '@/types/comment';

const props = defineProps<{
  comment: Comment;
}>();

const userStore = useUserStore();

defineEmits<{
  (e: 'like', comment: Comment): void;
  (e: 'reply', comment: Comment): void;
  (e: 'delete', comment: Comment): void;
}>();

// 检查是否是当前用户的评论
function isCurrentUser(userId: number) {
  return userStore.profile?.userId === userId;
}

// 格式化日期
function formatDate(timestamp: number) {
  const now = new Date().getTime();
  const diff = now - timestamp;

  // 小于1分钟
  if (diff < 60 * 1000) {
    return '刚刚';
  }
  // 小于1小时
  if (diff < 60 * 60 * 1000) {
    return Math.floor(diff / (60 * 1000)) + '分钟前';
  }
  // 小于24小时
  if (diff < 24 * 60 * 60 * 1000) {
    return Math.floor(diff / (60 * 60 * 1000)) + '小时前';
  }
  // 小于30天
  if (diff < 30 * 24 * 60 * 60 * 1000) {
    return Math.floor(diff / (24 * 60 * 60 * 1000)) + '天前';
  }

  // 超过30天显示具体日期
  const date = new Date(timestamp);
  return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
}
</script>

<style scoped>
.comment-item {
  transition: background-color 0.2s;
  border-radius: 8px;
  padding: 12px;
}

.comment-item:hover {
  background-color: rgba(0, 0, 0, 0.02);
}

.dark .comment-item:hover {
  background-color: rgba(255, 255, 255, 0.02);
}

.reply-item {
  transition: background-color 0.2s;
}

.reply-item:hover {
  background-color: rgba(0, 0, 0, 0.01);
}

.dark .reply-item:hover {
  background-color: rgba(255, 255, 255, 0.01);
}
</style>