import { ITopicRepository } from 'src/domain/topic/repository/topicRepository';
import { IMessageRepository } from 'src/domain/message/repository/messageRepository';
import { IUserRepository } from 'src/domain/user/repository/userRepository';
import { TopicData } from 'src/domain/topic/usecases/types';
import { TopicId } from 'src/domain/topic/models/topicId';
import { GetTopic } from 'src/domain/topic/usecases/getTopic';

export interface IGetTopics {
  /**
   * {@link TopicData}を日付順に並び替えた状態で取得する。
   * @param limit 取得する項目数の上限
   * @param from 取得する基準となる{@link TopicId}
   */
  execute(limit: number, from?: TopicId): Promise<TopicData[]>;

  /**
   * {@link TopicData}の一覧を取得する
   * @param topicsIds 取得する{@link Topic}のID
   */
  execute(topicsIds: TopicId[]): Promise<TopicData[]>;
}

export class GetTopics implements IGetTopics {

  constructor(
      private readonly messageRepository: IMessageRepository,
      private readonly topicRepository: ITopicRepository,
      private readonly userRepository: IUserRepository,
  ) {
  }

  execute(topicIds: TopicId[]): Promise<TopicData[]>;
  execute(limit: number, from?: TopicId): Promise<TopicData[]>;
  execute(arg: number | TopicId[], from?: TopicId): Promise<TopicData[]> {
    if (typeof arg === 'number') return this.getAllOrderByCreatedAt(arg, from);
    return this.getAll(arg);
  }

  async getAll(topicsIds: TopicId[]): Promise<TopicData[]> {
    const getTopicUseCase = new GetTopic(this.messageRepository, this.topicRepository, this.userRepository);

    // 並列でTopicを取得する
    const results: (TopicData | undefined)[] = await Promise.all(topicsIds.map(async (topicId) => {
      return await getTopicUseCase.execute(topicId);
    }));

    const topics: TopicData[] = [];
    results.forEach((value) => {
      if (value) topics.push(value);
    });

    return topics;
  }

  async getAllOrderByCreatedAt(limit: number, from?: TopicId): Promise<TopicData[]> {
    const entities = await this.topicRepository.findAllOrderByCreatedAt(limit, from);
    // 並列でTopicを取得する
    const results: (undefined | TopicData)[] = await Promise.all(entities.map(async (topic) => {
      const createdBy = await this.userRepository.find(topic.createdBy);
      if (!createdBy) return;
      const commentCount = await this.messageRepository.messageCount(topic.id);
      return {
        id: topic.id,
        title: topic.title,
        description: topic.description ?? undefined,
        thumbnailUrl: topic.thumbnailURL,
        createdAt: new Date(topic.createdAt),
        createdBy,
        commentCount,
      } as const;
    }));

    const topics: TopicData[] = [];
    results.forEach(result => {
      if (result) topics.push(result);
    });

    return topics;
  }
}
