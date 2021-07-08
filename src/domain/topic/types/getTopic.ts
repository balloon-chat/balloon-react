import { TopicId } from 'src/domain/topic/models/topic/topicId';
import { TopicData } from 'src/domain/topic/models/topic/topicData';

export interface IGetTopic {
  execute(topicId: TopicId): Promise<TopicData | undefined>;
}
