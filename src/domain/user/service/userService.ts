import { UserId } from 'src/domain/user/models/userId';

export class UserService {
  getCurrentUserId(): UserId {
    return new UserId('abc'); // TODO: remove this
  }
}
