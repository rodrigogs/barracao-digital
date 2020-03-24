const { patientsService } = require('barracoes-covid-19');
const { getRequestContext, responseBuilder } = require('../helpers');

const methods = {
  async GET(ctx) {
    try {
      const {
        pathParameters = {},
      } = ctx;
      if (pathParameters.cep && !pathParameters.id) {
        return responseBuilder.success.ok({
          body: await patientsService.getAllByCep(pathParameters.cep),
        });
      }
      if (pathParameters.cep && pathParameters.id) {
        const patient = await patientsService.getOneByCepAndId(pathParameters.cep, pathParameters.id);
        if (!patient) return responseBuilder.errors.notFound({ message: 'Patient Not Found' });
        return responseBuilder.success.ok({ body: patient });
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
        pathParameters,
      } = ctx;
      if (!pathParameters) {
        const createdPatient = await patientsService.create(body);
        return responseBuilder.success.created({ body: createdPatient });
      }
      if (pathParameters.cep && pathParameters.id) {
        const updatedPatient = await patientsService.update(pathParameters.cep, pathParameters.id, { status: body.status });
        return responseBuilder.success.ok({ body: updatedPatient });
      }
      return responseBuilder.errors.badRequest();
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
