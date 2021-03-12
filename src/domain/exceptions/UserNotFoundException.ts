export class UserNotFoundException extends Error {
  constructor(public readonly message: string) {
    super(message);
  }
}
