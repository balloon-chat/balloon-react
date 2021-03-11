import { ITopicRepository } from 'src/domain/topic/repository/topicRepository';
import { IMessageRepository } from 'src/domain/message/repository/messageRepository';
import { IUserRepository } from 'src/domain/user/repository/userRepository';
import { TopicData } from 'src/domain/topic/usecases/types';

export interface IGetTopics {
  /**
   * TopicDataの一覧を取得する
   * @param limit 取得する項目数の上限
   */
  execute(limit: number): Promise<TopicData[]>;
}

export class GetTopics implements IGetTopics {

  constructor(
      private readonly messageRepository: IMessageRepository,
      private readonly topicRepository: ITopicRepository,
      private readonly userRepository: IUserRepository,
  ) {
  }

  /**
   * {@link TopicData}を日付順に並び替えた状態で取得する。
   */
  async execute(limit: number): Promise<TopicData[]> {
    const topics = await this.topicRepository.findAllOrderByCreatedAt(limit);
    const data: TopicData[] = [];

    for (const topic of topics) {
      const createdBy = await this.userRepository.find(topic.createdBy);
      if (!createdBy) continue;
      const commentCount = await this.messageRepository.messageCount(topic.id);
      data.push({
        id: topic.id,
        title: topic.title,
        description: topic.description,
        thumbnailUrl: 'http://placehold.jp/1600x800.png',
        createdAt: new Date(topic.createdAt),
        createdBy,
        commentCount,
      } as const);
    }

    return data;
  }
}
