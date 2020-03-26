const { dynamoDB } = require('../providers');
const { CONFIGS_TABLE } = require('../config');

const configsTable = dynamoDB.singleTableDriver(CONFIGS_TABLE);

const repository = {
  async put({
    partition,
    sort,
    attributes,
    lock = true,
  }) {
    return configsTable.put({
      partition,
      sort,
      attributes,
      lock,
    });
  },

  async get({ partition, sort }) {
    return configsTable.get({ partition, sort });
  },
};

module.exports = repository;
