<template>
  <div class="comment-item">
    <!-- 评论主体 -->
    <div class="flex gap-4">
      <!-- 用户头像 -->
      <router-link :to="`/user/${comment.user.userId}`" class="flex-shrink-0">
        <n-avatar
          :src="comment.user.avatarUrl"
          :size="40"
          round
        />
      </router-link>

      <!-- 评论内容 -->
      <div class="flex-1">
        <!-- 用户信息和时间 -->
        <div class="flex items-center gap-2 mb-1">
          <router-link :to="`/user/${comment.user.userId}`" class="text-sm font-medium hover:text-primary">
            {{ comment.user.nickname }}
          </router-link>
          <span v-if="comment.user.vipRights" class="text-xs text-red-500">
            {{ comment.user.vipRights.redVipLevel > 0 ? 'VIP' + comment.user.vipRights.redVipLevel : 'VIP' }}
          </span>
          <span class="text-xs text-gray-500">{{ formatTime(comment.time) }}</span>
        </div>

        <!-- 评论内容 -->
        <div class="text-sm mb-2">
          <!-- 回复对象 -->
          <template v-if="comment.beReplied && comment.beReplied.length > 0">
            <span class="text-gray-500">回复 </span>
            <router-link
              :to="`/user/${comment.beReplied[0].user.userId}`"
              class="text-primary hover:underline"
            >@{{ comment.beReplied[0].user.nickname }}：</router-link>
            <span class="text-gray-500">{{ comment.beReplied[0].content }}</span>
            <n-divider vertical />
          </template>
          {{ comment.content }}
        </div>

        <!-- 操作按钮 -->
        <div class="flex items-center gap-4 text-xs text-gray-500">
          <!-- 点赞 -->
          <button
            class="flex items-center hover:text-primary"
            :class="{ 'text-primary': comment.liked }"
            @click="$emit('like', comment)"
          >
            <div :class="comment.liked ? 'i-carbon-thumbs-up-filled' : 'i-carbon-thumbs-up'" class="mr-1" />
            <span>{{ comment.likedCount > 0 ? comment.likedCount : '点赞' }}</span>
          </button>

          <!-- 回复 -->
          <button
            class="flex items-center hover:text-primary"
            @click="$emit('reply', comment)"
          >
            <div class="i-carbon-reply mr-1" />
            <span>回复</span>
          </button>

          <!-- 分享 -->
          <button class="flex items-center hover:text-primary">
            <div class="i-carbon-share mr-1" />
            <span>分享</span>
          </button>

          <!-- 举报 -->
          <button class="flex items-center hover:text-primary">
            <div class="i-carbon-warning mr-1" />
            <span>举报</span>
          </button>

          <!-- 删除（仅自己的评论可见） -->
          <button
            v-if="comment.user.userId === currentUser?.userId"
            class="flex items-center hover:text-red-500"
            @click="handleDelete"
          >
            <div class="i-carbon-trash-can mr-1" />
            <span>删除</span>
          </button>
        </div>
      </div>
    </div>

    <!-- 回复列表 -->
    <div v-if="comment.showReplyList && comment.replyCount > 0" class="ml-14 mt-4">
      <div v-if="loadingReplies" class="space-y-4">
        <n-skeleton v-for="i in 3" :key="i" text :repeat="2" />
      </div>
      <template v-else>
        <CommentItem
          v-for="reply in comment.replies"
          :key="reply.commentId"
          :comment="reply"
          :show-replies="false"
          @like="$emit('like', reply)"
          @reply="$emit('reply', reply)"
          @delete="$emit('delete', reply)"
        />
        <div v-if="comment.replyCount > comment.replies?.length" class="text-sm text-primary cursor-pointer mt-2" @click="loadMoreReplies">
          查看更多回复
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useUserStore } from '@/stores/user';
import type { Comment } from '@/types/comment';
import { formatTimeAgo } from '@/utils/format';

const props = defineProps<{
  comment: Comment;
  showReplies?: boolean;
}>();

const emit = defineEmits<{
  (e: 'like', comment: Comment): void;
  (e: 'reply', comment: Comment): void;
  (e: 'delete', comment: Comment): void;
}>();

const userStore = useUserStore();
const currentUser = userStore.userInfo;

const loadingReplies = ref(false);

/**
 * 格式化时间
 */
function formatTime(timestamp: number) {
  return formatTimeAgo(timestamp);
}

/**
 * 处理删除评论
 */
function handleDelete() {
  if (confirm('确定要删除这条评论吗？')) {
    emit('delete', props.comment);
  }
}

/**
 * 加载更多回复
 */
function loadMoreReplies() {
  // TODO: 实现加载更多回复的逻辑
  console.log('加载更多回复');
}
</script>

<style scoped>
.comment-item {
  padding: 16px;
  border-radius: 8px;
  transition: background-color 0.2s;
}

.comment-item:hover {
  background-color: rgba(0, 0, 0, 0.02);
}

.dark .comment-item:hover {
  background-color: rgba(255, 255, 255, 0.02);
}

.icon-btn {
  @apply flex items-center px-4 py-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors;
}
</style>