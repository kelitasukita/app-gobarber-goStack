import jwt from 'jsonwebtoken';
import { promisify } from 'util';

import authConfig from '../../config/auth';


export default async (req, res, next) => {
  const autorizacaoHeader = req.headers.authorization;

  if(!autorizacaoHeader) {
    return res.status(401).json({ error: 'Usuário não autorizado' });
  }

  const [, token] = autorizacaoHeader.split(' ');

  try {
    const decoded = await promisify(jwt.verify)(token, authConfig.secret);

    req.idUsuario = decoded.id;

    return next();
  } catch (erro) {
    return res.status(401).json({ error: 'Token inválido' });
  }

};
