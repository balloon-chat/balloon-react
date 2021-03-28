import { TopicId } from 'src/domain/topic/models/topicId';
import { TopicData } from 'src/domain/topic/models/topicData';

export interface IGetTopic {
  execute(topicId: TopicId): Promise<TopicData | undefined>;
}
