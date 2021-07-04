import { TopicData } from 'src/domain/topic/models/topicData';
import { Topic } from 'src/domain/topic/models/topic';
import { UserId } from 'src/domain/user/models/userId';
import { BranchTopicEntity, BranchTopicEntityFactory } from 'src/view/types/branchTopic';

export type TopicEntity = {
  id: string,
  title: string,
  description?: string | null,
  createdAt: number,
  createdBy: string,
  thumbnailUrl: string,
  commentCount: number,
  isPrivate: boolean,
  branchTopics: BranchTopicEntity[],
  label?: {
    title: string;
    color: string;
  } | null;
};

export class TopicEntityFactory {
  static create(topic: TopicData): TopicEntity {
    const branches = topic.branchTopics
      .map((branchTopic) => BranchTopicEntityFactory.fromBranchTopic({ branchTopic }));

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
      branchTopics: branches,
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
    const branchTopics = topic.branchTopics
      .map((branchTopic) => BranchTopicEntityFactory.fromBranchTopic({ branchTopic }));
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
      branchTopics,
    };
  }
}
