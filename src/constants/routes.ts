 /**
 * 路由路径常量
 * @description 定义应用中使用的路由路径常量
 */

/**
 * 路由名称常量
 */
export enum RouteName {
    /** 首页 */
    HOME = 'home',
    /** 发现音乐 */
    DISCOVER = 'discover',
    /** 推荐 */
    RECOMMEND = 'recommend',
    /** 歌单 */
    PLAYLIST = 'playlist',
    /** 歌单详情 */
    PLAYLIST_DETAIL = 'playlist-detail',
    /** 排行榜 */
    TOPLIST = 'toplist',
    /** 歌手 */
    ARTIST = 'artist',
    /** 歌手详情 */
    ARTIST_DETAIL = 'artist-detail',
    /** 专辑 */
    ALBUM = 'album',
    /** 专辑详情 */
    ALBUM_DETAIL = 'album-detail',
    /** 我的音乐 */
    MY_MUSIC = 'my-music',
    /** 登录 */
    LOGIN = 'login',
    /** 搜索 */
    SEARCH = 'search',
    /** 音乐测试 */
    MUSIC_TEST = 'music-test'
  }
  
  /**
   * 路由路径常量
   */
  export enum RoutePath {
    /** 首页 */
    HOME = '/',
    /** 发现音乐 */
    DISCOVER = '/discover',
    /** 推荐 */
    RECOMMEND = '/discover/recommend',
    /** 歌单 */
    PLAYLIST = '/discover/playlist',
    /** 歌单详情 */
    PLAYLIST_DETAIL = '/discover/playlist/:id',
    /** 排行榜 */
    TOPLIST = '/discover/toplist',
    /** 歌手 */
    ARTIST = '/discover/artist',
    /** 歌手详情 */
    ARTIST_DETAIL = '/discover/artist/:id',
    /** 专辑 */
    ALBUM = '/discover/album',
    /** 专辑详情 */
    ALBUM_DETAIL = '/album/:id',
    /** 我的音乐 */
    MY_MUSIC = '/my',
    /** 登录 */
    LOGIN = '/login',
    /** 搜索 */
    SEARCH = '/search',
    /** 音乐测试 */
    MUSIC_TEST = '/test/music'
  }