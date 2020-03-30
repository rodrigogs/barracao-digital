const doctorAuthorizer = require('./doctor-authorizer');
const { responseBuilder } = require('../helpers');

module.exports.handler = async (event) => {
  const accessPoliciy = await doctorAuthorizer.handler(event);
  const user = JSON.parse(accessPoliciy.context.consumer);
  if (user && !user.master) {
    return responseBuilder.errors.unauthorized('Master user required');
  }
  return accessPoliciy;
};
