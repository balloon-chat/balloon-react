import { IUserRepository } from 'src/domain/user/repository/userRepository';
import { UserRepository } from 'src/data/core/user/userRepository';
import { FirebaseUserDatabase } from 'src/data/firebase/user/userDatabase';
import { CreateUser } from 'src/domain/user/usecases/createUser';
import { UserEntity, UserEntityFactory } from 'src/view/types/user';
import { ICreateUser } from 'src/domain/user/types/createUser';
import { IGetUser } from 'src/domain/user/types/getUser';
import { GetUser } from 'src/domain/user/usecases/getUser';
import { IUserImageRepository } from 'src/domain/user/repository/userImageRepository';
import { UserImageRepository } from 'src/data/core/user/userImageRepository';
import { FirebaseUserImageDatabase } from 'src/data/firebase/user/userImageDatabase';
import { IGetUserByLoginId } from 'src/domain/user/types/getUserByLoginId';
import { GetUserByLoginId } from 'src/domain/user/usecases/getUserByLoginId';
import { IUpdateProfile, UpdateProfileParams } from 'src/domain/user/types/updateProfile';
import { UpdateProfile } from 'src/domain/user/usecases/updateProfile';

export class UserService {
  private readonly createUserUsecase: ICreateUser;

  private readonly getUserUsecase: IGetUser;

  private readonly getUserByLoginIdUsecase: IGetUserByLoginId;

  private readonly updateProfileUsecase: IUpdateProfile;

  constructor(
    userRepository: IUserRepository
    = new UserRepository(FirebaseUserDatabase.instance),
    userImageRepository: IUserImageRepository
    = new UserImageRepository(FirebaseUserImageDatabase.instance),
  ) {
    this.createUserUsecase = new CreateUser(userRepository, userImageRepository);
    this.getUserUsecase = new GetUser(userRepository);
    this.getUserByLoginIdUsecase = new GetUserByLoginId(userRepository);
    this.updateProfileUsecase = new UpdateProfile(userRepository, userImageRepository);
  }

  async createUser(
    loginId: string,
    name: string,
    photo: string | File,
  ): Promise<UserEntity> {
    const user = await this.createUserUsecase.execute(
      loginId,
      name,
      photo,
    );
    return UserEntityFactory.create(user);
  }

  async getUser(userId: string): Promise<UserEntity | null> {
    const user = await this.getUserUsecase.execute(userId);
    if (!user) return null;
    return UserEntityFactory.create(user);
  }

  async getUserByLoginId(loginId: string): Promise<UserEntity | null> {
    const loginUser = await this.getUserByLoginIdUsecase.execute(loginId);
    if (!loginUser) return null;
    return UserEntityFactory.create(loginUser);
  }

  async updateProfile(
    userId: string,
    loginId: string,
    param: UpdateProfileParams,
  ): Promise<UserEntity> {
    const user = await this.updateProfileUsecase.execute(userId, loginId, param);
    return UserEntityFactory.create(user);
  }
}
