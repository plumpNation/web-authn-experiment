import {
  DataTypes,
  type Sequelize,
  type ModelDefined,
} from "sequelize";

export type PublicKeyCredentialAttributes = {
  user_id: number;
  external_id: string;
  public_key: string;
};

export type PublicKeyCredentialCreationAttributes = PublicKeyCredentialAttributes;

export const create = (sequelize: Sequelize): ModelDefined<PublicKeyCredentialAttributes, PublicKeyCredentialCreationAttributes> => {
  const model = sequelize.define(
    'PublicKeyCredentials',
    {
      user_id: DataTypes.INTEGER.UNSIGNED,
      external_id: DataTypes.UUID,
      public_key: DataTypes.STRING,
    },
    {
      tableName: "public_key_credentials",
    },
  );

  return model;
};