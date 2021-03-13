import { ITopicImageRepository } from 'src/domain/topic/repository/ITopicImageRepository';
import { ITopicImageDatabase } from 'src/data/core/topic/topicImageDatabase';
import { UserId } from 'src/domain/user/models/userId';

export class TopicImageRepository implements ITopicImageRepository {

  constructor(private readonly database: ITopicImageDatabase) {
  }

  save(userId: UserId, fileName: string, file: File | Blob): Promise<string> {
    return this.database.save(userId.value, fileName, file);
  }
}
