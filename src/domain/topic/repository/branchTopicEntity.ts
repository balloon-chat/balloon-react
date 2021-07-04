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
  ) {
  }

  static from(branchTopic: BranchTopic): BranchTopicEntity {
    return new BranchTopicEntity(
      branchTopic.id,
      branchTopic.title,
    );
  }

  toBranchTopic(): BranchTopic {
    return BranchTopicFactory.create({
      id: this.id,
      title: this.title.value,
    });
  }
}
