import express from 'express';
import path from 'path';

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
    this.servidor.use(
      '/files',
      express.static(path.resolve(__dirname, '..', 'temp', 'uploads'))
    );
  }

  minhasRotas() {
    this.servidor.use(rotas);
  }
}

export default new App().servidor;
