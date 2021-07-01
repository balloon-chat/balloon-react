import { DerivedTopicId, DerivedTopicTitle } from 'src/domain/topic/models/derivedTopic';
import { DerivedTopicEntity } from 'src/domain/topic/repository/derivedTopicEntity';

export class DerivedTopicDto {
  constructor(
    readonly id: string,
    readonly title: string,
  ) {
  }

  static fromJSON(json: any | null | undefined): DerivedTopicDto | null {
    if (!json) return null;
    if (typeof json.id !== 'string') return null;
    if (typeof json.title !== 'string') return null;

    return new DerivedTopicDto(
      json.id,
      json.title,
    );
  }

  static fromEntity(entity: DerivedTopicEntity): DerivedTopicDto {
    return new DerivedTopicDto(
      entity.id.value,
      entity.title.value,
    );
  }

  toJSON(): DerivedTopicJSON {
    return {
      id: this.id,
      title: this.title,
    };
  }

  toEntity(): DerivedTopicEntity {
    return new DerivedTopicEntity(
      new DerivedTopicId(this.id),
      new DerivedTopicTitle(this.title),
    );
  }
}

export type DerivedTopicJSON = {
  id: string,
  title: string,
}
