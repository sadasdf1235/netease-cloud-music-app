<template>
  <n-modal
    v-model:show="show"
    preset="dialog"
    title="分享"
    :show-icon="false"
    style="width: 400px"
  >
    <div class="share-modal">
      <!-- 分享链接 -->
      <div class="mb-4">
        <div class="text-sm text-gray-500 mb-2">分享链接</div>
        <div class="flex gap-2">
          <n-input
            ref="linkInput"
            :value="shareLink"
            readonly
            class="flex-1"
          />
          <n-button @click="copyLink">复制</n-button>
        </div>
      </div>

      <!-- 分享到社交平台 -->
      <div class="mb-4">
        <div class="text-sm text-gray-500 mb-2">分享到</div>
        <div class="grid grid-cols-4 gap-4">
          <div
            v-for="platform in platforms"
            :key="platform.name"
            class="share-platform"
            @click="shareTo(platform)"
          >
            <div :class="platform.icon" class="text-2xl mb-1"></div>
            <div class="text-xs">{{ platform.name }}</div>
          </div>
        </div>
      </div>

      <!-- 分享到二维码 -->
      <div>
        <div class="text-sm text-gray-500 mb-2">二维码分享</div>
        <div class="flex justify-center">
          <n-qr-code
            :value="shareLink"
            :size="160"
            :color="isDark ? '#ffffff' : '#000000'"
            :background-color="isDark ? '#18181c' : '#ffffff'"
          />
        </div>
      </div>
    </div>
  </n-modal>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useMessage } from 'naive-ui';
import { useThemeVars } from 'naive-ui';
import { copyToClipboard } from '@/utils/clipboard';

const props = defineProps<{
  show: boolean;
  title: string;
  link: string;
}>();

const emit = defineEmits<{
  (e: 'update:show', value: boolean): void;
}>();

const message = useMessage();
const themeVars = useThemeVars();

// 是否是暗色主题
const isDark = computed(() => {
  return themeVars.value.common.baseColor === '#000000';
});

// 分享链接
const shareLink = computed(() => props.link);

// 分享平台
const platforms = [
  { name: '微信', icon: 'i-carbon-logo-wechat', color: '#07C160' },
  { name: 'QQ', icon: 'i-carbon-logo-qq', color: '#12B7F5' },
  { name: '微博', icon: 'i-carbon-logo-weibo', color: '#E6162D' },
  { name: '推特', icon: 'i-carbon-logo-twitter', color: '#1DA1F2' }
];

// 复制链接
function copyLink() {
  copyToClipboard(shareLink.value).then(() => {
    message.success('链接已复制到剪贴板');
  });
}

// 分享到社交平台
function shareTo(platform: typeof platforms[0]) {
  let url = '';
  const text = `${props.title} - 来自网易云音乐`;

  switch (platform.name) {
    case '微博':
      url = `http://service.weibo.com/share/share.php?url=${encodeURIComponent(shareLink.value)}&title=${encodeURIComponent(text)}`;
      break;
    case '推特':
      url = `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareLink.value)}&text=${encodeURIComponent(text)}`;
      break;
    default:
      message.info('暂不支持分享到该平台');
      return;
  }

  window.open(url, '_blank');
}
</script>

<style scoped>
.share-platform {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.share-platform:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.dark .share-platform:hover {
  background-color: rgba(255, 255, 255, 0.05);
}
</style>