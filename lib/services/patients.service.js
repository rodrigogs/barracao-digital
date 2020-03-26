const { patientsRepository, configsRepository } = require('../repository');
const doctorsService = require('./doctors.service');

const validateStatus = (status) => {
  const statuses = ['waiting', 'ongoing', 'finished', 'waiting_kit', 'cant_be_assisted'];
  if (statuses.indexOf(status) === -1) {
    const err = new Error(`Invalid status "${status}"`);
    err.status = 400;
  }
};

const getNextTicket = async () => {
  try {
    let config = await configsRepository.get({ partition: 'patients', sort: 'last_ticket' });
    if (!config) {
      config = await configsRepository.put({
        partition: 'patients',
        sort: 'last_ticket',
        attributes: { lastTicket: '0' },
        lock: false,
      });
    }
    const { lastTicket } = config;
    const nextTicket = String(Number(lastTicket) + 1);
    await configsRepository.put({ partition: 'patients', sort: 'last_ticket', attributes: { lastTicket } });
    return `${nextTicket}`.padStart(9, '0');
  } catch (err) {
    // This might be a "The conditional request failed" exception.
    // The way around it is to keep trying until you get an unlocked ticket.
    if (err.message.startsWith('The conditional request failed')) {
      return getNextTicket();
    }
    throw err;
  }
};

module.exports = {
  async create(patient) {
    const activeDoctors = await doctorsService.getAllByCepAndActive(patient.cep, true);
    const canBeAssisted = (activeDoctors.length === 0);
    const created = await patientsRepository.create({
      ...patient,
      status: canBeAssisted ? 'waiting' : 'cant_be_assisted',
      ticket: patient.ticket || await getNextTicket(),
    });
    return created;
  },

  async update(ticket, { status }) {
    validateStatus(status);

    const storedPatient = await patientsRepository.getOneByTicket(ticket);
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
    validateStatus(status);

    return patientsRepository.getAllByCepAndStatus(cep, status);
  },

  async getOneByTicket(ticket) {
    return patientsRepository.getOneByTicket(ticket);
  },
};
