export class EmptyCartCheckoutError extends Error {
  constructor() {
    super('Cannot checkout an empty cart.')
  }
}