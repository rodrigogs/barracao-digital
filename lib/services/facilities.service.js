const { facilitiesRepository } = require('../repository');
const { BadRequestError, ConflictError, NotFoundError } = require('../errors/api');
const { isValidCEP, isValidEmail } = require('../helpers/format.helper');

const validateFacilityPayload = (facility) => {
  if (!facility.origin || !isValidCEP(facility.origin)) throw new BadRequestError('CEP inválido');
  if (facility.contactType === 'email' && !isValidEmail(facility.contact)) throw new BadRequestError('Email inválido');
};

module.exports = {
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
    await Promise.all(destinations
      .map((destination) => facilitiesRepository.removeOriginDestination(origin, destination)));
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

    await Promise.all(destinations
      .map((destination) => facilitiesRepository.addOriginDestination(origin, destination)));
  },

  async removeOriginDestinations(origin, destinations) {
    await Promise.all(destinations
      .map((destination) => facilitiesRepository.removeOriginDestination(origin, destination)));
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
};
