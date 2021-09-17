import { IMessageRepository } from 'src/domain/message/repository/messageRepository';
import { ITopicRepository } from 'src/domain/topic/repository/topicRepository';
import { IUserRepository } from 'src/domain/user/repository/userRepository';
import { TopicId } from 'src/domain/topic/models/topic/topicId';
import { TopicData, TopicDataFactory } from 'src/domain/topic/models/topic/topicData';
import { IGetTopicData } from 'src/domain/topic/types/getTopicData';

export class GetTopicData implements IGetTopicData {
  constructor(
    private readonly messageRepository: IMessageRepository,
    private readonly topicRepository: ITopicRepository,
    private readonly userRepository: IUserRepository,
  ) {
  }

  async execute(topicId: TopicId): Promise<TopicData | undefined> {
    const topic = await this.topicRepository.find(topicId);
    if (!topic) return undefined;

    const [createdBy, commentCount] = await Promise.all([
      this.userRepository.find(topic.createdBy),
      this.messageRepository.messageCount(topic.id),
    ]);

    if (!createdBy) return undefined;

    return TopicDataFactory.create({
      topic: topic.toTopic(),
      commentCount,
      createdBy,
    });
  }
}
