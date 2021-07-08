// eslint-disable-next-line max-classes-per-file
import { TopicId } from 'src/domain/topic/models/topicId';
import { TopicTitle } from 'src/domain/topic/models/topicTitle';
import { UserId } from 'src/domain/user/models/userId';
import { TopicDescription } from 'src/domain/topic/models/topicDescription';
import { BranchTopic, BranchTopicId } from 'src/domain/topic/models/branchTopic';

export class Topic {
  constructor(
    public readonly id: TopicId,
    public readonly title: TopicTitle,
    public readonly createdAt: number,
    public readonly createdBy: UserId,
    public readonly thumbnailUrl: string,
    public readonly isPrivate: boolean,
    public branchTopics: BranchTopic[],
    public readonly description?: TopicDescription,
  ) {}

  addBranchTopic(branchTopic: BranchTopic) {
    this.branchTopics.push(branchTopic);
  }

  deleteBranchTopic(branchTopicId: BranchTopicId) {
    this.branchTopics = this.branchTopics
      .filter((e) => e.id.value !== branchTopicId.value);
  }

  copyWith({
    topicId,
    title,
    description,
    branchTopics,
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
    branchTopics?: BranchTopic[],
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
      branchTopics ?? this.branchTopics,
      TopicDescription.create(description) ?? this.description,
    );
  }
}

export class TopicFactory {
  static create({
    topicId,
    title,
    description,
    branchTopics,
    createdBy,
    createdAt,
    thumbnailUrl,
    isPrivate,
  }: {
    topicId?: TopicId,
    title: TopicTitle|string,
    description?: string,
    branchTopics?: BranchTopic[],
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
      branchTopics ?? [],
      TopicDescription.create(description),
    );
  }
}
