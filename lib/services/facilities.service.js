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

  async update(origin, facility) {
    const storedFacility = await facilitiesRepository.getOneByOrigin(origin);
    if (!storedFacility) throw new Error('Facility not found');

    return facilitiesRepository.update({
      ...storedFacility,
      ...facility,
      origin,
      destination: origin,
    });
  },

  async addOriginDestinations(origin, destinations) {
    const facility = await facilitiesRepository.getOneByOrigin(origin);
    if (!facility) throw new Error('Facility not found');

    const conflictingDestination = destinations.find((dest) => (dest === origin));
    if (conflictingDestination) throw new Error('Origin and destination cant be equal');

    await Promise.all(destinations
      .map((destination) => facilitiesRepository.addOriginDestination(origin, destination)));
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
