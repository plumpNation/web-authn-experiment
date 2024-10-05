import {
  DataTypes,
  type Sequelize,
  type ModelDefined,
  type Optional,
} from "sequelize";

export type UserAttributes = {
  id: string;
  name: number;
  certificate?: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type UserCreationAttributes = Optional<
  UserAttributes,
  'id' | 'createdAt' | 'updatedAt' | 'certificate'
>;

export type UserModel = ModelDefined<UserAttributes, UserCreationAttributes>;

export const create = (
  sequelize: Sequelize,
): UserModel =>
  sequelize.define(
    'User',
    {
      id: {
          type: DataTypes.INTEGER.UNSIGNED,
          autoIncrement: true,
          primaryKey: true
      },
      name: DataTypes.STRING,
      certificate: DataTypes.STRING,
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
    },
    {
      tableName: 'users',
    },
  );