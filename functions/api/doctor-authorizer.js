const { authService, jobsService } = require('../../lib/services');

const createAccessPoliciy = (user, key, methodArn) => ({
  principalId: key,
  policyDocument: {
    Statement: [{
      Action: 'execute-api:Invoke',
      Effect: 'Allow',
      Resource: methodArn,
    }],
    Version: '2012-10-17',
  },
  context: { consumer: JSON.stringify(user) },
});

const basicAuthStrategy = async (token) => {
  const [username, password] = Buffer
    .from(token, 'base64')
    .toString('utf8')
    .split(':');

  return authService.authorize({ username, password });
};

const signin = (type, authorizationToken) => {
  if (type === 'TOKEN') {
    const [authType, token] = authorizationToken.split(' ');
    switch (authType) {
      case 'Basic':
        return basicAuthStrategy(token);
      default:
        throw new Error(`Unsupported Authorization Type "${authType}"`);
    }
  }
  throw new Error(`Unsupported Authorization Type "${type}"`);
};

const heartBeat = async (user) => {
  const currentSchedule = await jobsService.retrieveCurrentAlternateDoctorJobSchedule(user);
  if (currentSchedule) await jobsService.removeAlternateDoctorJobSchedule(user);
  await jobsService.scheduleAlternateDoctorJob(user);
};

module.exports.handler = (event, context, callback) => {
  (async () => {
    try {
      const { type, authorizationToken, methodArn } = event;
      const user = await signin(type, authorizationToken);

      if (!user) return callback('Unauthorized');

      const key = user.password;
      delete user.password;

      if (user.active) await heartBeat({ ...user });

      const accessPolicy = createAccessPoliciy(user, key, methodArn);
      return callback(null, accessPolicy);
    } catch (err) {
      console.error('Authorization error:', err);
      return callback('Error');
    }
  })();
};
