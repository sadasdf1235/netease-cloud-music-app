export interface Comment {
  commentId: number;
  user: {
    userId: number;
    nickname: string;
    avatarUrl: string;
  };
  content: string;
  time: number;
  likedCount: number;
  liked: boolean;
  replyCount: number;
  replies?: Comment[];
}

export interface CommentParams {
  id: number;
  type: number; // 0: 歌曲, 1: mv, 2: 歌单, 3: 专辑, 4: 电台, 5: 视频, 6: 动态
  pageNo?: number;
  pageSize?: number;
  sortType?: number; // 1:按推荐排序, 2:按热度排序, 3:按时间排序
  cursor?: string;
}

export interface CommentResponse {
  comments: Comment[];
  totalCount: number;
  hasMore: boolean;
  cursor?: string;
  sortType: number;
  hotComments?: Comment[];
}