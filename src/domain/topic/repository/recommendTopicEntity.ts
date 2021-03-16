import { TopicId } from 'src/domain/topic/models/topicId';

export class RecommendTopicEntity {
  constructor(
      public readonly pickupTopicIds: TopicId[],
      public readonly newestTopicIds: TopicId[],
  ) {
  }
}
