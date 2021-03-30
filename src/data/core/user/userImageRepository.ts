import { UserId } from 'src/domain/user/models/userId';
import { IUserImageRepository } from 'src/domain/user/repository/userImageRepository';
import { IUserImageDatabase } from 'src/data/core/user/userImageDatabase';

export class UserImageRepository implements IUserImageRepository {
  constructor(private readonly userImageDatabase: IUserImageDatabase) {}

  async save(userId: UserId, file: File): Promise<string> {
    return this.userImageDatabase.save(userId.value, file);
  }
}
