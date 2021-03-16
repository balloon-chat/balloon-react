import { IGetTopic } from 'src/domain/topic/usecases/getTopic';
import { IRecommendTopicRepository } from 'src/domain/topic/repository/recommendTopicRepository';
import { TopicData } from 'src/domain/topic/usecases/types';

export interface IGetRecommendTopics {
  /**
   * おすすめの話題、最新の話題を取得する。
   */
  execute(): Promise<RecommendTopics | undefined>;
}

export class RecommendTopics {
  constructor(
      public readonly pickups: TopicData[],
      public readonly newest: TopicData[],
  ) {
  }
}

export class GetRecommendTopics implements IGetRecommendTopics {
  constructor(
      private readonly getTopicUseCase: IGetTopic,
      private readonly recommendTopicRepository: IRecommendTopicRepository,
  ) {
  }

  async execute(): Promise<RecommendTopics | undefined> {
    const recommends = await this.recommendTopicRepository.find();
    if (!recommends) return;

    const pickups: TopicData[] = [];
    for (const topicId of recommends.pickupTopicIds) {
      const topic = await this.getTopicUseCase.execute(topicId);
      if (topic) pickups.push(topic);
    }

    const newest: TopicData[] = [];
    for (const topicId of recommends.newestTopicIds) {
      const topic = await this.getTopicUseCase.execute(topicId);
      if (topic) newest.push(topic);
    }

    return new RecommendTopics(pickups, newest);
  }
}
