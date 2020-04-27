const dispatch = require('./dispatcher');
const configsService = require('./configs.service');
const {
  ForbiddenError,
  BadRequestError,
  NotFoundError,
} = require('../errors/api');
const { ONGOING } = require('../enums/patientStatuses.enum');

const service = {
  async createSession(doctorUsername, patientTicket) {
    if (!doctorUsername) throw new BadRequestError('Nome de usuário não informado');
    if (!patientTicket) throw new BadRequestError('Ticket do paciente não informado');

    const storedPatient = await dispatch('patients', 'getOneByTicket')(patientTicket);
    if (!storedPatient) throw new NotFoundError('O paciente não existe');
    if (storedPatient.status !== ONGOING) throw new ForbiddenError('O atendimento do paciente não está em andamento');

    const storedDoctor = await dispatch('doctors', 'getOneByUsername')(doctorUsername);
    if (!storedDoctor) throw new NotFoundError('O médico não existe');
    if (!storedDoctor.active) throw new ForbiddenError('O médico não está atendendo');

    const videoSession = await configsService.createVideoSession(doctorUsername, patientTicket);
    await dispatch('patients', 'setVideoSession')(patientTicket, videoSession);
    await dispatch('jobs', 'scheduleVideoCallCleanupJob')({ doctorUsername, patientTicket });

    return {
      ...videoSession,
      token: storedDoctor.master
        ? videoSession.moderatorToken
        : videoSession.publisherToken,
      moderatorToken: undefined,
      publisherToken: undefined,
      subscriberToken: undefined,
      ot: undefined,
      partition: undefined,
      sort: undefined,
      version: undefined,
    };
  },

  async getVideoSession(doctorUsername, patientTicket) {
    return configsService.getVideoSession(doctorUsername, patientTicket);
  },

  async removeVideoSession(doctorUsername, patientTicket) {
    await dispatch('patients', 'removeVideoSession')(patientTicket);
    await configsService.removeVideoSession(doctorUsername, patientTicket);
  },
};

module.exports = service;
