import facilitiesService from 'barracao-digital/services/facilities.service'
import { getRequestContext, responseBuilder } from '../../helpers'

export const handler = async (event) => {
  try {
    const requestContext = await getRequestContext(event)

    const { body } = requestContext

    if (!body || !body.origin) {
      return responseBuilder.errors.badRequest('O CEP da instalação é obrigatório')
    }

    const createdFacility = await facilitiesService.create(body)

    return responseBuilder.success.created({
      body: { ...createdFacility, destination: undefined },
    })
  } catch (err) {
    return responseBuilder.genericError(err)
  }
}
