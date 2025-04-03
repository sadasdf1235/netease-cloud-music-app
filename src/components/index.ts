/**
 * 组件统一导出文件
 * @description 统一导出所有组件，方便在项目中引用
 */

// 导出各模块组件
export * from './comment';
export * from './layout';
export * from './music';
export * from './navigation';
export * from './player/components';
export * from './playlist';
export * from './ui';
export * from './user';

// 导入所有模块
import * as CommentComponents from './comment';
import * as LayoutComponents from './layout';
import * as MusicComponents from './music';
import * as NavigationComponents from './navigation';
import * as PlayerComponents from './player/components';
import * as PlaylistComponents from './playlist';
import * as UiComponents from './ui';
import * as UserComponents from './user';

/**
 * 所有组件集合
 * 按模块分类组织
 */
export const Components = {
  Comment: CommentComponents,
  Layout: LayoutComponents,
  Music: MusicComponents,
  Navigation: NavigationComponents,
  Player: PlayerComponents,
  Playlist: PlaylistComponents,
  UI: UiComponents,
  User: UserComponents
};

export default Components;