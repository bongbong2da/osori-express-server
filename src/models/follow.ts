import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { user, userId } from './user';

export interface followAttributes {
  id: number;
  follower?: number;
  followee?: number;
  createDate?: string;
}

export type followPk = "id";
export type followId = follow[followPk];
export type followOptionalAttributes = "id" | "follower" | "followee" | "createDate";
export type followCreationAttributes = Optional<followAttributes, followOptionalAttributes>;

export class follow extends Model<followAttributes, followCreationAttributes> implements followAttributes {
  id!: number;
  follower?: number;
  followee?: number;
  createDate?: string;

  // follow belongsTo user via follower
  followerUser!: user;
  getFollowerUser!: Sequelize.BelongsToGetAssociationMixin<user>;
  setFollowerUser!: Sequelize.BelongsToSetAssociationMixin<user, userId>;
  createFollowerUser!: Sequelize.BelongsToCreateAssociationMixin<user>;
  // follow belongsTo user via followee
  followeeUser!: user;
  getFolloweeUser!: Sequelize.BelongsToGetAssociationMixin<user>;
  setFolloweeUser!: Sequelize.BelongsToSetAssociationMixin<user, userId>;
  createFolloweeUser!: Sequelize.BelongsToCreateAssociationMixin<user>;

  static initModel(sequelize: Sequelize.Sequelize): typeof follow {
    return sequelize.define('follow', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    follower: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'user',
        key: 'id'
      }
    },
    followee: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'user',
        key: 'id'
      }
    },
    createDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      defaultValue: Sequelize.Sequelize.fn('sysdate'),
      field: 'create_date'
    }
  }, {
    tableName: 'follows',
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
        name: "follows_user_id_fk",
        using: "BTREE",
        fields: [
          { name: "follower" },
        ]
      },
      {
        name: "follows_user_id_fk_2",
        using: "BTREE",
        fields: [
          { name: "followee" },
        ]
      },
    ]
  }) as typeof follow;
  }
}
