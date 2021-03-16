import { IRecommendTopicRepository } from 'src/domain/topic/repository/recommendTopicRepository';
import { IRecommendTopicDatabase } from 'src/data/core/topic/recommendTopicDatabase';
import { RecommendTopicEntity } from 'src/domain/topic/repository/recommendTopicEntity';

export class RecommendTopicRepository implements IRecommendTopicRepository {
  constructor(private readonly recommendTopicDatabase: IRecommendTopicDatabase) {
  }

  async find(): Promise<RecommendTopicEntity | undefined> {
    const dto = await this.recommendTopicDatabase.find();
    return dto?.toEntity();
  }
}
