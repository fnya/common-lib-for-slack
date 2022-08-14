export class InvalidArgumentError extends Error {
  // eslint-disable-next-line no-useless-constructor
  public constructor(message?: string) {
    super(message);
  }
}
