const doctorAuthorizer = require('./doctor-authorizer');
const { responseBuilder } = require('../helpers');

module.exports.handler = async (event) => {
  const accessPoliciy = await doctorAuthorizer.handler(event);
  const user = JSON.parse(accessPoliciy.context.consumer);
  if (user && (!user.master && !user.admin)) {
    return responseBuilder.errors.unauthorized('Admnistrator user required');
  }
  return accessPoliciy;
};
