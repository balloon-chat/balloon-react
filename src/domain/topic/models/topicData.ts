import { TopicId } from 'src/domain/topic/models/topicId';
import { TopicTitle } from 'src/domain/topic/models/topicTitle';
import { TopicDescription } from 'src/domain/topic/models/topicDescription';
import { User } from 'src/domain/user/models/user';
import { Topic } from 'src/domain/topic/models/topic';

export type TopicData = {
  id: TopicId,
  title: TopicTitle,
  description?: TopicDescription,
  thumbnailUrl: string,
  createdAt: Date,
  createdBy: User,
  commentCount: number,
};

export class TopicDataFactory {
  static create(arg: {
    topic: Topic,
    commentCount: number,
    createdBy: User,
  }): TopicData {
    return {
      id: arg.topic.id,
      title: arg.topic.title,
      description: arg.topic.description,
      thumbnailUrl: arg.topic.thumbnailUrl,
      createdAt: new Date(arg.topic.createdAt),
      createdBy: arg.createdBy,
      commentCount: arg.commentCount,
    };
  }
}
