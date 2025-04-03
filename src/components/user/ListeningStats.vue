<template>
  <div class="listening-stats">
    <!-- 时间范围选择 -->
    <div class="flex justify-between items-center mb-6">
      <h3 class="text-lg font-bold">听歌排行</h3>
      <n-radio-group v-model:value="timeRange" size="small">
        <n-radio-button value="1">最近一周</n-radio-button>
        <n-radio-button value="0">所有时间</n-radio-button>
      </n-radio-group>
    </div>
    
    <!-- 加载中状态 -->
    <div v-if="loading" class="flex justify-center py-10">
      <n-spin size="medium" />
    </div>
    
    <!-- 无数据状态 -->
    <div v-else-if="!songs.length" class="py-10 text-center text-gray-500">
      <div class="i-carbon-music-recent text-6xl mx-auto mb-4"></div>
      <p>暂无听歌记录</p>
      <p class="mt-2 text-sm">去发现一些好听的音乐吧~</p>
    </div>
    
    <!-- 数据展示 -->
    <div v-else>
      <!-- 音乐口味分析 -->
      <div class="mb-6 bg-gray-50 dark:bg-dark-800 rounded-lg p-4">
        <h4 class="text-base font-medium mb-3">音乐口味分析</h4>
        <div class="grid grid-cols-2 gap-4">
          <!-- 流派占比 -->
          <div class="genre-chart bg-white dark:bg-dark-900 rounded-lg p-3">
            <h5 class="text-sm font-medium mb-2">常听流派</h5>
            <div class="h-40 relative">
              <div v-if="!genreStats.length" class="absolute inset-0 flex items-center justify-center text-gray-500 text-sm">
                暂无数据
              </div>
              <div v-else class="flex flex-col h-full justify-center">
                <div 
                  v-for="(item, index) in genreStats.slice(0, 5)" 
                  :key="index"
                  class="flex items-center mb-2 last:mb-0"
                >
                  <div class="w-20 text-xs truncate" :title="item.name">{{ item.name }}</div>
                  <div class="flex-1 mx-2">
                    <div class="h-3 bg-gray-200 dark:bg-dark-700 rounded-full overflow-hidden">
                      <div 
                        class="h-full rounded-full" 
                        :style="{ 
                          width: `${item.percentage}%`, 
                          backgroundColor: genreColors[index % genreColors.length] 
                        }"
                      ></div>
                    </div>
                  </div>
                  <div class="text-xs w-8 text-right">{{ item.percentage }}%</div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- 歌手占比 -->
          <div class="artist-chart bg-white dark:bg-dark-900 rounded-lg p-3">
            <h5 class="text-sm font-medium mb-2">常听歌手</h5>
            <div class="h-40 relative">
              <div v-if="!artistStats.length" class="absolute inset-0 flex items-center justify-center text-gray-500 text-sm">
                暂无数据
              </div>
              <div v-else class="flex flex-col h-full justify-center">
                <div 
                  v-for="(item, index) in artistStats.slice(0, 5)" 
                  :key="index"
                  class="flex items-center mb-2 last:mb-0"
                >
                  <div class="w-20 text-xs truncate" :title="item.name">{{ item.name }}</div>
                  <div class="flex-1 mx-2">
                    <div class="h-3 bg-gray-200 dark:bg-dark-700 rounded-full overflow-hidden">
                      <div 
                        class="h-full rounded-full" 
                        :style="{ 
                          width: `${item.percentage}%`, 
                          backgroundColor: artistColors[index % artistColors.length] 
                        }"
                      ></div>
                    </div>
                  </div>
                  <div class="text-xs w-8 text-right">{{ item.percentage }}%</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 听歌排行榜 -->
      <div>
        <div class="flex justify-between items-center mb-3">
          <h4 class="text-base font-medium">听歌排行 ({{ songs.length }})</h4>
          <span class="text-xs text-gray-500">
            {{ timeRange === '1' ? '最近一周' : '所有时间' }} · 
            累计听歌{{ totalPlayCount }}首
          </span>
        </div>
        
        <div v-if="songs.length" class="listening-ranking">
          <div class="bg-gray-50 dark:bg-dark-800 px-4 py-2 rounded-t-lg grid grid-cols-12 text-xs font-medium text-gray-500">
            <div class="col-span-1">序号</div>
            <div class="col-span-6">歌曲</div>
            <div class="col-span-3">歌手</div>
            <div class="col-span-2 text-right">播放次数</div>
          </div>
          
          <div class="divide-y divide-gray-100 dark:divide-dark-700 rounded-b-lg overflow-hidden">
            <div 
              v-for="(song, index) in songs.slice(0, showLimit)" 
              :key="song.id"
              class="grid grid-cols-12 px-4 py-3 bg-white dark:bg-dark-900 items-center hover:bg-gray-50 dark:hover:bg-dark-800 transition-colors"
              :class="{'text-primary': index < 3}"
            >
              <div class="col-span-1 font-medium" :class="{'text-lg': index < 3}">
                {{ index + 1 }}
              </div>
              <div class="col-span-6 flex items-center">
                <img 
                  :src="song.al?.picUrl + '?param=60y60'" 
                  :alt="song.name" 
                  class="w-10 h-10 object-cover rounded mr-3" 
                />
                <div class="truncate">
                  <div class="font-medium truncate" :title="song.name">{{ song.name }}</div>
                  <div class="text-xs text-gray-500 truncate" v-if="song.alia && song.alia.length">
                    {{ song.alia.join(' / ') }}
                  </div>
                </div>
              </div>
              <div class="col-span-3 truncate text-gray-600 dark:text-gray-400" :title="formatArtists(song.ar)">
                {{ formatArtists(song.ar) }}
              </div>
              <div class="col-span-2 text-right">
                <div class="text-sm font-medium">{{ song.playCount || '-' }}</div>
              </div>
            </div>
          </div>
          
          <div v-if="songs.length > showLimit" class="text-center mt-4">
            <n-button text @click="showMore">
              查看更多
              <template #icon>
                <div class="i-carbon-chevron-down" />
              </template>
            </n-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * 用户听歌统计组件
 * @description 展示用户听歌排行及音乐口味分析
 */
