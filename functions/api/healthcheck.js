import { responseBuilder } from '../helpers'

import pkg from '../../package.json'

/**
 * @api {get} / Health check
 * @apiName HealthCheck
 * @apiGroup Health
 *
 * @apiSuccess {String} message Project name and version.
 */
export const handler = async () => {
  try {
    return responseBuilder.success.ok({
      body: {
        message: `${pkg.name}: ${pkg.version}`,
      },
    })
  } catch (err) {
    return responseBuilder.genericError(err)
  }
}
