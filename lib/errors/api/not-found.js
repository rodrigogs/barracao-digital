export default class NotFoundError extends Error {
  constructor(message = 'Not Found', ...args) {
    super(message, ...args)
    this.status = 404
  }
}
