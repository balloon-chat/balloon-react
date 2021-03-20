import { ITopicRepository } from 'src/domain/topic/repository/topicRepository';
import { TopicId } from 'src/domain/topic/models/topicId';
import { TopicEntity } from 'src/domain/topic/repository/topicEntity';
import { ITopicDatabase } from 'src/data/core/topic/topicDatabase';
import { TopicDto } from 'src/data/core/topic/topicDto';

export class TopicRepository implements ITopicRepository {

  constructor(
      private readonly topicDatabase: ITopicDatabase,
  ) {
  }

  async find(topicId: TopicId): Promise<TopicEntity | undefined> {
    const dto = await this.topicDatabase.find(topicId.value);
    return dto?.toTopicEntity();
  }

  async findAll(): Promise<TopicEntity[]> {
    const dto = await this.topicDatabase.findAll();
    return TopicDto.toTopicEntities(dto);
  }

  async findAllOrderByCreatedAt(limit: number, from?: TopicId): Promise<TopicEntity[]> {
    const dto = await this.topicDatabase.findAllSortByCreatedAt(limit, from?.value);
    return TopicDto.toTopicEntities(dto);
  }

  async save(topic: TopicEntity): Promise<void> {
    await this.topicDatabase.save(TopicDto.from(topic));
  }

}
