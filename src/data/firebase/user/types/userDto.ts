import { UserId } from 'src/domain/user/models/userId';
import { LoginUser } from 'src/domain/user/models/loginUser';
import { UserName } from 'src/domain/user/models/userName';
import { IllegalArgumentException } from 'src/domain/exceptions/IllegalArgumentException';

export class UserDto {
  constructor(
    readonly id: string,
    readonly loginId: string,
    readonly name: string,
    readonly photoUrl: string,
  ) {
  }

  static from(user: LoginUser): UserDto {
    if (!user.loginId) {
      throw new IllegalArgumentException('LoginUser must have loginId.');
    }
    return new UserDto(user.id.value, user.loginId, user.name?.value, user.photoUrl);
  }

  static fromJSON(json: Object | null): UserDto | undefined {
    if (json && isUserJSON(json)) {
      const src = json as UserJSON;
      return new UserDto(src.id, src.loginId, src.name, src.photoUrl);
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
      loginId: this.loginId,
      name: this.name,
      photoUrl: this.photoUrl,
    };
  }
}

type UserJSON = {
  id: string;
  loginId: string;
  name: string;
  photoUrl: string;
};

const isUserJSON = (obj: any): obj is UserJSON => typeof obj.id === 'string'
  && typeof obj.loginId === 'string'
  && typeof obj.name === 'string'
  && typeof obj.photoUrl === 'string';
