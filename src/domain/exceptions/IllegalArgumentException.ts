export class IllegalArgumentException extends Error {
  constructor(public readonly message: string) {
    super(message);
  }
}
