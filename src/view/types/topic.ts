import { TopicData } from 'src/domain/topic/models/topicData';

export type TopicEntity = {
  id: string,
  title: string,
  description?: string | null,
  createdAt: number,
  createdBy: string,
  thumbnailUrl: string,
  commentCount: number,
  isPrivate: boolean,
  label?: {
    title: string;
    color: string;
  } | null;
};

export class TopicEntityFactory {
  static create(topic: TopicData): TopicEntity {
    return {
      id: topic.id.value,
      title: topic.title.value,
      description: topic.description?.value ?? null,
      createdAt: topic.createdAt.valueOf(),
      createdBy: topic.createdBy.id.value,
      thumbnailUrl: topic.thumbnailUrl,
      commentCount: topic.commentCount,
      label: null,
      isPrivate: topic.isPrivate,
    };
  }
}
