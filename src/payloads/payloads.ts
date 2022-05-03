import { commentAttributes } from 'src/models/comment';
import { userAttributes } from '../models/user';
import { articleAttributes } from '../models/article';

export interface ArticleDto extends articleAttributes {
  isMine?: boolean;
  creator?: any;
  isScrapped?: boolean;
}

export interface UserDto extends userAttributes {
  followerCount?: number;
  followingCount?: number;
  isFollowing?: boolean;
}

export interface CommentDto extends commentAttributes {
  creator: any;
}

export interface FollowDto {
  follower?: any;
  followee?: any;
}
