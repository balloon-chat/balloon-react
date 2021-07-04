import { TopicData } from 'src/domain/topic/models/topicData';
import { Topic } from 'src/domain/topic/models/topic';
import { UserId } from 'src/domain/user/models/userId';
import { DerivedTopicEntity, DerivedTopicEntityFactory } from 'src/view/types/derivedTopic';

export type TopicEntity = {
  id: string,
  title: string,
  description?: string | null,
  createdAt: number,
  createdBy: string,
  thumbnailUrl: string,
  commentCount: number,
  isPrivate: boolean,
  derivedTopics: DerivedTopicEntity[],
  label?: {
    title: string;
    color: string;
  } | null;
};

export class TopicEntityFactory {
  static create(topic: TopicData): TopicEntity {
    const derived = topic.derivedTopics
      .map((derivedTopic) => DerivedTopicEntityFactory.fromDerivedTopic({ derivedTopic }));

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
      derivedTopics: derived,
    };
  }

  static fromTopic({
    topic,
    commentCount,
    createdBy,
  }:{
    topic: Topic,
    commentCount: number,
    createdBy: UserId,
  }): TopicEntity {
    const derived = topic.derivedTopics
      .map((derivedTopic) => DerivedTopicEntityFactory.fromDerivedTopic({ derivedTopic }));
    return {
      id: topic.id.value,
      title: topic.title.value,
      description: topic.description?.value ?? null,
      createdAt: topic.createdAt.valueOf(),
      createdBy: createdBy.value,
      thumbnailUrl: topic.thumbnailUrl,
      commentCount,
      label: null,
      isPrivate: topic.isPrivate,
      derivedTopics: derived,
    };
  }
}
