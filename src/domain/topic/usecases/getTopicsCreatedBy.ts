import { IGetTopicsCreatedBy } from 'src/domain/topic/types/getTopicsCreatedBy';
import { ITopicRepository } from 'src/domain/topic/repository/topicRepository';
import { UserId } from 'src/domain/user/models/userId';
import { TopicData } from 'src/domain/topic/models/topicData';
import { IGetTopic } from 'src/domain/topic/types/getTopic';

export class GetTopicsCreatedBy implements IGetTopicsCreatedBy {
  constructor(
    private readonly topicRepository: ITopicRepository,
    private readonly getTopicUseCase: IGetTopic,
  ) {
  }

  async execute(userId: string): Promise<TopicData[]> {
    const entities = await this.topicRepository.findAllCreatedBy(new UserId(userId));
    const topicIds = entities.map((entity) => entity.id);
    const results: (TopicData | undefined)[] = await Promise.all(
      topicIds.map((topicId) => this.getTopicUseCase.execute(topicId)),
    );
    const topics = results.filter<TopicData>((result): result is TopicData => result !== undefined);
    const sortedByCreatedAt = topics.sort((a, b) => b.createdAt.valueOf() - a.createdAt.valueOf());
    return sortedByCreatedAt;
  }
}
