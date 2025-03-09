import type { Artist } from './artist';
import type { Album } from './album';

/**
 * 歌曲类型
 */
export interface Song {
  id: number;
  name: string;
  artists: Artist[];
  album: Album;
  duration: number; // 时长（毫秒）
  fee: number; // 收费类型
  alias?: string[];
  mv?: number;
  publishTime?: number;
  status: number;
  copyrightId?: number;
  mark?: number;
  originCoverType?: number;
  single?: number;
  noCopyrightRcmd?: any;
  starred?: boolean;
  popularity?: number;
  score?: number;
  starredNum?: number;
  playedNum?: number;
  dayPlays?: number;
  hearTime?: number;
  ringtone?: string;
  crbt?: any;
  audition?: any;
  copyFrom?: string;
  commentThreadId?: string;
  ftype?: number;
  rtUrls?: any[];
  copyright?: number;
  transName?: string;
  sign?: any;
  rtype?: number;
  rurl?: any;
  bMusic?: MusicQuality;
  hMusic?: MusicQuality;
  mMusic?: MusicQuality;
  lMusic?: MusicQuality;
}

/**
 * 音质信息
 */
export interface MusicQuality {
  id: number;
  size: number;
  extension: string;
  sr: number;
  dfsId: number;
  bitrate: number;
  playTime: number;
  volumeDelta: number;
}

/**
 * 歌曲URL类型
 */
export interface SongUrl {
  id: number;
  url: string;
  br: number;
  size: number;
  md5: string;
  code: number;
  expi: number;
  type: string;
  gain: number;
  fee: number;
  payed: number;
  flag: number;
  canExtend: boolean;
  level: string;
  encodeType: string;
}

/**
 * 歌曲详情
 */
export interface SongDetail extends Song {
  lyrics: string[];
  tlyric: string[];
  klyric: string[];
  romalrc: string[];
  version: number;
  songType: number;
  songId: number;
  songName: string;
  singerName: string;
  albumName: string;
  transUser: {
    userid: number;
    nickname: string;
    uptime: number;
  };
  lyricUser: {
    userid: number;
    nickname: string;
    uptime: number;
  };
}

/**
 * 歌曲评论
 */
export interface SongComment {
  commentId: number;
  user: {
    userId: number;
    nickname: string;
    avatarUrl: string;
    userType: number;
  };
  content: string;
  time: number;
  likedCount: number;
  liked: boolean;
  replied?: {
    user: {
      userId: number;
      nickname: string;
      avatarUrl: string;
      userType: number;
    };
    content: string;
    time: number;
  };
}

/**
 * 相似歌曲
 */
export interface SimiSong extends Song {
  alg: string;
}

// 歌词
export interface Lyric {
  lrc?: {
    version: number;
    lyric: string;
  };
  klyric?: {
    version: number;
    lyric: string;
  };
  tlyric?: {
    version: number;
    lyric: string;
  };
}

// 歌词行
export interface LyricLine {
  time: number;
  text: string;
  translation?: string;
}