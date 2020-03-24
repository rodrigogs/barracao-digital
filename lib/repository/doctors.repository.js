const crypto = require('crypto');
const { v4: uuid } = require('uuid');
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
      id: uuid(),
      username,
      sort: `active#${false}`,
      name,
      password,
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
      sort: `active#${doctor.active}`,
      updatedAt: Date.now(),
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

  async getAllByCepAndActive(cep, active) {
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
        ':sort': `active#${active}`,
      },
    }).promise().then((result) => result.Items);
  },

  async getAllByCep(cep) {
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
