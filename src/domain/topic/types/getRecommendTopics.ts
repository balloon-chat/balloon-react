import { RecommendTopics } from 'src/domain/topic/models/recommendTopics';

export interface IGetRecommendTopics {
  /**
   * おすすめの話題を取得する。
   */
  execute(): Promise<RecommendTopics | undefined>;
}
