const { v4: uuid } = require('uuid');
const { dynamoDB } = require('../providers');
const { PATIENTS_TABLE } = require('../config');

const getValidFields = ({
  id,
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
  status,
  createdAt,
  updatedAt,
  version,
}) => ({
  id,
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
  status,
  createdAt,
  updatedAt,
  version,
});

const repository = {
  async create(object) {
    const fields = getValidFields(object);
    const patient = {
      ...fields,
      id: uuid(),
      sort: 'status#waiting',
      status: 'waiting',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      version: 0,
    };
    await dynamoDB.put({
      TableName: PATIENTS_TABLE,
      Item: patient,
    }).promise();
    return patient;
  },

  async update(object) {
    const fields = getValidFields(object);
    const patient = { ...fields };
    const previousVersion = patient.version;
    const updatedPatient = {
      ...patient,
      sort: `status#${patient.status}`,
      updatedAt: Date.now(),
      version: patient.version + 1,
    };

    await dynamoDB.put({
      TableName: PATIENTS_TABLE,
      Item: updatedPatient,
      ConditionExpression: '#version = :expectedVersion',
      ExpressionAttributeNames: {
        '#version': 'version',
      },
      ExpressionAttributeValues: {
        ':expectedVersion': previousVersion,
      },
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
