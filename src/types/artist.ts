import type { Song } from './song';
import type { Album } from './album';
import type { MV } from './mv';

/**
 * 歌手类型
 */
export interface Artist {
  id: number;
  name: string;
  picUrl: string;
  alias?: string[];
  albumSize?: number;
  musicSize?: number;
  mvSize?: number;
  briefDesc?: string;
  followed?: boolean;
  identifyTag?: string[];
  rank?: {
    rank: number;
    type: number;
  };
}

/**
 * 歌手分类参数
 */
export interface ArtistCategory {
  type: number; // -1:全部 1:男歌手 2:女歌手 3:乐队
  area: number; // -1:全部 7华语 96欧美 8:日本 16韩国 0:其他
  initial: string; // a-z/A-Z
}

/**
 * 歌手筛选参数
 */
export interface ArtistParams {
  type?: string;
  area?: string;
  initial?: string;
  limit?: number;
  offset?: number;
}

/**
 * 歌手详情类型
 */
export interface ArtistDetail extends Artist {
  cover: string;
  identifyTag?: string[];
  secondaryExpertIdentiy?: Array<{
    expertIdentiyId: number;
    expertIdentiyName: string;
  }>;
  user?: {
    userId: number;
    userType: number;
    nickname: string;
    avatarUrl: string;
    birthday: number;
    city: number;
    province: number;
    expertTags?: string[];
  };
}

/**
 * 歌手歌曲类型
 */
export interface ArtistSong extends Song {
  no: number;
  fee: number;
  privilege: {
    id: number;
    fee: number;
    payed: number;
    st: number;
    pl: number;
    dl: number;
    sp: number;
    cp: number;
    subp: number;
    cs: boolean;
    maxbr: number;
    fl: number;
    toast: boolean;
    flag: number;
    preSell: boolean;
  };
}

/**
 * 歌手专辑类型
 */
export interface ArtistAlbum extends Album {
  artist: Artist;
  artists: Artist[];
  paid: boolean;
  onSale: boolean;
  mark: number;
}