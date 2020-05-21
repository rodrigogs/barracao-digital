const { authService } = require('../../lib/services');
const { getRequestContext, responseBuilder } = require('../helpers');

const methods = {
  async POST(ctx) {
    const {
      body,
    } = ctx;

    const { username, password } = (body || {});
    if (!username || !password) {
      return responseBuilder.errors.badRequest('Missing username or password');
    }

    const loggedUser = await authService.login({ username, password });
    if (!loggedUser) return responseBuilder.errors.unauthorized();

    return responseBuilder.success.ok({ body: loggedUser });
  },
};

module.exports.handler = async (event) => {
  try {
    const requestContext = await getRequestContext(event);
    const method = methods[requestContext.httpMethod];

    if (!method) return responseBuilder.errors.methodNotAllowed();

    return await method(requestContext);
  } catch (err) {
    return responseBuilder.genericError(err);
  }
};
