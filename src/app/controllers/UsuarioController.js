import * as Yup from 'yup';
import User from '../models/user';

class UsuarioController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      password: Yup.string()
        .min(6)
        .required()
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Falha na validação' });
    }

    const verificaUsuario = await User.findOne({
      where: { email: req.body.email }
    });

    if (verificaUsuario) {
      return res.status(400).json({ error: 'Usuário já existe' });
    }

    const { name, email, provider, password } = req.body;

    const { id } = await User.create({
      name,
      email,
      provider,
      password
    });

    return res.json({
      id,
      name,
      email,
      provider
    });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email(),
      oldPassword: Yup.string().min(6),
      password: Yup.string()
        .min(6)
        .when('oldPassword', (oldPassword, field) =>
          oldPassword ? field.required() : field
        ),
      confirmPassword: Yup.string().when('password', (password, field) =>
        password ? field.required().oneOf([Yup.ref('password')]) : field
      )
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Falha na validação' });
    }

    const { email, oldPassword } = req.body;

    const usuario = await User.findByPk(req.idUsuario);

    if (email !== usuario.email) {
      const verificaUsuario = await User.findOne({ where: { email } });

      if (verificaUsuario) {
        return res.status(400).json({ error: 'Usuário já existe' });
      }
    }

    if (oldPassword && !(await usuario.checarSenha(oldPassword))) {
      return res.status(401).json({ error: 'Senha não confere' });
    }

    const { id, name, provider } = await usuario.update(req.body);

    return res.json({
      id,
      name,
      email,
      provider
    });
  }
}

export default new UsuarioController();
