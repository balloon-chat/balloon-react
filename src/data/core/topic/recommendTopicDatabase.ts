import { RecommendTopicDto } from 'src/data/core/topic/recommendTopicDto';

export interface IRecommendTopicDatabase {
  find(): Promise<RecommendTopicDto | undefined>;
}
