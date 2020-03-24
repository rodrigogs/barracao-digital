const crypto = require('crypto');
const { dynamoDB } = require('../providers');
const { DOCTORS_TABLE } = require('../config');

const repository = {
  async create({
    name,
    username,
    password,
    cep,
  }) {
    const doctor = {
      username,
      sort: `cep#${cep}active#${false}`,
      name,
      password: crypto.createHash('md5').update(password).digest('hex'),
      cep,
      active: false,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    await dynamoDB.put({
      TableName: DOCTORS_TABLE,
      Item: doctor,
    }).promise();
    return doctor;
  },

  async update(doctor) {
    await dynamoDB.delete({
      TableName: DOCTORS_TABLE,
      Key: {
        username: doctor.username,
      },
    }).promise();

    const updatedDoctor = {
      ...doctor,
      sort: `cep#${doctor.cep}active#${doctor.active}`,
    };

    await dynamoDB.put({
      TableName: DOCTORS_TABLE,
      Item: updatedDoctor,
    }).promise();

    return updatedDoctor;
  },

  async getOneByUsername(username) {
    return dynamoDB.get({
      TableName: DOCTORS_TABLE,
      Key: {
        username,
      },
    }).promise().then((result) => result.Item);
  },

  getAllByCepAndActive(cep, active) {
    return dynamoDB.query({
      TableName: DOCTORS_TABLE,
      IndexName: 'cep',
      KeyConditionExpression: '#cep = :cep AND #sort = :sort',
      ExpressionAttributeNames: {
        '#cep': 'cep',
        '#sort': 'sort',
      },
      ExpressionAttributeValues: {
        ':cep': cep,
        ':sort': `cep#${cep}active#${active}`,
      },
    }).promise().then((result) => result.Items);
  },

  getAllByCep(cep) {
    return dynamoDB.query({
      TableName: DOCTORS_TABLE,
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
};

module.exports = repository;
