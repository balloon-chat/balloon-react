import { IUserRepository } from 'src/domain/user/repository/userRepository';
import { IUserDatabase } from 'src/data/core/user/userDatabase';
import { UserId } from 'src/domain/user/models/userId';
import { UserDto } from 'src/data/core/user/userDto';
import { LoginUser } from 'src/domain/user/models/loginUser';

export class UserRepository implements IUserRepository {
  constructor(private readonly userDatabase: IUserDatabase) {}

  async find(userId: UserId): Promise<LoginUser | undefined> {
    const dto = await this.userDatabase.find(userId.value);
    return dto?.toUser();
  }

  async save(user: LoginUser): Promise<void> {
    await this.userDatabase.save(UserDto.from(user));
  }
}
