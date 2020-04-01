const { authService } = require('barracoes-covid-19/services');
const { responseBuilder } = require('../helpers');

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

module.exports.handler = async (event) => {
  try {
    const { type, authorizationToken, methodArn } = event;
    const user = await signin(type, authorizationToken);
    const key = user.password;
    delete user.password;
    return createAccessPoliciy(user, key, methodArn);
  } catch (err) {
    console.error('Authorization error:', err);
    return responseBuilder.errors.unauthorized(err.message);
  }
};
