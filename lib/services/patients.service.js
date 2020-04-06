const doctorsService = require('./doctors.service');
const facilitiesService = require('./facilities.service');
const configsService = require('./configs.service');
const { patientsRepository } = require('../repository');
const { distances: distancesProvider, firebase } = require('../providers');
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
    let config = await configsService.getPatientsLastTicket();
    if (!config) config = await configsService.setPatientsLastTicket(0, 0);

    const { lastTicket } = config;
    const nextTicket = String(Number(lastTicket) + 1);

    await configsService.setPatientsLastTicket(nextTicket, config.version);

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

const sendPushNotification = async (patientTicket, { title, body }) => {
  try {
    const token = await configsService.getPatientMessagingToken(patientTicket);
    if (!token) return;
    console.log('Sending push notifications to:', token);
    var message = {
      token,
      notification: {
        title,
        body,
      },
    };
    await firebase.messaging.send(message);
  } catch (err) {
    console.error('Error sending push notification:', err);
  }
};

// FIXME remove
const _sendTestPushNotification = async (patientTicket, payload) => {
  try {
    const token = await configsService.getPatientMessagingToken(patientTicket);
    if (!token) return;
    console.log('Sending push notifications to:', token);
    var message = {
      token,
      ...payload,
    };
    await firebase.messaging.send(message);
    return { token };
  } catch (err) {
    console.error('Error sending push notification:', err);
  }
};

const service = {
  // FIXME remove
  async _sendTestPushNotification(patientTicket, payload) {
    return _sendTestPushNotification(patientTicket, payload);
  },

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

  async update(ticket, {
    status,
    ongoingDoctorDoctorName,
    ongoingDoctorUsername,
    ongoingDoctorFeedback,
    waitingKitDoctorDoctorName,
    waitingKitDoctorUsername,
    waitingKitDoctorFeedback,
    finishedDoctorDoctorName,
    finishedDoctorUsername,
    finishedDoctorFeedback,
    patientFeedback,
  }) {
    validateStatus(status);

    const storedPatient = await patientsRepository.getOneByTicket(ticket);
    if (!storedPatient) throw new NotFoundError('Patient Not Found');

    const updatedPatient = {
      ...storedPatient,
      status,
      ongoingDoctorDoctorName,
      ongoingDoctorUsername,
      ongoingDoctorFeedback,
      waitingKitDoctorDoctorName,
      waitingKitDoctorUsername,
      waitingKitDoctorFeedback,
      finishedDoctorDoctorName,
      finishedDoctorUsername,
      finishedDoctorFeedback,
      patientFeedback,
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

  async setOngoing(patient, user, { message }) {
    if (!message) {
      throw new BadRequestError('O médico deve deixar uma mensagem para o paciente ao trocar o status para "Em atendimento"');
    }
    const updatedPatient = {
      ...patient,
      status: 'ongoing',
      ongoingDoctorDoctorName: user.name,
      ongoingDoctorUsername: user.username,
      ongoingDoctorFeedback: message || undefined,
    };
    const storedPatient = await service.update(patient.ticket, updatedPatient);
    await sendPushNotification(storedPatient.ticket, {
      title: `O médico ${user.name} está dando andamento na sua solicitação`,
      body: message,
    });
    return storedPatient;
  },

  async setWaitingKit(patient, user, { message }) {
    if (!message) {
      throw new BadRequestError('O médico deve deixar uma mensagem para o paciente ao trocar o status para "Aguardando kit"');
    }
    const updatedPatient = {
      ...patient,
      status: 'waiting_kit',
      waitingKitDoctorDoctorName: user.name,
      waitingKitDoctorUsername: user.username,
      waitingKitDoctorFeedback: message || undefined,
    };
    const storedPatient = await service.update(patient.ticket, updatedPatient);
    await sendPushNotification(storedPatient.ticket, {
      title: `O médico ${user.name} alterou seu status para "Aguardando kit"`,
      body: message,
    });
    return storedPatient;
  },

  async setFinished(patient, user, { message }) {
    const updatedPatient = {
      ...patient,
      status: 'finished',
      finishedDoctorDoctorName: user.name,
      finishedDoctorUsername: user.username,
      finishedDoctorFeedback: message || undefined,
    };
    const storedPatient = await service.update(patient.ticket, updatedPatient);
    await sendPushNotification(storedPatient.ticket, {
      title: `O médico ${user.name} alterou seu status para "Finalizado"`,
      body: message,
    });
    return storedPatient;
  },

  async setPatientFeedback(patient, _user, { value }) {
    if (value < 1 || value > 10) {
      throw new BadRequestError('O feedback do paciente deve ser um número de 1 a 10');
    }
    const updatedPatient = {
      ...patient,
      patientFeedback: value,
    };
    const storedPatient = await service.update(patient.ticket, updatedPatient);
    return storedPatient;
  },

  async setPatientMessagingToken(patient, _user, { token }) {
    if (!token) throw new BadRequestError('Token inválido');
    await configsService.setPatientMessagingToken(patient.ticket, token);
  },
};

module.exports = service;
