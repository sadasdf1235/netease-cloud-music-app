import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { UserProfile } from '@/types/user'
import { login, logout, getUserProfile } from '@/api/user'
import { STORAGE_KEY } from '@/constants/storage'

export const useUserStore = defineStore('user', () => {
  // 状态
  const token = ref<string>(localStorage.getItem(STORAGE_KEY.TOKEN) || '')
  const profile = ref<UserProfile | null>(null)
  const isLoggedIn = computed(() => !!token.value)

  // 登录
  const loginAction = async (phone: string, password: string) => {
    try {
      const res = await login(phone, password)
      token.value = res.token
      localStorage.setItem(STORAGE_KEY.TOKEN, res.token)
      await getProfile()
      return true
    } catch (error) {
      console.error('登录失败:', error)
      return false
    }
  }

  // 退出登录
  const logoutAction = async () => {
    try {
      await logout()
      token.value = ''
      profile.value = null
      localStorage.removeItem(STORAGE_KEY.TOKEN)
      return true
    } catch (error) {
      console.error('退出登录失败:', error)
      return false
    }
  }

  // 获取用户信息
  const getProfile = async () => {
    try {
      if (!token.value) return null
      const data = await getUserProfile()
      profile.value = data
      return data
    } catch (error) {
      console.error('获取用户信息失败:', error)
      return null
    }
  }

  // 初始化
  const initialize = async () => {
    if (token.value) {
      await getProfile()
    }
  }

  return {
    // 状态
    token,
    profile,
    isLoggedIn,
    // 方法
    login: loginAction,
    logout: logoutAction,
    getProfile,
    initialize,
  }
})