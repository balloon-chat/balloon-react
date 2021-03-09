/**
 * ユーザーの公開情報を保存するリポジトリ
 */
import { UserId } from 'src/domain/user/models/userId';
import { User } from 'src/domain/user/models/user';

export interface IUserRepository {
  find(userId: UserId): Promise<User | undefined>;

  save(user: User): Promise<void>;
}
