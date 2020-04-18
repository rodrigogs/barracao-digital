export default class InvalidCrmError extends Error {
  constructor(message) {
    super(message)
    this.name = 'InvalidCrmError'
  }
}
