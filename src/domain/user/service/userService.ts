import { UserId } from 'src/domain/user/models/userId';
import { IUserRepository } from 'src/domain/user/repository/userRepository';
import { UserRepository } from 'src/data/core/user/userRepository';
import { FirebaseUserDatabase } from 'src/data/firebase/user/userDatabase';
import { CreateUser, ICreateUser } from 'src/domain/user/usecases/createUser';

export class UserService {
  private readonly createUserUsecase: ICreateUser;

  constructor(
      userRepository: IUserRepository = new UserRepository(FirebaseUserDatabase.instance),
  ) {
    this.createUserUsecase = new CreateUser(userRepository);
  }

  getCurrentUserId(): UserId {
    return new UserId('abc'); // TODO: remove this
  }

  createUser(userId: string, name?: string | null, photoUrl?: string | null): Promise<void> {
    return this.createUserUsecase.execute(userId, name ?? undefined, photoUrl ?? undefined);
  }
}
