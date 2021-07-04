import { BranchTopicId, BranchTopicTitle } from 'src/domain/topic/models/branchTopic';
import { BranchTopicEntity } from 'src/domain/topic/repository/branchTopicEntity';

export class BranchTopicDto {
  constructor(
    readonly id: string,
    readonly title: string,
  ) {
  }

  static fromJSON(json: any | null | undefined): BranchTopicDto | null {
    if (!json) return null;
    if (typeof json.id !== 'string') return null;
    if (typeof json.title !== 'string') return null;

    return new BranchTopicDto(
      json.id,
      json.title,
    );
  }

  static fromEntity(entity: BranchTopicEntity): BranchTopicDto {
    return new BranchTopicDto(
      entity.id.value,
      entity.title.value,
    );
  }

  toJSON(): BranchTopicJSON {
    return {
      id: this.id,
      title: this.title,
    };
  }

  toEntity(): BranchTopicEntity {
    return new BranchTopicEntity(
      new BranchTopicId(this.id),
      new BranchTopicTitle(this.title),
    );
  }
}

export type BranchTopicJSON = {
  id: string,
  title: string,
}
