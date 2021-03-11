import { Topic } from 'src/domain/topic/models/topic';
import { TopicId } from 'src/domain/topic/models/topicId';
import { TopicTitle } from 'src/domain/topic/models/topicTitle';
import { UserId } from 'src/domain/user/models/userId';
import { TopicDescription } from 'src/domain/topic/models/topicDescription';
import { TopicEntity } from 'src/domain/topic/repository/topicEntity';

export class TopicDto {
  constructor(
      readonly id: string,
      readonly title: string,
      readonly description: string,
      readonly createdAt: number,
      readonly createdBy: string,
  ) {
  }

  static from(topic: TopicEntity): TopicDto {
    return new TopicDto(
        topic.id.value,
        topic.title.value,
        topic.description?.value ?? '',
        topic.createdAt,
        topic.createdBy.value,
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
      );
    }
  }

  static toTopicEntities(dto: TopicDto[]): TopicEntity[] {
    return dto.map((d) => d.toTopicEntity());
  }

  toTopicEntity(): TopicEntity {
    return new Topic(
        new TopicId(this.id),
        new TopicTitle(this.title),
        this.createdAt,
        new UserId(this.createdBy),
        TopicDescription.create(this.description),
    );
  }

  toJSON(): TopicJSON {
    return {
      id: this.id,
      title: this.title,
      description: this.description,
      createdAt: this.createdAt,
      createdBy: this.createdBy,
    };
  }
}

type TopicJSON = {
  id: string,
  title: string,
  description: string,
  createdAt: number,
  createdBy: string,
};

const isTopicJSON = (obj: any): obj is TopicJSON => {
  return typeof obj.id === 'string'
      && typeof obj.title === 'string'
      && typeof obj.description === 'string'
      && typeof obj.createdAt === 'number'
      && typeof obj.createdBy === 'string';
};
