import { IUserRepository } from 'src/domain/user/repository/userRepository';
import { UserId } from 'src/domain/user/models/userId';
import { FakeBaseRepository } from 'tests/data/FakeBaseRepository';
import { LoginUser } from 'src/domain/user/models/loginUser';

export class FakeUserRepository implements IUserRepository {
  private repository = new FakeBaseRepository<string, LoginUser>();

  find(userId: UserId): Promise<LoginUser | undefined> {
    return Promise.resolve(this.repository.find(userId.value));
  }

  save(user: LoginUser): Promise<void> {
    this.repository.save(user.id.value, user);
    return Promise.resolve();
  }

  clean() {
    this.repository.clean();
  }

  findByLoginId(loginId: string): Promise<LoginUser | undefined> {
    const users = this.repository
      .findAll()
      .filter((user) => user.loginId === loginId);

    return Promise.resolve(users[0]);
  }
}
