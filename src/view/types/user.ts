import { LoginUser } from 'src/domain/user/models/loginUser';

export type UserEntity = {
  uid: string,
  name: string,
  photoUrl: string
};

export class UserEntityFactory {
  static create(user: LoginUser): UserEntity {
    return {
      uid: user.id.value,
      name: user.name.value,
      photoUrl: user.photoUrl,
    } as const;
  }
}
