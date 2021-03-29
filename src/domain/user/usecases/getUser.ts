import { IGetUser } from 'src/domain/user/types/getUser';
import { IUserRepository } from 'src/domain/user/repository/userRepository';
import { LoginUser } from 'src/domain/user/models/loginUser';
import { UserId } from 'src/domain/user/models/userId';

export class GetUser implements IGetUser {
  constructor(private readonly userRepository: IUserRepository) {

  }

  async execute(userId: string): Promise<LoginUser | null> {
    const user = await this.userRepository.find(new UserId(userId));
    return user ?? null;
  }
}
