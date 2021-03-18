import { IUserRepository } from 'src/domain/user/repository/userRepository';
import { LoginUser } from 'src/domain/user/models/user';
import { UserName } from 'src/domain/user/models/userName';
import { UserId } from 'src/domain/user/models/userId';

export interface ICreateUser {
  /**
   * ユーザーの公開情報を保存する
   * @param userId ユーザーのID
   * @param name ユーザーの表示名
   * @param thumbnailUrl ユーザーのアイコン画像のURL
   */
  execute(userId: string, name?: string, thumbnailUrl?: string): Promise<void>;
}

export class CreateUser implements ICreateUser {
  constructor(private readonly userRepository: IUserRepository) {
  }

  async execute(userId: string, name?: string, thumbnailUrl?: string): Promise<void> {
    const userName = name ? new UserName(name) : undefined;
    const user = new LoginUser(new UserId(userId), userName, thumbnailUrl);

    if (await this.userRepository.find(user.id)) {
      // ユーザーがすでに作成されている。
      return Promise.resolve();
    }

    return this.userRepository.save(user);
  }
}
