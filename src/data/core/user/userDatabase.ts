import { UserDto } from 'src/data/core/user/userDto';

export interface IUserDatabase {

  find(userId: string): Promise<UserDto | undefined>;
}
