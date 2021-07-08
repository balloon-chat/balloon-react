// eslint-disable-next-line max-classes-per-file
import { UniqueId } from 'src/domain/core/uniqueId';
import { TopicTitle } from 'src/domain/topic/models/topicTitle';

export class BranchTopic {
  constructor(
    public readonly id: BranchTopicId,
    public readonly title: BranchTopicTitle,
    public readonly createdAt: number,
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
    createdAt,
  }: {
    id?: BranchTopicId,
    title: string,
    createdAt: number,
  }): BranchTopic {
    return new BranchTopic(
      id ?? new BranchTopicId(),
      new BranchTopicTitle(title),
      createdAt,
    );
  }
}
