import { IUserRepository } from 'src/domain/user/repository/userRepository';
import { UserName } from 'src/domain/user/models/userName';
import { UserId } from 'src/domain/user/models/userId';
import { LoginUser } from 'src/domain/user/models/loginUser';

export class CreateUser implements CreateUser {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(
    userId: string,
    name?: string,
    thumbnailUrl?: string,
  ): Promise<void> {
    const userName = name ? new UserName(name) : undefined;
    const user = new LoginUser(new UserId(userId), userName, thumbnailUrl);

    if (await this.userRepository.find(user.id)) {
      // ユーザーがすでに作成されている。
      return Promise.resolve();
    }

    return this.userRepository.save(user);
  }
}
