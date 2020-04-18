const { v4: uuid } = require('uuid');
const {
  aws: {
    dynamoDB,
  },
  firebase: {
    firestore,
  },
} = require('../providers');
const { PATIENTS_TABLE } = require('../config');

const parseDynamoQueryResult = (results) => {
  const items = results.Items;
  const lastEvaluatedKey = results.LastEvaluatedKey;

  return {
    items,
    lastEvaluatedKey,
  };
};

const getValidFields = ({
  id,
  name,
  age,
  meds,
  allergies,
  covenant,
  cep,
  originCep,
  cpf,
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
  ongoingFeedback = {
    doctorName: null,
    doctorCrm: null,
    doctorState: null,
    doctorMessage: null,
    facilityName: null,
  },
  waitingKitFeedback = {
    doctorName: null,
    doctorCrm: null,
    doctorState: null,
    doctorMessage: null,
    facilityName: null,
  },
  finishedFeedback = {
    doctorName: null,
    doctorCrm: null,
    doctorState: null,
    doctorMessage: null,
    facilityName: null,
    patientOutcome: null,
    patientFeedback: null,
  },
}) => ({
  id,
  name,
  age,
  meds,
  allergies,
  covenant,
  cep,
  originCep,
  cpf,
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
  ongoingFeedback,
  waitingKitFeedback,
  finishedFeedback,
});

const repository = {
  async create(object) {
    const fields = getValidFields(object);
    const createdAt = Date.now();
    const patient = {
      ...fields,
      id: uuid(),
      sort: `status#waiting#${createdAt}`,
      status: fields.status || 'waiting',
      age: Number(fields.age),
      createdAt,
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
      sort: `status#${patient.status}#createdAt#${patient.createdAt}`,
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

  async updateReactiveStatus(ticket, newStatus) {
    const doc = firestore.collection('patients').doc(ticket);
    return doc.set({
      status: newStatus,
      lastTimeUpdated: Date.now(),
    });
  },

  async getAllByOriginCep(cep, { lastEvaluatedKey, pageSize = 10 }) {
    return parseDynamoQueryResult(await dynamoDB.query({
      TableName: PATIENTS_TABLE,
      IndexName: 'originCep',
      KeyConditionExpression: '#originCep = :originCep',
      ExpressionAttributeNames: {
        '#originCep': 'originCep',
      },
      ExpressionAttributeValues: {
        ':originCep': cep,
      },
      Limit: pageSize > 20 ? 20 : pageSize,
      ExclusiveStartKey: lastEvaluatedKey,
      ScanIndexForward: true,
    }).promise());
  },

  async getAllByOriginCepAndStatus(cep, status, { lastEvaluatedKey, pageSize = 10 }) {
    return parseDynamoQueryResult(await dynamoDB.query({
      TableName: PATIENTS_TABLE,
      IndexName: 'originCep',
      KeyConditionExpression: '#originCep = :originCep AND begins_with(#sort, :sort)',
      ExpressionAttributeNames: {
        '#originCep': 'originCep',
        '#sort': 'sort',
      },
      ExpressionAttributeValues: {
        ':originCep': cep,
        ':sort': `status#${status}`,
      },
      Limit: pageSize > 20 ? 20 : pageSize,
      ExclusiveStartKey: lastEvaluatedKey,
      ScanIndexForward: true,
    }).promise());
  },

  async getAllByOriginCepAndTimeWaiting(
    cep,
    timeWaiting,
    { lastEvaluatedKey, pageSize = 10 },
  ) {
    const now = Date.now();
    const expectedTime = (now - timeWaiting);

    return parseDynamoQueryResult(await dynamoDB.query({
      TableName: PATIENTS_TABLE,
      IndexName: 'originCep',
      KeyConditionExpression: '#originCep = :originCep',
      FilterExpression: '#createdAt BETWEEN :expectedTime AND :now',
      ExpressionAttributeNames: {
        '#originCep': 'originCep',
        '#createdAt': 'createdAt',
      },
      ExpressionAttributeValues: {
        ':originCep': cep,
        ':expectedTime': expectedTime,
        ':now': now,
      },
      Limit: pageSize > 20 ? 20 : pageSize,
      ExclusiveStartKey: lastEvaluatedKey,
      ScanIndexForward: true,
    }).promise());
  },

  async getAllByOriginCepAndStatusAndTimeWaiting(
    cep,
    status,
    timeWaiting,
    { lastEvaluatedKey, pageSize = 10 },
  ) {
    const now = Date.now();
    const expectedTime = (now - timeWaiting);

    return parseDynamoQueryResult(await dynamoDB.query({
      TableName: PATIENTS_TABLE,
      IndexName: 'originCep',
      KeyConditionExpression: '#originCep = :originCep AND begins_with(#sort, :sort)',
      FilterExpression: '#createdAt BETWEEN :expectedTime AND :now',
      ExpressionAttributeNames: {
        '#originCep': 'originCep',
        '#sort': 'sort',
        '#createdAt': 'createdAt',
      },
      ExpressionAttributeValues: {
        ':originCep': cep,
        ':sort': `status#${status}`,
        ':expectedTime': expectedTime,
        ':now': now,
      },
      Limit: pageSize > 20 ? 20 : pageSize,
      ExclusiveStartKey: lastEvaluatedKey,
      ScanIndexForward: true,
    }).promise());
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
