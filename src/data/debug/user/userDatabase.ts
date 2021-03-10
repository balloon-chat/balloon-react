import { IUserDatabase } from 'src/data/core/user/userDatabase';
import { InMemoryBaseRepository } from 'src/data/debug/baseRepository';
import { UserDto } from 'src/data/core/user/userDto';

export class InMemoryUserDatabase implements IUserDatabase {
  private readonly repository = new InMemoryBaseRepository<string, UserDto>();

  // tslint:disable-next-line:variable-name
  private static _instance: IUserDatabase;

  static get instance(): IUserDatabase {
    if (!this._instance) {
      this._instance = new InMemoryUserDatabase();
    }
    return this._instance;
  }

  find(userId: string): Promise<UserDto | undefined> {
    return this.repository.find(userId);
  }

  async save(user: UserDto): Promise<void> {
    await this.repository.save(user.id, user);
  }
}
