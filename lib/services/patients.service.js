const doctorsService = require('./doctors.service');
const facilitiesService = require('./facilities.service');
const { patientsRepository, configsRepository } = require('../repository');
const { distances: distancesProvider } = require('../providers');
const { promiseHelper } = require('../helpers');

const validateStatus = (status) => {
  const statuses = ['waiting', 'ongoing', 'finished', 'waiting_kit', 'cant_be_assisted', 'facility_not_available'];
  if (statuses.indexOf(status) === -1) {
    const err = new Error(`Invalid status "${status}"`);
    err.status = 400;
  }
};

const validateDistance = async (originCep, destinationCep) => {
  const results = await distancesProvider.distancematrix({
    origins: [originCep],
    destinations: [destinationCep],
    travelMode: 'DRIVING',
    region: 'BR',
  });
  console.log(JSON.stringify(results, null, 2));
  return true;
};

const getNextTicket = async (retries = 0) => {
  try {
    let config = await configsRepository.get({ partition: 'patients', sort: 'last_ticket' });
    if (!config) {
      config = await configsRepository.put({
        partition: 'patients',
        sort: 'last_ticket',
        lastTicket: '0',
        version: 0,
        lock: false,
      });
    }

    const { lastTicket } = config;
    const nextTicket = String(Number(lastTicket) + 1);
    await configsRepository.put({
      ...config,
      partition: 'patients',
      sort: 'last_ticket',
      lastTicket: nextTicket,
    });

    const prefix = String(Date.now()).substr(7);
    return `${prefix}${nextTicket}`;
  } catch (err) {
    if (err.message.startsWith('The conditional request failed') && retries < 10) {
      await promiseHelper.wait(200);
      return getNextTicket(retries + 1);
    }
    throw err;
  }
};

module.exports = {
  async create(patient) {
    if (patient.ticket) {
      const isTicketInUse = !!(await patientsRepository.getOneByTicket(patient.ticket));
      if (isTicketInUse) throw new Error('Ticket is already in use');
    }

    let status = 'waiting';

    // const facility = await facilitiesService.getOneByDestination(patient.cep);
    // if (!facility) status = 'facility_not_available';

    // const hasValidDistance = await validateDistance(facility.origin, patient.cep);
    // if (!hasValidDistance) status = 'facility_not_available';

    const activeDoctors = await doctorsService.getAllByCepAndActive(patient.cep, true);
    const canBeAssisted = (activeDoctors.length === 0);
    if (!canBeAssisted) status = 'cant_be_assisted';

    const created = await patientsRepository.create({
      ...patient,
      status,
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

  async getAllByCepAndStatusAndTimeWaiting(cep, status, timeWaiting) {
    return patientsRepository.getAllByCepAndStatusAndTimeWaiting(cep, status, timeWaiting);
  },

  async getOneByTicket(ticket) {
    return patientsRepository.getOneByTicket(ticket);
  },
};
