const { dynamoDB } = require('../providers');
const { CONFIGS_TABLE } = require('../config');

const configsTable = dynamoDB.singleTableDriver(CONFIGS_TABLE);

const repository = {
  async put({
    partition,
    sort,
    lock = true,
    ...attributes
  }) {
    return configsTable.put({
      ...attributes,
      partition,
      sort,
      lock,
    });
  },

  async get({ partition, sort }) {
    return configsTable.get({ partition, sort });
  },
};

module.exports = repository;
