import { Router } from 'express';
const rotas = new Router();

rotas.get('/', (req, res) => {
  return res.json({ message: 'Hello rocketseat' });
})

export default rotas;