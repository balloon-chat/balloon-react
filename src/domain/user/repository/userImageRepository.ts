import { UserId } from 'src/domain/user/models/userId';

export interface IUserImageRepository {
  /**
   * @return 保存されたファイルのダウンロードURL
   */
  save(userId: UserId, file: File): Promise<string>;
}
