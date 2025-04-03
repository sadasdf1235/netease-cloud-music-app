/**
 * 播放器相关组件导出文件
 * @description 统一导出播放器相关组件，方便统一导入
 */

import PlayerControls from './PlayerControls.vue';
import PlayerInfo from './PlayerInfo.vue';
import PlayerLyric from './PlayerLyric.vue';
import PlayerProgress from './PlayerProgress.vue';
import PlayerVolume from './PlayerVolume.vue';
import MiniPlayer from './MiniPlayer.vue';
// 不导入index.vue，因为它是主入口组件

export {
  PlayerControls,
  PlayerInfo,
  PlayerLyric,
  PlayerProgress,
  PlayerVolume,
  MiniPlayer
};

/**
 * 默认导出所有播放器相关组件
 */
export default {
  PlayerControls,
  PlayerInfo,
  PlayerLyric,
  PlayerProgress,
  PlayerVolume,
  MiniPlayer
};