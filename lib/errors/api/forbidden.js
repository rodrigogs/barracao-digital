export default class ForbiddenError extends Error {
  constructor(message = 'Forbidden', ...args) {
    super(message, ...args)
    this.status = 403
  }
}
