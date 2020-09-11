import doctorsService from 'barracao-digital/services/doctors.service'
import conversationService from 'barracao-digital/services/conversation.service'
import { getRequestContext, responseBuilder } from '../../helpers'

export const handler = async (event) => {
  try {
    const { consumer: user, pathParameters, queryStringParameters } = await getRequestContext(event)
    const { master: isMaster } = user
    const { username, ticket } = pathParameters

    const isDeletingConversationSession = !!ticket
    if (isDeletingConversationSession) {
      if (!queryStringParameters.text && !queryStringParameters.video)
        return responseBuilder.errors.badRequest('Missing parameters')
      await conversationService.removeSession(user.cep, user.username, ticket, {
        text: String(queryStringParameters.text).toUpperCase() === 'TRUE',
        video: String(queryStringParameters.video).toUpperCase() === 'TRUE',
      })
      return responseBuilder.success.noContent()
    }

    const storedDoctor = await doctorsService.getOneByUsername(username)
    const isFromSameFacility = user.cep === storedDoctor.cep

    if (!isFromSameFacility && !isMaster) {
      return responseBuilder.errors.forbidden(
        'Administradores só podem deletar cadástros de suas regiões'
      )
    }

    await doctorsService.delete(username)
    return responseBuilder.success.noContent()
  } catch (err) {
    return responseBuilder.genericError(err)
  }
}
