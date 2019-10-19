import Sequelize from 'sequelize';

import user from '../app/models/user';

import databaseConfig from '../config/database';

const models = [user];

class Database {
  constructor() {
    this.init();

  }

  init() {
    this.conexao = new Sequelize(databaseConfig);

    models.map(model => model.init(this.conexao));
  }
}

export default new Database();
