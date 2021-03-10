import { UserId } from 'src/domain/user/models/userId';
import { InMemoryUserDatabase } from 'src/data/debug/user/userDatabase';
import { User } from 'src/domain/user/models/user';
import { UserName } from 'src/domain/user/models/userName';
import { UserDto } from 'src/data/core/user/userDto';

export class UserService {
  getCurrentUserId(): UserId {
    // TODO: remove this
    const user = new User(new UserId('abc'), new UserName('test'));
    InMemoryUserDatabase.instance.save(UserDto.from(user)).then();
    return user.id;
  }
}
