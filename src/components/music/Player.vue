<template>
  <div
    class="player bg-white dark:bg-dark-800 border-t border-gray-200 dark:border-gray-700 p-4"
  >
    <!-- 音频元素 -->
    <audio
      ref="audioRef"
      :src="currentSongUrl"
      @timeupdate="onTimeUpdate"
      @ended="onEnded"
      @canplay="onCanPlay"
      @error="onError"
      @play="onPlay"
      @pause="onPause"
      @loadeddata="onLoadedData"
      @loadedmetadata="onLoadedMetadata"
      preload="auto"
      crossorigin="anonymous"
    ></audio>

    <!-- 当前播放歌曲信息 -->
    <div v-if="playerStore.currentSong" class="flex items-center mb-4">
      <!-- 歌曲封面 -->
      <div class="w-16 h-16 rounded overflow-hidden mr-4 flex-shrink-0">
        <img
          :src="playerStore.currentSong.album.picUrl + '?param=64y64'"
          :alt="playerStore.currentSong.name"
          class="w-full h-full object-cover"
        />
      </div>

      <!-- 歌曲信息 -->
      <div class="flex-1 min-w-0">
        <div class="text-base font-medium truncate">
          {{ playerStore.currentSong.name }}
        </div>
        <div class="text-sm text-gray-500 truncate">
          {{ playerStore.currentSong.artists.map((a) => a.name).join(" / ") }}
        </div>
      </div>

      <!-- 喜欢按钮 -->
      <button class="icon-btn mr-2">
        <div class="i-carbon-favorite text-gray-400 hover:text-red-500"></div>
      </button>

      <!-- 播放列表按钮 -->
      <button class="icon-btn" @click="togglePlaylistPanel">
        <div class="i-carbon-list text-gray-400 hover:text-primary"></div>
      </button>
    </div>
    
    <!-- 调试与状态区域 -->
    <div class="bg-gray-50 dark:bg-dark-800 p-3 mb-4 rounded-lg shadow-sm text-xs">
      <div class="flex flex-wrap gap-x-4 gap-y-2 mb-2">
        <div class="flex items-center">
          <span class="text-gray-500 mr-1">歌曲:</span>
          <span class="font-medium">{{ playerStore.currentSong?.name || '无' }}</span>
        </div>
        <div class="flex items-center">
          <span class="text-gray-500 mr-1">状态:</span>
          <span class="font-medium" :class="{'text-primary': playerStore.playing}">{{ playerStore.playing ? '播放中' : '暂停' }}</span>
        </div>
        <div class="flex items-center">
          <span class="text-gray-500 mr-1">进度:</span>
          <span class="font-medium">{{ Math.round(playerStore.progress) }}%</span>
        </div>
        <div class="flex items-center">
          <span class="text-gray-500 mr-1">URL:</span>
          <span class="font-medium truncate max-w-[200px]">{{ currentSongUrl || '未设置' }}</span>
        </div>
      </div>
      <div v-if="audioError" class="text-red-500 mb-2 p-1 bg-red-50 dark:bg-red-900/20 rounded border-l-2 border-red-500">
        <div class="flex items-center">
          <div class="i-carbon-warning-filled mr-1"></div>
          <span>{{ audioError }}</span>
        </div>
      </div>
      <div class="flex gap-2">
        <button @click="testPlayDirectly" class="bg-primary text-white px-2 py-1 rounded text-xs hover:bg-primary/90 transition-colors flex items-center">
          <div class="i-carbon-play-filled mr-1"></div>
          <span>测试直接播放</span>
        </button>
        <button @click="updatePlayButtonState" class="bg-gray-200 dark:bg-dark-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded text-xs hover:bg-gray-300 dark:hover:bg-dark-600 transition-colors flex items-center">
          <div class="i-carbon-renew mr-1"></div>
          <span>刷新UI</span>
        </button>
      </div>
    </div>

    <!-- 进度条 -->
    <div class="mb-4">
      <div class="flex justify-between text-xs text-gray-500 mb-1">
        <span>{{ formatTime(playerStore.currentTime) }}</span>
        <span>{{ formatTime(playerStore.duration) }}</span>
      </div>
      <div
        class="h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden cursor-pointer"
        @click="onProgressBarClick"
        ref="progressBarRef"
      >
        <div
          class="h-full bg-primary"
          :style="{ width: `${playerStore.progress}%` }"
        ></div>
      </div>
    </div>

    <!-- 播放控制区域 -->
    <div class="flex items-center justify-center gap-4">
      <!-- 播放模式 -->
      <button class="icon-btn" @click="togglePlayMode">
        <div
          v-if="!playerStore.loop && !playerStore.random"
          class="i-carbon-repeat"
          title="顺序播放"
        ></div>
        <div
          v-else-if="playerStore.loop"
          class="i-carbon-repeat-one"
          title="单曲循环"
        ></div>
        <div
          v-else-if="playerStore.random"
          class="i-carbon-shuffle"
          title="随机播放"
        ></div>
      </button>

      <!-- 上一首 -->
      <button class="icon-btn" @click="playerStore.prev()">
        <div class="i-carbon-previous-filled"></div>
      </button>

      <!-- 播放/暂停 -->
      <button
        class="w-12 h-12 rounded-full bg-primary flex-center text-white"
        @click="togglePlay"
      >
        <div
          v-if="playerStore.playing"
          class="i-carbon-pause-filled text-xl"
        ></div>
        <div v-else class="i-carbon-play-filled text-xl"></div>
      </button>

      <!-- 下一首 -->
      <button class="icon-btn" @click="playerStore.next()">
        <div class="i-carbon-next-filled"></div>
      </button>

      <!-- 音量控制 -->
      <div class="flex items-center gap-2">
        <button class="icon-btn" @click="toggleMute">
          <div
            v-if="isMuted || playerStore.volume === 0"
            class="i-carbon-volume-mute"
          ></div>
          <div
            v-else-if="playerStore.volume > 50"
            class="i-carbon-volume-up"
          ></div>
          <div v-else class="i-carbon-volume-down"></div>
        </button>
        <input
          type="range"
          min="0"
          max="100"
          step="1"
          :value="playerStore.volume"
          @input="onVolumeChange"
          class="w-20"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from "vue";
