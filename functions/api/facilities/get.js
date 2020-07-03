import Router from '@everestate/serverless-router'
import { HTTP } from '@everestate/serverless-router-aws'
import facilitiesService from 'barracao-digital/services/facilities.service'
import configsService from 'barracao-digital/services/configs.service'
import { getRequestContext, responseBuilder } from '../../helpers'

const STAGE = process.env.STAGE

const dispatch = async (event) => {
  const router = new Router([HTTP])
  const requestContext = await getRequestContext(event)
  const { pathParameters, queryStringParameters } = requestContext
  const query = queryStringParameters || {}

  router.http

    .get(`/${STAGE}/facilities`, () =>
      facilitiesService
        .getAll(query.type, {
          lastEvaluatedKey: query.lastEvaluatedKey ? JSON.parse(query.lastEvaluatedKey) : undefined,
          pageSize: query.pageSize,
        })
        .then((facilities) => responseBuilder.success.ok({ body: facilities }))
    )

    .get(`/${STAGE}/facilities/origin/:origin`, () =>
      facilitiesService
        .getOneByOrigin(pathParameters.origin)
        .then((facility) =>
          !facility
            ? responseBuilder.errors.notFound('Facility not found')
            : responseBuilder.success.ok({ body: facility })
        )
    )

    .get(`/${STAGE}/facilities/origin/:origin/destinations`, () =>
      facilitiesService
        .getAllDestinationsByOrigin(pathParameters.origin)
        .then((destinations) => responseBuilder.success.ok({ body: destinations }))
    )

    .get(`/${STAGE}/facilities/origin/:origin/check`, () =>
      configsService
        .addCepVerified(pathParameters.origin)
        .then(() => facilitiesService.getOneByDestination(pathParameters.origin))
        .then((facility) =>
          !facility ? responseBuilder.errors.notFound() : responseBuilder.success.noContent()
        )
    )

  router.mismatch(() => {
    const { path, httpMethod } = event
    return Promise.reject(new Error(`Unknown route: ${httpMethod} ${path}`))
  })

  return router.dispatch(event)
}

export const handler = async (event) => {
  try {
    return await dispatch(event)
  } catch (err) {
    return responseBuilder.genericError(err)
  }
}
