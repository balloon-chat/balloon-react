import { IUserRepository } from 'src/domain/user/repository/userRepository';
import { UserName } from 'src/domain/user/models/userName';
import { UserId } from 'src/domain/user/models/userId';
import { LoginUser } from 'src/domain/user/models/loginUser';
import { ICreateUser } from 'src/domain/user/types/createUser';
import { IUserImageRepository } from 'src/domain/user/repository/userImageRepository';

export class CreateUser implements ICreateUser {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly userImageRepository: IUserImageRepository,
  ) {
  }

  async execute(
    loginId: string,
    name: string,
    photo: string | File,
  ): Promise<LoginUser> {
    const loginUser = await this.userRepository.findByLoginId(loginId);
    if (loginUser) {
      // ユーザーがすでに作成されている。
      return Promise.resolve(loginUser);
    }

    const userName = new UserName(name);
    const userId = new UserId();

    let photoUrl: string;
    if (typeof photo !== 'string') {
      photoUrl = await this.userImageRepository.save(userId, photo);
    } else {
      photoUrl = photo;
    }

    const user = new LoginUser(userId, loginId, userName, photoUrl);
    await this.userRepository.save(user);
    return user;
  }
}
