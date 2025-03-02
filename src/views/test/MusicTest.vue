<template>
  <div class="music-test p-6 bg-gray-100 dark:bg-dark-900 min-h-screen">
    <h1 class="text-2xl font-bold mb-6 text-center">音乐播放测试页面</h1>

    <!-- 王力宏2025福利秀测试区域 -->
    <div class="bg-white dark:bg-dark-800 p-4 rounded-lg shadow-md mb-6">
      <h2 class="text-xl font-bold mb-4">王力宏2025福利秀</h2>
      <div class="flex flex-wrap gap-4 justify-center">
        <button
          class="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition"
          @click="
            playWanglihongSong(
              2677307316,
              'Turn the Lights Back On (Live)',
              '王力宏'
            )
          "
        >
          播放 Turn the Lights Back On
        </button>
        <button
          class="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition"
          @click="playWanglihongSong(2678621910, '爱错 (Live)', '王力宏')"
        >
          播放 爱错
        </button>
      </div>
    </div>

    <!-- 周杰伦测试区域 -->
    <div class="bg-white dark:bg-dark-800 p-4 rounded-lg shadow-md mb-6">
      <h2 class="text-xl font-bold mb-4">周杰伦歌曲测试</h2>
      <div class="flex flex-wrap gap-4 justify-center">
        <button
          class="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition"
          @click="playTestSong(1901371647, '晴天', '周杰伦')"
        >
          播放 晴天
        </button>
        <button
          class="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition"
          @click="playTestSong(1824045033, '爱错', '周杰伦')"
        >
          播放 爱错
        </button>
      </div>
    </div>

    <!-- 直接URL播放测试 -->
    <div class="bg-white dark:bg-dark-800 p-4 rounded-lg shadow-md mb-6">
      <h2 class="text-xl font-bold mb-4">直接URL播放测试</h2>
      <div class="flex flex-wrap gap-4 justify-center">
        <button
          class="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg transition"
          @click="playDirectUrl(1901371647)"
        >
          直接URL播放晴天
        </button>
      </div>
    </div>

    <!-- 当前播放信息 -->
    <div class="bg-white dark:bg-dark-800 p-4 rounded-lg shadow-md">
      <h2 class="text-xl font-bold mb-4">当前播放信息</h2>
      <div v-if="playerStore.currentSong" class="space-y-2">
        <p><strong>歌曲名:</strong> {{ playerStore.currentSong.name }}</p>
        <p>
          <strong>歌手:</strong>
          {{ playerStore.currentSong.artists.map((a) => a.name).join("/") }}
        </p>
        <p><strong>专辑:</strong> {{ playerStore.currentSong.album?.name }}</p>
        <p>
          <strong>播放状态:</strong>
          {{ playerStore.playing ? "播放中" : "已暂停" }}
        </p>
        <p>
          <strong>进度:</strong> {{ formatTime(playerStore.currentTime) }} /
          {{ formatTime(playerStore.duration) }}
        </p>
      </div>
      <div v-else class="text-gray-500">当前没有播放歌曲</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { usePlayerStore } from "@/stores/player";
import { getSongUrl } from "@/api/music";

const playerStore = usePlayerStore();

/**
 * 播放王力宏2025福利秀歌曲
 *
 * @param songId 歌曲ID
 * @param songName 歌曲名称
 * @param artistName 艺术家名称
 */
async function playWanglihongSong(
  songId: number,
  songName: string,
  artistName: string = "王力宏"
) {
  console.log("播放王力宏歌曲:", songName, "歌曲ID:", songId);

  // 创建歌曲对象
  const song = {
    id: songId,
    name: songName,
    artists: [{ id: 5346, name: artistName }],
    album: {
      id: 263591404,
      name: "王力宏2025福利秀",
      picUrl:
        "https://p2.music.126.net/HTf2Mgf2PEu7KRYTpsPJog==/109951170503959818.jpg",
    },
    duration: 250000, // 约4分钟
  };

  // 设置到播放列表并播放
  playerStore.setPlaylist([song]);
  playerStore.play(0);

  // 确保播放状态
  if (!playerStore.playing) {
    playerStore.togglePlay();
  }
}

/**
 * 播放测试歌曲
 *
 * @param songId 歌曲ID
 * @param songName 歌曲名称
 * @param artistName 艺术家名称
 */
