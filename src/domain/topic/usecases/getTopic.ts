import { IMessageRepository } from 'src/domain/message/repository/messageRepository';
import { ITopicRepository } from 'src/domain/topic/repository/topicRepository';
import { IUserRepository } from 'src/domain/user/repository/userRepository';
import { TopicId } from 'src/domain/topic/models/topicId';
import { TopicData, TopicDataFactory } from 'src/domain/topic/models/topicData';

export class GetTopic {
  constructor(
    private readonly messageRepository: IMessageRepository,
    private readonly topicRepository: ITopicRepository,
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(topicId: TopicId): Promise<TopicData | undefined> {
    const topic = await this.topicRepository.find(topicId);
    if (!topic) return undefined;
    const createdBy = await this.userRepository.find(topic.createdBy);
    if (!createdBy) return undefined;

    const commentCount = await this.messageRepository.messageCount(topic.id);

    return TopicDataFactory.create({
      topic: topic.toTopic(),
      commentCount,
      createdBy,
    });
  }
}
