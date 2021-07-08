import { IRecommendTopicRepository } from 'src/domain/topic/repository/recommendTopicRepository';
import { RecommendTopicEntity } from 'src/domain/topic/repository/types/recommendTopicEntity';

export class FakeRecommendTopicRepository implements IRecommendTopicRepository {
  private data: RecommendTopicEntity | null = null;

  find(): Promise<RecommendTopicEntity | null> {
    return Promise.resolve(this.data);
  }

  save(data: RecommendTopicEntity) {
    this.data = data;
  }

  clean() {
    this.data = null;
  }
}
