const { v4: uuid } = require('uuid');
const { dynamoDB } = require('../providers');
const { PATIENTS_TABLE } = require('../config');

const repository = {
  async create({
    name,
    age,
    meds,
    allergies,
    covenant,
    cep,
    phone,
    email,
    whatsapp,
    telegram,
    hangouts,
    skype,
    hasBeenAssisted,
  }) {
    const patient = {
      id: uuid(),
      sort: 'status#waiting',
      name,
      age,
      meds,
      allergies,
      covenant,
      cep,
      phone,
      email,
      whatsapp,
      telegram,
      hangouts,
      skype,
      status: 'waiting',
      hasBeenAssisted,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    await dynamoDB.put({
      TableName: PATIENTS_TABLE,
      Item: patient,
    }).promise();
    return patient;
  },

  async update(patient) {
    await dynamoDB.delete({
      TableName: PATIENTS_TABLE,
      Key: {
        id: patient.id,
      },
    }).promise();

    const updatedPatient = {
      ...patient,
      sort: `status#${patient.status}`,
      updatedAt: Date.now(),
    };

    await dynamoDB.put({
      TableName: PATIENTS_TABLE,
      Item: updatedPatient,
    }).promise();

    return updatedPatient;
  },

  async getAllByCep(cep) {
    return dynamoDB.query({
      TableName: PATIENTS_TABLE,
      IndexName: 'cep',
      KeyConditionExpression: '#cep = :cep',
      ExpressionAttributeNames: {
        '#cep': 'cep',
      },
      ExpressionAttributeValues: {
        ':cep': cep,
      },
    }).promise().then((result) => result.Items);
  },

  async getAllByCepAndStatus(cep, status) {
    return dynamoDB.query({
      TableName: PATIENTS_TABLE,
      IndexName: 'cep',
      KeyConditionExpression: '#cep = :cep AND #sort = :sort',
      ExpressionAttributeNames: {
        '#cep': 'cep',
        '#sort': 'sort',
      },
      ExpressionAttributeValues: {
        ':cep': cep,
        ':sort': `status#${status}`,
      },
    }).promise().then((result) => result.Items);
  },

  async getOneById(id) {
    return dynamoDB.get({
      TableName: PATIENTS_TABLE,
      Key: {
        id,
      },
    }).promise().then((result) => result.Item);
  },
};

module.exports = repository;
