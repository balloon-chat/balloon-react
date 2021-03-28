import { TopicData } from 'src/domain/topic/models/topicData';

export class RecommendTopics {
  constructor(public readonly pickups: TopicData[]) {}
}
