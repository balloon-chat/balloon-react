import { DerivedTopicRepository } from 'src/domain/topic/repository/derivedTopicRepository';
import { FakeBaseRepository } from 'tests/data/FakeBaseRepository';
import { TopicId } from 'src/domain/topic/models/topicId';
import { DerivedTopicId } from 'src/domain/topic/models/derivedTopic';
import { DerivedTopicEntity } from 'src/domain/topic/repository/derivedTopicEntity';

export class FakeDerivedTopicRepository implements DerivedTopicRepository {
  private baseRepository = new FakeBaseRepository<
    string,
    {topicId: string, entity: DerivedTopicEntity}
    >();

  async delete(_: TopicId, derivedTopicId: DerivedTopicId): Promise<void> {
    this.baseRepository.delete(derivedTopicId.value);
  }

  async find(_: TopicId, derivedTopicId: DerivedTopicId): Promise<DerivedTopicEntity|null> {
    return (await this.baseRepository.find(derivedTopicId.value)?.entity) ?? null;
  }

  async findByTopicId(topicId: TopicId): Promise<DerivedTopicEntity[]> {
    const entities = await this.baseRepository.findAll();
    return entities
      .filter((e) => e.topicId === topicId.value)
      .map((e) => e.entity);
  }

  async save(topicId: TopicId, derivedTopic: DerivedTopicEntity): Promise<void> {
    await this.baseRepository.save(
      derivedTopic.id.value,
      {
        topicId: topicId.value,
        entity: derivedTopic,
      },
    );
  }

  clean() {
    this.baseRepository.clean();
  }
}
