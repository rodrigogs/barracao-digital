/* eslint-disable camelcase */
const { v4: uuid } = require('uuid');
const { dynamoDB } = require('../providers/aws');
const { firestore } = require('../providers/firebase');
const { removeConditionalProps } = require('../helpers/object.helper');
const { PATIENT_STATUSES } = require('../enums');
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
  lastStatus,
  createdAt,
  updatedAt,
  ticket,
  version,
  waitingStatus,
  ongoingStatus,
  finishedStatus,
  waiting_kitStatus,
  cant_be_assistedStatus,
  facility_not_availableStatus,
  gave_upStatus,
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
  lastStatus,
  createdAt,
  updatedAt,
  ticket,
  version,
  waitingStatus,
  ongoingStatus,
  finishedStatus,
  waiting_kitStatus,
  cant_be_assistedStatus,
  facility_not_availableStatus,
  gave_upStatus,
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
      lastStatus: fields.lastStatus || 'waiting',
      createdAt,
      age: Number(fields.age),
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

  async updateReactiveDocument(patient) {
    const { originCep, ticket } = patient;

    const doc = firestore // /facilities/{cep}}/patients/{ticket}
      .collection('facilities')
      .doc(originCep)
      .collection('patients')
      .doc(ticket);

    const normalized = removeConditionalProps(patient, (value) => (
      (value === undefined)
      || (value === null)
      || (typeof value === 'string' && value.trim().length === 0) // No empty strings
    ));

    return doc.set(normalized);
  },

  async getAllByOriginCep(cep, { lastEvaluatedKey, pageSize = 10 }) {
    return parseDynamoQueryResult(await dynamoDB.query({
      TableName: PATIENTS_TABLE,
      IndexName: 'originCep',
      KeyConditionExpression: '#originCep = :originCep',
      FilterExpression: '#status <> :status',
      ExpressionAttributeNames: {
        '#originCep': 'originCep',
        '#status': 'status',
      },
      ExpressionAttributeValues: {
        ':originCep': cep,
        ':status': PATIENT_STATUSES.GAVE_UP,
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
