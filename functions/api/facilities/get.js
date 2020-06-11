const Router = require('@everestate/serverless-router');
const { HTTP } = require('@everestate/serverless-router-aws');
const facilitiesService = require('barracao-digital/services/facilities.service');
const configsService = require('barracao-digital/services/configs.service');
const { getRequestContext, responseBuilder } = require('../../helpers');

const ENV = process.env.NODE_ENV;

const dispatch = async (event) => {
  const router = new Router([HTTP]);
  const requestContext = await getRequestContext(event);
  const {
    pathParameters,
    queryStringParameters,
  } = requestContext;
  const query = queryStringParameters || {};

  router.http

    .get(`/${ENV}/facilities`, () => facilitiesService
      .getAll(query.type, {
        lastEvaluatedKey: query.lastEvaluatedKey ? JSON.parse(query.lastEvaluatedKey) : undefined,
        pageSize: query.pageSize,
      })
      .then((facilities) => responseBuilder.success.ok({ body: facilities })))

    .get(`/${ENV}/facilities/origin/:origin`, () => facilitiesService
      .getOneByOrigin(pathParameters.origin)
      .then((facility) => (!facility
        ? responseBuilder.errors.notFound('Facility not found')
        : responseBuilder.success.ok({ body: facility }))))

    .get(`/${ENV}/facilities/origin/:origin/destinations`, () => facilitiesService
      .getAllDestinationsByOrigin(pathParameters.origin)
      .then((destinations) => responseBuilder.success.ok({ body: destinations })))

    .get(`/${ENV}/facilities/origin/:origin/check`, () => configsService.addCepVerified(pathParameters.origin)
      .then(() => facilitiesService.getOneByDestination(pathParameters.origin))
      .then((facility) => (!facility
        ? responseBuilder.errors.notFound()
        : responseBuilder.success.noContent())));

  router.mismatch(() => {
    const { path, httpMethod } = event;
    return Promise.reject(new Error(`Unknown route: ${httpMethod} ${path}`));
  });

  return router.dispatch(event);
};

module.exports.handler = async (event) => {
  try {
    return await dispatch(event);
  } catch (err) {
    return responseBuilder.genericError(err);
  }
};
