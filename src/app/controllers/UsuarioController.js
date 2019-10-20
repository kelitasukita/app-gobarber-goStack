import User from '../models/user';

class UsuarioController {
 async store(req, res) {
   const verificaUsuario = await User.findOne({ where: { email: req.body.email } });

   if(verificaUsuario) {
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
     provider,
   });
 }

 async update(req, res) {
  const { email, oldPassword } = req.body;

  const usuario = await User.findByPk(req.idUsuario);

  if(email !== usuario.email) {
    const verificaUsuario = await User.findOne({ where: { email } });

    if(verificaUsuario) {
     return res.status(400).json({ error: 'Usuário já existe' });
   }
  }

  if(oldPassword && !(await usuario.checarSenha(oldPassword))) {
    return res.status(401).json({ error: 'Senha não confere' });
  }

  const { id, name, provider } = await usuario.update(req.body);

  return res.json({
    id,
    name,
    email,
    provider,
  });
 }

}

export default new UsuarioController();
