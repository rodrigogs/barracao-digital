const defaultHeaders = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Credentials': true,
};

// Generic responses
const generic = (options) => {
  const statusCode = options.statusCode || 200;
  const headers = { ...defaultHeaders, ...options.headers };
  const body = options.body ? JSON.stringify(options.body) : undefined;

  return {
    ...options,
    statusCode,
    headers,
    body,
  };
};

const genericError = (error) => {
  console.error('Responding with error:', error);

  const status = error.status || error.statusCode || (error.response ? error.response.status : 500);
  const message = error.message || 'Internal Server Error';

  return generic({
    statusCode: status,
    body: { message },
  });
};

// Success responses
const ok = (options = {}) => {
  if (!options.body) {
    return genericError(new Error('200 status should have a body. Use 204 for responses with no content.'));
  }
  return generic({ ...options, statusCode: 200 });
};

const created = (options = {}) => {
  if (!options.body) {
    return genericError(new Error('201 status should have a body describing the created entity.'));
  }
  return generic({ ...options, statusCode: 201 });
};

const noContent = (options = {}) => {
  if (options.body) {
    return genericError(new Error('204 status should have no body.'));
  }
  return generic({ ...options, statusCode: 204, body: undefined });
};

// Error responses
const badRequest = (error = {}) => genericError({
  ...error,
  statusCode: 400,
  message: error.message || 'Bad Request',
});

const unauthorized = (error = {}) => genericError({
  ...error,
  statusCode: 401,
  message: error.message || 'Unauthorized',
});

const forbidden = (error = {}) => genericError({
  ...error,
  statusCode: 403,
  message: error.message || 'Forbidden',
});

const notFound = (error = {}) => genericError({
  ...error,
  statusCode: 404,
  message: error.message || 'Not Found',
});

const methodNotAllowed = (error = {}) => genericError({
  ...error,
  statusCode: 405,
  message: error.message || 'Method Not Allowed',
});

const internalServerError = (error = {}) => genericError({
  ...error,
  statusCode: 500,
  message: error.message || 'Internal Server Error',
});

const notImplemented = (error = {}) => genericError({
  ...error,
  statusCode: 501,
  message: error.message || 'Not Implemented',
});

module.exports = {
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
    internalServerError,
    notImplemented,
  },
};
