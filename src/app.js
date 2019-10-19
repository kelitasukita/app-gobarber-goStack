import express from 'express';
import rotas from './routes';
import './database';

class App {
  constructor() {
    this.servidor = express();

    this.middlewares();
    this.minhasRotas();
  }

  middlewares() {
    this.servidor.use(express.json());
  }

  minhasRotas() {
    this.servidor.use(rotas);
  }

}

export default new App().servidor;
