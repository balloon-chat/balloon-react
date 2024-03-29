import { TopicId } from 'src/domain/topic/models/topic/topicId';
import { TopicTitle } from 'src/domain/topic/models/topic/topicTitle';
import { Topic, TopicFactory } from 'src/domain/topic/models/topic/topic';
import { UserId } from 'src/domain/user/models/userId';
import { TopicDescription } from 'src/domain/topic/models/topic/topicDescription';
import { BranchTopicEntity } from 'src/domain/topic/repository/types/branchTopicEntity';

export class TopicEntity {
  constructor(
    public readonly id: TopicId,
    public readonly title: TopicTitle,
    public readonly createdAt: number,
    public readonly createdBy: UserId,
    public readonly thumbnailURL: string,
    public readonly isPrivate: boolean,
    public readonly description: TopicDescription | null,
    public readonly branchTopics: BranchTopicEntity[],
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
      topic.branchTopics.map((e) => BranchTopicEntity.from(e)),
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
      branchTopics: this.branchTopics.map((e) => e.toBranchTopic()),
    });
  }
}
