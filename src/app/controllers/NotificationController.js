import Notification from '../schemas/Notification';
import User from '../models/User';

class NotificationController {
  async index(req, res) {
    const checkIsProvider = await User.findOne({
      where: { id: req.idUsuario, provider: true }
    });

    if (!checkIsProvider) {
      return res.status(401).json({
        error: 'Somente provedores de serviços podem listar notificações'
      });
    }

    const notifications = await Notification.find({
      user: req.idUsuario
    })
      .sort({ createdAt: 'desc' })
      .limit(20);

    return res.json(notifications);
  }

  async update(req, res) {
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      { read: true },
      { new: true } // Esse campo retorna a notificação já atualizada como lida
    );

    return res.json(notification);
  }
}

export default new NotificationController();
