/**
 * 音乐相关模型的类型定义
 * @description 包含歌曲、歌手、专辑等音乐相关的所有类型定义
 */

/**
 * 歌手信息类型
 */
export interface Artist {
  /** 歌手ID */
  id: number;
  /** 歌手姓名 */
  name: string;
  /** 歌手头像URL */
  picUrl?: string;
  /** 歌手别名 */
  alias?: string[];
  /** 歌手描述 */
  briefDesc?: string;
  /** 歌手热门歌曲数量 */
  musicSize?: number;
  /** 歌手专辑数量 */
  albumSize?: number;
  /** 歌手MV数量 */
  mvSize?: number;
  /** 粉丝数量 */
  followedCount?: number;
  /** 是否已收藏 */
  followed?: boolean;
}

/**
 * 专辑信息类型
 */
export interface Album {
  /** 专辑ID */
  id: number;
  /** 专辑名称 */
  name: string;
  /** 专辑封面URL */
  picUrl?: string;
  /** 专辑描述 */
  description?: string;
  /** 发行时间 */
  publishTime?: number;
  /** 专辑包含的歌曲数 */
  size?: number;
  /** 专辑艺术家 */
  artist?: Artist;
  /** 专辑艺术家列表 */
  artists?: Artist[];
  /** 公司 */
  company?: string;
  /** 子类型 */
  subType?: string;
  /** 类型 */
  type?: string;
}

/**
 * 音质信息类型
 */
export interface MusicQuality {
  /** 音质ID */
  id: number;
  /** 文件大小 */
  size: number;
  /** 文件扩展名 */
  extension: string;
  /** 采样率 */
  sr: number;
  /** DFS ID */
  dfsId: number;
  /** 比特率 */
  bitrate: number;
  /** 播放时长 */
  playTime: number;
  /** 音量增益 */
  volumeDelta: number;
}

/**
 * 歌曲基本信息类型
 */
export interface Song {
  /** 歌曲ID */
  id: number;
  /** 歌曲名称 */
  name: string;
  /** 歌手信息 */
  ar?: Artist[];
  /** 歌手信息(兼容) */
  artists?: Artist[];
  /** 专辑信息 */
  al?: Album;
  /** 专辑信息(兼容) */
  album?: Album;
  /** 歌曲别名 */
  alia?: string[];
  /** 歌曲别名(兼容) */
  alias?: string[];
  /** 歌曲时长(毫秒) */
  dt?: number;
  /** 歌曲时长(兼容) */
  duration?: number;
  /** 发布时间 */
  publishTime?: number;
  /** MV ID */
  mv?: number;
  /** 收费类型 */
  fee?: number;
  /** 状态 */
  status?: number;
  /** 版权ID */
  copyrightId?: number;
  /** 标记 */
  mark?: number;
  /** 原始封面类型 */
  originCoverType?: number;
  /** 单曲 */
  single?: number;
  /** 无版权推荐 */
  noCopyrightRcmd?: any;
  /** 是否已收藏 */
  starred?: boolean;
  /** 人气 */
  popularity?: number;
  /** 分数 */
  score?: number;
  /** 收藏次数 */
  starredNum?: number;
  /** 播放次数 */
  playedNum?: number;
  /** 日播放次数 */
  dayPlays?: number;
  /** 听歌时长 */
  hearTime?: number;
  /** 铃声 */
  ringtone?: string;
  /** 其他音质信息 */
  bMusic?: MusicQuality;
  hMusic?: MusicQuality;
  mMusic?: MusicQuality;
  lMusic?: MusicQuality;
}

/**
 * 简化歌曲信息类型（用于播放器展示）
 */
export interface SimpleSong {
  /** 歌曲ID */
  id: number;
  /** 歌曲名称 */
  name: string;
  /** 歌手信息 */
  artists: Artist[];
  /** 专辑信息 */
  album: {
    id?: number;
    name?: string;
    picUrl?: string;
  };
  /** 歌曲时长(毫秒) */
  duration?: number;
}

/**
 * 歌曲URL类型
 */
export interface SongUrl {
  /** 歌曲ID */
  id: number;
  /** 歌曲URL */
  url: string;
  /** 比特率 */
  br: number;
  /** 文件大小 */
  size: number;
  /** 文件MD5 */
  md5: string;
  /** 状态码 */
  code: number;
  /** 过期时间 */
  expi: number;
  /** 文件类型 */
  type: string;
  /** 音量增益 */
  gain: number;
  /** 收费类型 */
  fee: number;
  /** 是否已付费 */
  payed: number;
  /** 标记 */
  flag: number;
  /** 是否可扩展 */
  canExtend: boolean;
  /** 级别 */
  level: string;
  /** 编码类型 */
  encodeType: string;
}

/**
 * 歌曲详情类型
 */
export interface SongDetail extends Song {
  /** 歌词 */
  lyrics: string[];
  /** 翻译歌词 */
  tlyric: string[];
  /** 卡拉OK歌词 */
  klyric: string[];
  /** 罗马音歌词 */
  romalrc: string[];
  /** 版本 */
  version: number;
  /** 歌曲类型 */
  songType: number;
  /** 歌曲ID */
  songId: number;
  /** 歌曲名称 */
  songName: string;
  /** 歌手名称 */
  singerName: string;
  /** 专辑名称 */
  albumName: string;
  /** 翻译者信息 */
  transUser?: {
    userid: number;
    nickname: string;
    uptime: number;
  };
  /** 歌词提供者信息 */
  lyricUser?: {
    userid: number;
    nickname: string;
    uptime: number;
  };
}

/**
 * 歌词类型
 */
export interface Lyric {
  /** 原始歌词 */
  lrc?: {
    version: number;
    lyric: string;
  };
  /** 卡拉OK歌词 */
  klyric?: {
    version: number;
    lyric: string;
  };
  /** 翻译歌词 */
  tlyric?: {
    version: number;
    lyric: string;
  };
}

/**
 * 歌词行类型
 */
export interface LyricLine {
  /** 时间点（毫秒） */
  time: number;
  /** 歌词文本 */
  text: string;
  /** 翻译 */
  translation?: string;
}

/**
 * 相似歌曲类型
 */
export interface SimiSong extends Song {
  /** 算法标记 */
  alg: string;
} 