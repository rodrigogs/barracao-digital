const { v4: uuid } = require('uuid');
const { dynamoDB } = require('../providers');
const { SINGLE_TABLE } = require('../config');

const unitsTable = dynamoDB.singleTableDriver(SINGLE_TABLE);

const repository = {
  async create({
    type = 'default',
    contact,
    contactType = 'email',
    cep,
    index,
  }) {
    const shed = {
      id: uuid(),
      type,
      index,
      contact,
      contactType,
      cep,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    return unitsTable.put({
      partition: 'sheds',
      sort: `cep#${shed.cep}id#${shed.id}`,
      item: shed,
    });
  },

  getAllByCep(cep) {
    return unitsTable.query({
      partition: 'sheds',
      sort: `cep#${cep}`,
    });
  },

  getOneByCepAndId(cep, id) {
    return unitsTable.get({
      partition: 'sheds',
      sort: `cep#${cep}#id${id}`,
    });
  },
};

module.exports = repository;
