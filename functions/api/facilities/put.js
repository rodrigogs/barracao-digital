import facilitiesService from 'barracao-digital/services/facilities.service'
import { getRequestContext, responseBuilder } from '../../helpers'

export const handler = async (event) => {
  try {
    const requestContext = await getRequestContext(event)

    const { body, pathParameters } = requestContext

    const { origin } = pathParameters
    const { destinations, ...attributes } = body

    let updatedFacility
    if (Object.keys(attributes).length > 0) {
      updatedFacility = await facilitiesService.update(origin, attributes)
    }

    await facilitiesService.addOriginDestinations(origin, destinations)

    return responseBuilder.success.ok({ body: { ...updatedFacility, destination: undefined } })
  } catch (err) {
    return responseBuilder.genericError(err)
  }
}
