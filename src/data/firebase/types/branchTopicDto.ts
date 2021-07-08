import { BranchTopicId, BranchTopicTitle } from 'src/domain/topic/models/branchTopic';
import { BranchTopicEntity } from 'src/domain/topic/repository/types/branchTopicEntity';

export class BranchTopicDto {
  constructor(
    readonly id: string,
    readonly title: string,
    readonly createdAt: number,
  ) {
  }

  static fromJSON(json: any | null | undefined): BranchTopicDto | null {
    if (!json) return null;
    if (typeof json.id !== 'string') return null;
    if (typeof json.title !== 'string') return null;
    if (typeof json.createdAt !== 'number') return null;

    return new BranchTopicDto(
      json.id,
      json.title,
      json.createdAt,
    );
  }

  static fromEntity(entity: BranchTopicEntity): BranchTopicDto {
    return new BranchTopicDto(
      entity.id.value,
      entity.title.value,
      entity.createdAt,
    );
  }

  toJSON(): BranchTopicJSON {
    return {
      id: this.id,
      title: this.title,
      createdAt: this.createdAt,
    };
  }

  toEntity(): BranchTopicEntity {
    return new BranchTopicEntity(
      new BranchTopicId(this.id),
      new BranchTopicTitle(this.title),
      this.createdAt,
    );
  }
}

export type BranchTopicJSON = {
  id: string,
  title: string,
  createdAt: number,
}
