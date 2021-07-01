import { TopicDto } from 'src/data/core/topic/topicDto';
import { DerivedTopicDto } from 'src/data/core/topic/derivedTopicDto';
import { DerivedTopicEntity } from 'src/domain/topic/repository/derivedTopicEntity';

export interface ITopicDatabase {
  find(topicId: string): Promise<TopicDto | undefined>;

  findAllTopicsCreatedBy(createdBy: string): Promise<TopicDto[]>;

  findAllPublicTopicsCreatedBy(createdBy: string): Promise<TopicDto[]>;

  findAllPublicTopicsSortByCreatedAt(limit: number, from?: string): Promise<TopicDto[]>;

  updateTopic(topicId: string, params: UpdateTopicParams): Promise<void>;

  save(topic: TopicDto): Promise<void>;

  delete(topicId: string): Promise<void>;

  findDerivedTopic(topicId: string, derivedTopicId: string): Promise<DerivedTopicEntity | null>

  addDerivedTopic(topicId: string, derivedTopic: DerivedTopicDto): Promise<void>

  deleteDerivedTopic(topicId: string, derivedTopicId: string): Promise<void>
}

export type UpdateTopicParams = {
  title: string | null,
  description: string | null,
  thumbnailUrl: string | null,
  isPrivate: boolean | null
};
