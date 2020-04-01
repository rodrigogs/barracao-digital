const { patientsService } = require('barracoes-covid-19/services');
const { getRequestContext, responseBuilder } = require('../../helpers');

const getPatientByTicket = async (ticket) => {
  const patient = await patientsService.getOneByTicket(ticket);
  // if (!user !user.master && (user.cep !== patient.cep)) {
  //   return responseBuilder.errors
  //     .forbidden({ message: 'Você só pode visualizar dados da sua região' });
  // }
  if (!patient) return responseBuilder.errors.notFound('Paciente não encontrado');
  return responseBuilder.success.ok({ body: patient });
};

const getByCep = async (cep, user, { status, timeWaiting }) => {
  if (!user.master && (user.cep !== cep)) {
    return responseBuilder.errors.forbidden('Você só pode visualizar dados da sua região');
  }
  if (status && !timeWaiting) {
    return responseBuilder.success.ok({
      body: await patientsService.getAllByCepAndStatus(cep, status),
    });
  }
  if (timeWaiting && !status) {
    return responseBuilder.success.ok({
      body: await patientsService
        .getAllByCepAndTimeWaiting(cep, timeWaiting),
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
};

module.exports.handler = async (event) => {
  const requestContext = await getRequestContext(event);
  const {
    consumer: user,
    pathParameters,
    queryStringParameters,
  } = requestContext;

  try {
    const { cep, ticket } = pathParameters || {};
    const { status, timeWaiting } = queryStringParameters || {};

    if (ticket) return getPatientByTicket(ticket);

    if (cep) return getByCep(cep, user, { status, timeWaiting });

    return responseBuilder.errors.badRequest();
  } catch (err) {
    return responseBuilder.genericError(err);
  }
};
