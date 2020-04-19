const { configsRepository } = require('../repository');

const setConfig = ({ partition, sort }, attrs) => configsRepository
  .put({ ...attrs, partition, sort });

const getConfig = ({ partition, sort }) => configsRepository
  .get({ partition, sort });

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
};

module.exports = service;