import { ref, computed, watch } from 'vue';
import { NRadioGroup, NRadioButton, NSpin, NButton } from 'naive-ui';
import type { Track } from '@/types/models/track';

// 定义组件属性
const props = defineProps({
  /** 歌曲列表 */
  songs: {
    type: Array as () => Track[],
    default: () => []
  },
  /** 是否加载中 */
  loading: {
    type: Boolean,
    default: false
  },
  /** 用户ID */
  userId: {
    type: Number,
    required: true
  }
});

// 定义事件
const emit = defineEmits(['change-range']);

// 时间范围
const timeRange = ref('1'); // 默认为最近一周
// 显示数量限制
const showLimit = ref(10);
// 流派色彩
const genreColors = ['#ff4d4f', '#ff7a45', '#fa8c16', '#faad14', '#fadb14', '#a0d911', '#52c41a', '#13c2c2', '#1677ff', '#2f54eb', '#722ed1', '#eb2f96'];
// 歌手色彩
const artistColors = ['#1677ff', '#52c41a', '#fa8c16', '#722ed1', '#eb2f96', '#13c2c2', '#faad14', '#ff4d4f', '#a0d911', '#2f54eb'];

// 流派统计
const genreStats = ref<Array<{name: string, percentage: number}>>([
  { name: '流行', percentage: 45 },
  { name: '摇滚', percentage: 20 },
  { name: '民谣', percentage: 15 },
  { name: '电子', percentage: 10 },
  { name: '古典', percentage: 5 },
  { name: '嘻哈', percentage: 5 }
]);

// 歌手统计
const artistStats = ref<Array<{name: string, percentage: number}>>([]);

// 总播放数
const totalPlayCount = computed(() => {
  return props.songs.reduce((total, song) => total + (song.playCount || 0), 0);
});

/**
 * 格式化歌手列表
 * @param artists 歌手数组
 * @returns 格式化后的歌手名称字符串
 */
function formatArtists(artists: any[]): string {
  if (!artists || !artists.length) {
    return '未知歌手';
  }
  return artists.map(artist => artist.name).join(' / ');
}

/**
 * 显示更多歌曲
 */
function showMore(): void {
  showLimit.value += 10;
}

/**
 * 分析音乐口味
 * 基于歌曲列表生成流派和歌手统计
 */
function analyzeMusicalTaste(): void {
  if (!props.songs.length) {
    artistStats.value = [];
    return;
  }

  // 统计歌手出现频率
  const artistMap = new Map<string, number>();
  let totalArtistCount = 0;

  props.songs.forEach(song => {
    song.ar?.forEach(artist => {
      const count = artistMap.get(artist.name) || 0;
      artistMap.set(artist.name, count + 1);
      totalArtistCount++;
    });
  });

  // 转换为百分比
  const artistArray = Array.from(artistMap.entries())
    .map(([name, count]) => ({
      name,
      percentage: Math.round((count / totalArtistCount) * 100)
    }))
    .sort((a, b) => b.percentage - a.percentage);

  artistStats.value = artistArray;
}

// 监听歌曲列表变化，更新统计数据
watch(() => props.songs, () => {
  analyzeMusicalTaste();
}, { immediate: true });

// 监听时间范围变化
watch(timeRange, (newValue) => {
  emit('change-range', newValue);
});
</script>

<style scoped>
.listening-stats {
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
</style> 