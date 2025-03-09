// 本地存储键名
export const STORAGE_KEY = {
  // 用户相关
  TOKEN: 'token', // 登录令牌
  USER_PROFILE: 'user_profile', // 用户信息
  USER_SETTINGS: 'user_settings', // 用户设置

  // 播放器相关
  PLAY_HISTORY: 'play_history', // 播放历史
  PLAY_MODE: 'play_mode', // 播放模式
  VOLUME: 'volume', // 音量

  // 主题相关
  THEME: 'theme', // 主题模式

  // 其他
  SEARCH_HISTORY: 'search_history', // 搜索历史
} as const;

// 播放模式
export const PLAY_MODE = {
  SEQUENCE: 'sequence', // 顺序播放
  LOOP: 'loop', // 单曲循环
  RANDOM: 'random', // 随机播放
} as const;

// 主题模式
export const THEME_MODE = {
  LIGHT: 'light', // 浅色模式
  DARK: 'dark', // 深色模式
  AUTO: 'auto', // 跟随系统
} as const;

// 音质等级
export const QUALITY_LEVEL = {
  STANDARD: 'standard', // 标准
  HIGHER: 'higher', // 较高
  EXHIGH: 'exhigh', // 极高
} as const;

// 导出类型
export type PlayMode = typeof PLAY_MODE[keyof typeof PLAY_MODE];
export type ThemeMode = typeof THEME_MODE[keyof typeof THEME_MODE];
export type QualityLevel = typeof QUALITY_LEVEL[keyof typeof QUALITY_LEVEL];