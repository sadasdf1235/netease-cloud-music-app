<template>
  <div class="user-profile bg-white dark:bg-dark-900 rounded-lg shadow-md p-6">
    <div class="flex flex-col md:flex-row md:items-start">
      <!-- 用户头像和基本信息 -->
      <div class="flex flex-col items-center md:items-start md:flex-shrink-0 md:mr-8">
        <div class="relative">
          <!-- 头像 -->
          <div class="relative group">
            <img
              :src="profile?.avatarUrl + '?param=160y160'"
              alt="用户头像"
              class="w-32 h-32 rounded-full object-cover border-4 border-white dark:border-dark-700 shadow-lg"
            />
            <div
              v-if="isCurrentUser"
              class="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer"
              @click="handleChangeAvatar"
            >
              <div class="text-white text-sm">更换头像</div>
            </div>
          </div>
          
          <!-- VIP标识 -->
          <div
            v-if="profile?.vipType && profile?.vipType > 0"
            class="absolute -bottom-2 -right-2 bg-gradient-to-r from-yellow-500 to-red-500 text-white text-xs px-3 py-1 rounded-full shadow-md"
          >
            <div class="flex items-center">
              <div class="i-carbon-star-filled mr-1"></div>
              <span>VIP{{ profile?.vipType }}</span>
            </div>
          </div>
        </div>
        
        <!-- 用户名和性别 -->
        <div class="mt-4 text-center md:text-left">
          <div class="flex items-center justify-center md:justify-start">
            <h1 class="text-xl font-bold">
              {{ profile?.nickname || '未登录' }}
            </h1>
            <span
              v-if="profile?.gender === 1"
              class="ml-2 text-blue-500 i-carbon-male"
              title="男性"
            ></span>
            <span
              v-else-if="profile?.gender === 2"
              class="ml-2 text-pink-500 i-carbon-female"
              title="女性"
            ></span>
          </div>
          
          <!-- 等级 -->
          <div class="mt-1 flex items-center justify-center md:justify-start text-sm">
            <div class="bg-primary/10 text-primary px-2 py-0.5 rounded">Lv.{{ profile?.level || 0 }}</div>
          </div>
        </div>
        
        <!-- 关注和粉丝 -->
        <div class="mt-4 flex items-center justify-center md:justify-start space-x-6">
          <button 
            class="flex flex-col items-center transition hover:text-primary"
            @click="$emit('view-follows')"
          >
            <span class="text-lg font-medium">{{ formatNumber(profile?.follows || 0) }}</span>
            <span class="text-xs text-gray-500">关注</span>
          </button>
          <button 
            class="flex flex-col items-center transition hover:text-primary"
            @click="$emit('view-fans')"
          >
            <span class="text-lg font-medium">{{ formatNumber(profile?.followeds || 0) }}</span>
            <span class="text-xs text-gray-500">粉丝</span>
          </button>
          <button 
            class="flex flex-col items-center transition hover:text-primary"
            @click="$emit('view-likes')"
          >
            <span class="text-lg font-medium">{{ likeCount }}</span>
            <span class="text-xs text-gray-500">获赞</span>
          </button>
        </div>
      </div>
      
      <!-- 用户详情信息 -->
      <div class="flex-1 mt-8 md:mt-0 md:border-l md:pl-8">
        <!-- 个人签名 -->
        <div class="mb-6">
          <div class="flex items-center justify-between mb-2">
            <h3 class="text-sm font-medium text-gray-500">个人介绍</h3>
            <button 
              v-if="isCurrentUser" 
              class="text-xs text-primary"
              @click="isEditingSignature = true"
            >
              编辑
            </button>
          </div>
          
          <div v-if="!isEditingSignature" class="text-gray-600 dark:text-gray-400 text-sm">
            {{ profile?.signature || '这个人很懒，什么都没写~' }}
          </div>
          
          <div v-else class="mt-2">
            <n-input
              v-model:value="editedSignature"
              type="textarea"
              :autosize="{
                minRows: 2,
                maxRows: 5
              }"
              placeholder="介绍一下你自己吧..."
              maxlength="150"
              show-count
            />
            <div class="flex justify-end mt-2 space-x-2">
              <n-button size="small" @click="cancelEdit">取消</n-button>
              <n-button size="small" type="primary" @click="saveSignature">保存</n-button>
            </div>
          </div>
        </div>
        
        <!-- 用户信息列表 -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- 城市 -->
          <div class="flex items-center text-sm">
            <div class="i-carbon-location text-gray-400 mr-2"></div>
            <span class="text-gray-600 dark:text-gray-400">
              {{ profile?.city ? getCityName(profile.city) : '未知地区' }}
            </span>
          </div>
          
          <!-- 注册时间 -->
          <div class="flex items-center text-sm">
            <div class="i-carbon-calendar text-gray-400 mr-2"></div>
            <span class="text-gray-600 dark:text-gray-400">
              {{ profile?.createTime ? formatDate(profile.createTime) : '未知' }} 注册
            </span>
          </div>
          
          <!-- 年龄 -->
          <div class="flex items-center text-sm">
            <div class="i-carbon-calendar-heat-map text-gray-400 mr-2"></div>
            <span class="text-gray-600 dark:text-gray-400">
              {{ profile?.birthday ? calculateAge(profile.birthday) : '未知年龄' }}
            </span>
          </div>
          
          <!-- 社交账号 -->
          <div class="flex items-center text-sm">
            <div class="i-carbon-link text-gray-400 mr-2"></div>
            <span 
              v-if="profile?.bindings && profile.bindings.length > 0" 
              class="text-gray-600 dark:text-gray-400"
            >
              已绑定 {{ profile.bindings.length }} 个社交账号
            </span>
            <span v-else class="text-gray-600 dark:text-gray-400">
              暂无绑定社交账号
            </span>
          </div>
        </div>
        
        <!-- 操作按钮区 -->
        <div v-if="isCurrentUser" class="mt-6 flex flex-wrap gap-2">
          <n-button size="small">
            <div class="i-carbon-edit mr-1"></div>
            编辑资料
          </n-button>
          <n-button size="small">
            <div class="i-carbon-settings mr-1"></div>
            账号设置
          </n-button>
        </div>
        <div v-else class="mt-6 flex flex-wrap gap-2">
          <n-button 
            size="small" 
            type="primary" 
            :ghost="isFollowing"
            @click="toggleFollow"
          >
            <div :class="isFollowing ? 'i-carbon-checkmark' : 'i-carbon-add'" class="mr-1"></div>
            {{ isFollowing ? '已关注' : '关注' }}
          </n-button>
          <n-button size="small">
            <div class="i-carbon-send mr-1"></div>
            发消息
          </n-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * 用户资料展示与编辑组件
 * @description 展示用户基本信息，支持编辑个人签名、头像等
 */
