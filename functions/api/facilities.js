const { facilitiesService } = require('barracoes-covid-19/services');
const { getRequestContext, responseBuilder } = require('../helpers');

const methods = {
  async GET(ctx) {
    try {
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
    } catch (err) {
      return responseBuilder.genericError(err);
    }
  },

  async POST(ctx) {
    try {
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
    } catch (err) {
      return responseBuilder.genericError(err);
    }
  },

  async PUT(ctx) {
    try {
      const {
        body,
        pathParameters,
      } = ctx;

      const { origin } = pathParameters;
      const { destinations, ...attributes } = body;

      const updatedFacility = await facilitiesService.update(origin, attributes);
      await facilitiesService.addOriginDestinations(origin, destinations);

      return responseBuilder.success.ok({ body: { ...updatedFacility, destination: undefined } });
    } catch (err) {
      return responseBuilder.genericError(err);
    }
  },
};

module.exports.handler = async (event) => {
  const requestContext = await getRequestContext(event);
  const method = methods[requestContext.httpMethod];

  if (!method) return responseBuilder.errors.methodNotAllowed();

  return method(requestContext);
};
