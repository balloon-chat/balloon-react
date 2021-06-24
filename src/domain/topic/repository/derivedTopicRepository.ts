import { TopicId } from 'src/domain/topic/models/topicId';
import { DerivedTopicId } from 'src/domain/topic/models/derivedTopic';
import { DerivedTopicEntity } from 'src/domain/topic/repository/derivedTopicEntity';

export interface DerivedTopicRepository {
  find(topicId: TopicId, derivedTopicId: DerivedTopicId): Promise<DerivedTopicEntity|null>

  findByTopicId(topicId: TopicId): Promise<DerivedTopicEntity[]>

  save(topicId: TopicId, derivedTopic: DerivedTopicEntity): Promise<void>

  delete(topicId: TopicId, derivedTopicId: DerivedTopicId): Promise<void>
}
