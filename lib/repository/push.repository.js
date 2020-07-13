const firebase = require('../providers/firebase');

const repository = {
  async sendMessage(message) {
    return firebase.messaging.send(message);
  },
};

module.exports = repository;
