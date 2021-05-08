import { UserId } from 'src/domain/user/models/userId';
import { LoginUser } from 'src/domain/user/models/loginUser';
import { UserName } from 'src/domain/user/models/userName';

/**
 * ユーザーの公開情報を保存するリポジトリ
 */
export interface IUserRepository {
  find(userId: UserId): Promise<LoginUser | undefined>;

  findByLoginId(loginId: string): Promise<LoginUser | undefined>

  save(user: LoginUser): Promise<void>;

  update(userId: UserId, params: {name?: UserName, photoUrl?: string}): Promise<void>
}
