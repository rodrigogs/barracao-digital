export default class ConflictError extends Error {
  constructor(message = 'Conflict', ...args) {
    super(message, ...args)
    this.status = 409
  }
}
