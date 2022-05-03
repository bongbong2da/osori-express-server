import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { article, articleId } from './article';
import type { user, userId } from './user';

export interface commentAttributes {
  id: number;
  articleId: number;
  parentId?: number;
  creatorId: number;
  content: string;
  createDate?: string;
  updateDate?: string;
}

export type commentPk = "id";
export type commentId = comment[commentPk];
export type commentOptionalAttributes = "id" | "parentId" | "createDate" | "updateDate";
export type commentCreationAttributes = Optional<commentAttributes, commentOptionalAttributes>;

export class comment extends Model<commentAttributes, commentCreationAttributes> implements commentAttributes {
  id!: number;
  articleId!: number;
  parentId?: number;
  creatorId!: number;
  content!: string;
  createDate?: string;
  updateDate?: string;

  // comment belongsTo article via articleId
  article!: article;
  getArticle!: Sequelize.BelongsToGetAssociationMixin<article>;
  setArticle!: Sequelize.BelongsToSetAssociationMixin<article, articleId>;
  createArticle!: Sequelize.BelongsToCreateAssociationMixin<article>;
  // comment belongsTo comment via parentId
  parent!: comment;
  getParent!: Sequelize.BelongsToGetAssociationMixin<comment>;
  setParent!: Sequelize.BelongsToSetAssociationMixin<comment, commentId>;
  createParent!: Sequelize.BelongsToCreateAssociationMixin<comment>;
  // comment belongsTo user via creatorId
  creator!: user;
  getCreator!: Sequelize.BelongsToGetAssociationMixin<user>;
  setCreator!: Sequelize.BelongsToSetAssociationMixin<user, userId>;
  createCreator!: Sequelize.BelongsToCreateAssociationMixin<user>;

  static initModel(sequelize: Sequelize.Sequelize): typeof comment {
    return sequelize.define('comment', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    articleId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'article',
        key: 'id'
      },
      field: 'article_id'
    },
    parentId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'comments',
        key: 'id'
      },
      field: 'parent_id'
    },
    creatorId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'user',
        key: 'id'
      },
      field: 'creator_id'
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    createDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      defaultValue: Sequelize.Sequelize.fn('sysdate'),
      field: 'create_date'
    },
    updateDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      field: 'update_date'
    }
  }, {
    tableName: 'comments',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "comments_article_id_fk",
        using: "BTREE",
        fields: [
          { name: "article_id" },
        ]
      },
      {
        name: "comments_comments_id_fk",
        using: "BTREE",
        fields: [
          { name: "parent_id" },
        ]
      },
      {
        name: "comments_user_id_fk",
        using: "BTREE",
        fields: [
          { name: "creator_id" },
        ]
      },
    ]
  }) as typeof comment;
  }
}
