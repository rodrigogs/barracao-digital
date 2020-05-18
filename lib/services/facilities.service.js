const dispatch = require('./dispatcher');
const facilitiesRepository = require('../repository/facilities.repository');
const { PATIENT_STATUSES } = require('../enums');
const { BadRequestError, ConflictError, NotFoundError } = require('../errors/api');
const { isValidCEP, isValidEmail } = require('../helpers/format.helper');

const validateFacilityPayload = (facility) => {
  if (!facility.origin || !isValidCEP(facility.origin)) throw new BadRequestError('CEP inválido');
  if (facility.contactType === 'email' && !isValidEmail(facility.contact)) throw new BadRequestError('Email inválido');
};

const getActiveFacilityPatients = async (origin) => {
  const activeStatuses = [
    PATIENT_STATUSES.WAITING,
    PATIENT_STATUSES.ONGOING,
    PATIENT_STATUSES.WAITING_KIT,
    PATIENT_STATUSES.CANT_BE_ASSISTED,
  ];

  const results = await Promise.all(activeStatuses.map(async (status) => {
    const patients = [];
    let items;
    let lastEvaluatedKey;

    do {
      ({ items, lastEvaluatedKey } = await dispatch('patients', 'getAllByOriginCepAndStatus')(
        origin, status, { lastEvaluatedKey },
      ));
      patients.push(...items);
    } while (lastEvaluatedKey);
    return patients;
  }));

  return results.flat();
};

const service = {
  async create(facility) {
    validateFacilityPayload(facility);

    const storedFacility = await facilitiesRepository.getOneByOrigin(facility.origin);
    if (storedFacility) throw new ConflictError('Uma instalação com esta origem já existe');

    return facilitiesRepository.create({
      ...facility,
      destination: facility.origin,
    });
  },

  async update(origin, facility) {
    if (!isValidCEP(origin)) throw new BadRequestError('CEP da origem inválido');

    const storedFacility = await facilitiesRepository.getOneByOrigin(origin);
    if (!storedFacility) throw new NotFoundError('Instalação não encontrada');

    return facilitiesRepository.update({
      ...storedFacility,
      ...facility,
      origin,
      destination: origin,
      version: storedFacility.version,
    });
  },

  async delete(origin) {
    if (!origin) return;
    const destinations = await facilitiesRepository.getAllDestinationsByOrigin(origin);
    await service.removeOriginDestinations(origin, destinations);
    await facilitiesRepository.delete(origin);
  },

  async addOriginDestinations(origin, destinations) {
    if (!isValidCEP(origin)) throw new BadRequestError('CEP da origem inválido');

    const facility = await facilitiesRepository.getOneByOrigin(origin);
    if (!facility) throw new NotFoundError('Instalação não encontrada');

    const conflictingDestination = destinations.find((dest) => (dest === origin));
    if (conflictingDestination) throw new BadRequestError('Nenhum destino pode ser igual a origem');

    const invalidCeps = destinations.filter((destination) => !isValidCEP(destination));
    if (invalidCeps.length > 0) throw new BadRequestError(`CEPs inválidos: ${invalidCeps.join(',')}`);

    const destinationsToAdd = destinations.filter((destination) => destination !== origin);
    await facilitiesRepository.addOriginDestinations(origin, destinationsToAdd);
  },

  async removeOriginDestinations(origin, destinations) {
    const destinationsToRemove = destinations.filter((destination) => destination !== origin);
    await facilitiesRepository.removeOriginDestinations(origin, destinationsToRemove);
  },

  async getAll(type, { lastEvaluatedKey, pageSize }) {
    return facilitiesRepository.getAll(type, { lastEvaluatedKey, pageSize });
  },

  async getOneByOrigin(origin) {
    if (!isValidCEP(origin)) throw new BadRequestError('CEP da origem inválido');
    return facilitiesRepository.getOneByOrigin(origin);
  },

  async getAllByOrigin(origin) {
    if (!isValidCEP(origin)) throw new BadRequestError('CEP da origem inválido');
    return facilitiesRepository.getAllByOrigin(origin);
  },

  async getAllDestinationsByOrigin(origin) {
    if (!isValidCEP(origin)) throw new BadRequestError('CEP da origem inválido');
    return facilitiesRepository.getAllDestinationsByOrigin(origin);
  },

  async getOneByDestination(destination) {
    if (!isValidCEP(destination)) throw new BadRequestError('CEP do destino inválido');

    const facility = await facilitiesRepository.getOneByDestination(destination);
    if (!facility) throw new NotFoundError('Instalação não encontrada');

    return facilitiesRepository.getOneByOrigin(facility.origin);
  },

  async setActive(origin, isActive) {
    const facility = await facilitiesRepository.getOneByOrigin(origin);
    if (!facility) throw new NotFoundError('Instalação não encontrada');

    await facilitiesRepository.update({ ...facility, active: isActive });
  },

  async broadcastNewStatus(origin, isActive) {
    if (typeof isActive !== 'boolean') return;

    const facility = await service.getOneByOrigin(origin);
    if (!facility) throw new NotFoundError('Instalação não encontrada');

    await service.setActive(facility.origin, isActive);

    const facilityActivePatients = await getActiveFacilityPatients(facility.origin);

    await Promise.all(facilityActivePatients.map(async (patient) => {
      if (!isActive && patient.status !== PATIENT_STATUSES.CANT_BE_ASSISTED) {
        await dispatch('patients', 'setCantBeAssisted')(patient);
      }
      if (patient.status === PATIENT_STATUSES.CANT_BE_ASSISTED) {
        const statusMethod = {
          [PATIENT_STATUSES.WAITING]: 'setWaiting',
          [PATIENT_STATUSES.ONGOING]: 'setOngoing',
          [PATIENT_STATUSES.WAITING_KIT]: 'setWaitingKit',
          [PATIENT_STATUSES.FINISHED]: 'setFinished',
        }[patient.lastStatus];
        await dispatch('patients', statusMethod)(patient);
      }
    }));
  },
};

module.exports = service;
