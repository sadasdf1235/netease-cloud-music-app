/**
 * 评论相关类型定义
 */

/**
 * 用户VIP权限
 */
interface VipRights {
  associator?: {
    vipCode: number;
    rights: boolean;
  };
  musicPackage?: {
    vipCode: number;
    rights: boolean;
  };
  redVipAnnualCount: number;
  redVipLevel: number;
}

/**
 * 评论用户信息
 */
interface CommentUser {
  userId: number;
  nickname: string;
  avatarUrl: string;
  vipRights?: VipRights;
  avatarDetail?: {
    identityIconUrl: string;
  };
}

/**
 * 被回复的评论
 */
interface BeReplied {
  user: CommentUser;
  content: string;
  status: number;
  beRepliedCommentId: number;
}

/**
 * 评论
 */
export interface Comment {
  commentId: number;
  user: CommentUser;
  content: string;
  time: number;
  timeStr: string;
  likedCount: number;
  liked: boolean;
  replyCount: number;
  showReplyList?: boolean;
  replies?: Comment[];
  beReplied?: BeReplied[];
  pendantData?: null;
  decorations?: any[];
  expressionUrl?: null;
}

/**
 * 评论参数
 */
export interface CommentParams {
  id: number;
  type: number;
  pageNo?: number;
  pageSize?: number;
  sortType?: number;
  cursor?: string;
  before?: number;
}

/**
 * 评论响应
 */
export interface CommentResponse {
  code: number;
  comments: Comment[];
  hotComments?: Comment[];
  total: number;
  more: boolean;
  cursor?: string;
}