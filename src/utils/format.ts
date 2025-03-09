/**
 * 格式化工具函数
 * @description 提供各种格式化方法，如时间、数字等
 */

/**
 * 格式化时间
 * @param time 时间（秒）
 * @returns 格式化后的时间字符串，如 "03:45"
 */
export function formatTime(time: number): string {
  if (!time || isNaN(time)) return '00:00';

  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);

  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

/**
 * 格式化为数字缩写
 * @param num 数字
 * @returns 格式化后的数字缩写，如 "1.2万"
 */
export function formatCount(num: number): string {
  if (!num || isNaN(num)) return '0';

  if (num < 10000) {
    return num.toString();
  } else if (num < 100000000) {
    return (num / 10000).toFixed(1) + '万';
  } else {
    return (num / 100000000).toFixed(1) + '亿';
  }
}

/**
 * 格式化日期
 * @param timestamp 时间戳（毫秒）
 * @param format 格式化模板，默认为 'YYYY-MM-DD'
 * @returns 格式化后的日期字符串
 */
export function formatDate(timestamp: number, format: string = 'YYYY-MM-DD'): string {
  if (!timestamp) return '';

  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hour = date.getHours();
  const minute = date.getMinutes();
  const second = date.getSeconds();

  return format
    .replace('YYYY', year.toString())
    .replace('MM', month.toString().padStart(2, '0'))
    .replace('DD', day.toString().padStart(2, '0'))
    .replace('HH', hour.toString().padStart(2, '0'))
    .replace('mm', minute.toString().padStart(2, '0'))
    .replace('ss', second.toString().padStart(2, '0'));
}

/**
 * 将毫秒转换为时分秒
 * @param ms 毫秒
 * @returns 格式化后的时间字符串，如 "03:45"
 */
export function msToMinuteSecond(ms: number): string {
  if (!ms || isNaN(ms)) return '00:00';
  return formatTime(Math.floor(ms / 1000));
}

/**
 * 将毫秒转换为完整时间格式
 * @param ms 毫秒
 * @returns 格式化后的时间字符串，如 "01:23:45"
 */
export function msToTime(ms: number): string {
  if (!ms || isNaN(ms)) return '00:00:00';

  const seconds = Math.floor(ms / 1000);
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hours > 0) {
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  } else {
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
}

/**
 * 格式化时长（毫秒）为 MM:SS 格式
 * @param duration 时长（毫秒）
 * @returns 格式化后的时间字符串
 */
export function formatDuration(duration: number): string {
  const minutes = Math.floor(duration / 1000 / 60);
  const seconds = Math.floor((duration / 1000) % 60);
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

/**
 * 格式化歌手名称（将歌手数组转换为 / 分隔的字符串）
 * @param artists 歌手数组
 * @returns 格式化后的歌手名称字符串
 */
export function formatArtists(artists: any[]): string {
  if (!artists || !artists.length) return '';
  return artists.map(artist => artist.name).join('/');
}

/**
 * 格式化时间为相对时间
 * @param timestamp 时间戳
 * @returns 相对时间字符串
 */
export function formatTimeAgo(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;

  // 小于1分钟
  if (diff < 60 * 1000) {
    return '刚刚';
  }

  // 小于1小时
  if (diff < 60 * 60 * 1000) {
    return Math.floor(diff / (60 * 1000)) + '分钟前';
  }

  // 小于24小时
  if (diff < 24 * 60 * 60 * 1000) {
    return Math.floor(diff / (60 * 60 * 1000)) + '小时前';
  }

  // 小于30天
  if (diff < 30 * 24 * 60 * 60 * 1000) {
    return Math.floor(diff / (24 * 60 * 60 * 1000)) + '天前';
  }

  // 超过30天显示具体日期
  return formatDate(timestamp);
}

/**
 * 格式化数字
 * @param num 数字
 * @returns 格式化后的字符串
 */
export function formatNumber(num: number): string {
  if (num < 10000) {
    return num.toString();
  }
  if (num < 100000000) {
    return (num / 10000).toFixed(1) + '万';
  }
  return (num / 100000000).toFixed(1) + '亿';
}

/**
 * 格式化歌词时间
 * @param time 时间（秒）
 */
export function formatLyricTime(time: number): string {
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  const milliseconds = Math.floor((time % 1) * 100);
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(2, '0')}`;
}