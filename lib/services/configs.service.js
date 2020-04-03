const { configsRepository } = require('../repository');

const service = {
  async getPatientsLastTicket() {
    return configsRepository.get({ partition: 'patients', sort: 'last_ticket' });
  },

  async setPatientsLastTicket(lastTicket) {
    const config = await service.getPatientsLastTicket();
    return configsRepository.put({
      ...config,
      partition: 'patients',
      sort: 'last_ticket',
      lastTicket,
    });
  },

  async getPatientMessagingToken(ticket) {
    const config = await configsRepository.get({ partition: `patients#${ticket}`, sort: 'messagingToken' });
    if (!config) return null;
    return config.token;
  },

  async setPatientMessagingToken(ticket, token) {
    const config = await service.getPatientMessagingToken(ticket);
    await configsRepository.put({
      ...config,
      partition: `patients#${ticket}`,
      sort: 'messagingToken',
      token,
    });
  }
};

module.exports = service;
