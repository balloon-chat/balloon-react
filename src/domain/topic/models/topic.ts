// eslint-disable-next-line max-classes-per-file
import { TopicId } from 'src/domain/topic/models/topicId';
import { TopicTitle } from 'src/domain/topic/models/topicTitle';
import { UserId } from 'src/domain/user/models/userId';
import { TopicDescription } from 'src/domain/topic/models/topicDescription';
import { DerivedTopic, DerivedTopicId } from 'src/domain/topic/models/derivedTopic';

export class Topic {
  constructor(
    public readonly id: TopicId,
    public readonly title: TopicTitle,
    public readonly createdAt: number,
    public readonly createdBy: UserId,
    public readonly thumbnailUrl: string,
    public readonly isPrivate: boolean,
    public derivedTopics: DerivedTopic[],
    public readonly description?: TopicDescription,
  ) {}

  addDerivedTopic(derivedTopic: DerivedTopic) {
    this.derivedTopics.push(derivedTopic);
  }

  deleteDerivedTopic(derivedTopicId: DerivedTopicId) {
    this.derivedTopics = this.derivedTopics
      .filter((e) => e.id.value !== derivedTopicId.value);
  }

  copyWith({
    topicId,
    title,
    description,
    derivedTopics,
    createdBy,
    createdAt,
    thumbnailUrl,
    isPrivate,
  }: {
    topicId?: TopicId,
    title?: TopicTitle,
    createdBy?: UserId,
    createdAt?: number,
    description?: string,
    derivedTopics?: DerivedTopic[],
    thumbnailUrl?: string,
    isPrivate?: boolean,
  }): Topic {
    return new Topic(
      topicId ?? this.id,
      title ?? this.title,
      createdAt ?? this.createdAt,
      createdBy ?? this.createdBy,
      thumbnailUrl ?? this.thumbnailUrl,
      isPrivate ?? this.isPrivate,
      derivedTopics ?? this.derivedTopics,
      TopicDescription.create(description) ?? this.description,
    );
  }
}

export class TopicFactory {
  static create({
    topicId,
    title,
    description,
    derivedTopics,
    createdBy,
    createdAt,
    thumbnailUrl,
    isPrivate,
  }: {
    topicId?: TopicId,
    title: TopicTitle|string,
    description?: string,
    derivedTopics?: DerivedTopic[],
    createdBy: UserId,
    createdAt?: number,
    thumbnailUrl: string,
    isPrivate?: boolean,
  }): Topic {
    return new Topic(
      topicId ?? new TopicId(),
      typeof title === 'string' ? new TopicTitle(title) : title,
      createdAt ?? Date.now(),
      createdBy,
      thumbnailUrl,
      isPrivate ?? false,
      derivedTopics ?? [],
      TopicDescription.create(description),
    );
  }
}
