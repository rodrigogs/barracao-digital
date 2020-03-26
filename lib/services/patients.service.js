const { patientsRepository, configsRepository } = require('../repository');

module.exports = {
  async create(patient) {
    const lastKey = await configsRepository.get({ partition: 'patients', sort: 'last_key' });
    const created = await patientsRepository.create({ ...patient, key: (lastKey + 1) });
    await configsRepository.put({ partition: 'patients', sort: 'last_key', attributes: { key: created.key } });
    return created;
  },

  async update(key, { status }) {
    const statuses = ['waiting', 'ongoing', 'finished', 'waiting_kit'];
    if (statuses.indexOf(status) === -1) {
      throw new Error(`Invalid status "${status}"`);
    }

    const storedPatient = await patientsRepository.getOneByKey(key);
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

  async getAllByCepAndStatus(cep, status) {
    return patientsRepository.getAllByCepAndStatus(cep, status);
  },

  async getOneByKey(key) {
    return patientsRepository.getOneByKey(key);
  },
};
