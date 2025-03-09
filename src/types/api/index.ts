/**
 * API类型定义导出索引
 * @description 统一导出所有API相关的类型定义
 */

// 导出通用API响应类型
export type { ApiResponse } from './common';

// 导出音乐API类型
export * from './music';

// 导出专辑API类型
export * from './album';

// 导出艺术家API类型
export * from './artist';

// 导出搜索API类型
export * from './search';

// 导出用户API类型
export * from './user';

// 导出歌单API类型
export * from './playlist';