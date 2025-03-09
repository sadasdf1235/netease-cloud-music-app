<template>
  <div class="login-container flex items-center justify-center min-h-screen bg-gray-100 dark:bg-dark-800 py-12 px-4">
    <div class="max-w-md w-full bg-white dark:bg-dark-900 rounded-lg shadow-lg overflow-hidden">
      <!-- 登录头部 -->
      <div class="px-6 py-8 text-center border-b border-gray-200 dark:border-gray-700">
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">网易云音乐</h1>
        <p class="text-gray-600 dark:text-gray-400">登录网易云音乐，体验更多精彩</p>
      </div>

      <!-- 登录方式切换 -->
      <div class="flex border-b border-gray-200 dark:border-gray-700">
        <button
          v-for="tab in loginTabs"
          :key="tab.key"
          class="flex-1 py-3 text-center transition-colors"
          :class="currentTab === tab.key ? 'text-primary border-b-2 border-primary' : 'text-gray-600 dark:text-gray-400'"
          @click="currentTab = tab.key"
        >
          {{ tab.name }}
        </button>
      </div>

      <!-- 登录表单区域 -->
      <div class="p-6">
        <!-- 手机号登录 -->
        <div v-if="currentTab === 'phone'">
          <n-form
            ref="formRef"
            :model="phoneForm"
            :rules="phoneRules"
            label-placement="left"
          >
            <n-form-item path="phone" label="手机号">
              <n-input v-model:value="phoneForm.phone" placeholder="请输入手机号" />
            </n-form-item>
            <n-form-item path="password" label="密码">
              <n-input
                v-model:value="phoneForm.password"
                type="password"
                placeholder="请输入密码"
                show-password-on="click"
              />
            </n-form-item>
          </n-form>
          <div class="mt-6">
            <n-button
              type="primary"
              block
              :loading="loginLoading"
              @click="handlePhoneLogin"
            >
              登录
            </n-button>
          </div>
        </div>

        <!-- 二维码登录 -->
        <div v-else-if="currentTab === 'qrcode'" class="text-center">
          <div v-if="qrStatus === 'loading'" class="py-8">
            <n-spin size="large" />
            <p class="mt-4 text-gray-600 dark:text-gray-400">二维码加载中...</p>
          </div>

          <div v-else-if="qrStatus === 'expired'" class="py-8">
            <div class="text-gray-500 dark:text-gray-400 mb-4">
              <div class="i-carbon-warning text-4xl mx-auto"></div>
              <p class="mt-2">二维码已过期</p>
            </div>
            <n-button @click="getQrCode">刷新二维码</n-button>
          </div>

          <div v-else class="py-4">
            <div class="qrcode-wrapper mx-auto mb-4 p-4 bg-white inline-block rounded">
              <img v-if="qrImg" :src="qrImg" alt="登录二维码" class="w-48 h-48" />
            </div>
            <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">使用<span class="text-primary">网易云音乐App</span>扫码登录</p>
            <p class="text-xs text-gray-500">二维码有效期 {{ qrCodeExpireTime }} 秒</p>
          </div>
        </div>
      </div>

      <!-- 底部其他登录方式 -->
      <div class="px-6 pb-6 pt-2 text-center">
        <p class="text-sm text-gray-500 dark:text-gray-400 mb-4">其他登录方式</p>
        <div class="flex justify-center space-x-6">
          <button class="icon-btn text-xl text-gray-600 hover:text-primary">
            <div class="i-carbon-logo-wechat"></div>
          </button>
          <button class="icon-btn text-xl text-gray-600 hover:text-primary">
            <div class="i-carbon-logo-qq"></div>
          </button>
          <button class="icon-btn text-xl text-gray-600 hover:text-primary">
            <div class="i-carbon-logo-weibo"></div>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useMessage } from 'naive-ui'
import { userApi } from '@/api'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const route = useRoute()
const message = useMessage()
const userStore = useUserStore()

// 如果已登录，跳转到首页
onMounted(() => {
  if (userStore.isLoggedIn) {
    router.push('/')
  }
})

