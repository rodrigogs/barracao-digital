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
  async createSession(doctorUsername, patientTicket, { text, video }) {
    if (!text && !video) return;

    if (!doctorUsername) throw new BadRequestError('Nome de usuário não informado');
    if (!patientTicket) throw new BadRequestError('Ticket do paciente não informado');

    const storedPatient = await dispatch('patients', 'getOneByTicket')(patientTicket);
    if (!storedPatient) throw new NotFoundError('O paciente não existe');
    if (storedPatient.status !== ONGOING) throw new ForbiddenError('O atendimento do paciente não está em andamento');

    const storedDoctor = await dispatch('doctors', 'getOneByUsername')(doctorUsername);
    if (!storedDoctor) throw new NotFoundError('O médico não existe');
    if (!storedDoctor.active) throw new ForbiddenError('O médico não está atendendo');

    if (text) {
      await service.createTextSession(
        storedDoctor.cep,
        doctorUsername,
        patientTicket,
      );
    }

    if (video) await service.createVideoSession(storedDoctor, storedPatient);

    await dispatch('patients', 'sendPushNotification')(patientTicket, {
      title: 'O médico deseja iniciar uma conversa de vídeo com você',
      body: '',
    });

    await dispatch('jobs', 'scheduleConversationCleanupJob')({ doctorUsername, patientTicket });
  },

  async removeSession(facilityOrigin, doctorUsername, patientTicket) {
    await service.removeVideoSession(doctorUsername, patientTicket);
    await service.removeTextSession(facilityOrigin, doctorUsername, patientTicket);
  },

  async createTextSession(facilityCep, doctorUsername, patientTicket) {
    await conversationRepository.createTextSession(
      facilityCep,
      doctorUsername,
      patientTicket,
    );
    await dispatch('patients', 'setTextSession')(patientTicket, doctorUsername);
    await dispatch('doctors', 'addTextSession')(doctorUsername, patientTicket);
  },

  async removeTextSession(facilityOrigin, doctorUsername, patientTicket) {
    await conversationRepository.removeTextSession(facilityOrigin, doctorUsername, patientTicket);
    await dispatch('patients', 'removeTextSession')(patientTicket);
    await dispatch('doctors', 'removeTextSession')(doctorUsername, patientTicket);
  },

  async createVideoSession(doctor, patient) {
    const { sessionId } = await conversationRepository.createOpentokSession();
    const doctorToken = conversationRepository.generateOpentokToken(sessionId, { role: 'publisher' });
    const patientToken = conversationRepository.generateOpentokToken(sessionId, { role: 'publisher' });
    const moderatorToken = conversationRepository.generateOpentokToken(sessionId, { role: 'moderator' });

    const videoSession = await configsService.setVideoSession(doctor.username, patient.ticket, {
      doctor: doctor.username,
      patient: patient.ticket,
      sessionId,
      doctorToken,
      patientToken,
      moderatorToken,
    });

    await dispatch('patients', 'setVideoSession')(patient.ticket, {
      token: videoSession.patientToken,
      sessionId: videoSession.sessionId,
    });

    await dispatch('doctors', 'addVideoSession')(doctor.username, {
      patientTicket: patient.ticket,
      token: doctor.master
        ? videoSession.moderatorToken
        : videoSession.doctorToken,
      sessionId: videoSession.sessionId,
    });
  },

  async removeVideoSession(doctorUsername, patientTicket) {
    const videoSession = await configsService.getVideoSession(doctorUsername, patientTicket);
    if (!videoSession) return;
    await conversationRepository.terminateOpentokSession(videoSession);
    await dispatch('patients', 'removeVideoSession')(patientTicket);
    await dispatch('doctors', 'removeVideoSession')(doctorUsername, patientTicket);
    await configsService.removeVideoSession(doctorUsername, patientTicket);
  },

  async getVideoSession(doctorUsername, patientTicket) {
    return configsService.getVideoSession(doctorUsername, patientTicket);
  },
};

module.exports = service;