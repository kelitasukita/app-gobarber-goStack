import 'dotenv/config';

import express from 'express';
import path from 'path';
import * as Sentry from '@sentry/node';
import Youch from 'youch';

import sentryConfig from './config/sentry';
import 'express-async-errors';
import rotas from './routes';
import './database';

class App {
  constructor() {
    this.servidor = express();

    Sentry.init(sentryConfig);

    this.middlewares();
    this.minhasRotas();
    this.exceptionHandler();
  }

  middlewares() {
    this.servidor.use(Sentry.Handlers.requestHandler());
    this.servidor.use(express.json());
    this.servidor.use(
      '/files',
      express.static(path.resolve(__dirname, '..', 'temp', 'uploads'))
    );
  }

  minhasRotas() {
    this.servidor.use(rotas);
    this.servidor.use(Sentry.Handlers.errorHandler());
  }

  exceptionHandler() {
    // Middleware de tratamentos de exceção
    this.servidor.use(async (err, req, res, next) => {
      if (process.env.NODE_ENV === 'development') {
        // Qdo se recebe 4 paramentros no middleware o express automaticamente                                                         entende que se trata de um middleware de tratamentos de exceções.
        const errors = await new Youch(err, req).toJSON(); // o Youch vai mostrar o erro, na linguagem que eu definir, de uma forma melhor para o programador.

        return res.status(500).json(errors);
      }

      return res.status(500).json({ error: 'Internal server error' });
    });
  }
}

export default new App().servidor;