// 登录方式标签
const loginTabs = [
  { key: 'phone', name: '手机号登录' },
  { key: 'qrcode', name: '二维码登录' }
]
const currentTab = ref('phone')

// 手机号登录表单
const formRef = ref(null)
const phoneForm = reactive({
  phone: '',
  password: ''
})

// 表单验证规则
const phoneRules = {
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度不能小于6位', trigger: 'blur' }
  ]
}

// 登录状态
const loginLoading = ref(false)

// 手机号登录处理
async function handlePhoneLogin() {
  try {
    loginLoading.value = true

    // 表单验证
    await formRef.value?.validate()

    // 调用登录API
    const res = await userApi.loginByPhone(phoneForm.phone, phoneForm.password)

    // 保存登录状态
    if (res.code === 200) {
      userStore.setLoginState(true, res.profile, res.cookie)
      message.success('登录成功')
      const redirect = route.query.redirect as string
      router.replace(redirect || '/')
    } else {
      message.error(res.msg || '登录失败')
    }
  } catch (error) {
    if (error instanceof Error) {
      message.error(error.message || '登录失败')
    }
  } finally {
    loginLoading.value = false
  }
}

// 二维码登录相关
const qrStatus = ref('loading') // loading, ready, expired
const qrImg = ref('')
const qrKey = ref('')
const qrCodeExpireTime = ref(300)
let checkQrTimer: number | null = null

// 获取二维码
async function getQrCode() {
  try {
    qrStatus.value = 'loading'

    // 获取二维码key
    const keyRes = await userApi.getQrKey()
    if (keyRes.code !== 200) {
      throw new Error('获取二维码失败')
    }

    qrKey.value = keyRes.data.unikey

    // 获取二维码图片
    const qrRes = await userApi.getQrCode(qrKey.value)
    if (qrRes.code !== 200) {
      throw new Error('获取二维码失败')
    }

    qrImg.value = qrRes.data.qrimg
    qrStatus.value = 'ready'
    qrCodeExpireTime.value = 300

    // 开始检查二维码状态
    startCheckQrStatus()
  } catch (error) {
    qrStatus.value = 'expired'
    if (error instanceof Error) {
      message.error(error.message)
    }
  }
}

// 检查二维码状态
async function checkQrStatus() {
  try {
    if (!qrKey.value) return

    const res = await userApi.checkQrStatus(qrKey.value)

    switch (res.code) {
      case 800:
        // 二维码过期
        qrStatus.value = 'expired'
        stopCheckQrStatus()
        break
      case 801:
        // 等待扫码
        qrCodeExpireTime.value--
        if (qrCodeExpireTime.value <= 0) {
          qrStatus.value = 'expired'
          stopCheckQrStatus()
        }
        break
      case 802:
        // 待确认
        message.info('请在手机上确认登录')
        break
      case 803:
        // 登录成功
        stopCheckQrStatus()
        message.success('登录成功')

        // 保存登录状态
        const cookie = res.cookie
        // 获取用户信息
        const userRes = await userApi.getUserAccount()
        if (userRes.code === 200) {
          userStore.setLoginState(true, userRes.profile, cookie)
          const redirect = route.query.redirect as string
          router.replace(redirect || '/')
        }
        break
    }
  } catch (error) {
    console.error('检查二维码状态出错:', error)
  }
}

// 开始检查二维码状态
function startCheckQrStatus() {
  stopCheckQrStatus()
  checkQrStatus() // 立即检查一次
  checkQrTimer = window.setInterval(checkQrStatus, 3000) // 每3秒检查一次
}

// 停止检查二维码状态
function stopCheckQrStatus() {
  if (checkQrTimer) {
    clearInterval(checkQrTimer)
    checkQrTimer = null
  }
}

// 组件挂载时获取二维码
onMounted(() => {
  if (currentTab.value === 'qrcode') {
    getQrCode()
  }
})

// 切换登录方式时处理
watch(currentTab, (newVal) => {
  if (newVal === 'qrcode') {
    getQrCode()
  } else {
    stopCheckQrStatus()
  }
})

// 组件卸载时清理定时器
onUnmounted(() => {
  stopCheckQrStatus()
})
</script>