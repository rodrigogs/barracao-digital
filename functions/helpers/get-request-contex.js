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
export default async (event) => {
  const {
    requestContext,
    httpMethod,
    headers,
    multiValueHeaders,
    body,
    queryStringParameters,
    multiValueQueryStringParameters,
    pathParameters,
    path,
    resource,
  } = event

  const { authorizer } = requestContext || {}
  const { consumer } = authorizer || {}

  let parsedBody
  let parsedConsumer

  try {
    parsedBody = typeof body === 'string' ? JSON.parse(body) : undefined
    parsedConsumer = typeof consumer === 'string' ? JSON.parse(consumer) : undefined
  } catch (err) {
    console.error('Error parsing body or consumer', err)
  }

  return {
    httpMethod: (httpMethod || '').toUpperCase(),
    headers,
    multiValueHeaders,
    queryStringParameters,
    multiValueQueryStringParameters,
    pathParameters,
    path,
    resource,
    body: parsedBody,
    consumer: parsedConsumer,
  }
}
