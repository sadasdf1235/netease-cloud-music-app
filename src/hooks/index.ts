/**
 * Hooks导出索引文件
 * @description 统一导出所有自定义Hooks，方便在项目中引用
 */

// 导出本地存储Hook
export { default as useLocalStorage } from './useLocalStorage';

// 导出播放器Hook
export { default as usePlayer } from './usePlayer';

// 导出主题管理Hook
export { default as useTheme } from './useTheme';