import { TopicId } from 'src/domain/topic/models/topicId';
import { TopicTitle } from 'src/domain/topic/models/topicTitle';
import { TopicDescription } from 'src/domain/topic/models/topicDescription';
import { User } from 'src/domain/user/models/user';
import { Topic } from 'src/domain/topic/models/topic';
import { BranchTopic } from 'src/domain/topic/models/branchTopic';

export type TopicData = {
  id: TopicId,
  title: TopicTitle,
  description?: TopicDescription,
  branchTopics: BranchTopic[],
  thumbnailUrl: string,
  createdAt: Date,
  createdBy: User,
  commentCount: number,
  isPrivate: boolean,
};

export class TopicDataFactory {
  static create({
    topic,
    commentCount,
    createdBy,
  }:{
    topic: Topic,
    commentCount: number,
    createdBy: User,
  }): TopicData {
    return {
      id: topic.id,
      title: topic.title,
      description: topic.description,
      branchTopics: topic.branchTopics,
      thumbnailUrl: topic.thumbnailUrl,
      createdAt: new Date(topic.createdAt),
      isPrivate: topic.isPrivate,
      createdBy,
      commentCount,
    };
  }
}
