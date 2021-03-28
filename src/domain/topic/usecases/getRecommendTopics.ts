import { IRecommendTopicRepository } from 'src/domain/topic/repository/recommendTopicRepository';
import { IGetRecommendTopics } from 'src/domain/topic/types/getRecommendTopics';
import { IGetTopics } from 'src/domain/topic/types/getTopics';
import { RecommendTopics } from 'src/domain/topic/models/recommendTopics';

export class GetRecommendTopics implements IGetRecommendTopics {
  constructor(
    private readonly getTopicsUseCase: IGetTopics,
    private readonly recommendTopicRepository: IRecommendTopicRepository,
  ) {}

  async execute(): Promise<RecommendTopics | undefined> {
    const recommends = await this.recommendTopicRepository.find();
    if (!recommends) return undefined;

    const pickups = await this.getTopicsUseCase.execute(
      recommends.pickupTopicIds,
    );
    return new RecommendTopics(pickups);
  }
}
