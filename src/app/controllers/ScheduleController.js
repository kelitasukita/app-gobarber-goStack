import { startOfDay, endOfDay, parseISO } from 'date-fns';
import { Op } from 'sequelize';

import User from '../models/User';
import Appointment from '../models/Appointment';

class ScheduleController {
  async index(req, res) {
    const checkUserIsProvider = await User.findOne({
      where: { id: req.idUsuario, provider: true }
    });

    if (!checkUserIsProvider) {
      return res
        .status(401)
        .json({ error: 'Usuário não é prestador de serviços' });
    }

    const { date } = req.query;
    const parsedDate = parseISO(date);

    const appointments = await Appointment.findAll({
      where: {
        provider_id: req.idUsuario,
        canceled_at: null,
        date: {
          [Op.between]: [startOfDay(parsedDate), endOfDay(parsedDate)]
        }
      },
      order: ['date']
    });

    return res.json(appointments);
  }
}

export default new ScheduleController();