function playTestSong(songId: number, songName: string, artistName: string) {
  console.log("播放测试歌曲:", songName, "歌曲ID:", songId);

  // 创建歌曲对象
  const song = {
    id: songId,
    name: songName,
    artists: [{ id: 6452, name: artistName }],
    album: {
      id: 34209,
      name: "测试专辑",
      picUrl:
        "https://p2.music.126.net/cUTk0ewrQtYGP2YpPZoUng==/3265549553028224.jpg",
    },
    duration: 240000, // 约4分钟
  };

  // 设置到播放列表并播放
  playerStore.setPlaylist([song]);
  playerStore.play(0);

  // 确保播放状态
  if (!playerStore.playing) {
    playerStore.togglePlay();
  }
}

/**
 * 使用直接URL播放歌曲
 *
 * @param songId 歌曲ID
 */
async function playDirectUrl(songId: number) {
  console.log("使用API获取URL播放歌曲,ID:", songId);

  try {
    // 通过API获取URL
    const res = await getSongUrl(songId, 320000);
    console.log("API响应:", res);

    // 详细打印API返回的数据结构，便于调试
    if (res.data) {
      console.log("res.data类型:", typeof res.data);
      console.log("res.data内容:", JSON.stringify(res.data));

      if (Array.isArray(res.data)) {
        console.log("res.data是数组，长度:", res.data.length);
        if (res.data.length > 0) {
          console.log("res.data[0]:", res.data[0]);
          console.log("res.data[0].url:", res.data[0].url);
        }
      } else if (res.data.data) {
        console.log("res.data.data类型:", typeof res.data.data);
        console.log("res.data.data内容:", JSON.stringify(res.data.data));
      }
    }

    let url = null;

    // 解析API响应
    if (res.data && res.data.length > 0 && res.data[0] && res.data[0].url) {
      url = res.data[0].url;
      console.log("获取到歌曲URL:", url);
    } else if (
      res.data &&
      res.data.data &&
      Array.isArray(res.data.data) &&
      res.data.data.length > 0 &&
      res.data.data[0] &&
      res.data.data[0].url
    ) {
      // 新版API响应格式
      url = res.data.data[0].url;
      console.log("获取到歌曲URL(新版API):", url);
    } else {
      // 尝试其他可能的响应格式
      if (res.code === 200) {
        if (res.data && typeof res.data === "object") {
          // 遍历对象查找url字段
          const findUrl = (obj) => {
            for (const key in obj) {
              if (key === "url" && typeof obj[key] === "string" && obj[key].startsWith("http")) {
                return obj[key];
              } else if (typeof obj[key] === "object" && obj[key] !== null) {
                const found = findUrl(obj[key]);
                if (found) return found;
              }
            }
            return null;
          };

          url = findUrl(res);
          if (url) {
            console.log("在响应中找到URL:", url);
          }
        }
      }

      if (!url) {
        console.error("API返回数据无效，无法提取URL:", res);
        alert("无法获取歌曲URL，API返回数据结构异常");
        return;
      }
    }

    if (!url) {
      console.error("获取到的URL为空");
      alert("无法获取歌曲URL，请检查歌曲ID是否有效");
      return;
    }

    // 创建测试Audio元素
    const audio = new Audio();
    audio.src = url;
    audio.volume = 0.5;

    // 添加事件监听
    audio.addEventListener("canplay", () => {
      console.log("音频可以播放了");
    });

    audio.addEventListener("play", () => {
      console.log("音频开始播放");
    });

    audio.addEventListener("error", (e) => {
      console.error("音频播放错误:", audio.error);
    });

    // 尝试播放
    try {
      await audio.play();
      console.log("API URL播放成功");
    } catch (error) {
      console.error("API URL播放失败:", error);

      // 可能需要用户交互
      alert("请点击确定以允许播放音频");
      try {
        await audio.play();
        console.log("用户交互后播放成功");
      } catch (e) {
        console.error("用户交互后仍然播放失败:", e);
        alert("播放失败，请检查浏览器音频设置或使用播放器组件播放");
      }
    }
  } catch (error) {
    console.error("获取歌曲URL出错:", error);
    alert("获取歌曲URL失败，请检查网络连接");
  }
}

/**
 * 格式化时间 (秒 -> mm:ss)
 *
 * @param time 时间（秒）
 * @returns 格式化后的时间字符串
 */
function formatTime(time: number): string {
  if (isNaN(time) || time <= 0) return "00:00";
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`;
}
</script>
