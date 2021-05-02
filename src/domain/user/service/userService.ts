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

export class UserService {
  private readonly createUserUsecase: ICreateUser;

  private readonly getUserUsecase: IGetUser;

  private readonly getUserByLoginIdUsecase: IGetUserByLoginId;

  constructor(
    userRepository: IUserRepository
    = new UserRepository(FirebaseUserDatabase.instance),
    userImageRepository: IUserImageRepository
    = new UserImageRepository(FirebaseUserImageDatabase.instance),
  ) {
    this.createUserUsecase = new CreateUser(userRepository, userImageRepository);
    this.getUserUsecase = new GetUser(userRepository);
    this.getUserByLoginIdUsecase = new GetUserByLoginId(userRepository);
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
}
