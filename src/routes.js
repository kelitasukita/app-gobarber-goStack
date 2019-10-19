import { Router } from 'express';
import user from './app/models/user';
import controllerUsuario from './app/controllers/controllerUsuario';

const rotas = new Router();

rotas.post('/users', controllerUsuario.store);

export default rotas;
