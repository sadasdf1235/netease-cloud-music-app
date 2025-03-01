import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface UserProfile {
  userId: number
  nickname: string
  avatarUrl: string
  backgroundUrl?: string
  signature?: string
  level?: number
  vipType?: number
}

export const useUserStore = defineStore('user', () => {
  // 用户登录状态
  const isLoggedIn = ref(false)
  // 用户信息
  const profile = ref<UserProfile | null>(null)
  // 用户cookie
  const cookie = ref('')
  
  // 计算属性：用户ID
  const userId = computed(() => profile.value?.userId || 0)
  
  // 设置登录状态和用户信息
  function setLoginState(loginState: boolean, userProfile: UserProfile | null = null, userCookie: string = '') {
    isLoggedIn.value = loginState
    profile.value = userProfile
    cookie.value = userCookie
    
    // 保存到本地存储
    if (loginState && userProfile) {
      localStorage.setItem('user_profile', JSON.stringify(userProfile))
      localStorage.setItem('user_cookie', userCookie)
    } else {
      localStorage.removeItem('user_profile')
      localStorage.removeItem('user_cookie')
    }
  }
  
  // 从本地存储恢复登录状态
  function restoreLoginState() {
    const storedProfile = localStorage.getItem('user_profile')
    const storedCookie = localStorage.getItem('user_cookie')
    
    if (storedProfile && storedCookie) {
      try {
        const userProfile = JSON.parse(storedProfile) as UserProfile
        setLoginState(true, userProfile, storedCookie)
        return true
      } catch (e) {
        console.error('Failed to parse stored user profile', e)
      }
    }
    return false
  }
  
  // 登出
  function logout() {
    setLoginState(false)
  }
  
  // 更新用户信息
  function updateProfile(userProfile: Partial<UserProfile>) {
    if (profile.value) {
      profile.value = { ...profile.value, ...userProfile }
      localStorage.setItem('user_profile', JSON.stringify(profile.value))
    }
  }
  
  return {
    isLoggedIn,
    profile,
    cookie,
    userId,
    setLoginState,
    restoreLoginState,
    logout,
    updateProfile
  }
})