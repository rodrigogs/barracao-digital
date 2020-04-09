const { facilitiesService } = require('barracao-digital/services');
const { getRequestContext, responseBuilder } = require('../helpers');

const methods = {
  async GET(ctx) {
    const {
      pathParameters,
      path,
    } = ctx;

    if (!pathParameters) {
      return responseBuilder.success.ok({
        body: await facilitiesService.getAll(),
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
    await facilitiesService.addOriginDestinations(origin, destinations);

    return responseBuilder.success.ok({ body: { ...updatedFacility, destination: undefined } });
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