import { usePlayerStore } from "@/stores/player";
import { getSongUrl as apiGetSongUrl } from "@/api/modules/music-song";

// 播放器组件主要变量
const audioRef = ref<HTMLAudioElement | null>(null);
const progressBarRef = ref<HTMLDivElement | null>(null);
const playerStore = usePlayerStore();
const currentSongUrl = ref<string>("");
const audioLoaded = ref(false);
const audioError = ref<string | null>(null);
const isMuted = ref(false);
const showPlaylistPanel = ref(false);

/**
 * 获取歌曲URL的函数
 * @param id 歌曲ID
 * @returns 返回歌曲的播放地址
 * @description 首先尝试通过API获取歌曲URL，如果失败则使用备用URL
 */
 async function getSongUrl(id: number): Promise<string> {
  try {
    // 使用项目中的API模块获取歌曲URL
    console.log("开始获取歌曲URL, ID:", id);
    const response = await apiGetSongUrl(id);
    console.log("获取歌曲URL响应:", response);
    
    // 正确处理API返回的数据结构
    if (response && response.data && response.data.length > 0) {
      const url = response.data[0].url;
      if (url) {
        console.log("获取到真实播放地址:", url);
        return url;
      }
    }
    
    // 如果API没有返回有效URL，使用备用方法
    console.log("API未返回有效URL，使用备用URL");
    return `https://music.163.com/song/media/outer/url?id=${id}.mp3`;
  } catch (error) {
    console.error("获取歌曲URL失败:", error);
    // 使用备用方法
    return `https://music.163.com/song/media/outer/url?id=${id}.mp3`;
  }
}

