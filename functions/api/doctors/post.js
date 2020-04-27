const doctorsService = require('barracao-digital/services/doctors.service');
const { getRequestContext, responseBuilder } = require('../../helpers');

module.exports.handler = async (event) => {
  try {
    const requestContext = await getRequestContext(event);

    const {
      consumer: user,
      body,
      path,
      pathParameters,
    } = requestContext;

    const isAlternatingActivity = (path && path.endsWith('alternate'));
    const isCreatingVideoSession = (pathParameters && pathParameters.ticket);

    if (isAlternatingActivity) {
      return responseBuilder.success.ok({
        body: await doctorsService.alternateActive(user.username),
      });
    }

    if (isCreatingVideoSession) {
      const videoSession = await doctorsService.createVideoSession(
        user.username,
        pathParameters.ticket,
      );
      return responseBuilder.success.ok({
        body: videoSession,
      });
    }

    const {
      master: wantsToBeMaster,
      admin: wantsTobeAdmin,
    } = body;

    const {
      master: isMaster,
    } = user;

    const isFromSameFacility = user.cep === body.cep;

    if (!isFromSameFacility && !isMaster) {
      return responseBuilder.errors.forbidden('Administradores só podem criar cadástros de suas regiões');
    }

    if (wantsToBeMaster && !isMaster) {
      return responseBuilder.errors.forbidden('Somente um usário master pode criar outro usuário master');
    }

    if (wantsTobeAdmin && !isMaster) {
      return responseBuilder.errors.forbidden('Somente um usuário master pode criar um administrador');
    }

    const newDoctor = await doctorsService.create(body);
    return responseBuilder.success.created({ body: { ...newDoctor, password: undefined } });
  } catch (err) {
    return responseBuilder.genericError(err);
  }
};
