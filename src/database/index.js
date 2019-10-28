import Sequelize from 'sequelize';

import User from '../app/models/user';
import File from '../app/models/file';

import databaseConfig from '../config/database';

const models = [User, File];

class Database {
  constructor() {
    this.init();
  }

  init() {
    this.conexao = new Sequelize(databaseConfig);

    models
      .map(model => model.init(this.conexao))
      .map(model => model.associate && model.associate(this.conexao.models)); // Estou chamando o método static associate
  }
}

export default new Database();
