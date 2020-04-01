module.exports = class MethodNotAllowedError extends Error {
  constructor(message = 'Method Not Allowed', ...args) {
    super(message, ...args);
    this.status = 405;
  }
};
