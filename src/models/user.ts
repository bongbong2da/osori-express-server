import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { article, articleId } from './article';
import type { chatMessage, chatMessageId } from './chatMessage';
import type { chatRoom, chatRoomId } from './chatRoom';
import type { follow, followId } from './follow';
import type { scrap, scrapId } from './scrap';
import type { token, tokenId } from './token';

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
  pushToken?: string;
}

export type userPk = "id";
export type userId = user[userPk];
export type userOptionalAttributes = "id" | "loginType" | "externalId" | "gender" | "email" | "name" | "phoneNumber" | "profileImage" | "ageRange" | "birthday" | "createDate" | "loginDate" | "modifyDate" | "pushToken";
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
  pushToken?: string;

  // user hasMany article via creatorId
  articles!: article[];
  getArticles!: Sequelize.HasManyGetAssociationsMixin<article>;
  setArticles!: Sequelize.HasManySetAssociationsMixin<article, articleId>;
  addArticle!: Sequelize.HasManyAddAssociationMixin<article, articleId>;
  addArticles!: Sequelize.HasManyAddAssociationsMixin<article, articleId>;
  createArticle!: Sequelize.HasManyCreateAssociationMixin<article>;
  removeArticle!: Sequelize.HasManyRemoveAssociationMixin<article, articleId>;
  removeArticles!: Sequelize.HasManyRemoveAssociationsMixin<article, articleId>;
  hasArticle!: Sequelize.HasManyHasAssociationMixin<article, articleId>;
  hasArticles!: Sequelize.HasManyHasAssociationsMixin<article, articleId>;
  countArticles!: Sequelize.HasManyCountAssociationsMixin;
  // user hasMany chatMessage via senderId
  chatMessages!: chatMessage[];
  getChatMessages!: Sequelize.HasManyGetAssociationsMixin<chatMessage>;
  setChatMessages!: Sequelize.HasManySetAssociationsMixin<chatMessage, chatMessageId>;
  addChatMessage!: Sequelize.HasManyAddAssociationMixin<chatMessage, chatMessageId>;
  addChatMessages!: Sequelize.HasManyAddAssociationsMixin<chatMessage, chatMessageId>;
  createChatMessage!: Sequelize.HasManyCreateAssociationMixin<chatMessage>;
  removeChatMessage!: Sequelize.HasManyRemoveAssociationMixin<chatMessage, chatMessageId>;
  removeChatMessages!: Sequelize.HasManyRemoveAssociationsMixin<chatMessage, chatMessageId>;
  hasChatMessage!: Sequelize.HasManyHasAssociationMixin<chatMessage, chatMessageId>;
  hasChatMessages!: Sequelize.HasManyHasAssociationsMixin<chatMessage, chatMessageId>;
  countChatMessages!: Sequelize.HasManyCountAssociationsMixin;
  // user hasMany chatRoom via maker
  chatRooms!: chatRoom[];
  getChatRooms!: Sequelize.HasManyGetAssociationsMixin<chatRoom>;
  setChatRooms!: Sequelize.HasManySetAssociationsMixin<chatRoom, chatRoomId>;
  addChatRoom!: Sequelize.HasManyAddAssociationMixin<chatRoom, chatRoomId>;
  addChatRooms!: Sequelize.HasManyAddAssociationsMixin<chatRoom, chatRoomId>;
  createChatRoom!: Sequelize.HasManyCreateAssociationMixin<chatRoom>;
  removeChatRoom!: Sequelize.HasManyRemoveAssociationMixin<chatRoom, chatRoomId>;
  removeChatRooms!: Sequelize.HasManyRemoveAssociationsMixin<chatRoom, chatRoomId>;
  hasChatRoom!: Sequelize.HasManyHasAssociationMixin<chatRoom, chatRoomId>;
  hasChatRooms!: Sequelize.HasManyHasAssociationsMixin<chatRoom, chatRoomId>;
  countChatRooms!: Sequelize.HasManyCountAssociationsMixin;
  // user hasMany chatRoom via partner
  partnerChatRooms!: chatRoom[];
  getPartnerChatRooms!: Sequelize.HasManyGetAssociationsMixin<chatRoom>;
  setPartnerChatRooms!: Sequelize.HasManySetAssociationsMixin<chatRoom, chatRoomId>;
  addPartnerChatRoom!: Sequelize.HasManyAddAssociationMixin<chatRoom, chatRoomId>;
  addPartnerChatRooms!: Sequelize.HasManyAddAssociationsMixin<chatRoom, chatRoomId>;
  createPartnerChatRoom!: Sequelize.HasManyCreateAssociationMixin<chatRoom>;
  removePartnerChatRoom!: Sequelize.HasManyRemoveAssociationMixin<chatRoom, chatRoomId>;
  removePartnerChatRooms!: Sequelize.HasManyRemoveAssociationsMixin<chatRoom, chatRoomId>;
  hasPartnerChatRoom!: Sequelize.HasManyHasAssociationMixin<chatRoom, chatRoomId>;
  hasPartnerChatRooms!: Sequelize.HasManyHasAssociationsMixin<chatRoom, chatRoomId>;
  countPartnerChatRooms!: Sequelize.HasManyCountAssociationsMixin;
  // user hasMany follow via follower
  follows!: follow[];
  getFollows!: Sequelize.HasManyGetAssociationsMixin<follow>;
  setFollows!: Sequelize.HasManySetAssociationsMixin<follow, followId>;
  addFollow!: Sequelize.HasManyAddAssociationMixin<follow, followId>;
  addFollows!: Sequelize.HasManyAddAssociationsMixin<follow, followId>;
  createFollow!: Sequelize.HasManyCreateAssociationMixin<follow>;
  removeFollow!: Sequelize.HasManyRemoveAssociationMixin<follow, followId>;
  removeFollows!: Sequelize.HasManyRemoveAssociationsMixin<follow, followId>;
  hasFollow!: Sequelize.HasManyHasAssociationMixin<follow, followId>;
  hasFollows!: Sequelize.HasManyHasAssociationsMixin<follow, followId>;
  countFollows!: Sequelize.HasManyCountAssociationsMixin;
  // user hasMany follow via followee
  followeeFollows!: follow[];
  getFolloweeFollows!: Sequelize.HasManyGetAssociationsMixin<follow>;
  setFolloweeFollows!: Sequelize.HasManySetAssociationsMixin<follow, followId>;
  addFolloweeFollow!: Sequelize.HasManyAddAssociationMixin<follow, followId>;
  addFolloweeFollows!: Sequelize.HasManyAddAssociationsMixin<follow, followId>;
  createFolloweeFollow!: Sequelize.HasManyCreateAssociationMixin<follow>;
  removeFolloweeFollow!: Sequelize.HasManyRemoveAssociationMixin<follow, followId>;
  removeFolloweeFollows!: Sequelize.HasManyRemoveAssociationsMixin<follow, followId>;
  hasFolloweeFollow!: Sequelize.HasManyHasAssociationMixin<follow, followId>;
  hasFolloweeFollows!: Sequelize.HasManyHasAssociationsMixin<follow, followId>;
  countFolloweeFollows!: Sequelize.HasManyCountAssociationsMixin;
  // user hasMany scrap via userId
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
  // user hasMany token via userId
  tokens!: token[];
  getTokens!: Sequelize.HasManyGetAssociationsMixin<token>;
  setTokens!: Sequelize.HasManySetAssociationsMixin<token, tokenId>;
  addToken!: Sequelize.HasManyAddAssociationMixin<token, tokenId>;
  addTokens!: Sequelize.HasManyAddAssociationsMixin<token, tokenId>;
  createToken!: Sequelize.HasManyCreateAssociationMixin<token>;
  removeToken!: Sequelize.HasManyRemoveAssociationMixin<token, tokenId>;
  removeTokens!: Sequelize.HasManyRemoveAssociationsMixin<token, tokenId>;
  hasToken!: Sequelize.HasManyHasAssociationMixin<token, tokenId>;
  hasTokens!: Sequelize.HasManyHasAssociationsMixin<token, tokenId>;
  countTokens!: Sequelize.HasManyCountAssociationsMixin;

  static initModel(sequelize: Sequelize.Sequelize): typeof user {
    return sequelize.define('user', {
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
      defaultValue: Sequelize.Sequelize.fn('user'),
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
    },
    pushToken: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'push_token'
    }
  }, {
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
  }) as typeof user;
  }
}
