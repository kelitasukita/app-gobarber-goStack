import * as Yup from 'yup';

import User from '../models/User';
import Appointment from '../models/Appointment';

class AppointmentController {
  async store(req, res) {
    const schema = Yup.object().shape({
      provider_id: Yup.number().required(),
      date: Yup.date().required()
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(401).json({ error: 'Falha na validação' });
    }

    const { provider_id, date } = req.body;

    /* Check se o id informado é de um provedor de serviços */

    const isProvider = await User.findOne({
      where: { id: provider_id, provider: true }
    });

    if (!isProvider) {
      return res.status(401).json({
        error: 'Você só pode fazer um agendamento com um provedor de serviços'
      });
    }

    const appointment = await Appointment.create({
      user_id: req.idUsuario, // Esse idUsuário vem do meu middleware de autenticação
      provider_id,
      date
    });

    return res.json(appointment);
  }
}

export default new AppointmentController();
