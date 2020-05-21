const { patientsService } = require('../../../lib/services');
const { getRequestContext, responseBuilder } = require('../../helpers');

module.exports.handler = async (event) => {
  try {
    const requestContext = await getRequestContext(event);
    const {
      body,
    } = requestContext;

    const createdPatient = await patientsService.create(body);
    return responseBuilder.success.created({ body: createdPatient });
  } catch (err) {
    return responseBuilder.genericError(err);
  }
};
