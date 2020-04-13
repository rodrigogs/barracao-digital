const crypto = require('crypto');
const { doctorsRepository } = require('../repository');
const { crm: crmProvider } = require('../providers');
const {
  ForbiddenError,
  BadRequestError,
  ConflictError,
  NotFoundError,
} = require('../errors/api');
const { isValidEmail, isValidCEP } = require('../helpers/format.helper');

const validateDoctorPayload = (doctor) => {
  if (!doctor.fu) throw new BadRequestError('O estado e obrigatório');
  if (!doctor.crm) throw new BadRequestError('O CRM é obrigatório');
  if (!doctor.email) throw new BadRequestError('O email é obrigatório');
  if (!isValidEmail(doctor.email)) throw new BadRequestError('Email inválido');
  if (!doctor.cep) throw new BadRequestError('O CEP é obrigatório');
  if (!isValidCEP(doctor.cep)) throw new BadRequestError('CEP inválido');
};

module.exports = {
  async create(doctor) {
    validateDoctorPayload(doctor);

    if (!doctor.username) throw new BadRequestError('O nome de usuário é obrigatório');

    const isUnique = !(await doctorsRepository.getOneByUsername(doctor.username));
    if (!isUnique) throw new ConflictError('An user with this username already exists');

    const result = await crmProvider.retrieve(doctor.fu, doctor.crm);
    const errorMessage = crmProvider.validate(result);
    if (errorMessage) throw new ForbiddenError('CRM inválido ou em sitação irregular');

    const password = crypto.createHash('md5').update(doctor.password).digest('hex');

    return doctorsRepository.create({ ...doctor, password });
  },

  async update(username, body) {
    validateDoctorPayload(body);

    const storedDoctor = await doctorsRepository.getOneByUsername(username);
    if (!storedDoctor) throw new NotFoundError('Médico não encontrado');

    const password = (body && body.password)
      ? crypto.createHash('md5').update(body.password).digest('hex')
      : storedDoctor.password;

    const updatedDoctor = {
      ...storedDoctor,
      ...body,
      username,
      password,
      version: storedDoctor.version,
    };
    return doctorsRepository.update(updatedDoctor);
  },

  async delete(username) {
    if (!username) return;
    await doctorsRepository.delete(username);
  },

  async getOneByUsername(username) {
    return doctorsRepository.getOneByUsername(username);
  },

  async getAllByCep(cep, { lastEvaluatedKey, pageSize }) {
    return doctorsRepository.getAllByCep(cep, { lastEvaluatedKey, pageSize });
  },

  async getAllByCepAndActive(cep, active, { lastEvaluatedKey, pageSize }) {
    return doctorsRepository.getAllByCepAndActive(cep, active, { lastEvaluatedKey, pageSize });
  },

  async alternateActive(username) {
    const storedDoctor = await doctorsRepository.getOneByUsername(username);
    return doctorsRepository.update({
      ...storedDoctor,
      active: !storedDoctor.active,
    });
  },
};
