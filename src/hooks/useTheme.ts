/**
 * 主题管理Hook
 * @description 提供主题切换和持久化功能
 */
import { ref, computed, watch } from 'vue';
import { useDark, usePreferredDark, useStorage } from '@vueuse/core';
import { STORAGE_KEY } from '@/constants/api';

/**
 * 主题类型
 */
export type ThemeMode = 'light' | 'dark' | 'auto';

/**
 * 主题管理Hook
 * @returns 包含主题状态和操作方法的对象
 */
export function useTheme() {
  // 系统偏好
  const prefersDark = usePreferredDark();

  // 使用VueUse的useDark实现暗黑模式切换
  const isDark = useDark();

  // 从本地存储中获取主题模式
  const themeMode = useStorage<ThemeMode>(STORAGE_KEY.THEME, 'auto');

  // 主题名称
  const themeName = computed(() => {
    switch (themeMode.value) {
      case 'light':
        return '浅色模式';
      case 'dark':
        return '深色模式';
      case 'auto':
        return '跟随系统';
      default:
        return '未知模式';
    }
  });

  /**
   * 设置主题模式
   * @param mode 主题模式
   */
  const setThemeMode = (mode: ThemeMode) => {
    themeMode.value = mode;

    // 根据模式设置暗黑模式
    if (mode === 'auto') {
      isDark.value = prefersDark.value;
    } else {
      isDark.value = mode === 'dark';
    }
  };

  /**
   * 切换主题模式
   */
  const toggleTheme = () => {
    // 循环切换：auto -> light -> dark -> auto
    if (themeMode.value === 'auto') {
      setThemeMode('light');
    } else if (themeMode.value === 'light') {
      setThemeMode('dark');
    } else {
      setThemeMode('auto');
    }
  };

  // 监听系统主题变化
  watch(prefersDark, (newValue) => {
    if (themeMode.value === 'auto') {
      isDark.value = newValue;
    }
  });

  // 初始化主题
  setThemeMode(themeMode.value);

  return {
    isDark,
    themeMode,
    themeName,
    setThemeMode,
    toggleTheme
  };
}

export default useTheme;