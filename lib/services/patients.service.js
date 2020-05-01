/* eslint-disable camelcase */
const dispatch = require('./dispatcher');
const configsService = require('./configs.service');
const patientsRepository = require('../repository/patients.repository');
const firebase = require('../providers/firebase');
const { promiseHelper, formatHelper: { isValidCPF } } = require('../helpers');
const { BadRequestError, ConflictError, NotFoundError } = require('../errors/api');
const { PATIENT_STATUSES } = require('../enums');

const validateStatus = (status) => {
  const statuses = PATIENT_STATUSES.asArray;
  if (statuses.indexOf(status) === -1) throw new BadRequestError(`O status "${status}" é inválido`);
};

const validatePatientPayload = (patient) => {
  if (!patient.name) throw new BadRequestError('O nome é obrigatório');
  if (!patient.cep) throw new BadRequestError('O CEP é obrigatório');
  if (!patient.cpf) throw new BadRequestError('O CPF é obrigatório');
  if (!isValidCPF(patient.cpf)) throw new BadRequestError('O CPF é inválido');
};

const getNextTicket = async (retries = 0) => {
  try {
    let config = await configsService.getPatientsLastTicket();
    if (!config) config = await configsService.setPatientsLastTicket(0, 0);

    const { lastTicket } = config;
    const nextTicket = String(Number(lastTicket) + 1);

    await configsService.setPatientsLastTicket(nextTicket, config.version);
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

const service = {
  async create(patient) {
    validatePatientPayload(patient);

    if (patient.ticket) {
      const isTicketInUse = !!(await patientsRepository.getOneByTicket(patient.ticket));
      if (isTicketInUse) throw new ConflictError('Este ticket já foi utilizado');
    }

    let status = PATIENT_STATUSES.WAITING;
    let facility = null;

    try {
      facility = await dispatch('facilities', 'getOneByDestination')(patient.cep);
      const { items: [hasActiveDoctors] } = await dispatch('doctors', 'getAllByCepAndActive')(
        facility.origin,
        true,
        { pageSize: 1 },
      );
      if (!hasActiveDoctors) status = PATIENT_STATUSES.CANT_BE_ASSISTED;
    } catch (err) {
      if (err instanceof NotFoundError) {
        status = PATIENT_STATUSES.FACILITY_NOT_AVAILABLE;
      } else {
        throw err;
      }
    }

    const createdPatient = await patientsRepository.create({
      ...patient,
      status,
      lastStatus: PATIENT_STATUSES.WAITING,
      originCep: facility ? facility.origin : undefined,
      ticket: patient.ticket || await getNextTicket(),
      [`${PATIENT_STATUSES.ONGOING}Status`]: undefined,
      [`${PATIENT_STATUSES.FINISHED}Status`]: undefined,
      [`${PATIENT_STATUSES.WAITING_KIT}Status`]: undefined,
      [`${PATIENT_STATUSES.CANT_BE_ASSISTED}Status`]: undefined,
      [`${PATIENT_STATUSES.FACILITY_NOT_AVAILABLE}Status`]: undefined,
      [`${PATIENT_STATUSES.GAVE_UP}Status`]: undefined,
      [`${status}Status`]: {
        timestamp: Date.now(),
      },
    });

    if (createdPatient.originCep) await patientsRepository.updateReactiveDocument(createdPatient);

    return createdPatient;
  },

  async update(ticket, {
    status,
    lastStatus,
    ongoingStatus,
    waiting_kitStatus,
    finishedStatus,
    videoSession,
  }) {
    if (status) validateStatus(status);

    const storedPatient = await patientsRepository.getOneByTicket(ticket);
    if (!storedPatient) throw new NotFoundError('Patient Not Found');

    const resolveValue = (property, value) => {
      if (value === null) return undefined;
      if (value) return value;
      return storedPatient[property];
    };

    const updatingPatient = {
      ...storedPatient,
      status: resolveValue('status', status),
      lastStatus: resolveValue('lastStatus', lastStatus),
      ongoingStatus: resolveValue('ongoingStatus', ongoingStatus),
      waiting_kitStatus: resolveValue('waiting_kitStatus', waiting_kitStatus),
      finishedStatus: resolveValue('finishedStatus', finishedStatus),
      videoSession: resolveValue('videoSession', videoSession),
    };

    const updatedPatient = await patientsRepository.update(updatingPatient);
    if (updatedPatient.originCep) await patientsRepository.updateReactiveDocument(updatedPatient);
    return updatedPatient;
  },

  async getAllByOriginCep(cep, { lastEvaluatedKey, pageSize }) {
    return patientsRepository.getAllByOriginCep(cep, { lastEvaluatedKey, pageSize });
  },

  async getAllByOriginCepAndStatus(cep, status, { lastEvaluatedKey, pageSize }) {
    validateStatus(status);

    return patientsRepository
      .getAllByOriginCepAndStatus(cep, status, { lastEvaluatedKey, pageSize });
  },

  async getAllByOriginCepAndTimeWaiting(cep, timeWaiting, { lastEvaluatedKey, pageSize }) {
    return patientsRepository
      .getAllByOriginCepAndTimeWaiting(cep, timeWaiting, { lastEvaluatedKey, pageSize });
  },

  async getAllByOriginCepAndStatusAndTimeWaiting(
    cep,
    status,
    timeWaiting,
    { lastEvaluatedKey, pageSize },
  ) {
    validateStatus(status);

    return patientsRepository.getAllByOriginCepAndStatusAndTimeWaiting(
      cep,
      status,
      timeWaiting,
      { lastEvaluatedKey, pageSize },
    );
  },

  async getOneByTicket(ticket) {
    return patientsRepository.getOneByTicket(ticket);
  },

  async sendPushNotification(patientTicket, { title, body }) {
    try {
      const token = await configsService.getPatientMessagingToken(patientTicket);
      if (!token) return;
      const message = {
        token,
        notification: {
          title,
          body,
        },
        apns: {
          headers: {
            'apns-expiration': '0',
          },
        },
        android: {
          ttl: '0s',
        },
        webpush: {
          headers: {
            TTL: '0',
          },
        },
      };
      await firebase.messaging.send(message);
    } catch (err) {
      console.error('Error sending push notification:', err);
    }
  },

  async setCantBeAssisted(patient) {
    const updatedPatient = {
      ...patient,
      lastStatus: patient.status,
      status: PATIENT_STATUSES.CANT_BE_ASSISTED,
      [`${PATIENT_STATUSES.CANT_BE_ASSISTED}Status`]: {
        timestamp: Date.now(),
      },
    };
    const storedPatient = await service.update(patient.ticket, updatedPatient);
    await service.sendPushNotification(storedPatient.ticket, {
      title: 'O barracão onde você estava sendo atendido fechou',
      body: 'Infelizmente não poderemos lhe atender no momento.',
    });
    return storedPatient;
  },

  async setWaiting(patient) {
    const updatedPatient = {
      ...patient,
      status: PATIENT_STATUSES.WAITING,
      lastStatus: patient.status === PATIENT_STATUSES.CANT_BE_ASSISTED
        ? patient.lastStatus
        : patient.status,
      [`${PATIENT_STATUSES.WAITING}Status`]: {
        timestamp: Date.now(),
      },
    };
    const storedPatient = await service.update(patient.ticket, updatedPatient);
    await service.sendPushNotification(storedPatient.ticket, {
      title: 'Barracão disponível',
      body: 'O barracão da sua região está funcionando novamente',
    });
    return storedPatient;
  },

  async setOngoing(patient, user = {}, { message } = {}) {
    if (!message && !patient[`${PATIENT_STATUSES.ONGOING}Status`]) {
      throw new BadRequestError('O médico deve deixar uma mensagem para o paciente ao trocar o status para "Em atendimento"');
    }
    const patientFacility = await dispatch('facilities', 'getOneByOrigin')(patient.originCep);
    const oldStatus = patient[`${PATIENT_STATUSES.ONGOING}Status`];
    const updatedPatient = {
      ...patient,
      status: PATIENT_STATUSES.ONGOING,
      lastStatus: patient.status === PATIENT_STATUSES.CANT_BE_ASSISTED
        ? patient.lastStatus
        : patient.status,
      [`${PATIENT_STATUSES.ONGOING}Status`]: {
        doctorName: user.name || oldStatus.doctorName,
        doctorCrm: user.crm || oldStatus.doctorCrm,
        doctorState: user.fu || oldStatus.doctorState,
        doctorMessage: message || oldStatus.doctorMessage,
        facilityName: patientFacility.name || oldStatus.facilityName,
        timestamp: Date.now(),
      },
    };
    const storedPatient = await service.update(patient.ticket, updatedPatient);
    await service.sendPushNotification(storedPatient.ticket, {
      title: 'Um médico está dando andamento na sua solicitação',
      body: message,
    });
    return storedPatient;
  },

  async setWaitingKit(patient, user = {}, { message } = {}) {
    if (!message && !patient[`${PATIENT_STATUSES.WAITING_KIT}Status`]) {
      throw new BadRequestError('O médico deve deixar uma mensagem para o paciente ao trocar o status para "Aguardando kit"');
    }
    const patientFacility = await dispatch('facilities', 'getOneByOrigin')(patient.originCep);
    const oldStatus = patient[`${PATIENT_STATUSES.WAITING_KIT}Status`];
    const updatedPatient = {
      ...patient,
      status: PATIENT_STATUSES.WAITING_KIT,
      lastStatus: patient.status === PATIENT_STATUSES.CANT_BE_ASSISTED
        ? patient.lastStatus
        : patient.status,
      [`${PATIENT_STATUSES.WAITING_KIT}Status`]: {
        doctorName: user.name || oldStatus.doctorName,
        doctorCrm: user.crm || oldStatus.doctorCrm,
        doctorState: user.fu || oldStatus.doctorState,
        doctorMessage: message || oldStatus.doctorMessage,
        facilityName: patientFacility.name || oldStatus.facilityName,
        timestamp: Date.now(),
      },
    };
    const storedPatient = await service.update(patient.ticket, updatedPatient);
    await service.sendPushNotification(storedPatient.ticket, {
      title: 'Seu status foi alterado para "Aguardando kit"',
      body: message,
    });
    return storedPatient;
  },

  async setFinished(patient, user = {}, { message, outcome } = {}) {
    if (!outcome && !patient[`${PATIENT_STATUSES.FINISHED}Status`]) {
      throw new BadRequestError('O médico deve informar o desfecho do paciente ao trocar o status para "Finalizado"');
    }
    const patientFacility = await dispatch('facilities', 'getOneByOrigin')(patient.originCep);
    const oldStatus = patient[`${PATIENT_STATUSES.FINISHED}Status`];
    const updatedPatient = {
      ...patient,
      status: PATIENT_STATUSES.FINISHED,
      lastStatus: patient.status === PATIENT_STATUSES.CANT_BE_ASSISTED
        ? patient.lastStatus
        : patient.status,
      [`${PATIENT_STATUSES.FINISHED}Status`]: {
        doctorName: user.name || oldStatus.doctorName,
        doctorCrm: user.crm || oldStatus.doctorCrm,
        doctorState: user.fu || oldStatus.doctorState,
        doctorMessage: message || oldStatus.doctorMessage,
        facilityName: patientFacility.name || oldStatus.facilityName,
        patientOutcome: outcome || oldStatus.patientOutcome,
        patientFeedback: undefined,
        timestamp: Date.now(),
      },
    };
    const storedPatient = await service.update(patient.ticket, updatedPatient);
    await service.sendPushNotification(storedPatient.ticket, {
      title: 'Um médico finalizou seu atendimento',
      body: message,
    });
    return storedPatient;
  },

  async setGaveUp(patient) {
    const updatedPatient = {
      ...patient,
      status: PATIENT_STATUSES.GAVE_UP,
      lastStatus: patient.status === PATIENT_STATUSES.CANT_BE_ASSISTED
        ? patient.lastStatus
        : patient.status,
      [`${PATIENT_STATUSES.GAVE_UP}Status`]: {
        timestamp: Date.now(),
      },
    };
    return service.update(patient.ticket, updatedPatient);
  },

  async setPatientFeedback(patient, _user, { value }) {
    if (value < 1 || value > 5) {
      throw new BadRequestError('O feedback do paciente deve ser um número de 1 a 5');
    }
    const updatedPatient = {
      ...patient,
      [`${PATIENT_STATUSES.FINISHED}Status`]: {
        ...patient[`${PATIENT_STATUSES.FINISHED}Status`],
        patientFeedback: value,
      },
    };
    return service.update(patient.ticket, updatedPatient);
  },

  async setPatientMessagingToken(patient, _user, { token }) {
    if (!token) throw new BadRequestError('Token inválido');
    await configsService.setPatientMessagingToken(patient.ticket, token);
  },

  async setVideoSession(ticket, { token, sessionId }) {
    console.info(`Setting video session for patient "${ticket}"`);
    const updatedPatient = await service.update(ticket, {
      videoSession: {
        token,
        sessionId,
      },
    });

    await service.sendPushNotification(ticket, {
      title: 'O médico deseja iniciar uma conversa de vídeo com você',
      body: '',
    });

    return updatedPatient;
  },

  async removeVideoSession(ticket) {
    console.info(`Removing video session for patient "${ticket}"`);
    return service.update(ticket, { videoSession: null });
  },
};

module.exports = service;
