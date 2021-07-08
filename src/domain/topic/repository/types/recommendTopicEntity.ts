import { TopicId } from 'src/domain/topic/models/topic/topicId';

export class RecommendTopicEntity {
  constructor(public readonly pickupTopicIds: TopicId[]) {}
}
