import authService from 'barracao-digital/services/auth.service'
import { getRequestContext, responseBuilder } from '../helpers'

const methods = {
  async POST(ctx) {
    const { body } = ctx

    const { username, password } = body || {}
    if (!username || !password) {
      return responseBuilder.errors.badRequest('Missing username or password')
    }

    const loggedUser = await authService.login({ username, password })
    if (!loggedUser) return responseBuilder.errors.unauthorized()

    return responseBuilder.success.ok({
      body: {
        ...loggedUser,
        videoSessions: undefined,
        textSessions: undefined,
        password: undefined,
      },
      password: undefined,
    })
  },
}

export const handler = async (event) => {
  try {
    const requestContext = await getRequestContext(event)
    const method = methods[requestContext.httpMethod]

    if (!method) return responseBuilder.errors.methodNotAllowed()

    return await method(requestContext)
  } catch (err) {
    return responseBuilder.genericError(err)
  }
}
