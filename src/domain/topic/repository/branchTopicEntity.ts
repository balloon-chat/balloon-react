import {
  BranchTopic,
  BranchTopicFactory,
  BranchTopicId,
  BranchTopicTitle,
} from 'src/domain/topic/models/branchTopic';

export class BranchTopicEntity {
  constructor(
    public readonly id: BranchTopicId,
    public readonly title: BranchTopicTitle,
    public readonly createdAt: number,
  ) {
  }

  static from(branchTopic: BranchTopic): BranchTopicEntity {
    return new BranchTopicEntity(
      branchTopic.id,
      branchTopic.title,
      branchTopic.createdAt,
    );
  }

  toBranchTopic(): BranchTopic {
    return BranchTopicFactory.create({
      id: this.id,
      title: this.title.value,
      createdAt: this.createdAt,
    });
  }
}
