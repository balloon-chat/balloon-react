import { TopicData } from 'src/domain/topic/models/topic/topicData';

export class RecommendTopics {
  constructor(public readonly pickups: TopicData[]) {}
}
