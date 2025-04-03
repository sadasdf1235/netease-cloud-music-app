<template>
  <div class="comment-section">
    <!-- 评论输入框 -->
    <div class="comment-input mb-6">
      <n-input
        v-model:value="commentContent"
        type="textarea"
        placeholder="说点什么吧..."
        :autosize="{ minRows: 2, maxRows: 4 }"
        class="mb-2"
      />
      <div class="flex justify-end">
        <n-button type="primary" :disabled="!commentContent.trim()" @click="handleSendComment">
          发送评论
        </n-button>
      </div>
    </div>

    <!-- 评论排序 -->
    <div class="flex items-center justify-between mb-4">
      <div class="text-lg font-bold">评论 ({{ totalCount }})</div>
      <n-radio-group v-model:value="sortType" size="small">
        <n-radio-button :value="1">推荐</n-radio-button>
        <n-radio-button :value="2">最热</n-radio-button>
        <n-radio-button :value="3">最新</n-radio-button>
      </n-radio-group>
    </div>

    <!-- 热门评论 -->
    <template v-if="hotComments && hotComments.length > 0">
      <div class="mb-4">
        <div class="text-sm text-gray-500 mb-2">热门评论</div>
        <div class="space-y-4">
          <CommentItem
            v-for="comment in hotComments"
            :key="comment.commentId"
            :comment="comment"
            @like="handleLikeComment"
            @reply="handleReplyComment"
            @delete="handleDeleteComment"
          />
        </div>
      </div>
      <n-divider />
    </template>

    <!-- 最新评论 -->
    <div class="mb-4">
      <div class="text-sm text-gray-500 mb-2">最新评论</div>
      <div v-if="loading" class="space-y-4">
        <n-skeleton v-for="i in 3" :key="i" text :repeat="2" />
      </div>
      <template v-else>
        <div v-if="comments.length > 0" class="space-y-4">
          <CommentItem
            v-for="comment in comments"
            :key="comment.commentId"
            :comment="comment"
            @like="handleLikeComment"
            @reply="handleReplyComment"
            @delete="handleDeleteComment"
          />
        </div>
        <div v-else class="text-center py-8 text-gray-500">
          还没有评论，快来抢沙发吧~
        </div>
      </template>
    </div>

    <!-- 分页 -->
    <div v-if="totalCount > pageSize" class="flex justify-center">
      <n-pagination
        v-model:page="currentPage"
        v-model:page-size="pageSize"
        :item-count="totalCount"
        :page-sizes="[20, 50, 100]"
        show-size-picker
        @update:page="handlePageChange"
        @update:page-size="handlePageSizeChange"
      />
    </div>

    <!-- 回复弹窗 -->
    <n-modal
      v-model:show="showReplyModal"
      preset="dialog"
      title="回复评论"
      positive-text="发送"
      negative-text="取消"
      @positive-click="handleSendReply"
      @negative-click="closeReplyModal"
    >
      <n-input
        v-model:value="replyContent"
        type="textarea"
        placeholder="说点什么吧..."
        :autosize="{ minRows: 2, maxRows: 4 }"
      />
    </n-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useMessage } from 'naive-ui';
import type { Comment } from '@/types/comment';
import { getComments, sendComment, likeComment, deleteComment } from '@/api/modules/comment';
import CommentItem from './CommentItem.vue';

const props = defineProps<{
  resourceId: number;
  resourceType: number;
}>();

const message = useMessage();

// 评论内容
const commentContent = ref('');
// 回复内容
const replyContent = ref('');
// 当前要回复的评论
const currentReplyComment = ref<Comment | null>(null);
// 显示回复弹窗
const showReplyModal = ref(false);

// 评论列表数据
const comments = ref<Comment[]>([]);
const hotComments = ref<Comment[]>([]);
const totalCount = ref(0);
const loading = ref(true);

// 分页参数
const currentPage = ref(1);
const pageSize = ref(20);
// 排序方式
const sortType = ref(1);

// 获取评论列表
async function fetchComments() {
  try {
    loading.value = true;
    const res = await getComments({
      id: props.resourceId,
      type: props.resourceType,
      pageNo: currentPage.value,
      pageSize: pageSize.value,
      sortType: sortType.value
    });
    comments.value = res.comments;
    hotComments.value = res.hotComments || [];
    totalCount.value = res.totalCount;
  } catch (error) {
    console.error('获取评论失败:', error);
    message.error('获取评论失败');
  } finally {
    loading.value = false;
  }
}

// 发送评论
async function handleSendComment() {
  if (!commentContent.value.trim()) return;

  try {
    await sendComment(props.resourceId, props.resourceType, commentContent.value);
    message.success('评论发送成功');
    commentContent.value = '';
    fetchComments();
  } catch (error) {
    console.error('发送评论失败:', error);
    message.error('发送评论失败');
  }
}

// 点赞评论
async function handleLikeComment(comment: Comment) {
  try {
    await likeComment(props.resourceId, props.resourceType, comment.commentId, !comment.liked);
    comment.liked = !comment.liked;
    comment.likedCount += comment.liked ? 1 : -1;
    message.success(comment.liked ? '点赞成功' : '已取消点赞');
  } catch (error) {
    console.error('点赞失败:', error);
    message.error('操作失败');
  }
}

// 打开回复弹窗
function handleReplyComment(comment: Comment) {
  currentReplyComment.value = comment;
  replyContent.value = '';
  showReplyModal.value = true;
}

// 关闭回复弹窗
function closeReplyModal() {
  showReplyModal.value = false;
  currentReplyComment.value = null;
  replyContent.value = '';
}

// 发送回复
async function handleSendReply() {
  if (!replyContent.value.trim() || !currentReplyComment.value) return;

  try {
    await sendComment(
      props.resourceId,
      props.resourceType,
      replyContent.value,
      currentReplyComment.value.commentId
    );
    message.success('回复发送成功');
    closeReplyModal();
    fetchComments();
  } catch (error) {
    console.error('发送回复失败:', error);
    message.error('发送回复失败');
  }
}

// 删除评论
async function handleDeleteComment(comment: Comment) {
  try {
    await deleteComment(props.resourceId, props.resourceType, comment.commentId);
    message.success('评论已删除');
    fetchComments();
  } catch (error) {
    console.error('删除评论失败:', error);
    message.error('删除失败');
  }
}

// 处理页码变化
function handlePageChange() {
  fetchComments();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// 处理每页数量变化
function handlePageSizeChange() {
  currentPage.value = 1;
  fetchComments();
}

// 监听排序方式变化
watch(sortType, () => {
  currentPage.value = 1;
  fetchComments();
});

// 组件挂载时获取评论
fetchComments();
</script>