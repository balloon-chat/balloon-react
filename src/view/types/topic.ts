import { TopicData } from 'src/domain/topic/usecases/types';

export type TopicEntity = {
  id: string,
  title: string,
  description?: string | null,
  createdAt: number,
  thumbnailUrl: string,
  commentCount: number,
  label?: {
    title: string,
    color: string,
  } | null,
};

export class TopicEntityFactory {
  static create(topic: TopicData): TopicEntity {
    return {
      id: topic.id.value,
      title: topic.title.value,
      description: topic.description?.value ?? null,
      createdAt: topic.createdAt.valueOf(),
      thumbnailUrl: topic.thumbnailUrl,
      commentCount: topic.commentCount,
      label: null,
    };
  }
}
