const { facilitiesRepository } = require('../repository');

module.exports = {
  async create(facility) {
    const storedFacility = await facilitiesRepository.getOneByOrigin(facility.origin);
    if (storedFacility) throw new Error('Facility already exists');

    return facilitiesRepository.create({
      ...facility,
      destination: facility.origin,
    });
  },

  async addOriginDestination(origin, destination) {
    if (origin === destination) throw new Error('Origin and destination cant be equal');

    const facility = await facilitiesRepository.getOneByOrigin(origin);
    if (!facility) throw new Error('Facility not found');

    return facilitiesRepository.addOriginDestination(origin, destination);
  },

  async getOneByOrigin(origin) {
    return facilitiesRepository.getOneByOrigin(origin);
  },

  async getAllByOrigin(origin) {
    return facilitiesRepository.getAllByOrigin(origin);
  },

  async getAllDestinationsByOrigin(origin) {
    return facilitiesRepository.getAllDestinationsByOrigin(origin);
  },

  async getOneByDestination(destination) {
    const facility = await facilitiesRepository.getOneByDestination(destination);
    if (!facility) throw new Error('Facility not found');

    return facilitiesRepository.getAllByOrigin(facility.origin);
  },
};
