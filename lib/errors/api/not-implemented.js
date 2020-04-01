module.exports = class NotImplementedError extends Error {
  constructor(message = 'Not Implemented', ...args) {
    super(message, ...args);
    this.status = 501;
  }
};
