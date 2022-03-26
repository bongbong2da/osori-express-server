import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { article, articleId } from './article';
import type { user, userId } from './user';

export interface scrapAttributes {
  id: number;
  userId?: number;
  articleId?: number;
}

export type scrapPk = 'id';
export type scrapId = scrap[scrapPk];
export type scrapOptionalAttributes = 'id' | 'userId' | 'articleId';
export type scrapCreationAttributes = Optional<scrapAttributes, scrapOptionalAttributes>;

export class scrap
  extends Model<scrapAttributes, scrapCreationAttributes>
  implements scrapAttributes
{
  id!: number;

  userId?: number;

  articleId?: number;

  // scrap belongsTo article via articleId
  article!: article;

  getArticle!: Sequelize.BelongsToGetAssociationMixin<article>;

  setArticle!: Sequelize.BelongsToSetAssociationMixin<article, articleId>;

  createArticle!: Sequelize.BelongsToCreateAssociationMixin<article>;

  // scrap belongsTo user via userId
  user!: user;

  getUser!: Sequelize.BelongsToGetAssociationMixin<user>;

  setUser!: Sequelize.BelongsToSetAssociationMixin<user, userId>;

  createUser!: Sequelize.BelongsToCreateAssociationMixin<user>;

  static initModel(sequelize: Sequelize.Sequelize): typeof scrap {
    return sequelize.define(
      'scrap',
      {
        id: {
          autoIncrement: true,
          type: DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true,
        },
        userId: {
          type: DataTypes.INTEGER,
          allowNull: true,
          references: {
            model: 'user',
            key: 'id',
          },
          field: 'user_id',
        },
        articleId: {
          type: DataTypes.INTEGER,
          allowNull: true,
          references: {
            model: 'article',
            key: 'id',
          },
          field: 'article_id',
        },
      },
      {
        tableName: 'scraps',
        timestamps: false,
        indexes: [
          {
            name: 'PRIMARY',
            unique: true,
            using: 'BTREE',
            fields: [{ name: 'id' }],
          },
          {
            name: 'scraps_article_id_fk',
            using: 'BTREE',
            fields: [{ name: 'article_id' }],
          },
          {
            name: 'scraps_user_id_fk',
            using: 'BTREE',
            fields: [{ name: 'user_id' }],
          },
        ],
      },
    ) as typeof scrap;
  }
}
