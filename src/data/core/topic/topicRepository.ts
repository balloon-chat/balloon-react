import { ITopicRepository, UpdateTopicParams } from 'src/domain/topic/repository/topicRepository';
import { TopicId } from 'src/domain/topic/models/topicId';
import { TopicEntity } from 'src/domain/topic/repository/topicEntity';
import { ITopicDatabase } from 'src/data/core/topic/topicDatabase';
import { TopicDto } from 'src/data/core/topic/topicDto';
import { UserId } from 'src/domain/user/models/userId';

export class TopicRepository implements ITopicRepository {
  constructor(private readonly topicDatabase: ITopicDatabase) {}

  async find(topicId: TopicId): Promise<TopicEntity | undefined> {
    const dto = await this.topicDatabase.find(topicId.value);
    return dto?.toTopicEntity();
  }

  async findAllPublicTopicsCreatedBy(createdBy: UserId): Promise<TopicEntity[]> {
    const dto = await this.topicDatabase.findAllPublicTopicsCreatedBy(createdBy.value);
    return dto.map((element) => element.toTopicEntity());
  }

  async findAllTopicsCreatedBy(createdBy: UserId): Promise<TopicEntity[]> {
    const dto = await this.topicDatabase.findAllTopicsCreatedBy(createdBy.value);
    return dto.map((element) => element.toTopicEntity());
  }

  async findAllPublicTopicsOrderByCreatedAt(
    limit: number,
    from?: TopicId,
  ): Promise<TopicEntity[]> {
    const dto = await this.topicDatabase.findAllPublicTopicsSortByCreatedAt(
      limit,
      from?.value,
    );
    return TopicDto.toTopicEntities(dto);
  }

  async updateTopic(topicId: TopicId, params: UpdateTopicParams): Promise<void> {
    await this.topicDatabase.updateTopic(topicId.value, {
      title: params.title?.value ?? null,
      description: params.description?.value ?? null,
      thumbnailUrl: params.thumbnailUrl,
      isPrivate: params.isPrivate,
    });
  }

  async save(topic: TopicEntity): Promise<void> {
    await this.topicDatabase.save(TopicDto.from(topic));
  }

  delete(topicId: TopicId): Promise<void> {
    return this.topicDatabase.delete(topicId.value);
  }
}
