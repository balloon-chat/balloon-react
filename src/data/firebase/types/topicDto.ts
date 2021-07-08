import { TopicId } from 'src/domain/topic/models/topicId';
import { TopicTitle } from 'src/domain/topic/models/topicTitle';
import { UserId } from 'src/domain/user/models/userId';
import { TopicDescription } from 'src/domain/topic/models/topicDescription';
import { TopicEntity } from 'src/domain/topic/repository/types/topicEntity';
import { BranchTopicDto } from 'src/data/firebase/types/branchTopicDto';

export class TopicDto {
  constructor(
    readonly id: string,
    readonly title: string,
    readonly description: string | null,
    readonly createdAt: number,
    readonly createdBy: string,
    readonly thumbnailURL: string,
    readonly isPrivate: boolean,
    readonly branch: string[],
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
      topic.branchTopics.map((e) => e.id.value),
    );
  }

  static fromJSON(json: Object | null | undefined): TopicDto | null {
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
        src.branch ?? [],
      );
    }
    return null;
  }

  toTopicEntity({ branchTopics } : {branchTopics: BranchTopicDto[]}): TopicEntity {
    const sortedBranch = this.branch
      .map((id) => branchTopics.find((branch) => branch.id === id))
      .filter((e): e is BranchTopicDto => e !== undefined)
      .map((e) => e.toEntity());

    return new TopicEntity(
      new TopicId(this.id),
      new TopicTitle(this.title),
      this.createdAt,
      new UserId(this.createdBy),
      this.thumbnailURL,
      this.isPrivate,
      TopicDescription.create(this.description) ?? null,
      sortedBranch,
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
      branch: this.branch,
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
  branch?: string[],
};

const isTopicJSON = (obj: any): obj is TopicJSON => typeof obj.id === 'string'
  && typeof obj.title === 'string'
  && (typeof obj.description === 'string'
    || typeof obj.description === 'object')
  && typeof obj.createdAt === 'number'
  && typeof obj.createdBy === 'string'
  && typeof obj.thumbnailURL === 'string'
  && typeof obj.isPrivate === 'boolean';
