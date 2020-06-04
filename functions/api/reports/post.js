const Router = require('@everestate/serverless-router');
const { HTTP } = require('@everestate/serverless-router-aws');
const reportsService = require('barracao-digital/services/reports.service');
const { REPORT_TYPES } = require('barracao-digital/enums');
const { getRequestContext, responseBuilder } = require('../../helpers');

const ENV = process.env.NODE_ENV;

const dispatch = async (event) => {
  const router = new Router([HTTP]);
  const requestContext = await getRequestContext(event);
  const { pathParameters, queryStringParameters } = requestContext;
  const query = queryStringParameters || {};

  router.http

    .post(`/${ENV}/reports/facility/:origin`, () => reportsService
      .createReport(REPORT_TYPES.FACILITY, {
        origin: pathParameters.origin,
        lastEvaluatedKey: query.lastEvaluatedKey ? JSON.parse(query.lastEvaluatedKey) : undefined,
        pageSize: query.pageSize,
      })
      .then((report) => responseBuilder.success.ok({ body: report })));

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
