import {
  BadRequestError,
  ConflictError,
  ForbiddenError,
  InternalServerError,
  MethodNotAllowedError,
  NotFoundError,
  NotImplementedError,
  UnauthorizedError,
} from 'barracao-digital/errors/api'

const defaultHeaders = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Credentials': true,
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': '*',
}

// Generic responses
export const generic = (options) => {
  const statusCode = options.statusCode || 200
  const headers = { ...defaultHeaders, ...options.headers }
  const body = options.body ? JSON.stringify(options.body) : undefined

  return {
    ...options,
    statusCode,
    headers,
    body,
  }
}

export const genericError = (error) => {
  console.error('Responding with error:', error)

  const status = error.status || error.statusCode || (error.response ? error.response.status : 500)
  const message = error.message || 'Internal Server Error'

  return generic({
    statusCode: status,
    body: { message },
  })
}

// Success responses
export const ok = (options = {}) => {
  if (!options.body) {
    return genericError(
      new Error('200 status should have a body. Use 204 for responses with no content.')
    )
  }
  return generic({ ...options, statusCode: 200 })
}

export const created = (options = {}) => {
  if (!options.body) {
    return genericError(new Error('201 status should have a body describing the created entity.'))
  }
  return generic({ ...options, statusCode: 201 })
}

export const noContent = (options = {}) => {
  if (options.body) {
    return genericError(new Error('204 status should have no body.'))
  }
  return generic({ ...options, statusCode: 204, body: undefined })
}

// Error responses
export const badRequest = (message) => genericError(new BadRequestError(message))

export const unauthorized = (message) => genericError(new UnauthorizedError(message))

export const forbidden = (message) => genericError(new ForbiddenError(message))

export const notFound = (message) => genericError(new NotFoundError(message))

export const methodNotAllowed = (message) => genericError(new MethodNotAllowedError(message))

export const conflict = (message) => genericError(new ConflictError(message))

export const internalServerError = (message) => genericError(new InternalServerError(message))

export const notImplemented = (message) => genericError(new NotImplementedError(message))

export default {
  generic,
  genericError,
  success: {
    ok,
    created,
    noContent,
  },
  errors: {
    badRequest,
    unauthorized,
    forbidden,
    notFound,
    methodNotAllowed,
    conflict,
    internalServerError,
    notImplemented,
  },
}
