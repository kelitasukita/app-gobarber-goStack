import jwt from 'jsonwebtoken';
import User from '../models/user';

import authConfig from '../../config/auth';

class SessionController {
  async store(req, res) {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });

    if(!user){
      return res.status(401).json({ error: 'Usuário não encontrado' });
    }

    if(!(await user.checarSenha(password))) {
      return res.status(401).json({ error: 'Senha não confere'});
    }

    const { id, name } = user;

    return res.json({
      user: {
        id,
      name,
      email,
      },
      token: jwt.sign({ id }, authConfig.secret, {
        expiresIn: authConfig.expireIn,
      }),

    });

  }
}

export default new SessionController();
