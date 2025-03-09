<script setup lang="ts">
import { usePlayerStore } from '@/stores/player';
import { formatTime } from '@/utils/format';
import {
  StepBackwardOutlined,
  StepForwardOutlined,
  PlayCircleOutlined,
  PauseCircleOutlined,
  SoundOutlined,
  RetweetOutlined,
  OrderedListOutlined,
  HeartOutlined,
  HeartFilled,
} from '@ant-design/icons-vue';

const playerStore = usePlayerStore();

// 播放器状态
const {
  currentSong,
  playing,
  currentTime,
  duration,
  volume,
  playMode,
  playlist,
} = storeToRefs(playerStore);

// 播放模式列表
const playModeList = [
  { key: 'sequence', label: '顺序播放' },
  { key: 'loop', label: '单曲循环' },
  { key: 'random', label: '随机播放' },
];

// 切换播放模式
const togglePlayMode = () => {
  const currentIndex = playModeList.findIndex((mode) => mode.key === playMode.value);
  const nextIndex = (currentIndex + 1) % playModeList.length;
  playerStore.setPlayMode(playModeList[nextIndex].key);
};

// 进度条相关
const sliderInput = ref(false);
const progressValue = computed(() => {
  return (currentTime.value / duration.value) * 100 || 0;
});

const handleProgressChange = (value: number) => {
  const time = (value / 100) * duration.value;
  playerStore.seek(time);
};

// 音量控制相关
const volumeVisible = ref(false);
const handleVolumeChange = (value: number) => {
  playerStore.setVolume(value / 100);
};

// 播放列表相关
const playlistVisible = ref(false);
const handleSongClick = (song: any) => {
  playerStore.play(song);
};
const handleRemoveSong = (song: any) => {
  playerStore.removeSong(song);
};
const handleClearPlaylist = () => {
  playerStore.clearPlaylist();
};
</script>

<template>
  <div class="player">
    <!-- 左侧：歌曲信息 -->
    <div class="song-info" v-if="currentSong">
      <img
        class="cover"
        :src="currentSong.album.picUrl + '?param=60y60'"
        :alt="currentSong.name"
      />
      <div class="info">
        <div class="name text-ellipsis">{{ currentSong.name }}</div>
        <div class="artist text-ellipsis">{{ currentSong.artists[0].name }}</div>
      </div>
      <div class="actions">
        <heart-outlined v-if="!currentSong.liked" />
        <heart-filled v-else class="liked" />
      </div>
    </div>
    <div class="song-info empty" v-else>
      <div class="empty-tip">还没有播放的音乐</div>
    </div>

    <!-- 中间：播放控制 -->
    <div class="player-control">
      <div class="control-buttons">
        <step-backward-outlined class="btn prev" @click="playerStore.prev" />
        <div class="btn play" @click="playerStore.togglePlay">
          <play-circle-outlined v-if="!playing" />
          <pause-circle-outlined v-else />
        </div>
        <step-forward-outlined class="btn next" @click="playerStore.next" />
      </div>
      <div class="progress-bar">
        <span class="time">{{ formatTime(currentTime) }}</span>
        <a-slider
          :value="progressValue"
          :max="100"
          :tooltip-visible="false"
          @change="handleProgressChange"
          @mousedown="sliderInput = true"
          @mouseup="sliderInput = false"
        />
        <span class="time">{{ formatTime(duration) }}</span>
      </div>
    </div>

    <!-- 右侧：功能按钮 -->
    <div class="player-actions">
      <a-dropdown v-model:visible="volumeVisible" placement="top">
        <sound-outlined class="btn" />
        <template #overlay>
          <div class="volume-slider">
            <a-slider
              vertical
              :value="volume * 100"
              :max="100"
              :tooltip-visible="false"
              @change="handleVolumeChange"
            />
          </div>
        </template>
      </a-dropdown>

      <retweet-outlined
        class="btn mode"
        :title="playModeList.find((mode) => mode.key === playMode)?.label"
        @click="togglePlayMode"
      />

      <a-dropdown v-model:visible="playlistVisible" placement="topRight">
        <ordered-list-outlined class="btn" />
        <template #overlay>
          <div class="playlist-panel">
            <div class="header">
              <div class="title">
                当前播放
                <span class="count">({{ playlist.length }})</span>
              </div>
              <a-button type="link" @click="handleClearPlaylist">清空</a-button>
            </div>
            <div class="list">
              <div
                v-for="song in playlist"
                :key="song.id"
                class="song-item"
                :class="{ active: currentSong?.id === song.id }"
                @click="handleSongClick(song)"
              >
                <div class="song-name text-ellipsis">{{ song.name }}</div>
                <div class="song-artist text-ellipsis">{{ song.artists[0].name }}</div>
                <div class="actions">
                  <close-outlined @click.stop="handleRemoveSong(song)" />
                </div>
              </div>
            </div>
          </div>
        </template>
      </a-dropdown>
    </div>
  </div>
