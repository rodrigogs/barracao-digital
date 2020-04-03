const { responseBuilder } = require('../helpers');

const pkg = require('../../package.json');

/**
 * @api {get} / Health check
 * @apiName HealthCheck
 * @apiGroup Health
 *
 * @apiSuccess {String} message Project name and version.
 */
module.exports.handler = async () => {
  try {
    return responseBuilder.success.ok({
      body: {
        message: `${pkg.name}: ${pkg.version}`,
      },
    });
  } catch (err) {
    console.error('Responding error:', err);
    return responseBuilder.genericError(err);
  }
};
