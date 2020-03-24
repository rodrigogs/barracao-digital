const { shedsService } = require('barracoes-covid-19');
const { getRequestContext, responseBuilder } = require('../helpers');

const methods = {
  async GET(ctx) {
    try {
      const {
        pathParameters = {},
      } = ctx;
      if (pathParameters.cep && !pathParameters.id) {
        return responseBuilder.success.ok({
          body: await shedsService.getAllByCep(pathParameters.cep),
        });
      }
      if (pathParameters.cep && pathParameters.id) {
        const shed = await shedsService.getOneByCepAndId(pathParameters.cep, pathParameters.id);
        if (!shed) return responseBuilder.errors.notFound({ message: 'Shed Not Found' });
        return responseBuilder.success.ok({ body: shed });
      }
      return responseBuilder.errors.badRequest();
    } catch (err) {
      return responseBuilder.genericError(err);
    }
  },

  async POST(ctx) {
    try {
      const {
        body,
      } = ctx;
      const createdShed = await shedsService.create(body);
      return responseBuilder.success.created({ body: createdShed });
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
