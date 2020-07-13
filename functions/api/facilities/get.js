const Router = require('@everestate/serverless-router');
const { HTTP } = require('@everestate/serverless-router-aws');
const facilitiesService = require('barracao-digital/services/facilities.service');
const reportsService = require('barracao-digital/services/reports.service');
const reportDimensions = require('barracao-digital/enums/reportDimensions.enum');
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

    .get(`/${ENV}/facilities/origin/:origin/check`, () => facilitiesService
      .getOneByDestination(pathParameters.origin)
      .then((facility) => (!facility
        ? responseBuilder.errors.notFound()
        : responseBuilder.success.noContent()))
      .finally(() => reportsService.feedMetric(
        reportDimensions.FACILITY_PATIENTS_CEP_CHECKS_NUMBER_BY_CEP_MAP,
        pathParameters.origin,
      )))

    .get(`/${ENV}/facilities/origin/:origin/analytics`, () => facilitiesService.getAnalytics().then());

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
