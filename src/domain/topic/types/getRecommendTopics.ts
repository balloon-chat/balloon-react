import { RecommendTopics } from 'src/domain/topic/models/recommend/recommendTopics';

export interface IGetRecommendTopics {
  /**
   * おすすめの話題を取得する。
   */
  execute(): Promise<RecommendTopics | undefined>;
}
