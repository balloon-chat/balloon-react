import { LoginUser } from 'src/domain/user/models/loginUser';

export type UserEntity = {
  uid: string,
  name: string | null,
  photoUrl: string | null
};

export class UserEntityFactory {
  static create(user: LoginUser): UserEntity {
    return {
      uid: user.id.value,
      name: user.name?.value ?? null,
      photoUrl: user.photoUrl ?? null,
    } as const;
  }
}
