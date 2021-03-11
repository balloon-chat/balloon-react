import { IMessageRepository } from 'src/domain/message/repository/messageRepository';
import { ITopicRepository } from 'src/domain/topic/repository/topicRepository';
import { IUserRepository } from 'src/domain/user/repository/userRepository';
import { TopicId } from 'src/domain/topic/models/topicId';
import { TopicData } from 'src/domain/topic/usecases/types';

export interface IGetTopic {
  execute(topicId: TopicId): Promise<TopicData | undefined>;
}

export class GetTopic {

  constructor(
      private readonly messageRepository: IMessageRepository,
      private readonly topicRepository: ITopicRepository,
      private readonly userRepository: IUserRepository,
  ) {
  }

  async execute(topicId: TopicId): Promise<TopicData | undefined> {
    const topic = await this.topicRepository.find(topicId);
    if (!topic) return;
    const createdBy = await this.userRepository.find(topic.createdBy);
    if (!createdBy) return;

    const commentCount = await this.messageRepository.messageCount(topic.id);

    return {
      id: topic.id,
      title: topic.title,
      description: topic.description,
      thumbnailUrl: 'http://placehold.jp/1600x800.png',
      createdAt: new Date(topic.createdAt),
      createdBy,
      commentCount,
    } as const;
  }
}
