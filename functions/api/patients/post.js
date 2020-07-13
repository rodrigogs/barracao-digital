import { patientsService } from 'barracao-digital/services'
import { getRequestContext, responseBuilder } from '../../helpers'

export const handler = async (event) => {
  try {
    const requestContext = await getRequestContext(event)
    const { body } = requestContext

    const createdPatient = await patientsService.create(body)
    return responseBuilder.success.created({ body: createdPatient })
  } catch (err) {
    return responseBuilder.genericError(err)
  }
}
