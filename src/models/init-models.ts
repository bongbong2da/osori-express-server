import type { Sequelize } from "sequelize";
import { article as _article } from "./article";
import type { articleAttributes, articleCreationAttributes } from "./article";
import { token as _token } from "./token";
import type { tokenAttributes, tokenCreationAttributes } from "./token";
import { user as _user } from "./user";
import type { userAttributes, userCreationAttributes } from "./user";

export {
  _article as article,
  _token as token,
  _user as user,
};

export type {
  articleAttributes,
  articleCreationAttributes,
  tokenAttributes,
  tokenCreationAttributes,
  userAttributes,
  userCreationAttributes,
};

export function initModels(sequelize: Sequelize) {
  const article = _article.initModel(sequelize);
  const token = _token.initModel(sequelize);
  const user = _user.initModel(sequelize);

  article.belongsTo(user, { as: "creator", foreignKey: "creatorId"});
  user.hasMany(article, { as: "articles", foreignKey: "creatorId"});
  token.belongsTo(user, { as: "user", foreignKey: "userId"});
  user.hasMany(token, { as: "tokens", foreignKey: "userId"});

  return {
    article: article,
    token: token,
    user: user,
  };
}
