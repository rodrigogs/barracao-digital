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
      const { cep, ticket } = pathParameters || {};
      const { status, timeWaiting } = queryStringParameters || {};

      if (ticket) {
        const patient = await patientsService.getOneByTicket(ticket);
        if (!user.master && (user.cep !== patient.cep)) {
          return responseBuilder.errors.forbidden({ message: 'Você só pode visualizar dados da sua região' });
        }
        if (!patient) return responseBuilder.errors.notFound({ message: 'Patient Not Found' });
        return responseBuilder.success.ok({ body: patient });
      }

      if (cep) {
        if (!user.master && (user.cep !== cep)) {
          return responseBuilder.errors.forbidden({ message: 'Você só pode visualizar dados da sua região' });
        }
        if (status && !timeWaiting) {
          return responseBuilder.success.ok({
            body: await patientsService.getAllByCepAndStatus(cep, status),
          });
        }
        if (status && timeWaiting) {
          return responseBuilder.success.ok({
            body: await patientsService
              .getAllByCepAndStatusAndTimeWaiting(cep, status, timeWaiting),
          });
        }
        return responseBuilder.success.ok({
          body: await patientsService.getAllByCep(cep),
        });
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

      const createdPatient = await patientsService.create(body);
      return responseBuilder.success.created({ body: createdPatient });
    } catch (err) {
      return responseBuilder.genericError(err);
    }
  },

  async PUT(ctx) {
    try {
      const {
        consumer: user,
        pathParameters,
        body,
      } = ctx;

      const { ticket } = pathParameters;

      const patient = await patientsService.getOneByTicket(ticket);
      if (!user.master && (user.cep !== patient.cep)) {
        return responseBuilder.errors.forbidden({ message: 'Você só pode alterar dados da sua região' });
      }

      const updatedPatient = await patientsService.update(ticket, { status: body.status });
      return responseBuilder.success.ok({ body: updatedPatient });
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
