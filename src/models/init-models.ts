import type { Sequelize } from "sequelize";
import { article as _article } from "./article";
import type { articleAttributes, articleCreationAttributes } from "./article";
import { follow as _follow } from "./follow";
import type { followAttributes, followCreationAttributes } from "./follow";
import { scrap as _scrap } from "./scrap";
import type { scrapAttributes, scrapCreationAttributes } from "./scrap";
import { token as _token } from "./token";
import type { tokenAttributes, tokenCreationAttributes } from "./token";
import { user as _user } from "./user";
import type { userAttributes, userCreationAttributes } from "./user";

export {
  _article as article,
  _follow as follow,
  _scrap as scrap,
  _token as token,
  _user as user,
};

export type {
  articleAttributes,
  articleCreationAttributes,
  followAttributes,
  followCreationAttributes,
  scrapAttributes,
  scrapCreationAttributes,
  tokenAttributes,
  tokenCreationAttributes,
  userAttributes,
  userCreationAttributes,
};

export function initModels(sequelize: Sequelize) {
  const article = _article.initModel(sequelize);
  const follow = _follow.initModel(sequelize);
  const scrap = _scrap.initModel(sequelize);
  const token = _token.initModel(sequelize);
  const user = _user.initModel(sequelize);

  scrap.belongsTo(article, { as: "article", foreignKey: "articleId"});
  article.hasMany(scrap, { as: "scraps", foreignKey: "articleId"});
  article.belongsTo(user, { as: "creator", foreignKey: "creatorId"});
  user.hasMany(article, { as: "articles", foreignKey: "creatorId"});
  follow.belongsTo(user, { as: "followerUser", foreignKey: "follower"});
  user.hasMany(follow, { as: "follows", foreignKey: "follower"});
  follow.belongsTo(user, { as: "followeeUser", foreignKey: "followee"});
  user.hasMany(follow, { as: "followeeFollows", foreignKey: "followee"});
  scrap.belongsTo(user, { as: "user", foreignKey: "userId"});
  user.hasMany(scrap, { as: "scraps", foreignKey: "userId"});
  token.belongsTo(user, { as: "user", foreignKey: "userId"});
  user.hasMany(token, { as: "tokens", foreignKey: "userId"});

  return {
    article: article,
    follow: follow,
    scrap: scrap,
    token: token,
    user: user,
  };
}
