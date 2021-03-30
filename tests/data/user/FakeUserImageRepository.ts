import { UserId } from 'src/domain/user/models/userId';
import { IUserImageRepository } from 'src/domain/user/repository/userImageRepository';

export class FakeUserImageRepository implements IUserImageRepository {
  // eslint-disable-next-line class-methods-use-this
  save(_: UserId, __: File): Promise<string> {
    return Promise.resolve('test.img');
  }
}
