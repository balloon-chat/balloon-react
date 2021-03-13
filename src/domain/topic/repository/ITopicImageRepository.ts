import { UserId } from 'src/domain/user/models/userId';

export interface ITopicImageRepository {
  /**
   * @return 保存されたファイルのダウンロードURL
   */
  save(userId: UserId, fileName: string, file: File | Blob): Promise<string>;
}
