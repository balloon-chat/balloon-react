import { ITopicRepository } from 'src/domain/topic/repository/topicRepository';
import { TopicEntity } from 'src/domain/topic/repository/topicEntity';
import { TopicId } from 'src/domain/topic/models/topicId';
import { FakeBaseRepository } from 'tests/data/FakeBaseRepository';

export class TopicRepository implements ITopicRepository {
  private readonly repository = new FakeBaseRepository<TopicId, TopicEntity>();

  find(topicId: TopicId): Promise<TopicEntity | undefined> {
    return Promise.resolve(this.repository.find(topicId));
  }

  findAll(): Promise<TopicEntity[]> {
    return Promise.resolve(this.repository.findAll());
  }

  findAllOrderByCreatedAt(limit: number): Promise<TopicEntity[]> {
    const result = this.repository.findAll().sort((a, b) => b.createdAt - a.createdAt);
    return Promise.resolve(result.slice(0, limit));
  }

  async save(topic: TopicEntity): Promise<void> {
    await this.repository.save(topic.id, topic);
  }

  clean() {
    this.repository.clean();
  }
}
