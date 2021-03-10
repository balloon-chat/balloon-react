import { IUserRepository } from 'src/domain/user/repository/userRepository';
import { UserId } from 'src/domain/user/models/userId';
import { User } from 'src/domain/user/models/user';
import { FakeBaseRepository } from 'tests/data/FakeBaseRepository';

export class FakeUserRepository implements IUserRepository {
  private repository = new FakeBaseRepository<UserId, User>();

  find(userId: UserId): Promise<User | undefined> {
    return Promise.resolve(this.repository.find(userId));
  }

  save(user: User): Promise<void> {
    this.repository.save(user.id, user);
    return Promise.resolve();
  }

  clean() {
    this.repository.clean();
  }
}
