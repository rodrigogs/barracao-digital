const doctorsService = require('barracao-digital/services/doctors.service');
const conversationService = require('barracao-digital/services/conversation.service');
const { getRequestContext, responseBuilder } = require('../../helpers');

module.exports.handler = async (event) => {
  try {
    const requestContext = await getRequestContext(event);

    const {
      consumer: user,
      pathParameters,
      body = {},
    } = requestContext;

    const {
      master: isMaster,
    } = user;

    const {
      username,
      ticket,
    } = pathParameters;

    const isDeletingConversationSession = !!ticket;
    if (isDeletingConversationSession) {
      await conversationService.removeSession(user.cep, user.username, ticket, {
        text: !!body.text, video: !!body.video,
      });
      return responseBuilder.success.noContent();
    }

    const storedDoctor = await doctorsService.getOneByUsername(username);
    const isFromSameFacility = user.cep === storedDoctor.cep;

    if (!isFromSameFacility && !isMaster) {
      return responseBuilder.errors.forbidden('Administradores só podem deletar cadástros de suas regiões');
    }

    await doctorsService.delete(username);
    return responseBuilder.success.noContent();
  } catch (err) {
    return responseBuilder.genericError(err);
  }
};
