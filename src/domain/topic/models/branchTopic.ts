// eslint-disable-next-line max-classes-per-file
import { UniqueId } from 'src/domain/core/UniqueId';
import { TopicTitle } from 'src/domain/topic/models/topicTitle';

export class BranchTopic {
  constructor(
    public readonly id: BranchTopicId,
    public readonly title: BranchTopicTitle,
  ) {
  }
}

export class BranchTopicId extends UniqueId {

}

export class BranchTopicTitle extends TopicTitle {

}

export class BranchTopicFactory {
  static create({
    id,
    title,
  }: {
    id?: BranchTopicId,
    title: string
  }): BranchTopic {
    return new BranchTopic(
      id ?? new BranchTopicId(),
      new BranchTopicTitle(title),
    );
  }
}
