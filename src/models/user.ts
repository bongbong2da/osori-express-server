import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { article, articleCreationAttributes, articleId } from './article';

/**
 * @Swagger
 *  components:
 *    schemas:
 *      User:
 *        type: object
 *        required:
 *          - nickname
 *        properties:
 *          nickname:
 *            type: string
 */

export interface userAttributes {
  id: number;
  login_type: 'NONE' | 'KAKAO' | 'GOOGLE' | 'APPLE';
  external_id?: number;
  nickname: string;
  gender?: string;
  email?: string;
  name?: string;
  phone_number?: string;
  profile_img?: number;
  age_range?: string;
  birthday?: string;
  create_date: string;
  login_date?: string;
  modify_date?: string;
}

export type userPk = "id";
export type userId = user[userPk];
export type userOptionalAttributes = "id" | "login_type" | "external_id" | "gender" | "email" | "name" | "phone_number" | "profile_img" | "age_range" | "birthday" | "create_date" | "login_date" | "modify_date";
export type userCreationAttributes = Optional<userAttributes, userOptionalAttributes>;

export class user extends Model<userAttributes, userCreationAttributes> implements userAttributes {
  id!: number;
  login_type!: 'NONE' | 'KAKAO' | 'GOOGLE' | 'APPLE';
  external_id?: number;
  nickname!: string;
  gender?: string;
  email?: string;
  name?: string;
  phone_number?: string;
  profile_img?: number;
  age_range?: string;
  birthday?: string;
  create_date!: string;
  login_date?: string;
  modify_date?: string;

  // user hasOne article via id
  article!: article;
  getArticle!: Sequelize.HasOneGetAssociationMixin<article>;
  setArticle!: Sequelize.HasOneSetAssociationMixin<article, articleId>;
  createArticle!: Sequelize.HasOneCreateAssociationMixin<article>;

  static initModel(sequelize: Sequelize.Sequelize): typeof user {
    return user.init({
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    login_type: {
      type: DataTypes.ENUM('NONE','KAKAO','GOOGLE','APPLE'),
      allowNull: false,
      defaultValue: "NONE"
    },
    external_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    nickname: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    gender: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    email: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    name: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    phone_number: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    profile_img: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    age_range: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    birthday: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    create_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      defaultValue: Sequelize.Sequelize.fn('current_timestamp')
    },
    login_date: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    modify_date: {
      type: DataTypes.DATEONLY,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'user',
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
