const OpenTok = require('opentok');
const { OPENTOK_API_KEY, OPENTOK_API_SECRET } = require('../../config');

const opentok = new OpenTok(OPENTOK_API_KEY, OPENTOK_API_SECRET);

module.exports = {
  async createSession() {
    return new Promise((resolve, reject) => {
      opentok.createSession({}, (err, session) => {
        if (err) return reject(err);
        return resolve({
          ...session,
          apiKey: OPENTOK_API_KEY,
        });
      });
    });
  },

  generateToken(sessionId, options = {}) {
    return opentok.generateToken(sessionId, options);
  },
};
