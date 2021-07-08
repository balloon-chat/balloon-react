import { RecommendTopicEntity } from 'src/domain/topic/repository/types/recommendTopicEntity';
import { TopicId } from 'src/domain/topic/models/topicId';

export class RecommendTopicDto {
  constructor(readonly pickup: string[]) {}

  static from(recommend: RecommendTopicEntity): RecommendTopicDto {
    return new RecommendTopicDto(
      recommend.pickupTopicIds.map((id) => id.value),
    );
  }

  static fromJSON(json: Object | null): RecommendTopicDto | undefined {
    if (!json) return undefined;
    const src = json as RecommendTopicJSON;

    const pickup: string[] = [];
    for (let i = 0; i < Object.keys(src.pickup).length; i += 1) {
      const topicId = src.pickup[i];
      if (topicId) pickup.push(topicId);
    }

    return new RecommendTopicDto(pickup);
  }

  toEntity(): RecommendTopicEntity {
    return new RecommendTopicEntity(this.pickup.map((id) => new TopicId(id)));
  }
}

type RecommendTopicJSON = {
  pickup: { [key: number]: string };
};
