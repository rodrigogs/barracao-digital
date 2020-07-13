const crypto = require('crypto');
const dispatch = require('./dispatcher');

const authorize = async ({ username, password }) => {
  const hashedPassword = crypto.createHash('md5').update(password).digest('hex');
  const user = await dispatch('doctors', 'getOneByUsername')(username);

  if (!user || user.password !== hashedPassword) {
    return false;
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
