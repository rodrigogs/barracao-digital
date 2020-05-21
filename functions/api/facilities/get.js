const facilitiesService = require('../../../lib/services/facilities.service');
const { getRequestContext, responseBuilder } = require('../../helpers');

module.exports.handler = async (event) => {
  try {
    const requestContext = await getRequestContext(event);

    const {
      pathParameters,
      path,
      queryStringParameters,
    } = requestContext;

    if (!pathParameters) {
      const { type, lastEvaluatedKey, pageSize } = queryStringParameters || {};
      const parsedLastKey = lastEvaluatedKey ? JSON.parse(lastEvaluatedKey) : undefined;

      return responseBuilder.success.ok({
        body: await facilitiesService.getAll(type, { lastEvaluatedKey: parsedLastKey, pageSize }),
      });
    }

    const { origin } = pathParameters;
    const listDestinations = path.endsWith('destinations');
    const checkAvailability = path.endsWith('check');

    if (listDestinations) {
      const destinations = await facilitiesService.getAllDestinationsByOrigin(origin);
      return responseBuilder.success.ok({ body: destinations });
    }

    if (checkAvailability) {
      const facility = await facilitiesService.getOneByDestination(origin);
      if (!facility) return responseBuilder.errors.notFound();
      return responseBuilder.success.noContent();
    }

    const facility = await facilitiesService.getOneByOrigin(origin);
    if (!facility) {
      return responseBuilder.errors.notFound('Facility not found');
    }

    return responseBuilder.success.ok({
      body: facility,
    });
  } catch (err) {
    return responseBuilder.genericError(err);
  }
};
