/**
 * @return {
 *  httpMethod,
 *  headers,
 *  multiValueHeaders,
 *  queryStringParameters,
 *  multiValueQueryStringParameters,
 *  pathParameters,
 *  body,
 *  consumer,
 * }
 */
module.exports = async (event) => {
  const {
    requestContext,
    httpMethod,
    headers,
    multiValueHeaders,
    body,
    queryStringParameters,
    multiValueQueryStringParameters,
    pathParameters,
  } = event;

  const { authorizer } = (requestContext || {});
  const { consumer } = (authorizer || {});

  return {
    httpMethod: (httpMethod || '').toUpperCase(),
    headers,
    multiValueHeaders,
    queryStringParameters,
    multiValueQueryStringParameters,
    pathParameters,
    body: (typeof body === 'string') ? JSON.parse(body) : undefined,
    consumer: (typeof consumer === 'string') ? JSON.parse(consumer) : undefined,
  };
};
