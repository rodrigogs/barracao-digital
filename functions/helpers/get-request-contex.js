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
    requestContext: {
      authorizer: {
        consumer,
      },
    },
    httpMethod,
    headers,
    multiValueHeaders,
    body,
    queryStringParameters,
    multiValueQueryStringParameters,
    pathParameters,
  } = event;

  return {
    httpMethod: (httpMethod || '').toUpperCase(),
    headers,
    multiValueHeaders,
    queryStringParameters,
    multiValueQueryStringParameters,
    pathParameters,
    body: JSON.parse(body),
    consumer: JSON.parse(consumer),
  };
};
