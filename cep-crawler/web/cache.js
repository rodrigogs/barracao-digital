const crypto = require('crypto');
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

const adapter = new FileSync('db.json');
const db = low(adapter);

db.defaults({ queries: {} }).write();

module.exports = {
  async get(query) {
    const key = crypto.createHash('md5').update(JSON.stringify(query)).digest('hex');
    const results = await db.get(`queries.${key}`).value();
    if (results) {
      return JSON.parse(results);
    }
    return null;
  },

  async put(query, results) {
    const key = crypto.createHash('md5').update(JSON.stringify(query)).digest('hex');
    return db.set(`queries.${key}`, JSON.stringify(results)).write();
  },
};
