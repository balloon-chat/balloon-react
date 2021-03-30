import { UserId } from 'src/domain/user/models/userId';
import { LoginUser } from 'src/domain/user/models/loginUser';
import { UserName } from 'src/domain/user/models/userName';

export class UserDto {
  constructor(
    readonly id: string,
    readonly name: string,
    readonly photoUrl: string,
  ) {}

  static from(user: LoginUser): UserDto {
    return new UserDto(user.id.value, user.name?.value, user.photoUrl);
  }

  static fromJSON(json: Object | null): UserDto | undefined {
    if (json && isUserJSON(json)) {
      const src = json as UserJSON;
      return new UserDto(src.id, src.name, src.photoUrl);
    }
    return undefined;
  }

  toUser(): LoginUser {
    return new LoginUser(
      new UserId(this.id),
      /**
       * 取得時にはloginIdをnullにする
       */
      null,
      new UserName(this.name),
      this.photoUrl,
    );
  }

  toJSON(): UserJSON {
    return {
      id: this.id,
      name: this.name,
      photoUrl: this.photoUrl,
    };
  }
}

type UserJSON = {
  id: string;
  name: string;
  photoUrl: string;
};

const isUserJSON = (obj: any): obj is UserJSON => typeof obj.id === 'string'
  && typeof obj.name === 'string'
  && typeof obj.photoUrl === 'string';
