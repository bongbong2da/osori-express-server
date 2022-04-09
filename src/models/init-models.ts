import type { Sequelize } from "sequelize";
import { article as _article } from "./article";
import type { articleAttributes, articleCreationAttributes } from "./article";
import { chatMessage as _chatMessage } from "./chatMessage";
import type { chatMessageAttributes, chatMessageCreationAttributes } from "./chatMessage";
import { chatRoom as _chatRoom } from "./chatRoom";
import type { chatRoomAttributes, chatRoomCreationAttributes } from "./chatRoom";
import { follow as _follow } from "./follow";
import type { followAttributes, followCreationAttributes } from "./follow";
import { scrap as _scrap } from "./scrap";
import type { scrapAttributes, scrapCreationAttributes } from "./scrap";
import { token as _token } from "./token";
import type { tokenAttributes, tokenCreationAttributes } from "./token";
import { user as _user } from "./user";
import type { userAttributes, userCreationAttributes } from "./user";

export {
  _article as article,
  _chatMessage as chatMessage,
  _chatRoom as chatRoom,
  _follow as follow,
  _scrap as scrap,
  _token as token,
  _user as user,
};

export type {
  articleAttributes,
  articleCreationAttributes,
  chatMessageAttributes,
  chatMessageCreationAttributes,
  chatRoomAttributes,
  chatRoomCreationAttributes,
  followAttributes,
  followCreationAttributes,
  scrapAttributes,
  scrapCreationAttributes,
  tokenAttributes,
  tokenCreationAttributes,
  userAttributes,
  userCreationAttributes,
};

export function initModels(sequelize: Sequelize) {
  const article = _article.initModel(sequelize);
  const chatMessage = _chatMessage.initModel(sequelize);
  const chatRoom = _chatRoom.initModel(sequelize);
  const follow = _follow.initModel(sequelize);
  const scrap = _scrap.initModel(sequelize);
  const token = _token.initModel(sequelize);
  const user = _user.initModel(sequelize);

  scrap.belongsTo(article, { as: "article", foreignKey: "articleId"});
  article.hasMany(scrap, { as: "scraps", foreignKey: "articleId"});
  chatMessage.belongsTo(chatRoom, { as: "room", foreignKey: "roomId"});
  chatRoom.hasMany(chatMessage, { as: "chatMessages", foreignKey: "roomId"});
  article.belongsTo(user, { as: "creator", foreignKey: "creatorId"});
  user.hasMany(article, { as: "articles", foreignKey: "creatorId"});
  chatMessage.belongsTo(user, { as: "sender", foreignKey: "senderId"});
  user.hasMany(chatMessage, { as: "chatMessages", foreignKey: "senderId"});
  chatRoom.belongsTo(user, { as: "makerUser", foreignKey: "maker"});
  user.hasMany(chatRoom, { as: "chatRooms", foreignKey: "maker"});
  chatRoom.belongsTo(user, { as: "partnerUser", foreignKey: "partner"});
  user.hasMany(chatRoom, { as: "partnerChatRooms", foreignKey: "partner"});
  follow.belongsTo(user, { as: "followerUser", foreignKey: "follower"});
  user.hasMany(follow, { as: "follows", foreignKey: "follower"});
  follow.belongsTo(user, { as: "followeeUser", foreignKey: "followee"});
  user.hasMany(follow, { as: "followeeFollows", foreignKey: "followee"});
  scrap.belongsTo(user, { as: "user", foreignKey: "userId"});
  user.hasMany(scrap, { as: "scraps", foreignKey: "userId"});
  token.belongsTo(user, { as: "user", foreignKey: "userId"});
  user.hasMany(token, { as: "tokens", foreignKey: "userId"});

  return {
    article: article,
    chatMessage: chatMessage,
    chatRoom: chatRoom,
    follow: follow,
    scrap: scrap,
    token: token,
    user: user,
  };
}
