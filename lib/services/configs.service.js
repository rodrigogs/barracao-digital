const configsRepository = require('../repository/configs.repository');

const setConfig = ({ partition, sort }, attrs) => configsRepository
  .put({ ...attrs, partition, sort });

const getConfig = ({ partition, sort }) => configsRepository
  .get({ partition, sort });

const removeConfig = ({ partition, sort }) => configsRepository
  .remove({ partition, sort });

const service = {
  async getPatientsLastTicket() {
    return configsRepository.get({ partition: 'patients', sort: 'last_ticket' });
  },

  async setPatientsLastTicket(lastTicket) {
    const config = await service.getPatientsLastTicket();
    return setConfig({ partition: 'patients', sort: 'last_ticket' }, { ...config, lastTicket });
  },

  async getPatientMessagingToken(ticket) {
    const config = await getConfig({ partition: `patients#${ticket}`, sort: 'messagingToken' });
    if (!config) return null;
    return config.token;
  },

  async setPatientMessagingToken(ticket, token) {
    const config = await getConfig({ partition: `patients#${ticket}`, sort: 'messagingToken' });
    return setConfig({ partition: `patients#${ticket}`, sort: 'messagingToken' }, { ...config, token });
  },

  async getDoctorMessagingToken(username) {
    const config = await getConfig({ partition: `doctors#${username}`, sort: 'messagingToken' });
    if (!config) return null;
    return config.token;
  },

  async setDoctorMessagingToken(username, token) {
    const config = await getConfig({ partition: `doctors#${username}`, sort: 'messagingToken' });
    return setConfig({ partition: `doctors#${username}`, sort: 'messagingToken' }, { ...config, token });
  },

  async createVideoSession(doctorUsername, patientTicket) {
    const videoSession = await configsRepository.createOpentokSession();
    const publisherToken = configsRepository.generateOpentokToken(videoSession.sessionId, { role: 'publisher' });
    const subscriberToken = configsRepository.generateOpentokToken(videoSession.sessionId, { role: 'subscriber' });
    const moderatorToken = configsRepository.generateOpentokToken(videoSession.sessionId, { role: 'moderator' });

    return setConfig({
      partition: `doctors#${doctorUsername}`,
      sort: `videoSession#${patientTicket}`,
    }, {
      ...videoSession,
      publisherToken,
      subscriberToken,
      moderatorToken,
    });
  },

  async getVideoSession(doctorUsername, patientTicket) {
    return getConfig({ partition: `doctors#${doctorUsername}`, sort: `videoSession#${patientTicket}` });
  },

  async removeVideoSession(doctorUsername, patientTicket) {
    return removeConfig({ partition: `doctors#${doctorUsername}`, sort: `videoSession#${patientTicket}` });
  },
};

module.exports = service;
