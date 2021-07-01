import { TopicId } from 'src/domain/topic/models/topicId';
import { TopicTitle } from 'src/domain/topic/models/topicTitle';
import { Topic, TopicFactory } from 'src/domain/topic/models/topic';
import { UserId } from 'src/domain/user/models/userId';
import { TopicDescription } from 'src/domain/topic/models/topicDescription';
import { DerivedTopicEntity } from 'src/domain/topic/repository/derivedTopicEntity';

export class TopicEntity {
  constructor(
    public readonly id: TopicId,
    public readonly title: TopicTitle,
    public readonly createdAt: number,
    public readonly createdBy: UserId,
    public readonly thumbnailURL: string,
    public readonly isPrivate: boolean,
    public readonly description: TopicDescription | null,
    public readonly derivedTopics: DerivedTopicEntity[],
  ) {}

  static from(topic: Topic): TopicEntity {
    return new TopicEntity(
      topic.id,
      topic.title,
      topic.createdAt,
      topic.createdBy,
      topic.thumbnailUrl,
      topic.isPrivate,
      topic.description ?? null,
      topic.derivedTopics.map((e) => DerivedTopicEntity.from(e)),
    );
  }

  toTopic(): Topic {
    return TopicFactory.create({
      topicId: this.id,
      title: this.title,
      createdAt: this.createdAt,
      createdBy: this.createdBy,
      thumbnailUrl: this.thumbnailURL,
      isPrivate: this.isPrivate,
      description: this.description?.value,
      derivedTopics: this.derivedTopics.map((e) => e.toDerivedTopic()),
    });
  }
}
