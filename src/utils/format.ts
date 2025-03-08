 /**
 * 格式化相关工具函数
 * @description 提供各种数据格式化的工具函数
 */

/**
 * 格式化时间为 MM:SS 格式
 * @param time 时间（秒）
 * @returns 格式化后的时间字符串
 */
export function formatTime(time: number): string {
    if (isNaN(time)) return '00:00';
    
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }
  
  /**
   * 格式化时长（毫秒）为 MM:SS 格式
   * @param duration 时长（毫秒）
   * @returns 格式化后的时间字符串
   */
  export function formatDuration(duration: number): string {
    if (!duration) return '00:00';
    return formatTime(duration / 1000);
  }
  
  /**
   * 格式化日期为 YYYY-MM-DD 格式
   * @param timestamp 时间戳
   * @returns 格式化后的日期字符串
   */
  export function formatDate(timestamp: number): string {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  }
  
  /**
   * 格式化大数字（将数字转换为带单位的字符串，如：1.2万）
   * @param count 数字
   * @returns 格式化后的字符串
   */
  export function formatCount(count: number): string {
    if (!count && count !== 0) return '0';
    if (count < 10000) return count.toString();
    if (count < 100000000) return Math.floor(count / 10000) + '万';
    return Math.floor(count / 100000000) + '亿';
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