import { TopicId } from 'src/domain/topic/models/topicId';
import { TopicTitle } from 'src/domain/topic/models/topicTitle';
import { UserId } from 'src/domain/user/models/userId';
import { TopicDescription } from 'src/domain/topic/models/topicDescription';
import { TopicEntity } from 'src/domain/topic/repository/topicEntity';
import { DerivedTopicDto, DerivedTopicJSON } from 'src/data/core/topic/derivedTopicDto';

export class TopicDto {
  constructor(
    readonly id: string,
    readonly title: string,
    readonly description: string | null,
    readonly createdAt: number,
    readonly createdBy: string,
    readonly thumbnailURL: string,
    readonly isPrivate: boolean,
    readonly derivedTopics: DerivedTopicDto[],
  ) {}

  static from(topic: TopicEntity): TopicDto {
    return new TopicDto(
      topic.id.value,
      topic.title.value,
      topic.description?.value ?? '',
      topic.createdAt,
      topic.createdBy.value,
      topic.thumbnailURL,
      topic.isPrivate,
      topic.derivedTopics.map((e) => DerivedTopicDto.fromEntity(e)),
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
        src.isPrivate,
        [], // TODO: ドキュメントからIDを取得する
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
      this.isPrivate,
      TopicDescription.create(this.description) ?? null,
      this.derivedTopics.map((e) => e.toEntity()),
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
      isPrivate: this.isPrivate,
      derivedTopics: this.derivedTopics.map((e) => e.toJSON()),
    };
  }
}

type TopicJSON = {
  id: string
  title: string
  description: string | null
  createdAt: number
  createdBy: string
  thumbnailURL: string
  isPrivate: boolean,
  derivedTopics: DerivedTopicJSON[]
};

const isTopicJSON = (obj: any): obj is TopicJSON => typeof obj.id === 'string'
  && typeof obj.title === 'string'
  && (typeof obj.description === 'string'
    || typeof obj.description === 'object')
  && typeof obj.createdAt === 'number'
  && typeof obj.createdBy === 'string'
  && typeof obj.thumbnailURL === 'string'
  && typeof obj.isPrivate === 'boolean';
