import * as Yup from 'yup';
import { startOfHour, parseISO, isBefore, format, subHours } from 'date-fns';
import pt from 'date-fns/locale/pt';

import User from '../models/User';
import File from '../models/File';
import Appointment from '../models/Appointment';
import Notification from '../schemas/Notification';

import Queue from '../../lib/Queue';
import CancellationMail from '../jobs/CancellationMail';

class AppointmentController {
  async index(req, res) {
    const { page = 1 } = req.query;

    const appointmentList = await Appointment.findAll({
      where: { user_id: req.idUsuario, canceled_at: null },
      order: ['date'],
      attributes: ['id', 'date', 'past', 'cancelable'],
      limit: 20,
      offset: (page - 1) * 20,
      include: {
        model: User,
        as: 'provider',
        attributes: ['id', 'name'],
        include: [
          {
            model: File,
            as: 'avatar',
            attributes: ['id', 'path', 'url']
          }
        ]
      }
    });

    return res.json(appointmentList);
  }

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

    if (req.idUsuario === provider_id) {
      return res.status(401).json({ error: 'Não permitido autoagendamento' });
    }

    const checkIsProvider = await User.findOne({
      where: { id: provider_id, provider: true }
    });

    if (!checkIsProvider) {
      return res.status(401).json({
        error: 'Você só pode fazer agendamento com um provedor de serviços'
      });
    }

    /*
      Check se a data informada é uma data passada
    */

    const hourStart = startOfHour(parseISO(date)); // Essa variável vai guardar uma string com o date que será
    // transformado num dado do JS através do parseISO e o startOfHour vai fazer com q todos os horários serjam
    // arredondados para hora certa, não aceitando minutos, mas somente a hora redonda.

    if (isBefore(hourStart, new Date())) {
      return res.status(400).json({ error: 'Data passada, não permitida' });
    }

    /*
      Check se o Provider já não possui agendamento para data e dia informado
    */

    const checkDisponibilidade = await Appointment.findOne({
      where: {
        provider_id,
        canceled_at: null,
        date: hourStart
      }
    });

    if (checkDisponibilidade) {
      return res
        .status(400)
        .json({ error: 'Data de agendamento não disponível' });
    }

    const appointment = await Appointment.create({
      user_id: req.idUsuario, // Esse idUsuário vem do meu middleware de autenticação
      provider_id,
      date: hourStart
    });

    /*
      Notificar provedor de serviços sobre seus agendamentos
    */
    const user = await User.findByPk(req.idUsuario);
    const formatedDate = format(hourStart, "'dia' dd 'de' MMMM', às' H:mm'h'", {
      locale: pt
    });

    await Notification.create({
      content: `Novo agendamento de ${user.name} para o ${formatedDate}`,
      user: provider_id
    });

    return res.json(appointment);
  }

  async delete(req, res) {
    const appointment = await Appointment.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'provider',
          attributes: ['name', 'email']
        },
        {
          model: User,
          as: 'user',
          attributes: ['name']
        }
      ]
    });

    if (appointment.user_id !== req.idUsuario) {
      return res.status(401).json({
        error: 'Você não tem permissão para cancelar esse agengamento'
      });
    }

    const dataLimite = subHours(appointment.date, 2);

    if (isBefore(dataLimite, new Date())) {
      return res.status(401).json({
        error:
          'Cancelamento de agendamento permitido com no mínimo 2 horas de antecedência'
      });
    }

    appointment.canceled_at = new Date();

    await appointment.save();

    await Queue.add(CancellationMail.key, {
      appointment
    });

    return res.json(appointment);
  }
}

export default new AppointmentController();
