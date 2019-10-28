import Sequelize from 'sequelize';

import User from '../app/models/User';
import File from '../app/models/File';
import Appointment from '../app/models/Appointment';

import databaseConfig from '../config/database';

const models = [User, File, Appointment];

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
