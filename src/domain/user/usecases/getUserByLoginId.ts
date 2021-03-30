import { IUserRepository } from 'src/domain/user/repository/userRepository';
import { LoginUser } from 'src/domain/user/models/loginUser';

export class GetUserByLoginId {
  constructor(private readonly userRepository: IUserRepository) {
  }

  async execute(loginId: string): Promise<LoginUser|null> {
    const user = await this.userRepository.findByLoginId(loginId);
    return user ?? null;
  }
}
