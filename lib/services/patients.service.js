const doctorsService = require('./doctors.service');
const facilitiesService = require('./facilities.service');
const { patientsRepository, configsRepository } = require('../repository');
const { distances: distancesProvider } = require('../providers');
const { promiseHelper } = require('../helpers');
const { BadRequestError, ConflictError, NotFoundError } = require('../errors/api');

const validateStatus = (status) => {
  const statuses = ['waiting', 'ongoing', 'finished', 'waiting_kit', 'cant_be_assisted', 'facility_not_available'];
  if (statuses.indexOf(status) === -1) throw new BadRequestError(`O status "${status}" é inválido`);
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
    // Timestamp: 1585515307603
    // Ticket:        000000000
    const prefix = String(Date.now()).substr(nextTicket.length + 4);
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
      if (isTicketInUse) throw new ConflictError('Este ticket já foi utilizado');
    }

    let status = 'waiting';

    try {
      const facility = await facilitiesService.getOneByDestination(patient.cep);
      const activeDoctors = await doctorsService.getAllByCepAndActive(facility.origin, true);
      if (activeDoctors.length === 0) status = 'cant_be_assisted';
    } catch (err) {
      if (err instanceof NotFoundError) {
        status = 'facility_not_available';
      } else {
        throw err;
      }
    }

    // const hasValidDistance = await validateDistance(facility.origin, patient.cep);
    // if (!hasValidDistance) status = 'facility_not_available';

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
    if (!storedPatient) throw new NotFoundError('Patient Not Found');

    const updatedPatient = {
      ...storedPatient,
      status,
    };

    return patientsRepository.update(updatedPatient);
  },

  async getAllByCep(cep) {
    const patientfacility = await facilitiesService.getOneByDestination(cep);
    const facilityDestinations = await facilitiesService
      .getAllDestinationsByOrigin(patientfacility.origin);

    const results = await Promise.all(
      facilityDestinations
        .map((destination) => patientsRepository.getAllByCep(destination)),
    );

    return results.flatMap((patient) => patient);
  },

  async getAllByCepAndStatus(cep, status) {
    validateStatus(status);

    const patientfacility = await facilitiesService.getOneByDestination(cep);
    const facilityDestinations = await facilitiesService
      .getAllDestinationsByOrigin(patientfacility.origin);

    const results = await Promise.all(
      facilityDestinations
        .flatMap((destination) => patientsRepository.getAllByCepAndStatus(destination, status)),
    );

    return results.flatMap((patient) => patient);
  },

  async getAllByCepAndTimeWaiting(cep, timeWaiting) {
    const patientfacility = await facilitiesService.getOneByDestination(cep);
    const facilityDestinations = await facilitiesService
      .getAllDestinationsByOrigin(patientfacility.origin);

    const results = await Promise.all(
      facilityDestinations
        .flatMap((destination) => patientsRepository
          .getAllByCepAndTimeWaiting(destination, timeWaiting)),
    );

    return results.flatMap((patient) => patient);
  },

  async getAllByCepAndStatusAndTimeWaiting(cep, status, timeWaiting) {
    validateStatus(status);

    const patientfacility = await facilitiesService.getOneByDestination(cep);
    const facilityDestinations = await facilitiesService
      .getAllDestinationsByOrigin(patientfacility.origin);

    const results = await Promise.all(
      facilityDestinations
        .flatMap((destination) => patientsRepository
          .getAllByCepAndStatusAndTimeWaiting(destination, status, timeWaiting)),
    );

    return results.flatMap((patient) => patient);
  },

  async getOneByTicket(ticket) {
    return patientsRepository.getOneByTicket(ticket);
  },
};
