import { IUserRepository } from 'src/domain/user/repository/userRepository';
import { UserId } from 'src/domain/user/models/userId';
import { FakeBaseRepository } from 'tests/data/FakeBaseRepository';
import { LoginUser } from 'src/domain/user/models/loginUser';
import { UserName } from 'src/domain/user/models/userName';

export class FakeUserRepository implements IUserRepository {
  private repository = new FakeBaseRepository<string, LoginUser>();

  find(userId: UserId): Promise<LoginUser | undefined> {
    return Promise.resolve(this.repository.find(userId.value));
  }

  findByLoginId(loginId: string): Promise<LoginUser | undefined> {
    const users = this.repository
      .findAll()
      .filter((user) => user.loginId === loginId);

    return Promise.resolve(users[0]);
  }

  save(user: LoginUser): Promise<void> {
    this.repository.save(user.id.value, user);
    return Promise.resolve();
  }

  async update(
    userId: UserId,
    {
      name,
      photoUrl,
    }: {
      name?: UserName,
      photoUrl?: string,
    },
  ): Promise<void> {
    const user = this.repository.find(userId.value);
    if (!user) throw Error('User Not found');
    const updated = user.copyWith({ name, photoUrl });
    this.repository.save(userId.value, updated);
  }

  clean() {
    this.repository.clean();
  }
}
