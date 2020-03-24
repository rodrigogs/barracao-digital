const { doctorsService } = require('barracoes-covid-19');
const { getRequestContext, responseBuilder } = require('../helpers');

const methods = {
  async GET(ctx) {
    try {
      const {
        consumer: user,
        pathParameters,
        queryStringParameters,
      } = ctx;

      const { cep, username } = pathParameters || {};
      const { active } = queryStringParameters || {};

      if (cep) {
        if (!user.master && user.cep !== cep) {
          return responseBuilder.errors.forbidden('Você só pode visualizar dados da sua região');
        }
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
        consumer: user,
        pathParameters,
        body,
      } = ctx;

      if (!pathParameters) {
        if (body.master && !user.master) {
          return responseBuilder.errors.forbidden('Somente um usário master pode criar outro usuário master');
        }
        if (body.admin && (!user.master && !user.admin)) {
          if (!user.master && (body.cep !== user.cep)) {
            return responseBuilder.errors.forbidden('Administradores só podem criar/alterar cadástros em suas regiões');
          }
          return responseBuilder.errors.forbidden('Somente um administrador pode criar outro administrador');
        }
        const newDoctor = await doctorsService.create(body);
        return responseBuilder.success.created({ body: { ...newDoctor, password: undefined } });
      }

      if (pathParameters.username) {
        if (!user.master && (user.username !== pathParameters.username)) {
          return responseBuilder.errors.forbidden('Você não pode mudar o status de outro usuário');
        }
        const updatedDoctor = await doctorsService.update(pathParameters.username, body);
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
