import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { user, userId } from './user';

export interface articleAttributes {
  id: number;
  creator_id: number;
  category_id?: number;
  title: string;
  view_count?: number;
  like_count?: number;
  tags?: string;
  contents: string;
  isPublished?: number;
  create_date: string;
  modify_date?: string;
}

export type articlePk = "id";
export type articleId = article[articlePk];
export type articleOptionalAttributes = "id" | "category_id" | "view_count" | "like_count" | "tags" | "isPublished" | "create_date" | "modify_date";
export type articleCreationAttributes = Optional<articleAttributes, articleOptionalAttributes>;

export class article extends Model<articleAttributes, articleCreationAttributes> implements articleAttributes {
  id!: number;
  creator_id!: number;
  category_id?: number;
  title!: string;
  view_count?: number;
  like_count?: number;
  tags?: string;
  contents!: string;
  isPublished?: number;
  create_date!: string;
  modify_date?: string;

  // article belongsTo user via id
  id_user!: user;
  getId_user!: Sequelize.BelongsToGetAssociationMixin<user>;
  setId_user!: Sequelize.BelongsToSetAssociationMixin<user, userId>;
  createId_user!: Sequelize.BelongsToCreateAssociationMixin<user>;

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
    creator_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    category_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    title: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    view_count: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    like_count: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
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
      defaultValue: 0
    },
    create_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      defaultValue: Sequelize.Sequelize.fn('current_timestamp')
    },
    modify_date: {
      type: DataTypes.DATEONLY,
      allowNull: true
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
