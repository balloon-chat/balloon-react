import { UserDto } from 'src/data/core/user/userDto';

export interface IUserDatabase {
  find(userId: string): Promise<UserDto | undefined>;

  findByLoginId(loginId: string): Promise<UserDto | undefined>

  save(user: UserDto): Promise<void>;
}
