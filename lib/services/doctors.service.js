const { doctorsRepository } = require('../repository');

module.exports = {
  async create(doctor) {
    const isUnique = !(await doctorsRepository.getOneByUsername(doctor.username));
    if (!isUnique) throw new Error('An user with this username already exists');
    return doctorsRepository.create(doctor);
  },

  async update(username) {
    const storedDoctor = await doctorsRepository.getOneByUsername(username);
    if (!storedDoctor) throw new Error('Doctor Not Found');
    const updatedDoctor = {
      ...storedDoctor,
      active: !storedDoctor.active,
    };
    return doctorsRepository.update(updatedDoctor);
  },

  async getOneByUsername(username) {
    return doctorsRepository.getOneByUsername(username);
  },

  async getAllByCep(cep) {
    return doctorsRepository.getAllByCep(cep);
  },

  async getAllByCepAndActive(cep, active) {
    return doctorsRepository.getAllByCepAndActive(cep, active);
  },
};
