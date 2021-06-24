// eslint-disable-next-line max-classes-per-file
import { UniqueId } from 'src/domain/core/UniqueId';
import { TopicTitle } from 'src/domain/topic/models/topicTitle';

export class DerivedTopic {
  constructor(
    public readonly id: DerivedTopicId,
    public readonly title: DerivedTopicTitle,
  ) {
  }
}

export class DerivedTopicId extends UniqueId {

}

export class DerivedTopicTitle extends TopicTitle {

}

export class DerivedTopicFactory {
  static create({
    id,
    title,
  }: {
    id?: DerivedTopicId,
    title: string
  }): DerivedTopic {
    return new DerivedTopic(
      id ?? new DerivedTopicId(),
      new DerivedTopicTitle(title),
    );
  }
}
