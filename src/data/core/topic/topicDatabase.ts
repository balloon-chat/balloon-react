import { TopicDto } from 'src/data/core/topic/topicDto';

export interface ITopicDatabase {
  find(topicId: string): Promise<TopicDto | undefined>;

  findAll(): Promise<TopicDto[]>;

  findAllCreatedBy(userId: string): Promise<TopicDto[]>;

  findAllSortByCreatedAt(limit: number, from?: string): Promise<TopicDto[]>;

  save(topic: TopicDto): Promise<void>;
}
