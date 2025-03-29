/**
 * 类型定义导出索引
 * @description 统一导出所有类型定义，避免重复导入和循环引用
 */

// 导出API公共类型
export * from './api/common';

// 导出模型类型（优先）
export * from './album';
export * from './artist';
export * from './comment';
export * from './mv';
export * from './playlist';
export * from './recommend';
export * from './song';
export * from './toplist';

// 使用重命名避免名称冲突
import * as UserTypes from './user';
import * as UserApiTypes from './api/user';
export { UserTypes }; 
// 选择性导出用户API类型
export { 
  UserDetailResponse,
  UserPlaylistResponse,
  LoginResponse
} from './api/user';

// 导出其他API响应类型
export * from './api/album';
export * from './api/artist';
export * from './api/music';
export * from './api/playlist';
export * from './api/search';

// 导出组件类型
export * from './components';

// 导出状态类型
export * from './store/player';

// 注意:
// 1. 目前有些类型在模型和API目录中重复定义，后续需要清理
// 2. API模块应该统一使用 /types/api 中的类型
// 3. 组件应该统一使用 /types/models 中的类型