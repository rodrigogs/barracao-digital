const doctorAuthorizer = require('./doctor-authorizer');

module.exports.handler = async (event) => {
  const accessPoliciy = await doctorAuthorizer.handler(event);
  const user = JSON.parse(accessPoliciy.context.consumer);
  if (!user.isAdmin) throw new Error('Unauthorized');
  return accessPoliciy;
};
