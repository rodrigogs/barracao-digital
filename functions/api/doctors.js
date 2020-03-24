const { doctorsService } = require('barracoes-covid-19');
const { getRequestContext, responseBuilder } = require('../helpers');

const methods = {
  async GET(ctx) {
    try {
      const {
        pathParameters,
        queryStringParameters,
      } = ctx;
      const { cep, username } = pathParameters || {};
      const { active } = queryStringParameters || {};

      if (cep) {
        const doctors = active
          ? await doctorsService.getAllByCepAndActive(cep, active === 'true')
          : await doctorsService.getAllByCep(cep);
        return responseBuilder.success.ok({
          body: doctors.map((doctor) => ({ ...doctor, password: undefined })),
        });
      }

      if (username) {
        const doctor = await doctorsService.getOneByUsername(username);
        if (!doctor) return responseBuilder.errors.notFound({ message: 'Doctor Not Found' });
        return responseBuilder.success.ok({
          body: { ...doctor, password: undefined },
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
        pathParameters,
        body,
      } = ctx;
      if (!pathParameters) {
        const newDoctor = await doctorsService.create(body);
        return responseBuilder.success.created({ body: { ...newDoctor, password: undefined } });
      }
      if (pathParameters.username) {
        const updatedDoctor = await doctorsService.update(pathParameters.username);
        return responseBuilder.success.ok({ body: { ...updatedDoctor, password: undefined } });
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
