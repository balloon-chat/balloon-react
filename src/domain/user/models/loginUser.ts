import { UserId } from 'src/domain/user/models/userId';
import { UserName } from 'src/domain/user/models/userName';
import { User } from 'src/domain/user/models/user';

export class LoginUser extends User {
  constructor(id: UserId, name?: UserName, public readonly photoUrl?: string) {
    super(id, name);
  }
}
