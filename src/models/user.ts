import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { article, articleCreationAttributes, articleId } from './article';

export interface userAttributes {
  id: number;
  loginType: 'NONE' | 'KAKAO' | 'GOOGLE' | 'APPLE';
  externalId?: string;
  nickname: string;
  gender?: string;
  email?: string;
  name?: string;
  phoneNumber?: string;
  profileImage?: string;
  ageRange?: string;
  birthday?: string;
  createDate: string;
  loginDate?: string;
  modifyDate?: string;
}

export type userPk = "id";
export type userId = user[userPk];
export type userOptionalAttributes = "id" | "loginType" | "externalId" | "gender" | "email" | "name" | "phoneNumber" | "profileImage" | "ageRange" | "birthday" | "createDate" | "loginDate" | "modifyDate";
export type userCreationAttributes = Optional<userAttributes, userOptionalAttributes>;

export class user extends Model<userAttributes, userCreationAttributes> implements userAttributes {
  id!: number;
  loginType!: 'NONE' | 'KAKAO' | 'GOOGLE' | 'APPLE';
  externalId?: string;
  nickname!: string;
  gender?: string;
  email?: string;
  name?: string;
  phoneNumber?: string;
  profileImage?: string;
  ageRange?: string;
  birthday?: string;
  createDate!: string;
  loginDate?: string;
  modifyDate?: string;

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
    loginType: {
      type: DataTypes.ENUM('NONE','KAKAO','GOOGLE','APPLE'),
      allowNull: false,
      defaultValue: "NONE",
      field: 'login_type'
    },
    externalId: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'external_id'
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
    phoneNumber: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'phone_number'
    },
    profileImage: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'profile_image'
    },
    ageRange: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'age_range'
    },
    birthday: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    createDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      defaultValue: Sequelize.Sequelize.fn('current_timestamp'),
      field: 'create_date'
    },
    loginDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      field: 'login_date'
    },
    modifyDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      field: 'modify_date'
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