// 监听当前歌曲变化
watch(
  () => playerStore.currentSong,
  async (newSong) => {
    if (newSong) {
      console.log("监听到currentSong变化，歌曲ID:", newSong.id);
      
      try {
        // 获取真实播放地址
        const response = await apiGetSongUrl(newSong.id);
        
        // 正确处理API返回的数据结构
        if (response && response.data && response.data.length > 0) {
          const url = response.data[0].url;
          if (url) {
            currentSongUrl.value = url;
            console.log("获取到真实播放地址:", url);
          } else {
            // 如果API没有返回有效URL，使用备用方法
            currentSongUrl.value = `https://music.163.com/song/media/outer/url?id=${newSong.id}.mp3`;
            console.log("API未返回有效URL，使用备用URL:", currentSongUrl.value);
          }
        } else {
          // 如果API没有返回有效数据，使用备用方法
          currentSongUrl.value = `https://music.163.com/song/media/outer/url?id=${newSong.id}.mp3`;
          console.log("API未返回有效数据，使用备用URL:", currentSongUrl.value);
        }
        
        // 重置错误状态
        audioError.value = null;
        
        if (audioRef.value) {
          // 确保设置src并加载
          audioRef.value.src = currentSongUrl.value;
          audioRef.value.load();
          
          // 如果当前状态是播放，尝试播放
          if (playerStore.playing) {
            try {
              console.log("尝试自动播放");
              // 使用setTimeout确保浏览器有时间处理音频加载
              setTimeout(() => {
                if (audioRef.value) {
                  const playPromise = audioRef.value.play();
                  if (playPromise !== undefined) {
                    playPromise.catch(err => {
                      console.error("自动播放失败:", err);
                      // 不显示alert，可能会阻碍用户体验
                      console.log("需要用户交互才能播放音频，请点击播放按钮");
                    });
                  }
                }
              }, 300);
            } catch (error) {
              console.error("播放出错:", error);
            }
          }
        }
      } catch (error) {
        console.error("设置歌曲URL失败:", error);
        audioError.value = "获取歌曲URL失败";
        // 使用备用URL
        currentSongUrl.value = `https://music.163.com/song/media/outer/url?id=${newSong.id}.mp3`;
        if (audioRef.value) {
          audioRef.value.src = currentSongUrl.value;
          audioRef.value.load();
        }
      }
    } else {
      console.log("当前没有选中的歌曲");
      currentSongUrl.value = "";
      if (audioRef.value) {
        audioRef.value.src = "";
      }
    }
  },
  { immediate: true } // 立即执行一次，确保初始化时加载当前歌曲
);

// 监听播放状态变化
watch(
  () => playerStore.playing,
  async (isPlaying) => {
    console.log("监听到播放状态变化:", isPlaying ? "播放" : "暂停");
    if (audioRef.value) {
      if (isPlaying) {
        try {
          console.log("尝试播放音频");
          // 确保当前URL已设置
          if (!audioRef.value.src || audioRef.value.src !== currentSongUrl.value) {
            if (playerStore.currentSong) {
              // 获取真实播放地址
              const url = await getSongUrl(playerStore.currentSong.id);
              currentSongUrl.value = url;
              audioRef.value.src = currentSongUrl.value;
              audioRef.value.load();
            }
          }
          
          // 尝试播放
          const playResult = audioRef.value.play();
          if (playResult) {
            playResult.catch(err => {
              console.error("播放失败:", err);
              // 不使用alert，改为在控制台输出错误
              console.log("需要用户交互才能播放音频，请点击播放按钮");
              // 如果播放失败，更新状态
              if (playerStore.playing) {
                playerStore.togglePlay();
              }
            });
          }
        } catch (error) {
          console.error("播放音频时出错:", error);
          // 如果播放出错，更新状态
          if (playerStore.playing) {
            playerStore.togglePlay();
          }
        }
      } else {
        console.log("暂停音频");
        audioRef.value.pause();
      }
    } else {
      console.error("音频元素未初始化");
    }
  }
);

// 监听当前时间变化
watch(
  () => playerStore.currentTime,
  (newTime) => {
    if (audioRef.value && Math.abs(audioRef.value.currentTime - newTime) > 1) {
      audioRef.value.currentTime = newTime;
    }
  }
);

// 时间更新事件
function onTimeUpdate(e: Event) {
  if (!audioRef.value) return;
  
  const currentTime = audioRef.value.currentTime;
  const duration = audioRef.value.duration || 0;
  
  // 更新播放时间
  playerStore.updateCurrentTime(currentTime);
  
  // 计算进度百分比
  if (duration > 0) {
    const progress = (currentTime / duration) * 100;
    playerStore.setProgress(progress);
    console.log("更新播放进度:", progress.toFixed(2) + "%");
  }
}

// 加载元数据事件
function onLoadedMetadata(e: Event) {
  if (!audioRef.value) return;
  
  const duration = audioRef.value.duration || 0;
  console.log("音频加载元数据，时长:", duration);
  
  // 更新总时长
  playerStore.updateDuration(duration);
  
  // 重置进度
  playerStore.setProgress(0);
}

