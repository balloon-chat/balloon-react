import { TopicDto } from 'src/data/core/topic/topicDto';

export interface ITopicDatabase {
  find(topicId: string): Promise<TopicDto | undefined>;

  findAllTopicsCreatedBy(createdBy: string): Promise<TopicDto[]>;

  findAllPublicTopicsCreatedBy(createdBy: string): Promise<TopicDto[]>;

  findAllPublicTopicsSortByCreatedAt(limit: number, from?: string): Promise<TopicDto[]>;

  save(topic: TopicDto): Promise<void>;
}
