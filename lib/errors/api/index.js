const BadRequestError = require('./bad-request');
const ForbiddenError = require('./forbidden');
const InternalServerError = require('./internal-server-error');
const MethodNotAllowedError = require('./method-not-allowed');
const ConflictError = require('./conflict');
const NotFoundError = require('./not-found');
const NotImplementedError = require('./not-implemented');
const UnauthorizedError = require('./unauthorized');

module.exports = {
  BadRequestError,
  ForbiddenError,
  InternalServerError,
  MethodNotAllowedError,
  ConflictError,
  NotFoundError,
  NotImplementedError,
  UnauthorizedError,
};
