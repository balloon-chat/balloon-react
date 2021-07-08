import { BranchTopic } from 'src/domain/topic/models/branchTopic';

export type BranchTopicEntity = {
  id: string,
  title: string,
  createdAt: number,
}

export class BranchTopicEntityFactory {
  static fromBranchTopic({
    branchTopic,
  }: {branchTopic: BranchTopic}): BranchTopicEntity {
    return {
      id: branchTopic.id.value,
      title: branchTopic.title.value,
      createdAt: branchTopic.createdAt,
    };
  }
}
