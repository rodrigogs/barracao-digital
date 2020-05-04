const dispatch = require('./dispatcher');
const configsService = require('./configs.service');
const conversationRepository = require('../repository/conversation.repository');
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

    const { sessionId } = await conversationRepository.createOpentokSession();
    const doctorToken = conversationRepository.generateOpentokToken(sessionId, { role: 'publisher' });
    const patientToken = conversationRepository.generateOpentokToken(sessionId, { role: 'publisher' });
    const moderatorToken = conversationRepository.generateOpentokToken(sessionId, { role: 'moderator' });

    const videoSession = await configsService.setVideoSession(doctorUsername, patientTicket, {
      doctor: doctorUsername,
      patient: patientTicket,
      sessionId,
      doctorToken,
      patientToken,
      moderatorToken,
    });

    await dispatch('patients', 'setVideoSession')(patientTicket, {
      token: videoSession.patientToken,
      sessionId: videoSession.sessionId,
    });

    await dispatch('doctors', 'addVideoSession')(doctorUsername, {
      patientTicket,
      token: storedDoctor.master
        ? videoSession.moderatorToken
        : videoSession.doctorToken,
      sessionId: videoSession.sessionId,
    });

    await dispatch('jobs', 'scheduleConversationCleanupJob')({ doctorUsername, patientTicket });

    return {
      sessionId,
      token: storedDoctor.master
        ? videoSession.moderatorToken
        : videoSession.doctorToken,
    };
  },

  async removeSession(facilityOrigin, doctorUsername, patientTicket) {
    await service.removeVideoSession(doctorUsername, patientTicket);
    await service.removeTextSession(facilityOrigin, doctorUsername, patientTicket);
  },

  async getVideoSession(doctorUsername, patientTicket) {
    return configsService.getVideoSession(doctorUsername, patientTicket);
  },

  async removeVideoSession(doctorUsername, patientTicket) {
    const videoSession = await configsService.getVideoSession(doctorUsername, patientTicket);
    if (!videoSession) return;
    await conversationRepository.terminateOpentokSession(videoSession);
    await dispatch('patients', 'removeVideoSession')(patientTicket);
    await dispatch('doctors', 'removeVideoSession')(doctorUsername, patientTicket);
    await configsService.removeVideoSession(doctorUsername, patientTicket);
  },

  async removeTextSession(facilityOrigin, doctorUsername, patientTicket) {
    conversationRepository.removeTextSession(facilityOrigin, doctorUsername, patientTicket);
  },
};

module.exports = service;
