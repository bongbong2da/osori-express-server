import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
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

  // article belongsTo user via id
  idUser!: user;
  getIdUser!: Sequelize.BelongsToGetAssociationMixin<user>;
  setIdUser!: Sequelize.BelongsToSetAssociationMixin<user, userId>;
  createIdUser!: Sequelize.BelongsToCreateAssociationMixin<user>;

  static initModel(sequelize: Sequelize.Sequelize): typeof article {
    return article.init({
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'user',
        key: 'id'
      }
    },
    creatorId: {
      type: DataTypes.INTEGER,
      allowNull: false,
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
      defaultValue: Sequelize.Sequelize.fn('current_timestamp'),
      field: 'create_date'
    },
    modifyDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      field: 'modify_date'
    }
  }, {
    sequelize,
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
    ]
  });
  }
}
