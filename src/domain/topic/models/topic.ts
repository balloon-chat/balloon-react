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
      public readonly description?: TopicDescription,
  ) {
  }
}

export class TopicFactory {
  static create(
      title: TopicTitle,
      createdBy: UserId,
      thumbnailUrl: string,
      description?: string,
      cratedAt?: number,
      topicId?: TopicId,
  ): Topic {
    return new Topic(
        topicId ?? new TopicId(),
        title,
        cratedAt ?? Date.now(),
        createdBy,
        thumbnailUrl,
        TopicDescription.create(description),
    );
  }
}
