import { UserId } from 'src/domain/user/models/userId';
import { UserName } from 'src/domain/user/models/userName';

export class User {
  constructor(
      public readonly id: UserId,
      public readonly name?: UserName,
  ) {
  }
}

export class AnonymousUser extends User {
  constructor(id: UserId = new UserId()) {
    super(id, undefined);
  }
}
