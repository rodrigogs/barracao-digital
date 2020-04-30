const opentok = require('../providers/opentok');

const service = {
  async createOpentokSession(options = {}) {
    return opentok.createSession(options);
  },

  // eslint-disable-next-line no-unused-vars
  async terminateOpentokSession({ apiKey, sessionId }) {
    // Check if it's possible https://tokbox.com/developer/guides/moderation/rest/
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

module.exports = service;
