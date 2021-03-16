import { IRecommendTopicRepository } from 'src/domain/topic/repository/recommendTopicRepository';
import { RecommendTopicEntity } from 'src/domain/topic/repository/recommendTopicEntity';

export class FakeRecommendTopicRepository implements IRecommendTopicRepository {
  private data: RecommendTopicEntity | undefined = undefined;

  find(): Promise<RecommendTopicEntity | undefined> {
    return Promise.resolve(this.data);
  }

  save(data: RecommendTopicEntity) {
    this.data = data;
  }

  clean() {
    this.data = undefined;
  }
}
