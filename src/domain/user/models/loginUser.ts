import { UserId } from 'src/domain/user/models/userId';
import { UserName } from 'src/domain/user/models/userName';
import { User } from 'src/domain/user/models/user';

export class LoginUser extends User {
  /**
   * @param id アプリケーション内で用いられるユーザーのID
   * @param loginId ログイン時に用いられるID
   * @param name ユーザー名
   * @param photoUrl ユーザーアイコンのURL
   */
  constructor(
    id: UserId,
    readonly loginId: string | null,
    readonly name: UserName,
    readonly photoUrl: string,
  ) {
    super(id, name);
  }

  copyWith({
    name,
    photoUrl,
  }: {
    name?: UserName,
    photoUrl?: string,
  }): LoginUser {
    return new LoginUser(
      this.id,
      this.loginId,
      name ?? this.name,
      photoUrl ?? this.photoUrl,
    );
  }
}
