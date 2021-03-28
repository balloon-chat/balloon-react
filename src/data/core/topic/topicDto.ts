import { TopicId } from 'src/domain/topic/models/topicId';
import { TopicTitle } from 'src/domain/topic/models/topicTitle';
import { UserId } from 'src/domain/user/models/userId';
import { TopicDescription } from 'src/domain/topic/models/topicDescription';
import { TopicEntity } from 'src/domain/topic/repository/topicEntity';

export class TopicDto {
  constructor(
    readonly id: string,
    readonly title: string,
    readonly description: string | null,
    readonly createdAt: number,
    readonly createdBy: string,
    readonly thumbnailURL: string,
  ) {}

  static from(topic: TopicEntity): TopicDto {
    return new TopicDto(
      topic.id.value,
      topic.title.value,
      topic.description?.value ?? '',
      topic.createdAt,
      topic.createdBy.value,
      topic.thumbnailURL,
    );
  }

  static fromJSON(json: Object | null): TopicDto | undefined {
    if (json && isTopicJSON(json)) {
      const src = json as TopicJSON;
      return new TopicDto(
        src.id,
        src.title,
        src.description,
        src.createdAt,
        src.createdBy,
        src.thumbnailURL,
      );
    }
    return undefined;
  }

  static toTopicEntities(dto: TopicDto[]): TopicEntity[] {
    return dto.map((d) => d.toTopicEntity());
  }

  toTopicEntity(): TopicEntity {
    return new TopicEntity(
      new TopicId(this.id),
      new TopicTitle(this.title),
      this.createdAt,
      new UserId(this.createdBy),
      this.thumbnailURL,
      TopicDescription.create(this.description) ?? null,
    );
  }

  toJSON(): TopicJSON {
    return {
      id: this.id,
      title: this.title,
      description: this.description,
      createdAt: this.createdAt,
      createdBy: this.createdBy,
      thumbnailURL: this.thumbnailURL,
    };
  }
}

type TopicJSON = {
  id: string;
  title: string;
  description: string | null;
  createdAt: number;
  createdBy: string;
  thumbnailURL: string;
};

const isTopicJSON = (obj: any): obj is TopicJSON => typeof obj.id === 'string'
  && typeof obj.title === 'string'
  && (typeof obj.description === 'string'
    || typeof obj.description === 'object')
  && typeof obj.createdAt === 'number'
  && typeof obj.createdBy === 'string'
  && typeof obj.thumbnailURL === 'string';
