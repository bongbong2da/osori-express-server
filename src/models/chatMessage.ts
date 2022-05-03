import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { chatRoom, chatRoomId } from './chatRoom';
import type { user, userId } from './user';

export interface chatMessageAttributes {
  id: number;
  senderId: number;
  roomId: number;
  message: string;
  createDate?: string;
  modifyDate?: string;
  deleteDate?: string;
}

export type chatMessagePk = "id";
export type chatMessageId = chatMessage[chatMessagePk];
export type chatMessageOptionalAttributes = "id" | "createDate" | "modifyDate" | "deleteDate";
export type chatMessageCreationAttributes = Optional<chatMessageAttributes, chatMessageOptionalAttributes>;

export class chatMessage extends Model<chatMessageAttributes, chatMessageCreationAttributes> implements chatMessageAttributes {
  id!: number;
  senderId!: number;
  roomId!: number;
  message!: string;
  createDate?: string;
  modifyDate?: string;
  deleteDate?: string;

  // chatMessage belongsTo chatRoom via roomId
  room!: chatRoom;
  getRoom!: Sequelize.BelongsToGetAssociationMixin<chatRoom>;
  setRoom!: Sequelize.BelongsToSetAssociationMixin<chatRoom, chatRoomId>;
  createRoom!: Sequelize.BelongsToCreateAssociationMixin<chatRoom>;
  // chatMessage belongsTo user via senderId
  sender!: user;
  getSender!: Sequelize.BelongsToGetAssociationMixin<user>;
  setSender!: Sequelize.BelongsToSetAssociationMixin<user, userId>;
  createSender!: Sequelize.BelongsToCreateAssociationMixin<user>;

  static initModel(sequelize: Sequelize.Sequelize): typeof chatMessage {
    return sequelize.define('chatMessage', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    senderId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'user',
        key: 'id'
      },
      field: 'sender_id'
    },
    roomId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'chat_room',
        key: 'id'
      },
      field: 'room_id'
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    createDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      defaultValue: Sequelize.Sequelize.fn('sysdate')
    },
    modifyDate: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    deleteDate: {
      type: DataTypes.DATEONLY,
      allowNull: true
    }
  }, {
    tableName: 'chat_message',
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
        name: "chat_message_chat_room_id_fk",
        using: "BTREE",
        fields: [
          { name: "room_id" },
        ]
      },
      {
        name: "chat_message_user_id_fk",
        using: "BTREE",
        fields: [
          { name: "sender_id" },
        ]
      },
    ]
  }) as typeof chatMessage;
  }
}
