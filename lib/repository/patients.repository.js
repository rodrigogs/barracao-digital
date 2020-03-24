const { v4: uuid } = require('uuid');
const { dynamoDB } = require('../providers');
const { SINGLE_TABLE } = require('../config');

const patientsTable = dynamoDB.singleTableDriver(SINGLE_TABLE);

const repository = {
  async create({
    name,
    age,
    meds,
    allergies,
    covenant,
    cep,
    contact,
    contactType,
  }) {
    const patient = {
      id: uuid(),
      name,
      age,
      meds,
      allergies,
      covenant,
      cep,
      contact,
      contactType,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    return patientsTable.put({
      partition: `patients#${patient.cep}`,
      sort: `name#${patient.name}status#${patient.status}id#${patient.id}`,
      item: patient,
    });
  },

  async update(patient) {
    // eslint-disable-next-line no-underscore-dangle
    await patientsTable.delete({ partition: patient.__pk, sort: patient.__sk });
    await patientsTable.put({
      partition: `patients#${patient.cep}`,
      sort: `name#${patient.name}status#${patient.status}id#${patient.id}`,
      item: patient,
    });
  },

  getAllByCep(cep) {
    return patientsTable.query({ partition: `patients#${cep}` });
  },

  async getOneByCepAndId(cep, id) {
    const results = await patientsTable.query({
      partition: `patients#${cep}`,
      filter: `id${id}`,
      limit: 1,
    });
    return results[0];
  },
};

module.exports = repository;
