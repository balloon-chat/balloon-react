import { IUserRepository } from 'src/domain/user/repository/userRepository';
import { UserRepository } from 'src/data/core/user/userRepository';
import { FirebaseUserDatabase } from 'src/data/firebase/user/userDatabase';
import { CreateUser } from 'src/domain/user/usecases/createUser';
import { UserEntity, UserEntityFactory } from 'src/view/types/user';
import { ICreateUser } from 'src/domain/user/types/createUser';
import { IGetUser } from 'src/domain/user/types/getUser';
import { GetUser } from 'src/domain/user/usecases/getUser';

export class UserService {
  private readonly createUserUsecase: ICreateUser;

  private readonly getUserUsecase: IGetUser

  constructor(
    userRepository: IUserRepository = new UserRepository(
      FirebaseUserDatabase.instance,
    ),
  ) {
    this.createUserUsecase = new CreateUser(userRepository);
    this.getUserUsecase = new GetUser(userRepository);
  }

  createUser(
    userId: string,
    name?: string | null,
    photoUrl?: string | null,
  ): Promise<void> {
    return this.createUserUsecase.execute(
      userId,
      name ?? undefined,
      photoUrl ?? undefined,
    );
  }

  async getUser(userId: string): Promise<UserEntity|null> {
    const user = await this.getUserUsecase.execute(userId);
    if (!user) return null;
    return UserEntityFactory.create(user);
  }
}
