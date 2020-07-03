export default class UnauthorizedError extends Error {
  constructor(message = 'Unauthorized', ...args) {
    super(message, ...args)
    this.status = 401
  }
}
