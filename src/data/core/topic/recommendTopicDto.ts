import { RecommendTopicEntity } from 'src/domain/topic/repository/recommendTopicEntity';
import { TopicId } from 'src/domain/topic/models/topicId';

export class RecommendTopicDto {
  constructor(
      readonly pickup: string[],
      readonly newest: string[],
  ) {
  }

  static from(recommend: RecommendTopicEntity): RecommendTopicDto {
    return new RecommendTopicDto(
        recommend.pickupTopicIds.map((id) => id.value),
        recommend.newestTopicIds.map((id) => id.value),
    );
  }

  static fromJSON(json: Object | null): RecommendTopicDto | undefined {
    if (!json) return;
    const src = json as RecommendTopicJSON;

    const pickup: string[] = [];
    for (let i = 0; i < Object.keys(src.pickup).length; i += 1) {
      const topicId = src.pickup[i];
      if (topicId) pickup.push(topicId);
    }

    const newest: string[] = [];
    for (let i = 0; i < Object.keys(src.newest).length; i += 1) {
      const topicId = src.newest[i];
      if (topicId) newest.push(topicId);
    }

    return new RecommendTopicDto(
        pickup,
        newest,
    );
  }

  toEntity(): RecommendTopicEntity {
    return new RecommendTopicEntity(
        this.pickup.map(id => new TopicId(id)),
        this.newest.map(id => new TopicId(id)),
    );
  }
}

type RecommendTopicJSON = {
  pickup: { [key: number]: string },
  newest: { [key: number]: string },
};
