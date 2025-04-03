<template>
  <div class="profile-editor bg-white dark:bg-dark-900 rounded-lg shadow-md p-6">
    <h2 class="text-xl font-bold mb-6">个人资料</h2>
    
    <!-- 头像上传 -->
    <div class="mb-8">
      <h3 class="text-lg font-medium mb-4">头像</h3>
      <div class="flex items-center space-x-4">
        <div class="relative">
          <img 
            :src="userStore.profile?.avatarUrl + '?param=160y160'" 
            alt="用户头像"
            class="w-24 h-24 rounded-full object-cover border-4 border-white dark:border-dark-700 shadow-lg"
          />
          <div
            v-if="userStore.profile?.vipType && userStore.profile.vipType > 0"
            class="absolute -bottom-1 -right-1 bg-primary text-white text-xs px-2 py-0.5 rounded-full"
          >
            VIP
          </div>
        </div>
        <div>
          <n-upload
            action="/api/upload"
            :show-file-list="false"
            :before-upload="beforeAvatarUpload"
            class="upload-avatar"
          >
            <n-button type="primary">更换头像</n-button>
          </n-upload>
          <p class="text-sm text-gray-500 mt-2">支持 jpg、png 格式，大小不超过 2MB</p>
        </div>
      </div>
    </div>

    <!-- 基本信息 -->
    <div class="mb-8">
      <h3 class="text-lg font-medium mb-4">基本信息</h3>
      <n-form
        ref="formRef"
        :model="formData"
        :rules="rules"
        label-placement="left"
        label-width="100"
        require-mark-placement="right-hanging"
      >
        <n-form-item label="昵称" path="nickname">
          <n-input v-model:value="formData.nickname" placeholder="请输入昵称" />
        </n-form-item>
        
        <n-form-item label="性别" path="gender">
          <n-radio-group v-model:value="formData.gender">
            <n-space>
              <n-radio :value="1">男</n-radio>
              <n-radio :value="2">女</n-radio>
            </n-space>
          </n-radio-group>
        </n-form-item>

        <n-form-item label="生日" path="birthday">
          <n-date-picker
            v-model:value="formData.birthday"
            type="date"
            placeholder="请选择生日"
          />
        </n-form-item>

        <n-form-item label="地区" path="region">
          <n-cascader
            v-model:value="formData.region"
            :options="regionOptions"
            placeholder="请选择地区"
          />
        </n-form-item>

        <n-form-item label="签名" path="signature">
          <n-input
            v-model:value="formData.signature"
            type="textarea"
            placeholder="请输入个性签名"
            :autosize="{ minRows: 3, maxRows: 5 }"
          />
        </n-form-item>
      </n-form>
    </div>

    <!-- 保存按钮 -->
    <div class="flex justify-end">
      <n-button
        type="primary"
        :loading="saving"
        @click="handleSave"
      >
        保存修改
      </n-button>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * 个人资料编辑组件
 * @description 用于编辑用户头像、昵称、性别等基本信息
 */
import { ref, onMounted } from 'vue';
import { useUserStore } from '@/stores/user';
import { useMessage, NUpload, NButton, NForm, NFormItem, NInput, NRadioGroup, NRadio, NSpace, NDatePicker, NCascader } from 'naive-ui';
import type { FormInst } from 'naive-ui';

const userStore = useUserStore();
const message = useMessage();
const formRef = ref<FormInst | null>(null);
const saving = ref(false);

// 表单数据
const formData = ref({
  nickname: userStore.profile?.nickname || '',
  gender: userStore.profile?.gender || 1,
  birthday: userStore.profile?.birthday || Date.now(),
  region: userStore.profile?.region || [],
  signature: userStore.profile?.signature || ''
});

// 表单验证规则
const rules = {
  nickname: {
    required: true,
    message: '请输入昵称',
    trigger: 'blur'
  },
  gender: {
    required: true,
    message: '请选择性别',
    trigger: 'change'
  },
  birthday: {
    required: true,
    message: '请选择生日',
    trigger: 'change'
  },
  region: {
    required: true,
    message: '请选择地区',
    trigger: 'change'
  }
};

// 地区选项（示例数据）
const regionOptions = [
  {
    label: '北京',
    value: 'beijing',
    children: [
      { label: '朝阳区', value: 'chaoyang' },
      { label: '海淀区', value: 'haidian' }
    ]
  },
  {
    label: '上海',
    value: 'shanghai',
    children: [
      { label: '浦东新区', value: 'pudong' },
      { label: '黄浦区', value: 'huangpu' }
    ]
  }
];

/**
 * 头像上传前的验证
 */
function beforeAvatarUpload(data: { file: File }) {
  const isImage = data.file.type.startsWith('image/');
  const isLt2M = data.file.size / 1024 / 1024 < 2;

  if (!isImage) {
    message.error('只能上传图片文件!');
    return false;
  }
  if (!isLt2M) {
    message.error('图片大小不能超过 2MB!');
    return false;
  }
  return true;
}

/**
 * 保存表单数据
 */
async function handleSave() {
  if (!formRef.value) return;
  
  try {
    await formRef.value.validate();
    saving.value = true;
    
    // TODO: 调用更新用户信息的API
    // await updateUserProfile(formData.value);
    
    message.success('保存成功');
  } catch (error) {
    console.error('保存失败:', error);
    message.error('保存失败，请重试');
  } finally {
    saving.value = false;
  }
}

onMounted(() => {
  // 初始化表单数据
  formData.value = {
    nickname: userStore.profile?.nickname || '',
    gender: userStore.profile?.gender || 1,
    birthday: userStore.profile?.birthday || Date.now(),
    region: userStore.profile?.region || [],
    signature: userStore.profile?.signature || ''
  };
});
</script>

<style scoped>
.upload-avatar {
  display: inline-block;
}
</style>
