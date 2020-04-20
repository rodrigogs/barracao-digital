const doctorsService = require('barracao-digital/services/doctors.service');
const { getRequestContext, responseBuilder } = require('../../helpers');

module.exports.handler = async (event) => {
  try {
    const requestContext = await getRequestContext(event);

    const {
      consumer: user,
      pathParameters,
      body,
      resource,
    } = requestContext;

    const {
      master: wantsToBeMaster,
      admin: wantsTobeAdmin,
    } = body;

    const { master: isMaster } = user;
    const { username } = pathParameters;
    const isSelfUpdate = user.username === username;

    if (wantsToBeMaster && !isMaster) {
      return responseBuilder.errors.forbidden('Somente um usário master pode criar outro usuário master');
    }

    if (wantsTobeAdmin && !isMaster) {
      return responseBuilder.errors.forbidden('Somente um usuário master pode criar um administrador');
    }

    if (username) {
      const storedDoctor = await doctorsService.getOneByUsername(username);
      if (!storedDoctor) {
        return responseBuilder.errors.notFound('Doutor não encontrado');
      }

      // /doctors/{username}/messaging/token
      if (resource.endsWith('messaging/token')) {
        if (!isSelfUpdate) return responseBuilder.errors.forbidden('Você só pode atualizar seu próprio token');
        await doctorsService.setDoctorMessagingToken(storedDoctor, user, body);
        return responseBuilder.success.noContent();
      }

      const isTryingToChangeAnotherAdmin = !isSelfUpdate
        && (storedDoctor.admin || storedDoctor.master);
      if (isTryingToChangeAnotherAdmin && !isMaster) {
        return responseBuilder.errors.forbidden('Você não pode alterar o cadástro de outros administradores');
      }

      const updatedDoctor = await doctorsService.update(username, body);
      return responseBuilder.success.ok({ body: { ...updatedDoctor, password: undefined } });
    }

    return responseBuilder.errors.badRequest();
  } catch (err) {
    return responseBuilder.genericError(err);
  }
};
