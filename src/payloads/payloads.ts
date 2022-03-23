import { articleAttributes } from '../models/article';

export interface ArticleDto extends articleAttributes {
    creator? : any;
}

export interface FollowDto {
    follower? : any;
    followee? :any
}
