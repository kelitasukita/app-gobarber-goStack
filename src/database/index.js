import Sequelize from 'sequelize';

import User from '../app/models/user';

import databaseConfig from '../config/database';

const models = [User];

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
