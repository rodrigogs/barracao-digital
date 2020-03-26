const { patientsService } = require('barracoes-covid-19');
const { getRequestContext, responseBuilder } = require('../helpers');

const methods = {
  async GET(ctx) {
    try {
      const {
        consumer: user,
        pathParameters,
        queryStringParameters,
      } = ctx;

      const { cep, key } = pathParameters || {};
      const { status } = queryStringParameters || {};

      if (cep) {
        if (!user.master && (user.cep !== cep)) {
          return responseBuilder.errors.forbidden('Você só pode visualizar dados da sua região');
        }
        if (status) {
          return responseBuilder.success.ok({
            body: await patientsService.getAllByCepAndStatus(cep, status),
          });
        }
        return responseBuilder.success.ok({
          body: await patientsService.getAllByCep(cep),
        });
      }

      if (key) {
        const patient = await patientsService.getOneByKey(key);
        if (!user.master && (user.cep !== patient.cep)) {
          return responseBuilder.errors.forbidden('Você só pode visualizar dados da sua região');
        }
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
        consumer: user,
        pathParameters,
        body,
      } = ctx;

      const { key } = pathParameters || {};

      if (!pathParameters) {
        const createdPatient = await patientsService.create(body);
        return responseBuilder.success.created({ body: createdPatient });
      }

      if (key) {
        const patient = await patientsService.getOneByKey(key);
        if (!user.master && (user.cep !== patient.cep)) {
          return responseBuilder.errors.forbidden('Você só pode alterar dados da sua região');
        }
        const updatedPatient = await patientsService.update(key, { status: body.status });
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
