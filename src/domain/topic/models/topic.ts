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
      public readonly description?: TopicDescription,
  ) {
  }
}

export class TopicFactory {
  create(title: TopicTitle, createdBy: UserId, description?: string, cratedAt?: number): Topic {
    return new Topic(
        new TopicId(),
        title,
        cratedAt ?? Date.now(),
        createdBy,
        TopicDescription.create(description),
    );
  }
}