// 可以播放事件
function onCanPlay() {
  console.log("音频可以开始播放");
  audioLoaded.value = true;
  audioError.value = null;
}

// 播放开始事件
function onPlay() {
  console.log("音频开始播放");
  if (!playerStore.playing) {
    console.log("更新播放状态为true");
    playerStore.togglePlay();
  }
}

// 暂停事件
function onPause() {
  console.log("音频暂停");
  if (playerStore.playing) {
    console.log("更新播放状态为false");
    playerStore.togglePlay();
  }
}

// 播放结束事件
function onEnded() {
  console.log("播放结束，切换到下一首");
  
  // 更新进度为100%
  playerStore.setProgress(100);
  playerStore.updateCurrentTime(playerStore.duration);
  
  // 切换到下一首
  playerStore.next();
}

// 音频加载完成事件
function onLoadedData() {
  console.log("音频数据已加载");
  if (audioRef.value) {
    const duration = audioRef.value.duration || 0;
    playerStore.updateDuration(duration);
    audioLoaded.value = true;
  }
}

// 错误事件处理
function onError(e: Event) {
  console.error("音频播放错误", e);
  const audio = audioRef.value;
  if (audio && audio.error) {
    // 获取更详细的错误信息
    let errorDetails = "";
    switch(audio.error.code) {
      case 1: errorDetails = "获取资源被中止"; break;
      case 2: errorDetails = "网络错误"; break;
      case 3: errorDetails = "解码错误"; break;
      case 4: errorDetails = "资源不可用或格式不支持"; break;
      default: errorDetails = "未知错误";
    }
    
    const errorMsg = `播放错误: ${errorDetails} (${audio.error.code})`;
    console.error(errorMsg, audio.error);
    audioError.value = errorMsg;
    
    // 尝试使用备用URL
    if (playerStore.currentSong) {
      console.log("尝试使用备用URL播放");
      const backupUrl = `https://music.163.com/song/media/outer/url?id=${playerStore.currentSong.id}.mp3`;
      if (currentSongUrl.value !== backupUrl) {
        currentSongUrl.value = backupUrl;
        audio.src = backupUrl;
        audio.load();
        
        // 如果当前状态是播放，尝试播放
        if (playerStore.playing) {
          setTimeout(() => {
            if (audioRef.value) {
              audioRef.value.play().catch(err => {
                console.error("备用URL播放失败:", err);
                audioError.value = "备用URL播放失败，请尝试点击播放按钮";
              });
            }
          }, 300); // 增加延迟，确保有足够时间加载
        }
      }
    }
  }
  
  // 如果当前是播放状态，切换到暂停状态
  if (playerStore.playing) {
    playerStore.togglePlay();
  }
}

