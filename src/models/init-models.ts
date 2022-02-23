import type { Sequelize } from 'sequelize';
import { article as _article } from './article';
import type { articleAttributes, articleCreationAttributes } from './article';
import { user as _user } from './user';
import type { userAttributes, userCreationAttributes } from './user';

export {
  _article as article,
  _user as user,
};

export type {
  articleAttributes,
  articleCreationAttributes,
  userAttributes,
  userCreationAttributes,
};

export function initModels(sequelize: Sequelize) {
  const article = _article.initModel(sequelize);
  const user = _user.initModel(sequelize);

  article.belongsTo(user, { as: 'idUser', foreignKey: 'id' });
  user.hasOne(article, { as: 'article', foreignKey: 'id' });

  return {
    article,
    user,
  };
}
