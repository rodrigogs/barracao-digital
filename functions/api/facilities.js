const { facilitiesService } = require('barracao-digital/services');
const { getRequestContext, responseBuilder } = require('../helpers');

const methods = {
  async GET(ctx) {
    const {
      pathParameters,
      path,
      queryStringParameters,
    } = ctx;

    if (!pathParameters) {
      const { type, lastEvaluatedKey, pageSize } = queryStringParameters || {};
      const parsedLastKey = lastEvaluatedKey ? JSON.parse(lastEvaluatedKey) : undefined;

      return responseBuilder.success.ok({
        body: await facilitiesService.getAll(type, { lastEvaluatedKey: parsedLastKey, pageSize }),
      });
    }

    const { origin } = pathParameters;
    const listDestinations = path.endsWith('destinations');

    if (listDestinations) {
      const destinations = await facilitiesService.getAllDestinationsByOrigin(origin);
      return responseBuilder.success.ok({ body: destinations });
    }

    const facility = await facilitiesService.getOneByOrigin(origin);
    if (!facility) {
      return responseBuilder.errors.notFound('Facility not found');
    }

    return responseBuilder.success.ok({
      body: facility,
    });
  },

  async POST(ctx) {
    const {
      body,
    } = ctx;

    if (!body || !body.origin) {
      return responseBuilder.errors.badRequest('O CEP da instalação é obrigatório');
    }

    const createdFacility = await facilitiesService.create(body);

    return responseBuilder.success.created({
      body: { ...createdFacility, destination: undefined },
    });
  },

  async PUT(ctx) {
    const {
      body,
      pathParameters,
    } = ctx;

    const { origin } = pathParameters;
    const { destinations, ...attributes } = body;

    const updatedFacility = await facilitiesService.update(origin, attributes);
    const currentDestinations = await facilitiesService.getAllDestinationsByOrigin(origin);

    const removedDestinations = currentDestinations
      .filter((destination) => destinations.indexOf(destination) === -1);

    const newDestinations = destinations
      .filter((destination) => currentDestinations.indexOf(destination) === -1);

    await Promise.all([
      await facilitiesService.addOriginDestinations(origin, newDestinations),
      await facilitiesService.removeOriginDestinations(origin, removedDestinations),
    ]);

    return responseBuilder.success.ok({ body: { ...updatedFacility, destination: undefined } });
  },

  async DELETE(ctx) {
    const {
      pathParameters,
    } = ctx;

    const {
      origin,
    } = pathParameters;

    await facilitiesService.delete(origin);
    return responseBuilder.success.noContent();
  },
};

module.exports.handler = async (event) => {
  try {
    const requestContext = await getRequestContext(event);
    const method = methods[requestContext.httpMethod];

    if (!method) return responseBuilder.errors.methodNotAllowed();

    return await method(requestContext);
  } catch (err) {
    return responseBuilder.genericError(err);
  }
};