/**
 * 播放/暂停切换函数
 * @description 处理播放和暂停状态的切换，包括错误处理和状态同步
 */
 function togglePlay() {
  console.log("切换播放状态");
  
  if (!audioRef.value) {
    console.error("音频元素不存在");
    audioError.value = "播放器初始化失败，请刷新页面";
    return;
  }
  
  if (playerStore.playing) {
    // 当前是播放状态，暂停
    console.log("暂停播放");
    audioRef.value.pause();
    playerStore.togglePlay(); // 设置为暂停状态
  } else {
    // 当前是暂停状态
    if (!playerStore.currentSong) {
      console.log("当前没有选中的歌曲");
      audioError.value = "请先选择要播放的歌曲";
      return;
    }
    
    // 确保audio元素的src已设置
    if (!audioRef.value.src || audioRef.value.src === '' || !audioRef.value.src.includes(playerStore.currentSong.id.toString())) {
      // 重置错误状态
      audioError.value = null;
      
      getSongUrl(playerStore.currentSong.id).then(url => {
        currentSongUrl.value = url;
        audioRef.value!.src = url;
        audioRef.value!.load();
        console.log("重新设置音频URL:", url);
        
        // 先设置播放状态
        playerStore.togglePlay(); // 设置为播放状态
        
        // 开始播放
        console.log("开始播放");
        try {
          const playPromise = audioRef.value!.play();
          
          if (playPromise !== undefined) {
            playPromise.catch(error => {
              console.error("播放失败:", error);
              // 如果播放失败，恢复暂停状态
              if (playerStore.playing) {
                playerStore.togglePlay();
              }
              // 显示错误信息
              audioError.value = "播放失败，请再次点击播放按钮";
            });
          }
        } catch (error) {
          console.error("播放出错:", error);
          audioError.value = "播放出错，请再次点击播放按钮";
          // 恢复暂停状态
          if (playerStore.playing) {
            playerStore.togglePlay();
          }
        }
      }).catch(error => {
        console.error("获取歌曲URL失败:", error);
        audioError.value = "获取歌曲URL失败，请检查网络连接";
        // 使用备用URL
        const backupUrl = `https://music.163.com/song/media/outer/url?id=${playerStore.currentSong.id}.mp3`;
        currentSongUrl.value = backupUrl;
        audioRef.value!.src = backupUrl;
        audioRef.value!.load();
        
        // 先设置播放状态
        playerStore.togglePlay(); // 设置为播放状态
        
        // 尝试播放
        try {
          const playPromise = audioRef.value!.play();
          if (playPromise !== undefined) {
            playPromise.catch(err => {
              console.error("备用URL播放失败:", err);
              // 如果播放失败，恢复暂停状态
              if (playerStore.playing) {
                playerStore.togglePlay();
              }
              audioError.value = "播放失败，可能需要用户交互";
            });
          }
        } catch (err) {
          console.error("备用URL播放出错:", err);
          audioError.value = "播放出错，请稍后再试";
          // 恢复暂停状态
          if (playerStore.playing) {
            playerStore.togglePlay();
          }
        }
      });
    } else {
      // 重置错误状态
      audioError.value = null;
      
      // 先设置播放状态
      playerStore.togglePlay(); // 设置为播放状态
      
      // 开始播放
      console.log("开始播放");
      try {
        const playPromise = audioRef.value.play();
        
        if (playPromise !== undefined) {
          playPromise.catch(error => {
            console.error("播放失败:", error);
            // 如果播放失败，恢复暂停状态
            if (playerStore.playing) {
              playerStore.togglePlay();
            }
            // 显示错误信息
            audioError.value = "播放失败，请再次点击播放按钮";
          });
        }
      } catch (error) {
        console.error("播放出错:", error);
        audioError.value = "播放出错，请再次点击播放按钮";
        // 恢复暂停状态
        if (playerStore.playing) {
          playerStore.togglePlay();
        }
      }
    }
  }
}

// 音量控制
function onVolumeChange(e: Event) {
  const value = Number((e.target as HTMLInputElement).value);
  playerStore.setVolume(value);
  if (audioRef.value) {
    audioRef.value.volume = value / 100;
  }
}

// 静音切换
function toggleMute() {
  if (audioRef.value) {
    isMuted.value = !isMuted.value;
    audioRef.value.muted = isMuted.value;
  }
}

// 点击进度条事件
function onProgressBarClick(e: MouseEvent) {
  if (!progressBarRef.value || !audioRef.value || playerStore.duration <= 0) {
    console.log("进度条点击无效：进度条元素不存在或音频未加载");
    return;
  }
  
  const rect = progressBarRef.value.getBoundingClientRect();
  const percent = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
  
  // 设置进度
  const newTime = percent * playerStore.duration;
  console.log("点击进度条，设置新时间:", newTime, "秒，百分比:", (percent * 100).toFixed(2) + "%");
  
  // 更新播放器状态
  playerStore.setProgress(percent * 100);
  playerStore.updateCurrentTime(newTime);
  
  // 同步到音频元素
  audioRef.value.currentTime = newTime;
}

// 切换播放列表面板
function togglePlaylistPanel() {
  showPlaylistPanel.value = !showPlaylistPanel.value;
}

// 切换播放模式
function togglePlayMode() {
  console.log("切换播放模式");
  // 顺序播放 -> 单曲循环 -> 随机播放 -> 顺序播放
  if (!playerStore.loop && !playerStore.random) {
    // 当前是顺序播放，切换到单曲循环
    playerStore.toggleLoop();
    console.log("切换到单曲循环");
  } else if (playerStore.loop) {
    // 当前是单曲循环，切换到随机播放
    playerStore.toggleLoop(); // 关闭循环
    playerStore.toggleRandom(); // 开启随机
    console.log("切换到随机播放");
  } else if (playerStore.random) {
    // 当前是随机播放，切换到顺序播放
    playerStore.toggleRandom(); // 关闭随机
    console.log("切换到顺序播放");
  }
}

