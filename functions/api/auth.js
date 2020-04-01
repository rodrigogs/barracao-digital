const { authService } = require('barracao-digital/services');
const { getRequestContext, responseBuilder } = require('../helpers');

const methods = {
  async POST(ctx) {
    try {
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
    } catch (err) {
      return responseBuilder.genericError(err);
    }
  },
};

module.exports.handler = async (event) => {
  const requestContext = await getRequestContext(event);
  const method = methods[requestContext.httpMethod];

  if (!method) return responseBuilder.errors.methodNotAllowed();

  return method(requestContext);
};
