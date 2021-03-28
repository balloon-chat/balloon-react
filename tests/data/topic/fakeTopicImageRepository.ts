import { ITopicImageRepository } from 'src/domain/topic/repository/topicImageRepository';
import { UserId } from 'src/domain/user/models/userId';

export class FakeTopicImageRepository implements ITopicImageRepository {
  // eslint-disable-next-line class-methods-use-this
  save(_: UserId, fileName: string, __: File | Blob): Promise<string> {
    return Promise.resolve(fileName);
  }
}
