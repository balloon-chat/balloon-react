import { ITopicRepository } from 'src/domain/topic/repository/topicRepository';
import { TopicEntity } from 'src/domain/topic/repository/topicEntity';
import { TopicId } from 'src/domain/topic/models/topicId';
import { FakeBaseRepository } from 'tests/data/FakeBaseRepository';
import { UserId } from 'src/domain/user/models/userId';

export class FakeTopicRepository implements ITopicRepository {
  private readonly repository = new FakeBaseRepository<TopicId, TopicEntity>();

  find(topicId: TopicId): Promise<TopicEntity | undefined> {
    return Promise.resolve(this.repository.find(topicId));
  }

  findAll(): Promise<TopicEntity[]> {
    return Promise.resolve(this.repository.findAll());
  }

  findAllCreatedBy(userId: UserId): Promise<TopicEntity[]> {
    const result = this.repository
      .findAll()
      .filter((topic) => topic.createdBy.value === userId.value);
    return Promise.resolve(result);
  }

  findAllOrderByCreatedAt(limit: number, from?: TopicId): Promise<TopicEntity[]> {
    const result = this.repository.findAll().sort((a, b) => b.createdAt - a.createdAt);

    if (from) {
      const fromIndex = result.findIndex((topic) => topic.id.value === from.value);
      return Promise.resolve(result.slice(fromIndex, fromIndex + limit));
    }

    return Promise.resolve(result.slice(0, limit));
  }

  async save(topic: TopicEntity): Promise<void> {
    await this.repository.save(topic.id, topic);
  }

  clean() {
    this.repository.clean();
  }
}
