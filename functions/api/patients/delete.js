import patientsService from 'barracao-digital/services/patients.service'
import conversationService from 'barracao-digital/services/conversation.service'
import { getRequestContext, responseBuilder } from '../../helpers'

export const handler = async (event) => {
  try {
    const requestContext = await getRequestContext(event)

    const { path, pathParameters } = requestContext

    const { ticket } = pathParameters

    const storedPatient = await patientsService.getOneByTicket(ticket)
    if (!storedPatient) return responseBuilder.success.noContent()

    const isDeletingConversationSession = path.endsWith('/video')
    if (isDeletingConversationSession) {
      if (!ticket) return responseBuilder.errors.badRequest('Senha inválida')
      if (!storedPatient.videoSession) return responseBuilder.success.noContent()
      await conversationService.removeVideoSession(storedPatient.textSession, storedPatient.ticket)
    }

    return responseBuilder.success.noContent()
  } catch (err) {
    return responseBuilder.genericError(err)
  }
}
