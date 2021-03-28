import { RecommendTopicEntity } from 'src/domain/topic/repository/recommendTopicEntity';

export interface IRecommendTopicRepository {
  find(): Promise<RecommendTopicEntity | undefined>;
}
