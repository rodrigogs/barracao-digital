const crypto = require('crypto');
const { doctorsRepository } = require('../repository');

const isValidEmail = (email) => {
  const re = /^(([^<>()\\[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
};

module.exports = {
  async create(doctor) {
    const isUnique = !(await doctorsRepository.getOneByUsername(doctor.username));
    if (!isUnique) throw new Error('An user with this username already exists');
    if (doctor.email && !isValidEmail(doctor.email)) throw new Error('Invalid email');
    return doctorsRepository.create(doctor);
  },

  async update(username, body) {
    const storedDoctor = await doctorsRepository.getOneByUsername(username);
    if (!storedDoctor) throw new Error('Doctor Not Found');
    if (body.email && !isValidEmail(body.email)) throw new Error('Invalid email');

    const password = (body && body.password)
      ? crypto.createHash('md5').update(body.password).digest('hex')
      : storedDoctor.password;

    const updatedDoctor = {
      ...storedDoctor,
      ...body,
      password,
      version: storedDoctor.version,
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

  async alternateActive(username) {
    const storedDoctor = await doctorsRepository.getOneByUsername(username);
    return doctorsRepository.update({
      ...storedDoctor,
      active: !storedDoctor.active,
    });
  },
};
