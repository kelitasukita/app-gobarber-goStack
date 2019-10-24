import { Router } from 'express';

import UsuarioController from './app/controllers/UsuarioController';
import SessionController from './app/controllers/SessionController';

import authMiddleware from './app/middlewares/auth';

const rotas = new Router();

rotas.post('/users', UsuarioController.store);
rotas.post('/sessions', SessionController.store);

rotas.use(authMiddleware);

rotas.put('/users', UsuarioController.update);

export default rotas;
