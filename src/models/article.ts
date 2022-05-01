import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { comment, commentId } from './comment';
import type { scrap, scrapId } from './scrap';
import type { user, userId } from './user';

export interface articleAttributes {
  id: number;
  creatorId: number;
  categoryId?: number;
  title: string;
  viewCount?: number;
  likeCount?: number;
  tags?: string;
  contents: string;
  isPublished?: number;
  createDate: string;
  modifyDate?: string;
}

export type articlePk = "id";
export type articleId = article[articlePk];
export type articleOptionalAttributes = "id" | "categoryId" | "viewCount" | "likeCount" | "tags" | "isPublished" | "createDate" | "modifyDate";
export type articleCreationAttributes = Optional<articleAttributes, articleOptionalAttributes>;

export class article extends Model<articleAttributes, articleCreationAttributes> implements articleAttributes {
  id!: number;
  creatorId!: number;
  categoryId?: number;
  title!: string;
  viewCount?: number;
  likeCount?: number;
  tags?: string;
  contents!: string;
  isPublished?: number;
  createDate!: string;
  modifyDate?: string;

  // article hasMany comment via articleId
  comments!: comment[];
  getComments!: Sequelize.HasManyGetAssociationsMixin<comment>;
  setComments!: Sequelize.HasManySetAssociationsMixin<comment, commentId>;
  addComment!: Sequelize.HasManyAddAssociationMixin<comment, commentId>;
  addComments!: Sequelize.HasManyAddAssociationsMixin<comment, commentId>;
  createComment!: Sequelize.HasManyCreateAssociationMixin<comment>;
  removeComment!: Sequelize.HasManyRemoveAssociationMixin<comment, commentId>;
  removeComments!: Sequelize.HasManyRemoveAssociationsMixin<comment, commentId>;
  hasComment!: Sequelize.HasManyHasAssociationMixin<comment, commentId>;
  hasComments!: Sequelize.HasManyHasAssociationsMixin<comment, commentId>;
  countComments!: Sequelize.HasManyCountAssociationsMixin;
  // article hasMany scrap via articleId
  scraps!: scrap[];
  getScraps!: Sequelize.HasManyGetAssociationsMixin<scrap>;
  setScraps!: Sequelize.HasManySetAssociationsMixin<scrap, scrapId>;
  addScrap!: Sequelize.HasManyAddAssociationMixin<scrap, scrapId>;
  addScraps!: Sequelize.HasManyAddAssociationsMixin<scrap, scrapId>;
  createScrap!: Sequelize.HasManyCreateAssociationMixin<scrap>;
  removeScrap!: Sequelize.HasManyRemoveAssociationMixin<scrap, scrapId>;
  removeScraps!: Sequelize.HasManyRemoveAssociationsMixin<scrap, scrapId>;
  hasScrap!: Sequelize.HasManyHasAssociationMixin<scrap, scrapId>;
  hasScraps!: Sequelize.HasManyHasAssociationsMixin<scrap, scrapId>;
  countScraps!: Sequelize.HasManyCountAssociationsMixin;
  // article belongsTo user via creatorId
  creator!: user;
  getCreator!: Sequelize.BelongsToGetAssociationMixin<user>;
  setCreator!: Sequelize.BelongsToSetAssociationMixin<user, userId>;
  createCreator!: Sequelize.BelongsToCreateAssociationMixin<user>;

  static initModel(sequelize: Sequelize.Sequelize): typeof article {
    return sequelize.define('article', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
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
    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'category_id'
    },
    title: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    viewCount: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
      field: 'view_count'
    },
    likeCount: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
      field: 'like_count'
    },
    tags: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    contents: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    isPublished: {
      type: DataTypes.TINYINT,
      allowNull: true,
      defaultValue: 0,
      field: 'is_published'
    },
    createDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      defaultValue: Sequelize.Sequelize.fn('sysdate'),
      field: 'create_date'
    },
    modifyDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      field: 'modify_date'
    }
  }, {
    tableName: 'article',
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
        name: "article_FK",
        using: "BTREE",
        fields: [
          { name: "creator_id" },
        ]
      },
    ]
  }) as typeof article;
  }
}
