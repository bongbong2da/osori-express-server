import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { chatMessage, chatMessageId } from './chatMessage';
import type { user, userId } from './user';

export interface chatRoomAttributes {
  id: number;
  maker?: number;
  partner?: number;
  createDate?: string;
  modifyDate?: string;
}

export type chatRoomPk = "id";
export type chatRoomId = chatRoom[chatRoomPk];
export type chatRoomOptionalAttributes = "id" | "maker" | "partner" | "createDate" | "modifyDate";
export type chatRoomCreationAttributes = Optional<chatRoomAttributes, chatRoomOptionalAttributes>;

export class chatRoom extends Model<chatRoomAttributes, chatRoomCreationAttributes> implements chatRoomAttributes {
  id!: number;
  maker?: number;
  partner?: number;
  createDate?: string;
  modifyDate?: string;

  // chatRoom hasMany chatMessage via roomId
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
  // chatRoom belongsTo user via maker
  makerUser!: user;
  getMakerUser!: Sequelize.BelongsToGetAssociationMixin<user>;
  setMakerUser!: Sequelize.BelongsToSetAssociationMixin<user, userId>;
  createMakerUser!: Sequelize.BelongsToCreateAssociationMixin<user>;
  // chatRoom belongsTo user via partner
  partnerUser!: user;
  getPartnerUser!: Sequelize.BelongsToGetAssociationMixin<user>;
  setPartnerUser!: Sequelize.BelongsToSetAssociationMixin<user, userId>;
  createPartnerUser!: Sequelize.BelongsToCreateAssociationMixin<user>;

  static initModel(sequelize: Sequelize.Sequelize): typeof chatRoom {
    return sequelize.define('chatRoom', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    maker: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'user',
        key: 'id'
      }
    },
    partner: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'user',
        key: 'id'
      }
    },
    createDate: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    modifyDate: {
      type: DataTypes.DATEONLY,
      allowNull: true
    }
  }, {
    tableName: 'chat_room',
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
        name: "chat_room_user_id_fk",
        using: "BTREE",
        fields: [
          { name: "maker" },
        ]
      },
      {
        name: "chat_room_user_id_fk_2",
        using: "BTREE",
        fields: [
          { name: "partner" },
        ]
      },
    ]
  }) as typeof chatRoom;
  }
}
