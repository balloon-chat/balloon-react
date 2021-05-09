import { IUpdateProfile, UpdateProfileParams } from 'src/domain/user/types/updateProfile';
import { IUserRepository } from 'src/domain/user/repository/userRepository';
import { IUserImageRepository } from 'src/domain/user/repository/userImageRepository';
import { UserNotFoundException } from 'src/domain/exceptions/UserNotFoundException';
import { UserId } from 'src/domain/user/models/userId';
import { LoginUser } from 'src/domain/user/models/loginUser';
import { UserName } from '../models/userName';

export class UpdateProfile implements IUpdateProfile {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly userImageRepository: IUserImageRepository,
  ) {
  }

  /**
   * @throws UserNotFoundException userIdとloginIdが指すユーザーが一致しなかった場合
   */
  async execute(
    userId: string,
    loginId: string,
    { name, photo }: UpdateProfileParams,
  ): Promise<LoginUser> {
    const user = await this.userRepository.findByLoginId(loginId);
    if (!user) throw new UserNotFoundException(`User(userId: ${userId}) was not found`);
    if (userId !== user.id.value) throw new UserNotFoundException(`User(userId: ${userId}) was not found`);

    const uid = new UserId(userId);

    // アイコン画像を更新
    let photoUrl: string|undefined;
    if (photo) {
      photoUrl = await this.userImageRepository.save(uid, photo);
    }

    const newUser = user.copyWith({ name: name ? new UserName(name) : undefined, photoUrl });
    await this.userRepository.update(uid, { name: newUser.name, photoUrl: newUser.photoUrl });

    return newUser;
  }
}
