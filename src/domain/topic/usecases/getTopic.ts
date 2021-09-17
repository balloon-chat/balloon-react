import { ITopicRepository } from 'src/domain/topic/repository/topicRepository';
import { TopicId } from 'src/domain/topic/models/topic/topicId';
import { Topic } from 'src/domain/topic/models/topic/topic';
import { IGetTopic } from 'src/domain/topic/types/getTopic';

export class GetTopic implements IGetTopic {
  constructor(
    private readonly topicRepository: ITopicRepository,
  ) {
  }

  async execute(topicId: TopicId): Promise<Topic | undefined> {
    const entity = await this.topicRepository.find(topicId);
    return entity?.toTopic();
  }
}
