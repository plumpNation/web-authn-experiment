import { Sequelize } from 'sequelize';

import { create as createUserModel } from './models/User.mts';
import { create as createPublicKeyCredentialModel } from './models/PublicKeyCredential.mts';

const sequelize = new Sequelize('sqlite::memory:');

export const user = createUserModel(sequelize);
export const publicKeyCredential = createPublicKeyCredentialModel(sequelize);

publicKeyCredential.belongsTo(user, { foreignKey: 'user_id' });
user.hasMany(publicKeyCredential, { foreignKey: 'user_id' });