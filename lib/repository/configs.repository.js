const { dynamoDB } = require('../providers/aws');
const opentok = require('../providers/opentok');
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

  async createOpentokSession(options = {}) {
    return opentok.createSession(options);
  },

  generateOpentokToken(sessionId, options) {
    const nowInSeconds = Math.round(Date.now() / 1000);
    const oneHourInSeconds = 60 * 60;
    return opentok.generateToken(sessionId, {
      ...options,
      expireTime: nowInSeconds + oneHourInSeconds,
    });
  },
};

module.exports = repository;
