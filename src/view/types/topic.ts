import { TopicData } from 'src/domain/topic/models/topic/topicData';
import { Topic } from 'src/domain/topic/models/topic/topic';
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
  }:{
    topic: Topic,
    commentCount: number,
  }): TopicEntity {
    const branchTopics = topic.branchTopics
      .map((branchTopic) => BranchTopicEntityFactory.fromBranchTopic({ branchTopic }));
    return {
      id: topic.id.value,
      title: topic.title.value,
      description: topic.description?.value ?? null,
      createdAt: topic.createdAt.valueOf(),
      createdBy: topic.createdBy.value,
      thumbnailUrl: topic.thumbnailUrl,
      commentCount,
      label: null,
      isPrivate: topic.isPrivate,
      branchTopics,
    };
  }
}
