<template>
  <div class="mv-list-page">
    <!-- 筛选条件 -->
    <div class="mb-6 bg-white dark:bg-dark-900 rounded-lg p-4 shadow-sm">
      <!-- 地区 -->
      <div class="flex items-center mb-4">
        <div class="text-sm text-gray-500 mr-4">地区：</div>
        <n-radio-group v-model:value="filterParams.area" size="small" class="flex flex-wrap gap-2">
          <n-radio-button
            v-for="area in areaOptions"
            :key="area.value"
            :value="area.value"
          >
            {{ area.label }}
          </n-radio-button>
        </n-radio-group>
      </div>

      <!-- 类型 -->
      <div class="flex items-center mb-4">
        <div class="text-sm text-gray-500 mr-4">类型：</div>
        <n-radio-group v-model:value="filterParams.type" size="small" class="flex flex-wrap gap-2">
          <n-radio-button
            v-for="type in typeOptions"
            :key="type.value"
            :value="type.value"
          >
            {{ type.label }}
          </n-radio-button>
        </n-radio-group>
      </div>

      <!-- 排序 -->
      <div class="flex items-center">
        <div class="text-sm text-gray-500 mr-4">排序：</div>
        <n-radio-group v-model:value="filterParams.order" size="small" class="flex flex-wrap gap-2">
          <n-radio-button
            v-for="order in orderOptions"
            :key="order.value"
            :value="order.value"
          >
            {{ order.label }}
          </n-radio-button>
        </n-radio-group>
      </div>
    </div>

    <!-- MV列表 -->
    <div class="relative" ref="listWrapper" style="height: calc(100vh - 250px);">
      <template v-if="loading">
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          <div v-for="i in 8" :key="i" class="mv-item">
            <div class="relative rounded-lg overflow-hidden aspect-video shadow-md mb-2 bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
            <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2"></div>
            <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-2/3"></div>
          </div>
        </div>
      </template>
      <template v-else>
        <n-scrollbar ref="scrollbarRef" @scroll="handleScroll">
          <TransitionGroup
            tag="div"
            class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4"
            name="mv-list"
            appear
          >
            <MVCard
              v-for="mv in mvList"
              :key="mv.id"
              :mv="mv"
              @click="goToDetail(mv.id)"
              @play="playMV"
            />
          </TransitionGroup>
          <!-- 加载更多 -->
          <div v-if="hasMore" class="py-4 text-center text-gray-500">
            <n-spin size="small" /> 加载更多...
          </div>
        </n-scrollbar>
      </template>
    </div>

    <!-- 无数据提示 -->
    <div v-if="!loading && mvList.length === 0" class="text-center py-16 text-gray-500">
      暂无MV数据
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useMessage } from 'naive-ui';
import { getAllMVs } from '@/api/modules/mv';
import type { MV } from '@/types/mv';
import { useThrottleFn } from '@vueuse/core';
import MVCard from '@/components/common/MVCard.vue';

const router = useRouter();
const message = useMessage();

// 筛选选项
const areaOptions = [
  { label: '全部', value: '全部' },
  { label: '内地', value: '内地' },
  { label: '港台', value: '港台' },
  { label: '欧美', value: '欧美' },
  { label: '日本', value: '日本' },
  { label: '韩国', value: '韩国' }
] as const;

const typeOptions = [
  { label: '全部', value: '全部' },
  { label: '官方版', value: '官方版' },
  { label: '原生', value: '原生' },
  { label: '现场版', value: '现场版' },
  { label: '网易出品', value: '网易出品' }
] as const;

const orderOptions = [
  { label: '上升最快', value: '上升最快' },
  { label: '最热', value: '最热' },
  { label: '最新', value: '最新' }
] as const;

type AreaType = typeof areaOptions[number]['value'];
type TypeType = typeof typeOptions[number]['value'];
type OrderType = typeof orderOptions[number]['value'];

// 筛选参数
const filterParams = reactive({
  area: '全部' as AreaType,
  type: '全部' as TypeType,
  order: '上升最快' as OrderType
});

// 列表相关
const pageSize = 30;
const loading = ref(true);
const hasMore = ref(true);
const mvList = ref<MV[]>([]);
const offset = ref(0);

// 滚动相关
const listWrapper = ref<HTMLElement>();
const scrollbarRef = ref();
const isLoadingMore = ref(false);

/**
 * 获取MV列表
 */
async function fetchMVs(isLoadMore = false) {
  if (isLoadMore && (!hasMore.value || isLoadingMore.value)) return;

  try {
    if (!isLoadMore) {
      loading.value = true;
      offset.value = 0;
      mvList.value = [];
    } else {
      isLoadingMore.value = true;
    }

    const res = await getAllMVs(
      filterParams.area,
      filterParams.type,
      filterParams.order,
      pageSize,
      offset.value
    );

    if (isLoadMore) {
      mvList.value.push(...res.data);
    } else {
      mvList.value = res.data;
    }

    offset.value += pageSize;
    hasMore.value = res.hasMore;
  } catch (error) {
    console.error('获取MV列表失败:', error);
    message.error('获取MV列表失败');
  } finally {
    loading.value = false;
    isLoadingMore.value = false;
  }
}

/**
 * 处理滚动加载更多
 */
const handleScroll = useThrottleFn((e: Event) => {
  if (!scrollbarRef.value) return;

  const { scrollTop, scrollHeight, clientHeight } = scrollbarRef.value.$el;
  if (scrollHeight - scrollTop - clientHeight < 100) {
    fetchMVs(true);
  }
}, 200);

/**
 * 跳转到MV详情
 */
function goToDetail(id: number) {
  router.push(`/discover/mv/${id}`);
}

/**
 * 播放MV
 */
function playMV(id: number) {
  router.push(`/discover/mv/${id}`);
}

// 监听筛选参数变化
watch(filterParams, () => {
  fetchMVs();
});

// 组件挂载时获取数据
onMounted(() => {
  fetchMVs();
});
</script>

<style scoped>
.mv-list-page {
  min-height: calc(100vh - 64px);
  padding: 24px;
}

:deep(.n-scrollbar-rail) {
  z-index: 10;
}

/* 列表动画 */
.mv-list-enter-active,
.mv-list-leave-active {
  transition: all 0.3s ease;
}

.mv-list-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.mv-list-leave-to {
  opacity: 0;
  transform: scale(0.9);
}

/* 错列显示动画 */
.mv-list-move {
  transition: transform 0.3s ease;
}
</style>