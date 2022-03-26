import { articleAttributes } from '../models/article';

export interface ArticleDto extends articleAttributes {
    isMine? : boolean;
    creator? : any;
}

export interface FollowDto {
    follower? : any;
    followee? :any
}
