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

  async execute(createdBy: string, userId?: string): Promise<TopicData[]> {
    // 閲覧者と作成者が同じだった場合のみ、非公開のTopicも取得する
    const entities = createdBy === userId
      ? await this.topicRepository.findAllTopicsCreatedBy(new UserId(createdBy))
      : await this.topicRepository.findAllPublicTopicsCreatedBy(new UserId(createdBy));

    const topicIds = entities.map((entity) => entity.id);
    const results: (TopicData | undefined)[] = await Promise.all(
      topicIds.map((topicId) => this.getTopicUseCase.execute(topicId)),
    );

    const topics = results.filter<TopicData>((result): result is TopicData => result !== undefined);
    const sortedByCreatedAt = topics.sort((a, b) => b.createdAt.valueOf() - a.createdAt.valueOf());
    return sortedByCreatedAt;
  }
}
