const { patientsRepository } = require('../repository');

module.exports = {
  async create(patient) {
    return patientsRepository.create(patient);
  },

  async update(cep, id, { status }) {
    const statuses = ['waiting', 'ongoing', 'finished', 'waiting_kit'];
    if (statuses.indexOf(status) === -1) {
      throw new Error(`Invalid status "${status}"`);
    }
    const storedPatient = await patientsRepository.getOneByCepAndId(cep, id);
    if (!storedPatient) throw new Error('Patient Not Found');
    const updatedPatient = {
      ...storedPatient,
      status,
    };
    return patientsRepository.update(updatedPatient);
  },

  async getAllByCep(cep) {
    return patientsRepository.getAllByCep(cep);
  },

  async getOneByCepAndId(cep, id) {
    return patientsRepository.getOneByCepAndId(cep, id);
  },
};
