import { IRecommendTopicRepository } from 'src/domain/topic/repository/recommendTopicRepository';
import { TopicData } from 'src/domain/topic/usecases/types';
import { IGetTopics } from 'src/domain/topic/usecases/getTopics';

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
      private readonly getTopicsUseCase: IGetTopics,
      private readonly recommendTopicRepository: IRecommendTopicRepository,
  ) {
  }

  async execute(): Promise<RecommendTopics | undefined> {
    const recommends = await this.recommendTopicRepository.find();
    if (!recommends) return;

    const [pickups, newest] = await Promise.all([
      this.getTopicsUseCase.execute(recommends.pickupTopicIds),
      this.getTopicsUseCase.execute(recommends.newestTopicIds),
    ]);

    return new RecommendTopics(pickups, newest);
  }
}
