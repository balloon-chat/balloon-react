import { UserId } from 'src/domain/user/models/userId';
import { User } from 'src/domain/user/models/user';

export class AnonymousUser extends User {
  constructor(id: UserId = new UserId()) {
    super(id, undefined);
  }
}
