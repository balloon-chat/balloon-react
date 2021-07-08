import { RecommendTopicEntity } from 'src/domain/topic/repository/types/recommendTopicEntity';

export interface IRecommendTopicRepository {
  find(): Promise<RecommendTopicEntity | null>;
}
