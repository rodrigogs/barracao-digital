const cloudWatchEvents = require('./cloudWatchEvents');
const dynamoDB = require('./dynamoDB');
const lambda = require('./lambda');

module.exports = {
  cloudWatchEvents,
  dynamoDB,
  lambda,
};