// 直接测试播放功能
async function testPlayDirectly() {
  console.log("测试直接播放");

  try {
    if (!playerStore.currentSong) {
      console.error("没有当前歌曲");
      audioError.value = "没有当前歌曲可播放";
      return;
    }
    
    // 重置错误状态
    audioError.value = null;
    audioLoaded.value = false;
    
    // 获取歌曲URL
    try {
      console.log("尝试通过API获取歌曲URL");
      const url = await apiGetSongUrl(playerStore.currentSong.id);
      
      if (url && url.data && url.data.length > 0 && url.data[0].url) {
        currentSongUrl.value = url.data[0].url;
        console.log("成功获取API歌曲URL:", currentSongUrl.value);
      } else {
        // 如果API未返回有效URL，使用备用URL
        currentSongUrl.value = `https://music.163.com/song/media/outer/url?id=${playerStore.currentSong.id}.mp3`;
        console.log("API未返回有效URL，使用备用URL:", currentSongUrl.value);
      }
    } catch (error) {
      console.error("通过API获取URL失败，使用备用URL", error);
      currentSongUrl.value = `https://music.163.com/song/media/outer/url?id=${playerStore.currentSong.id}.mp3`;
    }
    
    // 设置音频元素
    if (audioRef.value) {
      console.log("设置音频源:", currentSongUrl.value);
      audioRef.value.src = currentSongUrl.value;
      audioRef.value.load();
      
      // 尝试播放
      console.log("开始测试播放");
      try {
        const playPromise = audioRef.value.play();
        
        // 确保播放状态为播放
        if (!playerStore.playing) {
          playerStore.togglePlay();
        }
        
        // 处理播放承诺
        if (playPromise !== undefined) {
          await playPromise;
          console.log("测试播放成功");
        }
      } catch (playError) {
        console.error("测试播放失败:", playError);
        audioError.value = "测试播放失败: " + (playError instanceof Error ? playError.message : String(playError));
        
        // 如果播放失败但状态是播放，恢复为暂停状态
        if (playerStore.playing) {
          playerStore.togglePlay();
        }
      }
    } else {
      console.error("音频元素未初始化");
      audioError.value = "音频元素未初始化";
    }
  } catch (error) {
    console.error("测试播放出错:", error);
    audioError.value = "测试播放出错: " + (error instanceof Error ? error.message : String(error));
  }
}



// 更新UI状态
function updatePlayButtonState() {
  console.log("手动更新UI状态");
  // 确保组件响应性更新
  if (playerStore.playing) {
    console.log("当前状态为播放，尝试重新渲染");
    playerStore.togglePlay();
    setTimeout(() => {
      playerStore.togglePlay();
    }, 100);
  } else {
    console.log("当前状态为暂停，尝试重新渲染");
    playerStore.togglePlay();
    setTimeout(() => {
      playerStore.togglePlay();
    }, 100);
  }
}

// 格式化时间
function formatTime(time: number) {
  if (isNaN(time)) return '00:00';
  
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

// 组件挂载时初始化
onMounted(() => {
  console.log("Player组件已挂载");

  // 初始化音频元素
  if (audioRef.value) {
    // 设置初始音量
    audioRef.value.volume = playerStore.volume / 100;
    console.log("设置初始音量:", playerStore.volume);

    // 如果当前有歌曲，尝试加载
    if (playerStore.currentSong) {
      console.log("挂载时发现当前有歌曲:", playerStore.currentSong.name);
      
      // 获取URL并设置
      getSongUrl(playerStore.currentSong.id).then(url => {
        currentSongUrl.value = url;
        console.log("获取到歌曲URL:", currentSongUrl.value);
        
        // 设置音频源
        audioRef.value!.src = currentSongUrl.value;
        audioRef.value!.load();
        
        // 如果状态是播放，尝试播放
        if (playerStore.playing) {
          console.log("状态为播放，尝试播放");
          
          // 延迟一点播放，确保URL已设置
          setTimeout(() => {
            if (audioRef.value) {
              const playPromise = audioRef.value.play();
              if (playPromise !== undefined) {
                playPromise.catch(error => {
                  console.error("初始播放失败:", error);
                  console.log("需要用户交互才能播放音频，请点击播放按钮");
                });
              }
            }
          }, 500);
        }
      }).catch(error => {
        console.error("获取歌曲URL失败:", error);
        audioError.value = "获取歌曲URL失败";
      });
    }
  }
});
</script>
