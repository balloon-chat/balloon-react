import { TopicDto } from 'src/data/core/topic/topicDto';

export interface ITopicDatabase {

  find(topicId: string): Promise<TopicDto | undefined>;

  findAll(): Promise<TopicDto[]>;

  findAllSortByCreatedAt(limit: number): Promise<TopicDto[]>;

  save(topic: TopicDto): Promise<void>;
}