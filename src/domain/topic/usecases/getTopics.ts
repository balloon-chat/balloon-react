import { ITopicRepository } from 'src/domain/topic/repository/topicRepository';
import { TopicData } from 'src/domain/topic/models/topic/topicData';
import { TopicId } from 'src/domain/topic/models/topic/topicId';
import { IGetTopics } from 'src/domain/topic/types/getTopics';
import { IGetTopic } from 'src/domain/topic/types/getTopic';
import { IMessageRepository } from 'src/domain/message/repository/messageRepository';
import { GetTopic } from 'src/domain/topic/usecases/getTopic';
import { IUserRepository } from 'src/domain/user/repository/userRepository';

export class GetTopics implements IGetTopics {
  private readonly getTopicUsecase: IGetTopic;

  constructor(
    private readonly topicRepository: ITopicRepository,
    messageRepository: IMessageRepository,
    userRepository: IUserRepository,
  ) {
    this.getTopicUsecase = new GetTopic(
      messageRepository,
      this.topicRepository,
      userRepository,
    );
  }

  execute(topicIds: TopicId[]): Promise<TopicData[]>;

  execute(limit: number, from?: TopicId): Promise<TopicData[]>;

  execute(arg: number | TopicId[], from?: TopicId): Promise<TopicData[]> {
    if (typeof arg === 'number') return this.getAllOrderByCreatedAt(arg, from);
    return this.getAll(arg);
  }

  async getAll(topicsIds: TopicId[]): Promise<TopicData[]> {
    // 並列でTopicを取得する
    const results: (TopicData | undefined)[] = await Promise.all(
      topicsIds.map((topicId) => this.getTopicUsecase.execute(topicId)),
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
      entities.map(async (topic) => this.getTopicUsecase.execute(topic.id)),
    );

    const topics: TopicData[] = [];
    results.forEach((result) => {
      if (result) topics.push(result);
    });

    return topics;
  }
}
