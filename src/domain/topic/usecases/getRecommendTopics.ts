import { IRecommendTopicRepository } from 'src/domain/topic/repository/recommendTopicRepository';
import { TopicData } from 'src/domain/topic/usecases/types';
import { IGetTopics } from 'src/domain/topic/usecases/getTopics';

export interface IGetRecommendTopics {
  /**
   * おすすめの話題を取得する。
   */
  execute(): Promise<RecommendTopics | undefined>;
}

export class RecommendTopics {
  constructor(
      public readonly pickups: TopicData[],
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

    const pickups = await this.getTopicsUseCase.execute(recommends.pickupTopicIds);
    return new RecommendTopics(pickups);
  }
}
