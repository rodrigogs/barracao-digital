const { v4: uuid } = require('uuid');
const { DOCTORS_TABLE } = require('../config');
const { dynamoDB } = require('../providers/aws');
const { firestore } = require('../providers/firebase');
const { removeConditionalProps } = require('../helpers/object.helper');

const parseDynamoQueryResult = (results) => {
  const items = results.Items;
  const lastEvaluatedKey = results.LastEvaluatedKey;

  return {
    items,
    lastEvaluatedKey,
  };
};

const getValidFields = ({
  name,
  username,
  password,
  cep,
  email,
  fu,
  crm,
  specialty,
  active,
  master,
  admin,
}) => ({
  name,
  username,
  password,
  cep,
  email,
  fu,
  crm,
  specialty,
  active,
  master,
  admin,
});

const repository = {
  async create(object) {
    const fields = getValidFields(object);
    const doctor = {
      id: uuid(),
      username: fields.username,
      sort: `active#${false}`,
      name: fields.name,
      specialty: fields.specialty,
      password: fields.password,
      cep: fields.cep,
      email: fields.email,
      fu: fields.fu,
      crm: fields.crm,
      active: false,
      master: fields.master,
      admin: fields.admin,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      version: 0,
    };

    await dynamoDB.put({
      TableName: DOCTORS_TABLE,
      Item: doctor,
    }).promise();

    await repository.updateReactiveDocument(doctor);

    return doctor;
  },

  async update(doctor) {
    const fields = getValidFields(doctor);
    const updatedDoctor = {
      ...fields,
      sort: `active#${doctor.active}`,
      createdAt: doctor.createdAt,
      updatedAt: Date.now(),
      version: doctor.version + 1,
    };

    await dynamoDB.put({
      TableName: DOCTORS_TABLE,
      Item: updatedDoctor,
      ConditionExpression: '#version = :expectedVersion',
      ExpressionAttributeNames: {
        '#version': 'version',
      },
      ExpressionAttributeValues: {
        ':expectedVersion': doctor.version,
      },
    }).promise();

    await repository.updateReactiveDocument(updatedDoctor);

    return updatedDoctor;
  },

  async delete(username) {
    const storedDoctor = await repository.getOneByUsername(username);
    if (!storedDoctor) return;

    await dynamoDB.delete({
      TableName: DOCTORS_TABLE,
      Key: { username: storedDoctor.username },
      ConditionExpression: '#version = :expectedVersion',
      ExpressionAttributeNames: {
        '#version': 'version',
      },
      ExpressionAttributeValues: {
        ':expectedVersion': storedDoctor.version,
      },
    }).promise();

    await repository.updateReactiveDocument(storedDoctor, true);
  },

  async updateReactiveDocument(doctor, remove) {
    const doc = firestore // /facilities/{cep}}
      .collection('facilities')
      .doc(doctor.cep)
      .collection('doctors')
      .doc(doctor.username);

    if (remove) {
      await doc.get().then((d) => d && d.ref && d.ref.delete());
    }

    const normalized = removeConditionalProps(doctor, (value) => (
      (value === undefined)
      || (value === null)
      || (typeof value === 'string' && value.trim().length === 0) // No empty strings
    ));

    return doc.set(normalized);
  },

  async getOneByUsername(username) {
    return dynamoDB.get({
      TableName: DOCTORS_TABLE,
      Key: {
        username,
      },
    }).promise().then((result) => result.Item);
  },

  async getAllByCepAndActive(cep, active, { lastEvaluatedKey, pageSize = 10 }) {
    return parseDynamoQueryResult(await dynamoDB.query({
      TableName: DOCTORS_TABLE,
      IndexName: 'cep',
      KeyConditionExpression: '#cep = :cep AND #sort = :sort',
      ExpressionAttributeNames: {
        '#cep': 'cep',
        '#sort': 'sort',
      },
      ExpressionAttributeValues: {
        ':cep': cep,
        ':sort': `active#${active}`,
      },
      Limit: pageSize > 20 ? 20 : pageSize,
      ExclusiveStartKey: lastEvaluatedKey,
      ScanIndexForward: true,
    }).promise());
  },

  async getAll({ lastEvaluatedKey, pageSize }) {
    return parseDynamoQueryResult(await dynamoDB.scan({
      TableName: DOCTORS_TABLE,
      Limit: pageSize > 20 ? 20 : pageSize,
      ExclusiveStartKey: lastEvaluatedKey,
    }).promise());
  },

  async getAllByCep(cep, { lastEvaluatedKey, pageSize = 10 }) {
    return parseDynamoQueryResult(await dynamoDB.query({
      TableName: DOCTORS_TABLE,
      IndexName: 'cep',
      KeyConditionExpression: '#cep = :cep',
      ExpressionAttributeNames: {
        '#cep': 'cep',
      },
      ExpressionAttributeValues: {
        ':cep': cep,
      },
      Limit: pageSize > 20 ? 20 : pageSize,
      ExclusiveStartKey: lastEvaluatedKey,
      ScanIndexForward: true,
    }).promise());
  },
};

module.exports = repository;
