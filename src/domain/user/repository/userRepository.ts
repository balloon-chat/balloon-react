import { UserId } from 'src/domain/user/models/userId';
import { LoginUser } from 'src/domain/user/models/user';

/**
 * ユーザーの公開情報を保存するリポジトリ
 */
export interface IUserRepository {
  find(userId: UserId): Promise<LoginUser | undefined>;

  save(user: LoginUser): Promise<void>;
}
