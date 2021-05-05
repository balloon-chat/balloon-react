import { ITopicRepository } from 'src/domain/topic/repository/topicRepository';
import { IMessageRepository } from 'src/domain/message/repository/messageRepository';
import { IUserRepository } from 'src/domain/user/repository/userRepository';
import { TopicData, TopicDataFactory } from 'src/domain/topic/models/topicData';
import { TopicId } from 'src/domain/topic/models/topicId';
import { GetTopic } from 'src/domain/topic/usecases/getTopic';
import { IGetTopics } from 'src/domain/topic/types/getTopics';

export class GetTopics implements IGetTopics {
  constructor(
    private readonly messageRepository: IMessageRepository,
    private readonly topicRepository: ITopicRepository,
    private readonly userRepository: IUserRepository,
  ) {}

  execute(topicIds: TopicId[]): Promise<TopicData[]>;

  execute(limit: number, from?: TopicId): Promise<TopicData[]>;

  execute(arg: number | TopicId[], from?: TopicId): Promise<TopicData[]> {
    if (typeof arg === 'number') return this.getAllOrderByCreatedAt(arg, from);
    return this.getAll(arg);
  }

  async getAll(topicsIds: TopicId[]): Promise<TopicData[]> {
    const getTopicUseCase = new GetTopic(
      this.messageRepository,
      this.topicRepository,
      this.userRepository,
    );

    // 並列でTopicを取得する
    const results: (TopicData | undefined)[] = await Promise.all(
      topicsIds.map((topicId) => getTopicUseCase.execute(topicId)),
    );

    const topics: TopicData[] = [];
    results.forEach((value) => {
      if (value) topics.push(value);
    });

    return topics;
  }

  async getAllOrderByCreatedAt(
    limit: number,
    from?: TopicId,
  ): Promise<TopicData[]> {
    const entities = await this.topicRepository.findAllPublicTopicsOrderByCreatedAt(
      limit,
      from,
    );
    // 並列でTopicを取得する
    const results: (undefined | TopicData)[] = await Promise.all(
      entities.map(async (topic) => {
        const createdBy = await this.userRepository.find(topic.createdBy);
        if (!createdBy) return undefined;
        const commentCount = await this.messageRepository.messageCount(
          topic.id,
        );
        return TopicDataFactory.create({
          topic: topic.toTopic(),
          commentCount,
          createdBy,
        });
      }),
    );

    const topics: TopicData[] = [];
    results.forEach((result) => {
      if (result) topics.push(result);
    });

    return topics;
  }
}
