export default class InternalServerError extends Error {
  constructor(message = 'Internal Server Error', ...args) {
    super(message, ...args)
    this.status = 500
  }
}
