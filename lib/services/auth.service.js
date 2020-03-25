const crypto = require('crypto');
const { doctorsRepository } = require('../repository');

const authorize = async ({ username, password }) => {
  const hashedPassword = crypto.createHash('md5').update(password).digest('hex');
  const user = await doctorsRepository.getOneByUsername(username);

  if (!user || user.password !== hashedPassword) {
    throw new Error('Unauthorized');
  }

  return user;
};

module.exports = {
  async login({ username, password }) {
    return authorize({ username, password });
  },

  async authorize({ username, password }) {
    return authorize({ username, password });
  },
};
