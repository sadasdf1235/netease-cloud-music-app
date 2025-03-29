/**
 * 类型定义导出索引
 * @description 统一导出所有类型定义，避免重复导入和循环引用
 */

// 导出API公共类型
export * from './api/common';

// 导出统一的音乐相关类型（新增）
export * from './models/music';

// 导出其他模型类型
export * from './playlist';
export * from './recommend';
export * from './toplist';

// 使用重命名避免名称冲突
import * as UserTypes from './user';
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
// 1. 暂时保留旧的类型导出，以保证向后兼容
// 2. 后续应统一使用 ./models/music 中的类型定义
// 3. 后续清理工作中应移除重复的类型定义文件