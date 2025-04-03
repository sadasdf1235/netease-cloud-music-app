/**
 * 类型定义导出索引
 * @description 统一导出所有类型定义，提供清晰的导入路径
 */

//===================================================
// 核心模型类型 - 推荐使用这些类型定义
//===================================================

// 音乐相关核心模型（歌曲、歌手、专辑等）
export * from './models/music';

// 播放器相关类型
export * from './store/player';

//===================================================
// API响应类型 - 用于网络请求返回的数据类型
//===================================================

// API公共类型（如分页、通用响应等）
export * from './api/common';

// 各模块API响应类型
export * from './api/album';
export * from './api/artist';
export * from './api/music';
export * from './api/playlist';
export * from './api/search';
export * from './api/user';

//===================================================
// UI组件类型 - 用于界面组件的props和事件
//===================================================

// 组件类型
export * from './components';

//===================================================
// 其他类型 - 兼容性导出，新代码推荐使用models中的类型
//===================================================

// 以下导出为兼容旧代码，新代码应使用models/music中的类型
export * from './playlist';
export * from './recommend';
export * from './toplist';

// 用户相关类型（使用命名空间避免冲突）
import * as UserTypes from './user';
export { UserTypes };

/**
 * @deprecated
 * 以下类型可能在多处定义，并已被整合到统一模型中
 * 为保持兼容性暂时保留，新代码中推荐直接从models中导入
 */
export {
  UserDetailResponse,
  UserPlaylistResponse,
  LoginResponse
} from './api/user';