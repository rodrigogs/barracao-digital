module.exports = class BadRequestError extends Error {
  constructor(message = 'Bad Request', ...args) {
    super(message, ...args);
    this.status = 400;
  }
};
