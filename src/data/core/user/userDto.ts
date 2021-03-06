import { User } from 'src/domain/user/models/user';
import { UserId } from 'src/domain/user/models/userId';
import { UserName } from 'src/domain/user/models/userName';

export class UserDto {
  constructor(
      readonly id: string,
      readonly name?: string,
  ) {
  }

  static from(user: User): UserDto {
    return new UserDto(
        user.id.value,
        user.name?.value,
    );
  }

  toUser(): User {
    return new User(
        new UserId(this.id),
        this.name ? new UserName(this.name) : undefined,
    );
  }
}
