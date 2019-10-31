import { Router } from 'express';
import multer from 'multer';

import multerConfig from './config/multer';
import UsuarioController from './app/controllers/UsuarioController';
import SessionController from './app/controllers/SessionController';
import FileController from './app/controllers/FileController';
import ProviderController from './app/controllers/ProviderController';
import AppointmentController from './app/controllers/AppointmentController';

import authMiddleware from './app/middlewares/auth';

const rotas = new Router();
const upload = multer(multerConfig);

rotas.post('/users', UsuarioController.store);
rotas.post('/sessions', SessionController.store);

rotas.use(authMiddleware);

rotas.put('/users', UsuarioController.update);

rotas.get('/providers', ProviderController.index);

rotas.get('/appointments', AppointmentController.index);
rotas.post('/appointments', AppointmentController.store);

rotas.post('/files', upload.single('file'), FileController.store);

export default rotas;
