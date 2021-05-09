// eslint-disable-next-line max-classes-per-file
import { TopicId } from 'src/domain/topic/models/topicId';
import { TopicTitle } from 'src/domain/topic/models/topicTitle';
import { UserId } from 'src/domain/user/models/userId';
import { TopicDescription } from 'src/domain/topic/models/topicDescription';

export class Topic {
  constructor(
    public readonly id: TopicId,
    public readonly title: TopicTitle,
    public readonly createdAt: number,
    public readonly createdBy: UserId,
    public readonly thumbnailUrl: string,
    public readonly isPrivate: boolean,
    public readonly description?: TopicDescription,
  ) {}

  copyWith({
    topicId,
    title,
    description,
    createdBy,
    createdAt,
    thumbnailUrl,
    isPrivate,
  }: {
    topicId?: TopicId,
    title?: TopicTitle,
    description?: string,
    createdBy?: UserId,
    createdAt?: number,
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
      TopicDescription.create(description) ?? this.description,
    );
  }
}

export class TopicFactory {
  static create({
    topicId,
    title,
    description,
    createdBy,
    createdAt,
    thumbnailUrl,
    isPrivate,
  }: {
    topicId?: TopicId,
    title: TopicTitle,
    description?: string,
    createdBy: UserId,
    createdAt?: number,
    thumbnailUrl: string,
    isPrivate?: boolean,
  }): Topic {
    return new Topic(
      topicId ?? new TopicId(),
      title,
      createdAt ?? Date.now(),
      createdBy,
      thumbnailUrl,
      isPrivate ?? false,
      TopicDescription.create(description),
    );
  }
}
