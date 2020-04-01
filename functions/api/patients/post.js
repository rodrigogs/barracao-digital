const { patientsService } = require('barracao-digital/services');
const { getRequestContext, responseBuilder } = require('../../helpers');

module.exports.handler = async (event) => {
  const requestContext = await getRequestContext(event);
  const {
    body,
  } = requestContext;

  try {
    const createdPatient = await patientsService.create(body);
    return responseBuilder.success.created({ body: createdPatient });
  } catch (err) {
    return responseBuilder.genericError(err);
  }
};
