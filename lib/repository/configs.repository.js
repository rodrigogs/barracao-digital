const { dynamoDB } = require('../providers/aws');
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

  async remove({ partition, sort }) {
    return configsTable.delete({ partition, sort });
  },
};

module.exports = repository;
