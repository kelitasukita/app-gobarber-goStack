import user from '../models/user';

class usuarioController {
 async store(req, res) {
   const verificaUsuario = await user.findOne({ where: { email: req.body.email } });

   if(verificaUsuario) {
     return res.status(400).json({ error: 'Usuário já existe' });
   }

   const { name, email, provider, password } = req.body;

   const { id } = await user.create({
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

}

export default new usuarioController();
