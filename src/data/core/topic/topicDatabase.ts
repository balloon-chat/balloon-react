import { TopicDto } from 'src/data/core/topic/topicDto';

export interface ITopicDatabase {
  find(topicId: string): Promise<TopicDto | undefined>;

  findAllTopicsCreatedBy(createdBy: string): Promise<TopicDto[]>;

  findAllPublicTopicsCreatedBy(createdBy: string): Promise<TopicDto[]>;

  findAllPublicTopicsSortByCreatedAt(limit: number, from?: string): Promise<TopicDto[]>;

  updateTopic(topicId: string, params: UpdateTopicParams): Promise<void>;

  save(topic: TopicDto): Promise<void>;

  delete(topicId: string): Promise<void>;
}

export type UpdateTopicParams = {
  title: string | null,
  description: string | null,
  thumbnailUrl: string | null,
  isPrivate: boolean | null
};
