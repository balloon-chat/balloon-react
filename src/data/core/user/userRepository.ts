import { IUserRepository } from 'src/domain/user/repository/userRepository';
import { IUserDatabase } from 'src/data/core/user/userDatabase';
import { UserId } from 'src/domain/user/models/userId';
import { User } from 'src/domain/user/models/user';

export class UserRepository implements IUserRepository {
  constructor(
      private readonly userDatabase: IUserDatabase,
  ) {
  }

  async find(userId: UserId): Promise<User | undefined> {
    const dto = await this.userDatabase.find(userId.value);
    return dto?.toUser();
  }

}