import { ref, computed } from 'vue';
import { NInput, NButton, useMessage } from 'naive-ui';
import { useUserStore } from '@/stores/user';
import type { UserProfile } from '@/types/models/user';
import { updateUserProfile, followUser } from '@/api/modules/user';

// 消息提示
const message = useMessage();

// 用户信息
const props = defineProps<{
  /** 用户资料 */
  profile?: UserProfile;
  /** 是否为当前登录用户 */
  isCurrentUser: boolean;
  /** 是否已关注该用户 */
  isFollowing?: boolean;
  /** 用户获赞数 */
  likeCount?: number;
}>();

// 默认的获赞数
const likeCount = computed(() => props.likeCount || 0);

// 编辑状态
const isEditingSignature = ref(false);
const editedSignature = ref(props.profile?.signature || '');

// 定义事件
const emit = defineEmits([
  'update:profile',
  'view-follows',
  'view-fans',
  'view-likes',
  'follow-changed'
]);

/**
 * 格式化数字
 * @param num 数字
 * @returns 格式化后的数字字符串
 */
function formatNumber(num: number): string {
  if (num >= 100000000) {
    return (num / 100000000).toFixed(1) + '亿';
  } else if (num >= 10000) {
    return (num / 10000).toFixed(1) + '万';
  } else {
    return num.toString();
  }
}

/**
 * 格式化日期
 * @param timestamp 时间戳
 * @returns 格式化后的日期字符串 YYYY年MM月DD日
 */
function formatDate(timestamp: number): string {
  const date = new Date(timestamp);
  return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
}

/**
 * 计算年龄
 * @param birthday 生日时间戳
 * @returns 年龄字符串
 */
function calculateAge(birthday: number): string {
  const birthDate = new Date(birthday);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return `${age}岁`;
}

/**
 * 获取城市名称
 * @param cityCode 城市代码
 * @returns 城市名称
 */
function getCityName(cityCode: number): string {
  // 这里应该有一个城市代码到名称的映射
  // 简化处理，实际应用中应该有一个完整的城市列表
  const cities: Record<number, string> = {
    1: '北京',
    2: '上海',
    3: '广州',
    4: '深圳',
    // 更多城市...
  };
  
  return cities[cityCode] || `城市(${cityCode})`;
}

/**
 * 处理头像更换
 */
function handleChangeAvatar(): void {
  message.info('头像更换功能开发中...');
  // 实际实现应该打开文件选择器，上传新头像
}

/**
 * 取消编辑签名
 */
function cancelEdit(): void {
  isEditingSignature.value = false;
  editedSignature.value = props.profile?.signature || '';
}

/**
 * 保存签名
 */
async function saveSignature(): Promise<void> {
  try {
    // 实际应用中，这里应该调用API更新用户签名
    // const result = await updateUserProfile({ signature: editedSignature.value });
    
    // 模拟API调用成功
    message.success('个人介绍更新成功');
    
    // 更新用户资料
    if (props.profile) {
      const updatedProfile = {
        ...props.profile,
        signature: editedSignature.value
      };
      
      emit('update:profile', updatedProfile);
    }
    
    isEditingSignature.value = false;
  } catch (error) {
    message.error('更新失败，请稍后再试');
  }
}

/**
 * 切换关注状态
 */
async function toggleFollow(): Promise<void> {
  if (!props.profile?.userId) return;
  
  try {
    // 关注状态：t=1为关注，t=0为取消关注
    const t = props.isFollowing ? 0 : 1;
    
    // 实际应用中，这里应该调用API更新关注状态
    // const result = await followUser(props.profile.userId, t);
    
    // 模拟API调用成功
    message.success(props.isFollowing ? '已取消关注' : '关注成功');
    
    // 触发关注状态变更事件
    emit('follow-changed', !props.isFollowing);
  } catch (error) {
    message.error('操作失败，请稍后再试');
  }
}
</script>

<style scoped>
.user-profile {
  transition: all 0.3s ease;
}
</style> 