</template>

<style lang="less" scoped>
.player {
  .flex-between();
  height: 100%;
  padding: 0 @padding-lg;
  background-color: @component-background;
  border-top: 1px solid @border-color-split;

  // 左侧：歌曲信息
  .song-info {
    .flex-start();
    width: 280px;
    gap: @margin-sm;

    &.empty {
      .flex-center();
      color: @text-color-secondary;
    }

    .cover {
      width: 48px;
      height: 48px;
      border-radius: @border-radius-base;
    }

    .info {
      flex: 1;
      min-width: 0;

      .name {
        color: @text-color;
        font-size: @font-size-base;
      }

      .artist {
        color: @text-color-secondary;
        font-size: @font-size-sm;
      }
    }

    .actions {
      .flex-center();
      font-size: 16px;
      cursor: pointer;
      color: @text-color-secondary;

      &:hover {
        color: @text-color;
      }

      .liked {
        color: @primary-color;
      }
    }
  }

  // 中间：播放控制
  .player-control {
    flex: 1;
    max-width: 680px;
    padding: 0 @padding-lg;

    .control-buttons {
      .flex-center();
      gap: @margin-lg;
      margin-bottom: @margin-xs;

      .btn {
        cursor: pointer;
        transition: all 0.3s;

        &:hover {
          color: @primary-color;
        }

        &.play {
          font-size: 32px;
          color: @primary-color;
        }

        &.prev,
        &.next {
          font-size: 24px;
        }
      }
    }

    .progress-bar {
      .flex-center();
      gap: @margin-xs;

      .time {
        color: @text-color-secondary;
        font-size: @font-size-sm;
        width: 40px;
        text-align: center;
      }

      :deep(.ant-slider) {
        flex: 1;
        margin: 0;

        .ant-slider-rail {
          background-color: @border-color-split;
        }

        .ant-slider-track {
          background-color: @primary-color;
        }

        .ant-slider-handle {
          border-color: @primary-color;
        }
      }
    }
  }

  // 右侧：功能按钮
  .player-actions {
    .flex-end();
    width: 280px;
    gap: @margin-lg;

    .btn {
      font-size: 20px;
      cursor: pointer;
      color: @text-color-secondary;

      &:hover {
        color: @text-color;
      }

      &.mode {
        font-size: 16px;
      }
    }
  }
}

// 音量滑块
.volume-slider {
  padding: @padding-sm;
  height: 120px;
  background-color: @component-background;
  border-radius: @border-radius-base;
  box-shadow: @box-shadow-base;

  :deep(.ant-slider) {
    height: 100%;
    margin: 0;

    .ant-slider-rail {
      background-color: @border-color-split;
    }

    .ant-slider-track {
      background-color: @primary-color;
    }

    .ant-slider-handle {
      border-color: @primary-color;
    }
  }
}

// 播放列表面板
.playlist-panel {
  width: 480px;
  max-height: 480px;
  background-color: @component-background;
  border-radius: @border-radius-base;
  box-shadow: @box-shadow-base;

  .header {
    .flex-between();
    padding: @padding-sm @padding-md;
    border-bottom: 1px solid @border-color-split;

    .title {
      color: @text-color;
      font-size: @font-size-lg;

      .count {
        color: @text-color-secondary;
        font-size: @font-size-base;
      }
    }
  }

  .list {
    height: 420px;
    overflow-y: auto;

    .song-item {
      .flex-between();
      padding: @padding-sm @padding-md;
      cursor: pointer;

      &:hover {
        background-color: @item-hover-bg;

        .actions {
          opacity: 1;
        }
      }

      &.active {
        color: @primary-color;
      }

      .song-name {
        flex: 1;
        min-width: 0;
        padding-right: @padding-sm;
      }

      .song-artist {
        width: 120px;
        color: @text-color-secondary;
      }

      .actions {
        opacity: 0;
        transition: opacity 0.3s;

        .anticon {
          padding: @padding-xs;
          color: @text-color-secondary;

          &:hover {
            color: @text-color;
          }
        }
      }
    }
  }
}
</style>