import { Router } from 'express';
import multer from 'multer';

import multerConfig from './config/multer';
import UsuarioController from './app/controllers/UsuarioController';
import SessionController from './app/controllers/SessionController';

import authMiddleware from './app/middlewares/auth';

const rotas = new Router();
const upload = multer(multerConfig);

rotas.post('/users', UsuarioController.store);
rotas.post('/sessions', SessionController.store);

rotas.use(authMiddleware);

rotas.put('/users', UsuarioController.update);

rotas.post('/files', upload.single('file'), (req, res) => {
  return res.json({ ok: true });
});

export default rotas;
