import { TopicId } from 'src/domain/topic/models/topicId';
import { TopicTitle } from 'src/domain/topic/models/topicTitle';
import { TopicDescription } from 'src/domain/topic/models/topicDescription';
import { User } from 'src/domain/user/models/user';

export type TopicData = {
  id: TopicId,
  title: TopicTitle,
  description?: TopicDescription,
  thumbnailUrl: string,
  createdAt: Date,
  createdBy: User,
  commentCount: number,
};
