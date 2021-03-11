import { TopicEntity } from 'src/domain/topic/repository/topicEntity';
import { TopicId } from 'src/domain/topic/models/topicId';

export interface ITopicRepository {

  find(topicId: TopicId): Promise<TopicEntity | undefined>;

  findAll(): Promise<TopicEntity[]>;

  findAllOrderByCreatedAt(limit: number): Promise<TopicEntity[]>;

  save(topic: TopicEntity): Promise<void>;
}
