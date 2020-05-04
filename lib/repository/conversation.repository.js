const opentok = require('../providers/opentok');
const { firestore } = require('../providers/firebase');

const repository = {
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

  removeTextSession(facilityOrigin, doctorUsername, patientTicket) {
    const collectionPath = `/facilities/${facilityOrigin}/conversations/${doctorUsername}#${patientTicket}/messages`;
    return firestore.deleteCollection(collectionPath, 20);
  },
};

module.exports = repository;
