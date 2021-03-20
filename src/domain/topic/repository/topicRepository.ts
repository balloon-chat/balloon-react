import { TopicEntity } from 'src/domain/topic/repository/topicEntity';
import { TopicId } from 'src/domain/topic/models/topicId';

export interface ITopicRepository {

  find(topicId: TopicId): Promise<TopicEntity | undefined>;

  findAll(): Promise<TopicEntity[]>;

  /**
   * @param limit 取得する最大の項目数
   * @param from 取得する基準となる{@lnk TopicId}(ページングで用いる)
   */
  findAllOrderByCreatedAt(limit: number, from?: TopicId): Promise<TopicEntity[]>;

  save(topic: TopicEntity): Promise<void>;
}
