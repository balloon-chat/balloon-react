import { LoginUser, User } from 'src/domain/user/models/user';
import { UserId } from 'src/domain/user/models/userId';
import { UserName } from 'src/domain/user/models/userName';

export class UserDto {
  constructor(
      readonly id: string,
      readonly name: string,
  ) {
  }

  static from(user: LoginUser): UserDto {
    return new UserDto(
        user.id.value,
        user.name.value,
    );
  }

  static fromJSON(json: Object | null): UserDto | undefined {
    if (json && isUserJSON(json)) {
      const src = json as UserJSON;
      return new UserDto(src.id, src.name);
    }
  }

  toUser(): User {
    return new User(
        new UserId(this.id),
        this.name ? new UserName(this.name) : undefined,
    );
  }

  toJSON(): UserJSON {
    return {
      id: this.id,
      name: this.name,
    };
  }
}

type UserJSON = {
  id: string,
  name: string,
};

const isUserJSON = (obj: any): obj is UserJSON => {
  return typeof obj.id === 'string'
      && typeof obj.name === 'string';
};
