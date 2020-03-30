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
  ticket,
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
  ticket,
  version,
});

const repository = {
  async create(object) {
    const fields = getValidFields(object);
    const patient = {
      ...fields,
      id: uuid(),
      sort: 'status#waiting',
      status: fields.status || 'waiting',
      age: Number(fields.age),
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
      version: Number(patient.version) + 1,
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

  async getAllByCepAndTimeWaiting(cep, timeWaiting) {
    const now = Date.now();
    const expectedTime = (now - timeWaiting);

    return dynamoDB.query({
      TableName: PATIENTS_TABLE,
      IndexName: 'cep',
      KeyConditionExpression: '#cep = :cep',
      FilterExpression: '#createdAt BETWEEN :expectedTime AND :now',
      ExpressionAttributeNames: {
        '#cep': 'cep',
        '#createdAt': 'createdAt',
      },
      ExpressionAttributeValues: {
        ':cep': cep,
        ':expectedTime': expectedTime,
        ':now': now,
      },
    }).promise().then((result) => result.Items);
  },

  async getAllByCepAndStatusAndTimeWaiting(cep, status, timeWaiting) {
    const now = Date.now();
    const expectedTime = (now - timeWaiting);

    return dynamoDB.query({
      TableName: PATIENTS_TABLE,
      IndexName: 'cep',
      KeyConditionExpression: '#cep = :cep AND #sort = :sort',
      FilterExpression: '#createdAt BETWEEN :expectedTime AND :now',
      ExpressionAttributeNames: {
        '#cep': 'cep',
        '#sort': 'sort',
        '#createdAt': 'createdAt',
      },
      ExpressionAttributeValues: {
        ':cep': cep,
        ':sort': `status#${status}`,
        ':expectedTime': expectedTime,
        ':now': now,
      },
    }).promise().then((result) => result.Items);
  },

  async getOneByTicket(ticket) {
    return dynamoDB.get({
      TableName: PATIENTS_TABLE,
      Key: {
        ticket,
      },
    }).promise().then((result) => result.Item);
  },
};

module.exports = repository;
